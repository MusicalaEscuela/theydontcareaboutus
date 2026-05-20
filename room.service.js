// ============================================================
// room.service.js
// Capa única para leer/escribir en Firebase Realtime Database.
// Mantiene la UI separada de Firebase, porque sufrir modularmente
// sigue siendo sufrir, pero con arquitectura.
// ============================================================

import { auth, db, ensureAuth } from "./firebase-config.js";
import {
  child,
  get,
  goOffline,
  goOnline,
  off,
  onDisconnect,
  onValue,
  ref,
  remove,
  serverTimestamp,
  set,
  update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  ACTIVITIES,
  CUES,
  DEFAULT_PATTERNS,
  getLeastPopulatedGroup,
  getPatternPreset,
  sanitizePatterns
} from "./rhythms.js";

const HEARTBEAT_MS = 25000;
const DEFAULT_ROOM_CODE = "MJ30";
const DEFAULT_ACTIVITY = ACTIVITIES.tdcau_body_groove;

let heartbeatTimer = null;
let activeParticipantRef = null;

export function normalizeRoomCode(value) {
  return String(value || DEFAULT_ROOM_CODE)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 24) || DEFAULT_ROOM_CODE;
}

export async function getCurrentUser() {
  return ensureAuth();
}

export async function getCurrentUid() {
  const user = await getCurrentUser();
  return user.uid;
}

