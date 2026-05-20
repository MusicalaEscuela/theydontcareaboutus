// ============================================================
// participant.ui.js
// Interfaz mobile-first para el público participante.
// ============================================================

import {
  joinRoom,
  leaveRoom,
  listenMetronome,
  listenPatterns,
  listenServerTimeOffset,
  listenToConnection,
  listenToCue,
  listenToRoom,
  normalizeRoomCode,
  stopListening
} from "./room.service.js";
import {
  ACTIVITIES,
  GROUPS,
  DEFAULT_PATTERNS,
  getActivityById,
  getGroupById,
  getGroupPattern,
  sanitizePatterns
} from "./rhythms.js";

let currentRoomCode = "MJ30";
let currentParticipant = null;
let currentRoom = null;
let lastCueSignature = "";
let cueUnsubscribe = null;
let roomUnsubscribe = null;
let metronomeUnsubscribe = null;
let patternsUnsubscribe = null;
let serverOffsetUnsubscribe = null;
let connectionUnsubscribe = null;
let serverTimeOffset = 0;
let metronomeState = null;
let currentPatterns = sanitizePatterns(DEFAULT_PATTERNS);
let currentStep16 = -1;
let pulseAnimationFrame = null;
let lastPulseBeat = null;
let lastPulseActive = false;

export async function initParticipant(roomCode) {
  currentRoomCode = normalizeRoomCode(roomCode);
  renderJoinScreen(currentRoomCode);
  attachConnectionWatcher();
}