export async function createOrOpenRoom(roomCode) {
  const code = normalizeRoomCode(roomCode);
  const user = await getCurrentUser();
  const roomRef = ref(db, `rooms/${code}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    const initialRoom = createDefaultRoom(user.uid);
    await set(roomRef, initialRoom);
    return {
      roomCode: code,
      room: initialRoom,
      created: true,
      isHostOwner: true
    };
  }

  const room = snapshot.val();
  return {
    roomCode: code,
    room,
    created: false,
    isHostOwner: room?.hostUid === user.uid
  };
}

export async function getRoomOnce(roomCode) {
  const code = normalizeRoomCode(roomCode);
  const snapshot = await get(ref(db, `rooms/${code}`));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function roomExists(roomCode) {
  const room = await getRoomOnce(roomCode);
  return Boolean(room);
}

export async function sendCue(roomCode, cueKey) {
  const code = normalizeRoomCode(roomCode);
  const cue = CUES[cueKey];
  if (!cue) throw new Error(`Cue desconocido: ${cueKey}`);

  const cleanCue = {
    key: cue.key,
    type: cue.type,
    activeGroup: cue.activeGroup ?? null,
    message: cue.message,
    subMessage: cue.subMessage,
    participantStatus: cue.participantStatus,
    tone: cue.tone,
    icon: cue.icon,
    updatedAt: serverTimestamp(),
    updatedAtClient: Date.now()
  };

  await set(ref(db, `rooms/${code}/currentCue`), cleanCue);
  touchRoom(code);
}

export async function resetRoomCue(roomCode) {
  await sendCue(roomCode, "reset");
}

export async function updateBpm(roomCode, bpm) {
  const code = normalizeRoomCode(roomCode);
  const value = clampNumber(Number(bpm), 40, 240, DEFAULT_ACTIVITY.defaultBpm);
  await set(ref(db, `rooms/${code}/bpm`), value);
  await update(ref(db, `rooms/${code}/metronome`), {
    bpm: value,
    updatedAt: serverTimestamp(),
    updatedAtClient: Date.now()
  });
  touchRoom(code);
}

export async function updateActivity(roomCode, activityId) {
  const code = normalizeRoomCode(roomCode);
  const activity = ACTIVITIES[activityId] || DEFAULT_ACTIVITY;
  await set(ref(db, `rooms/${code}/activity`), activity.id);
  await set(ref(db, `rooms/${code}/bpm`), activity.defaultBpm);
  await update(ref(db, `rooms/${code}/metronome`), {
    bpm: activity.defaultBpm,
    updatedAt: serverTimestamp(),
    updatedAtClient: Date.now()
  });
  touchRoom(code);
}

export async function updateMode(roomCode, mode) {
  const code = normalizeRoomCode(roomCode);
  const nextMode = mode === "show" ? "show" : "rehearsal";
  await set(ref(db, `rooms/${code}/mode`), nextMode);
  touchRoom(code);
}

export async function updateRoomTitle(roomCode, title) {
  const code = normalizeRoomCode(roomCode);
  const cleanTitle = String(title || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80) || "Sala rítmica Musicala";

  await set(ref(db, `rooms/${code}/title`), cleanTitle);
  touchRoom(code);
  return cleanTitle;
}

export async function claimHostRoom(roomCode) {
  const code = normalizeRoomCode(roomCode);
  const user = await getCurrentUser();

  await update(ref(db, `rooms/${code}`), {
    hostUid: user.uid,
    hostClaimedAt: serverTimestamp(),
    hostClaimedAtClient: Date.now()
  });

  return user.uid;
}

export async function joinRoom(roomCode, participantDraft) {
  const code = normalizeRoomCode(roomCode);
  const user = await getCurrentUser();
  const room = await getRoomOnce(code);

  if (!room) {
    throw new Error(`La sala ${code} todavía no existe. Abre primero el panel host.`);
  }

  const selectedGroup = Number(participantDraft.group || 0);
  const group = selectedGroup >= 1 && selectedGroup <= 5
    ? selectedGroup
    : getLeastPopulatedGroup(room.participants || {});

  const uid = user.uid;
  const participantRef = ref(db, `rooms/${code}/participants/${uid}`);
  const participant = {
    uid,
    name: sanitizeParticipantName(participantDraft.name),
    group,
    joinedAt: serverTimestamp(),
    joinedAtClient: Date.now(),
    lastSeen: serverTimestamp(),
    lastSeenClient: Date.now(),
    userAgent: navigator.userAgent.slice(0, 160)
  };

  await set(participantRef, participant);
  await onDisconnect(participantRef).remove();

  startHeartbeat(participantRef);
  activeParticipantRef = participantRef;

  return {
    uid,
    participant: {
      ...participant,
      joinedAt: Date.now(),
      lastSeen: Date.now()
    }
  };
}

export async function leaveRoom() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  if (activeParticipantRef) {
    try {
      await remove(activeParticipantRef);
    } catch (error) {
      console.warn("No se pudo retirar el participante:", error);
    }
    activeParticipantRef = null;
  }
}

export function listenToRoom(roomCode, callback, onError) {
  const code = normalizeRoomCode(roomCode);
  const roomRef = ref(db, `rooms/${code}`);
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  }, onError);
}

export function listenToCue(roomCode, callback, onError) {
  const code = normalizeRoomCode(roomCode);
  const cueRef = ref(db, `rooms/${code}/currentCue`);
  return onValue(cueRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  }, onError);
}

export function listenToParticipants(roomCode, callback, onError) {
  const code = normalizeRoomCode(roomCode);
  const participantsRef = ref(db, `rooms/${code}/participants`);
  return onValue(participantsRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : {});
  }, onError);
}

export function listenToConnection(callback) {
  const connectedRef = ref(db, ".info/connected");
  return onValue(connectedRef, (snapshot) => {
    callback(Boolean(snapshot.val()));
  });
}


export async function updateMetronome(roomCode, data = {}) {
  const code = normalizeRoomCode(roomCode);
  const bpm = clampNumber(Number(data.bpm), 40, 240, DEFAULT_ACTIVITY.defaultBpm);
  const payload = {
    enabled: Boolean(data.enabled),
    bpm,
    subdivision: data.subdivision || "quarter",
    accentEvery: clampNumber(Number(data.accentEvery), 1, 16, 4),
    updatedAt: serverTimestamp(),
    updatedAtClient: Date.now()
  };

  if (data.restart || data.startedAt === "server" || data.startedAt === true) {
    payload.startedAt = serverTimestamp();
    payload.startedAtClient = Date.now();
  }

  await update(ref(db, `rooms/${code}/metronome`), payload);
  touchRoom(code);
}

export function listenMetronome(roomCode, callback, onError) {
  const code = normalizeRoomCode(roomCode);
  const metronomeRef = ref(db, `rooms/${code}/metronome`);
  return onValue(metronomeRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  }, onError);
}

export function listenPatterns(roomCode, callback, onError) {
  const code = normalizeRoomCode(roomCode);
  const patternsRef = ref(db, `rooms/${code}/patterns`);
  return onValue(patternsRef, (snapshot) => {
    callback(snapshot.exists() ? sanitizePatterns(snapshot.val()) : sanitizePatterns(DEFAULT_PATTERNS));
  }, onError);
}

export async function updateGroupPattern(roomCode, groupId, patternData = {}) {
  const code = normalizeRoomCode(roomCode);
  const groupKey = String(Number(groupId));
  const clean = sanitizePatterns({ [groupKey]: patternData })[groupKey];
  await set(ref(db, `rooms/${code}/patterns/${groupKey}`), {
    ...clean,
    patternText: clean.patternText,
    helper: clean.helper,
    updatedAt: serverTimestamp(),
    updatedAtClient: Date.now()
  });
  touchRoom(code);
}

export async function updatePatterns(roomCode, patterns = DEFAULT_PATTERNS) {
  const code = normalizeRoomCode(roomCode);
  const clean = sanitizePatterns(patterns);
  const payload = {};
  Object.entries(clean).forEach(([groupId, pattern]) => {
    payload[groupId] = {
      ...pattern,
      updatedAt: serverTimestamp(),
      updatedAtClient: Date.now()
    };
  });
  await set(ref(db, `rooms/${code}/patterns`), payload);
  touchRoom(code);
}

export async function resetPatterns(roomCode) {
  await updatePatterns(roomCode, DEFAULT_PATTERNS);
}

export async function applyPatternPreset(roomCode, presetId) {
  const preset = getPatternPreset(presetId);
  await updatePatterns(roomCode, preset.patterns);
  return preset;
}

export function listenServerTimeOffset(callback, onError) {
  const offsetRef = ref(db, ".info/serverTimeOffset");
  return onValue(offsetRef, (snapshot) => {
    callback(Number(snapshot.val() || 0));
  }, onError);
}

export async function readParticipant(roomCode, uid = auth.currentUser?.uid) {
  if (!uid) return null;
  const code = normalizeRoomCode(roomCode);
  const snapshot = await get(child(ref(db), `rooms/${code}/participants/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
}

export function stopListening(unsubscribe) {
  if (typeof unsubscribe === "function") unsubscribe();
}

export function forceReconnect() {
  goOffline(db);
  window.setTimeout(() => goOnline(db), 300);
}

function touchRoom(_code) {
  // Intencionalmente no escribimos en rooms/{roomCode} para evitar que
  // reglas segmentadas bloqueen cambios de patterns/metronome/currentCue.
  // Si necesitas updatedAt global, habilita esa ruta en reglas y agrega aquí
  // escrituras explícitas a rooms/{roomCode}/updatedAt.
}

function createDefaultRoom(hostUid) {
  return {
    title: "Salvémoslos del Reggaetón · Especial Michael Jackson",
    activity: DEFAULT_ACTIVITY.id,
    bpm: DEFAULT_ACTIVITY.defaultBpm,
    mode: "rehearsal",
    hostUid,
    createdAt: serverTimestamp(),
    createdAtClient: Date.now(),
    updatedAt: serverTimestamp(),
    updatedAtClient: Date.now(),
    currentCue: {
      key: "prepare",
      type: "prepare",
      activeGroup: null,
      message: "Prepárate",
      subMessage: "Mira tu grupo y espera la entrada",
      participantStatus: "espera",
      tone: "neutral",
      icon: "🎬",
      updatedAt: serverTimestamp(),
      updatedAtClient: Date.now()
    },
    metronome: {
      enabled: false,
      bpm: DEFAULT_ACTIVITY.defaultBpm,
      subdivision: "quarter",
      accentEvery: 4,
      startedAt: serverTimestamp(),
      startedAtClient: Date.now(),
      updatedAt: serverTimestamp(),
      updatedAtClient: Date.now()
    },
    patterns: sanitizePatterns(DEFAULT_PATTERNS),
    participants: {}
  };
}

function startHeartbeat(participantRef) {
  if (heartbeatTimer) clearInterval(heartbeatTimer);

  heartbeatTimer = window.setInterval(() => {
    update(participantRef, {
      lastSeen: serverTimestamp(),
      lastSeenClient: Date.now()
    }).catch((error) => {
      console.warn("Heartbeat falló:", error);
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    });
  }, HEARTBEAT_MS);

  window.addEventListener("pagehide", () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
  }, { once: true });
}

function sanitizeParticipantName(value) {
  const name = String(value || "").trim().replace(/\s+/g, " ").slice(0, 32);
  return name || "Participante";
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}