function renderJoinScreen(roomCode) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <main class="participant-shell join-shell fade-in">
      <section class="brand-card join-card" aria-labelledby="join-title">
        <div class="brand-topline">
          <img src="logo.png" alt="Musicala" class="brand-logo" onerror="this.classList.add('hidden')" />
          <span class="brand-fallback">Musicala</span>
        </div>

        <p class="event-kicker">Sala rítmica en vivo</p>
        <h1 id="join-title">Salvémoslos del Reggaetón</h1>
        <p class="event-subtitle">Especial Michael Jackson · Base corporal original</p>

        <div class="room-pill" aria-label="Código de sala">Sala ${escapeHtml(roomCode)}</div>

        <form id="join-form" class="join-form">
          <label class="field-label" for="participant-name">Tu nombre <span>(opcional)</span></label>
          <input id="participant-name" class="text-input" type="text" maxlength="32" placeholder="Ej: Cata" autocomplete="name" />

          <fieldset class="group-fieldset">
            <legend>Elige grupo o deja automático</legend>

            <label class="group-option auto-option">
              <input type="radio" name="group" value="auto" checked />
              <span class="group-option-body">
                <strong>✨ Automático</strong>
                <small>La app te ubica donde haga falta más gente.</small>
              </span>
            </label>

            <div class="group-options-grid">
              ${GROUPS.map((group) => `
                <label class="group-option compact-group" style="--group-color:${group.color}; --group-soft:${group.softColor};">
                  <input type="radio" name="group" value="${group.id}" />
                  <span class="group-option-body">
                    <span class="group-option-emoji" aria-hidden="true">${group.emoji}</span>
                    <strong>Grupo ${group.id}</strong>
                    <small>${group.name}</small>
                  </span>
                </label>
              `).join("")}
            </div>
          </fieldset>

          <button class="primary-action" type="submit">Entrar a la sala</button>
        </form>

        <p class="microcopy">No necesitas instalar nada. Qué civilizado por una vez.</p>
      </section>
    </main>
  `;

  document.getElementById("join-form").addEventListener("submit", handleJoinSubmit);
}

async function handleJoinSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const name = document.getElementById("participant-name").value;
  const groupValue = new FormData(form).get("group");
  const selectedGroup = groupValue === "auto" ? null : Number(groupValue);

  setButtonLoading(submitButton, "Entrando…");

  try {
    const result = await joinRoom(currentRoomCode, {
      name,
      group: selectedGroup
    });

    currentParticipant = result.participant;
    renderParticipantRoom(currentRoomCode, currentParticipant);
    startParticipantListeners();
  } catch (error) {
    renderInlineError(form, error.message || "No se pudo entrar a la sala.");
    submitButton.disabled = false;
    submitButton.textContent = "Entrar a la sala";
  }
}

function renderParticipantRoom(roomCode, participant) {
  const group = getGroupById(participant.group);
  const groupPattern = getGroupPattern(currentPatterns, participant.group);
  const app = document.getElementById("app");

  app.innerHTML = `
    <main class="participant-shell live-shell fade-in" style="--group-color:${group.color}; --group-soft:${group.softColor};">
      <header class="participant-header">
        <div>
          <div id="conn-badge" class="connection-badge">
            <span class="conn-dot"></span>
            Conectado a sala ${escapeHtml(roomCode)}
          </div>
          <p id="participant-room-title" class="participant-room-title">Sala rítmica Musicala</p>
          <p id="activity-name" class="activity-name">Base corporal</p>
        </div>
        <button id="leave-room-btn" class="ghost-button small-button" type="button">Salir</button>
      </header>

      <section id="pulse-widget" class="pulse-widget meter-off" aria-live="polite">
        <div class="pulse-copy">
          <strong>Pulso del director</strong>
          <span id="pulse-meta">Pulso en espera</span>
        </div>
        <div id="pulse-light" class="pulse-light" aria-label="Pulso visual">
          <span id="pulse-count" class="pulse-count">–</span>
        </div>
        <div id="pulse-bpm" class="pulse-bpm">BPM --</div>
      </section>

      <section id="cue-card" class="cue-card" aria-live="assertive">
        <div class="group-badge">
          <span>Grupo ${group.id}</span>
          <strong>${group.name}</strong>
        </div>

        <div class="main-emoji" aria-hidden="true">${group.emoji}</div>

        <div id="cue-status" class="cue-status">Espera</div>
        <h1 id="cue-message" class="cue-message">Espera tu entrada</h1>
        <p id="cue-submessage" class="cue-submessage">${group.action}</p>

        <div class="pattern-panel" id="pattern-panel">
          <span class="pattern-label">Tu patrón</span>
          <strong id="pattern-text">${escapeHtml(groupPattern.patternText)}</strong>
          <small id="pattern-helper">${escapeHtml(groupPattern.helper)}</small>
          <div id="participant-step-grid" class="step-grid" aria-label="Patrón de 16 pasos">
            ${renderParticipantSteps(groupPattern.steps)}
          </div>
        </div>

        <button id="help-toggle" class="secondary-action" type="button">¿Qué hago?</button>
      </section>

      <section id="help-panel" class="help-panel" hidden>
        <h2>${group.emoji} Grupo ${group.id}: ${group.name}</h2>
        <p><strong>Acción:</strong> <span id="help-action">${escapeHtml(groupPattern.action)}</span></p>
        <p><strong>Patrón:</strong> <span id="help-detail">${escapeHtml(groupPattern.detail)}</span></p>
        <p id="help-copy">${escapeHtml(groupPattern.help)}</p>
      </section>
    </main>
  `;

  document.getElementById("help-toggle").addEventListener("click", () => {
    const panel = document.getElementById("help-panel");
    panel.hidden = !panel.hidden;
  });

  document.getElementById("leave-room-btn").addEventListener("click", async () => {
    await leaveRoom();
    cleanupParticipantListeners();
    renderJoinScreen(currentRoomCode);
  });
}

function startParticipantListeners() {
  cleanupParticipantListeners();

  cueUnsubscribe = listenToCue(currentRoomCode, (cue) => {
    updateParticipantCue(cue || createFallbackCue());
  }, (error) => {
    showConnectionError(error.message);
  });

  roomUnsubscribe = listenToRoom(currentRoomCode, (room) => {
    currentRoom = room;
    updateRoomMeta(room);
  }, (error) => {
    showConnectionError(error.message);
  });

  metronomeUnsubscribe = listenMetronome(currentRoomCode, (metronome) => {
    metronomeState = metronome;
    ensurePulseAnimation();
  }, (error) => {
    showConnectionError(error.message);
  });

  patternsUnsubscribe = listenPatterns(currentRoomCode, (patterns) => {
    currentPatterns = sanitizePatterns(patterns || DEFAULT_PATTERNS);
    updateParticipantPatternPanel();
  }, (error) => {
    showConnectionError(error.message);
  });

  serverOffsetUnsubscribe = listenServerTimeOffset((offset) => {
    serverTimeOffset = Number(offset || 0);
    ensurePulseAnimation();
  });
}

function cleanupParticipantListeners() {
  stopListening(cueUnsubscribe);
  stopListening(roomUnsubscribe);
  stopListening(metronomeUnsubscribe);
  stopListening(patternsUnsubscribe);
  stopListening(serverOffsetUnsubscribe);
  cueUnsubscribe = null;
  roomUnsubscribe = null;
  metronomeUnsubscribe = null;
  patternsUnsubscribe = null;
  serverOffsetUnsubscribe = null;
  if (pulseAnimationFrame) {
    cancelAnimationFrame(pulseAnimationFrame);
    pulseAnimationFrame = null;
  }
}

function attachConnectionWatcher() {
  if (connectionUnsubscribe) stopListening(connectionUnsubscribe);
  connectionUnsubscribe = listenToConnection((connected) => {
    const badge = document.getElementById("conn-badge");
    if (!badge) return;

    if (connected) {
      badge.classList.remove("is-offline");
      badge.innerHTML = `<span class="conn-dot"></span> Conectado a sala ${escapeHtml(currentRoomCode)}`;
    } else {
      badge.classList.add("is-offline");
      badge.innerHTML = `<span class="conn-dot"></span> Sin conexión · reconectando`;
    }
  });
}

function renderParticipantSteps(steps = []) {
  const normalized = Array.from({ length: 16 }, (_, index) => Boolean(steps[index]));
  return normalized.map((active, index) => `
    <span class="step-dot ${active ? "is-pattern" : ""} ${index % 4 === 0 ? "is-accent" : ""}" data-step-index="${index}" title="Paso ${index + 1}"></span>
  `).join("");
}

function updateParticipantPatternPanel() {
  if (!currentParticipant) return;
  const group = getGroupById(currentParticipant.group);
  const pattern = getGroupPattern(currentPatterns, currentParticipant.group);
  const shell = document.querySelector(".participant-shell");
  if (shell && group) {
    shell.style.setProperty("--group-color", pattern.color || group.color);
    shell.style.setProperty("--group-soft", pattern.softColor || group.softColor);
  }

  const text = document.getElementById("pattern-text");
  const helper = document.getElementById("pattern-helper");
  const grid = document.getElementById("participant-step-grid");
  const submessage = document.getElementById("cue-submessage");
  const helpAction = document.getElementById("help-action");
  const helpDetail = document.getElementById("help-detail");
  const helpCopy = document.getElementById("help-copy");

  if (text) text.textContent = pattern.patternText || "—";
  if (helper) helper.textContent = pattern.helper || "Patrón actualizado";
  if (grid) {
    grid.innerHTML = renderParticipantSteps(pattern.steps);
    updateParticipantStepCursor(currentStep16);
  }
  if (submessage) submessage.textContent = pattern.action || group?.action || "Sigue tu patrón";
  if (helpAction) helpAction.textContent = pattern.action || group?.action || "Sigue tu patrón";
  if (helpDetail) helpDetail.textContent = pattern.detail || group?.patternDetail || "Mira los pasos iluminados.";
  if (helpCopy) helpCopy.textContent = pattern.help || group?.help || "Sigue la luz del patrón.";
}

function updateParticipantStepCursor(stepIndex) {
  if (!currentParticipant) return;
  const pattern = getGroupPattern(currentPatterns, currentParticipant.group);
  document.querySelectorAll("#participant-step-grid .step-dot").forEach((dot) => {
    const index = Number(dot.dataset.stepIndex);
    const current = index === Number(stepIndex);
    const active = Boolean(pattern.steps[index]);
    dot.classList.toggle("is-pattern", active);
    dot.classList.toggle("is-current", current);
    dot.classList.toggle("is-hit", current && active);
    dot.classList.toggle("is-accent", index % 4 === 0);
  });
}

function updateRoomMeta(room) {
  const activityName = document.getElementById("activity-name");
  const roomTitle = document.getElementById("participant-room-title");
  if (!room) return;

  const activity = getActivityById(room.activity);
  const modeLabel = room.mode === "show" ? "Show" : "Ensayo";
  if (roomTitle) roomTitle.textContent = room.title || "Sala rítmica Musicala";
  if (activityName) activityName.textContent = `${activity.shortName} · ${room.bpm || activity.defaultBpm} BPM · ${modeLabel}`;
}


function ensurePulseAnimation() {
  if (pulseAnimationFrame) return;
  pulseAnimationFrame = requestAnimationFrame(updatePulseVisual);
}

function updatePulseVisual() {
  const widget = document.getElementById("pulse-widget");
  const light = document.getElementById("pulse-light");
  const count = document.getElementById("pulse-count");
  const meta = document.getElementById("pulse-meta");
  const bpmEl = document.getElementById("pulse-bpm");

  if (!widget || !light || !count || !meta || !bpmEl) {
    pulseAnimationFrame = null;
    return;
  }

  const bpm = clampNumber(Number(metronomeState?.bpm || currentRoom?.bpm || 96), 40, 240, 96);
  const enabled = Boolean(metronomeState?.enabled);
  const startedAt = Number(metronomeState?.startedAt || metronomeState?.startedAtClient || 0);
  const accentEvery = clampNumber(Number(metronomeState?.accentEvery || 4), 1, 16, 4);

  bpmEl.textContent = `BPM ${bpm}`;

  if (!enabled || !startedAt) {
    widget.classList.remove("meter-on");
    widget.classList.add("meter-off");
    light.classList.remove("is-active", "is-accent");
    count.textContent = "–";
    meta.textContent = "Pulso en espera";
    currentStep16 = -1;
    updateParticipantStepCursor(-1);
    lastPulseBeat = null;
    lastPulseActive = false;
    pulseAnimationFrame = requestAnimationFrame(updatePulseVisual);
    return;
  }

  const serverNow = Date.now() + serverTimeOffset;
  const elapsed = Math.max(0, serverNow - startedAt);
  const beatDurationMs = 60000 / bpm;
  const beatIndex = Math.floor(elapsed / beatDurationMs);
  const phase = (elapsed % beatDurationMs) / beatDurationMs;
  const currentBeat = (beatIndex % accentEvery) + 1;
  const stepDurationMs = beatDurationMs / 4;
  currentStep16 = Math.floor(elapsed / stepDurationMs) % 16;
  updateParticipantStepCursor(currentStep16);
  const isActive = phase < 0.18;
  const isAccent = isActive && currentBeat === 1;

  widget.classList.add("meter-on");
  widget.classList.remove("meter-off");
  count.textContent = String(currentBeat);
  meta.textContent = "Pulso del director";
  light.classList.toggle("is-active", isActive);
  light.classList.toggle("is-accent", isAccent);

  if (isActive && (!lastPulseActive || lastPulseBeat !== currentBeat)) {
    widget.classList.remove("pulse-hit");
    void widget.offsetWidth;
    widget.classList.add("pulse-hit");
  }

  lastPulseBeat = currentBeat;
  lastPulseActive = isActive;
  pulseAnimationFrame = requestAnimationFrame(updatePulseVisual);
}

function updateParticipantCue(cue) {
  if (!currentParticipant) return;

  const group = getGroupById(currentParticipant.group);
  const groupPattern = getGroupPattern(currentPatterns, currentParticipant.group);
  const card = document.getElementById("cue-card");
  const status = document.getElementById("cue-status");
  const message = document.getElementById("cue-message");
  const submessage = document.getElementById("cue-submessage");

  if (!group || !card || !status || !message || !submessage) return;

  const state = getVisualStateForCue(cue, group, groupPattern);
  card.className = `cue-card ${state.cardClass}`;
  status.textContent = state.status;
  message.textContent = state.message;
  submessage.textContent = state.subMessage;

  const signature = `${cue.type}:${cue.activeGroup ?? "none"}:${cue.updatedAtClient || cue.updatedAt || "x"}:${state.isMyTurn}`;
  if (state.shouldVibrate && signature !== lastCueSignature) {
    vibrate(state.vibrationPattern);
  }
  lastCueSignature = signature;
}

function getVisualStateForCue(cue, group, groupPattern = null) {
  const cueType = cue?.type || "prepare";
  const activeGroup = Number(cue?.activeGroup || 0);

  if (cueType === "group") {
    const isMyTurn = activeGroup === group.id;
    return isMyTurn
      ? {
        cardClass: "is-active is-group-turn",
        status: "Entra",
        message: "¡Ahora tu grupo!",
        subMessage: groupPattern?.action || group.action,
        isMyTurn: true,
        shouldVibrate: true,
        vibrationPattern: [90, 35, 90]
      }
      : {
        cardClass: "is-waiting",
        status: "Espera",
        message: "Espera tu entrada",
        subMessage: `Está activo el Grupo ${activeGroup}`,
        isMyTurn: false,
        shouldVibrate: false
      };
  }

  if (cueType === "all") {
    return {
      cardClass: "is-active is-all",
      status: "Todos",
      message: "Todos juntos",
      subMessage: "Sigue tu patrón · Todos juntos",
      isMyTurn: true,
      shouldVibrate: true,
      vibrationPattern: [70, 35, 70, 35, 120]
    };
  }

  if (cueType === "silence") {
    return {
      cardClass: "is-silence",
      status: "Silencio",
      message: "Silencio total",
      subMessage: "Para ahora · cero golpes · cero gritos",
      isMyTurn: false,
      shouldVibrate: true,
      vibrationPattern: [180]
    };
  }

  if (cueType === "cut") {
    return {
      cardClass: "is-cut",
      status: "Corte",
      message: "Corte final",
      subMessage: "Para en seco · todos al tiempo",
      isMyTurn: false,
      shouldVibrate: true,
      vibrationPattern: [250]
    };
  }

  if (cueType === "pose") {
    return {
      cardClass: "is-pose",
      status: "Pose final",
      message: "Pose Michael Jackson",
      subMessage: "Congélate en una pose final",
      isMyTurn: true,
      shouldVibrate: true,
      vibrationPattern: [80, 40, 220]
    };
  }

  if (cueType === "countdown") {
    return {
      cardClass: "is-countdown",
      status: "Espera",
      message: "Viene el ritmo",
      subMessage: cue.subMessage || "Cinco · cuatro · tres · dos · uno",
      isMyTurn: false,
      shouldVibrate: true,
      vibrationPattern: [70]
    };
  }

  if (cueType === "lower") {
    return {
      cardClass: "is-lower",
      status: "Espera",
      message: "Baja la energía",
      subMessage: "Más suave · mantén el pulso",
      isMyTurn: false,
      shouldVibrate: false
    };
  }

  return {
    cardClass: "is-prepare",
    status: "Espera",
    message: cue?.message || "Prepárate",
    subMessage: cue?.subMessage || "Mira tu grupo y espera la entrada",
    isMyTurn: false,
    shouldVibrate: false
  };
}

function createFallbackCue() {
  return {
    type: "prepare",
    activeGroup: null,
    message: "Prepárate",
    subMessage: "Mira tu grupo y espera la entrada"
  };
}

function vibrate(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function setButtonLoading(button, text) {
  button.disabled = true;
  button.dataset.originalText = button.textContent;
  button.textContent = text;
}

function renderInlineError(container, message) {
  const oldError = container.querySelector(".inline-error");
  if (oldError) oldError.remove();

  const error = document.createElement("p");
  error.className = "inline-error";
  error.textContent = message;
  container.appendChild(error);
}

function showConnectionError(message) {
  const badge = document.getElementById("conn-badge");
  if (!badge) return;
  badge.classList.add("is-offline");
  badge.innerHTML = `<span class="conn-dot"></span> Error de conexión`;
  console.warn("Firebase listener error:", message);
}


function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
