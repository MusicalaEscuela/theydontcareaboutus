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
  CHANT_RESPONSE_TEXT,
  GROUPS,
  DEFAULT_PATTERNS,
  getActivityById,
  getGroupById,
  getGroupPattern,
  sanitizePatterns
} from "./rhythms.js";
import { escapeHtml, clampNumber, renderChantWords } from "./utils.js";

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
let currentCueState = null;
let currentStep16 = -1;
let lastStep16 = -2;
let lastBeat = -1;
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

        <div class="participant-instructions">
          <strong>Cuenta siempre: 1, 2, 3, 4.</strong>
          <p>Cuando tu pantalla se ponga de color, haces el ritmo o movimiento de tu grupo. Cuando esté clara, espera tu turno y sigue contando por dentro. Si aparece "Todos ahora", todos participan al mismo tiempo.</p>
        </div>

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
    const result = await joinRoom(currentRoomCode, { name, group: selectedGroup });
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
          <small id="group-location" hidden></small>
        </div>

        <div class="main-emoji" aria-hidden="true">${group.emoji}</div>

        <div id="cue-status" class="cue-status">Espera</div>
        <h1 id="cue-message" class="cue-message">Espera tu entrada</h1>
        <p id="cue-submessage" class="cue-submessage">${group.action}</p>

        <div id="chant-lyrics-card" class="chant-lyrics-card" hidden>
          <span>Lee y canta</span>
          <div id="chant-lyrics" class="chant-lyrics">${renderChantWords(getChantText())}</div>
          <small>Lee la frase y cántala cuando entre la pista.</small>
        </div>

        <div id="count-guide" class="count-guide" aria-label="Conteo 1 2 3 4">
          ${[1, 2, 3, 4].map((n) => `<span class="count-number" data-count-number="${n}">${n}</span>`).join("")}
        </div>

        <div class="pattern-panel" id="pattern-panel">
          <span class="pattern-label">Tu patrón</span>
          <strong id="pattern-text">${escapeHtml(groupPattern.patternText)}</strong>
          <small id="pattern-helper">${escapeHtml(groupPattern.helper)}</small>
          <div id="participant-step-grid" class="step-grid" aria-label="Patrón de 16 pasos">
            ${renderParticipantSteps(groupPattern.steps)}
          </div>
        </div>

        <button id="help-toggle" class="secondary-action" type="button">¿Qué hago?</button>

        <section id="help-panel" class="help-panel" hidden>
          <h2>${group.emoji} Grupo ${group.id}: ${group.name}</h2>
          <p><strong>Acción:</strong> <span id="help-action">${escapeHtml(groupPattern.action)}</span></p>
          <p><strong>Patrón:</strong> <span id="help-detail">${escapeHtml(groupPattern.detail)}</span></p>
          <p id="help-copy">${escapeHtml(groupPattern.help)}</p>
        </section>
      </section>

      <section class="how-to-play-panel">
        <button id="how-to-toggle" class="ghost-button small-button" type="button" aria-expanded="false">Cómo jugar</button>
        <div id="how-to-body" hidden>
          <h2>Cómo jugar</h2>
          <ul>
            <li>Mira tu grupo.</li>
            <li>Cuenta 1, 2, 3, 4.</li>
            <li>Cuando esté morado: haces tu ritmo.</li>
            <li>Cuando esté claro: esperas.</li>
            <li>Si aparece la frase coral: responde cantando la letra que aparece en pantalla.</li>
          </ul>
        </div>
      </section>

      <section id="participant-intro-overlay" class="participant-intro-overlay" hidden aria-live="polite"></section>
    </main>
  `;

  document.getElementById("help-toggle")?.addEventListener("click", (event) => {
    const panel = document.getElementById("help-panel");
    if (!panel) return;
    panel.hidden = !panel.hidden;
    event.currentTarget.textContent = panel.hidden ? "¿Qué hago?" : "Ocultar ayuda";
    if (!panel.hidden) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  document.getElementById("how-to-toggle").addEventListener("click", (event) => {
    const panel = document.getElementById("how-to-body");
    panel.hidden = !panel.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!panel.hidden));
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
  }, (error) => showConnectionError(error.message));

  roomUnsubscribe = listenToRoom(currentRoomCode, (room) => {
    currentRoom = room;
    updateRoomMeta(room);
  }, (error) => showConnectionError(error.message));

  metronomeUnsubscribe = listenMetronome(currentRoomCode, (metronome) => {
    metronomeState = metronome;
    ensurePulseAnimation();
  }, (error) => showConnectionError(error.message));

  patternsUnsubscribe = listenPatterns(currentRoomCode, (patterns) => {
    currentPatterns = sanitizePatterns(patterns || DEFAULT_PATTERNS);
    updateParticipantPatternPanel();
  }, (error) => showConnectionError(error.message));

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
  lastStep16 = -2;
  lastBeat = -1;
  lastPulseBeat = null;
  lastPulseActive = false;
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
  return Array.from({ length: 16 }, (_, index) => {
    const active = Boolean(steps[index]);
    return `<span class="step-dot ${active ? "is-pattern" : ""} ${index % 4 === 0 ? "is-accent" : ""}" data-step-index="${index}" title="Paso ${index + 1}"></span>`;
  }).join("");
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
    lastStep16 = -2;
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
  if (!room) return;
  const activityName = document.getElementById("activity-name");
  const roomTitle = document.getElementById("participant-room-title");
  const chantLyrics = document.getElementById("chant-lyrics");
  const groupLocation = document.getElementById("group-location");

  const activity = getActivityById(room.activity);
  const modeLabel = room.mode === "show" ? "Show" : "Ensayo";
  if (roomTitle) roomTitle.textContent = room.title || "Sala rítmica Musicala";
  if (activityName) activityName.textContent = `${activity.shortName} · ${room.bpm || activity.defaultBpm} BPM · ${modeLabel}`;
  if (chantLyrics) chantLyrics.innerHTML = renderChantWords(getChantText(room), getCurrentBeatProgress());
  if (groupLocation && currentParticipant) {
    const location = room.groupLocations?.[String(currentParticipant.group)] || "";
    groupLocation.textContent = location ? `Lugar: ${location}` : "";
    groupLocation.hidden = !location;
  }
  updateParticipantIntroOverlay(room);
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
  const startedAt = Number(metronomeState?.startedAt || 0);
  const accentEvery = clampNumber(Number(metronomeState?.accentEvery || 4), 1, 16, 4);

  bpmEl.textContent = `BPM ${bpm}`;

  if (!enabled || !startedAt) {
    widget.classList.remove("meter-on");
    widget.classList.add("meter-off");
    light.classList.remove("is-active", "is-accent");
    count.textContent = "–";
    meta.textContent = "Pulso en espera";
    if (currentStep16 !== -1) {
      currentStep16 = -1;
      lastStep16 = -2;
      updateParticipantStepCursor(-1);
    }
    if (lastBeat !== -1) {
      lastBeat = -1;
      updateCountGuide(-1);
    }
    lastPulseBeat = null;
    lastPulseActive = false;
    pulseAnimationFrame = requestAnimationFrame(updatePulseVisual);
    return;
  }

  const serverNow = Date.now() + serverTimeOffset;
  const elapsed = Math.max(0, serverNow - startedAt);
  const beatDurationMs = 60000 / bpm;
  const stepDurationMs = beatDurationMs / 4;
  const beatIndex = Math.floor(elapsed / beatDurationMs);
  const phase = (elapsed % beatDurationMs) / beatDurationMs;
  const currentBeat = (beatIndex % accentEvery) + 1;
  const step = Math.floor(elapsed / stepDurationMs) % 16;

  // Solo actualiza el DOM del cursor cuando el paso cambia.
  if (step !== lastStep16) {
    currentStep16 = step;
    lastStep16 = step;
    updateParticipantStepCursor(step);
  }

  // Solo actualiza el conteo cuando el beat cambia.
  if (currentBeat !== lastBeat) {
    lastBeat = currentBeat;
    updateCountGuide(currentBeat);
  }

  // Karaoke del canto (solo cuando está activo).
  if (currentCueState?.type === "chant") {
    updateChantKaraoke();
  }

  const isActive = phase < 0.18;
  const isAccent = isActive && currentBeat === 1;

  widget.classList.add("meter-on");
  widget.classList.remove("meter-off");
  count.textContent = String(currentBeat);
  meta.textContent = "Pulso del director";
  light.classList.toggle("is-active", isActive);
  light.classList.toggle("is-accent", isAccent);

  // Dispara la animación de golpe solo en el flanco de subida de cada beat.
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
  currentCueState = cue;

  const group = getGroupById(currentParticipant.group);
  const groupPattern = getGroupPattern(currentPatterns, currentParticipant.group);
  const card = document.getElementById("cue-card");
  const status = document.getElementById("cue-status");
  const message = document.getElementById("cue-message");
  const submessage = document.getElementById("cue-submessage");
  const chantCard = document.getElementById("chant-lyrics-card");
  const chantLyrics = document.getElementById("chant-lyrics");

  if (!group || !card || !status || !message || !submessage) return;

  const state = getVisualStateForCue(cue, group, groupPattern);
  card.className = `cue-card ${state.cardClass}`;
  status.textContent = state.status;
  message.textContent = state.message;
  submessage.textContent = state.subMessage;
  if (chantCard) chantCard.hidden = !state.isChant;
  if (chantLyrics) chantLyrics.innerHTML = renderChantWords(getChantText(), state.isChant ? getChantProgress(cue) : -1);

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
        cardClass: "is-active is-active-purple is-group-turn",
        status: "AHORA TÚ",
        message: "AHORA TÚ",
        subMessage: groupPattern?.action || group.action,
        isMyTurn: true,
        shouldVibrate: true,
        vibrationPattern: [90, 35, 90]
      }
      : {
        cardClass: "is-waiting",
        status: "Espera tu entrada",
        message: "Espera tu entrada",
        subMessage: "Sigue contando 1, 2, 3, 4",
        isMyTurn: false,
        shouldVibrate: false
      };
  }

  if (cueType === "all") {
    return {
      cardClass: "is-active is-all",
      status: "TODOS AHORA",
      message: "TODOS AHORA",
      subMessage: "Sigue tu patrón · Todos juntos",
      isMyTurn: true,
      shouldVibrate: true,
      vibrationPattern: [70, 35, 70, 35, 120]
    };
  }

  if (cueType === "chant") {
    return {
      cardClass: "is-active is-chant",
      status: "Frase coral",
      message: "TODOS RESPONDEN",
      subMessage: "Lee la frase y cántala cuando entre la pista",
      isMyTurn: true,
      isChant: true,
      shouldVibrate: true,
      vibrationPattern: [80, 40, 80, 40, 160]
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
  return { type: "prepare", activeGroup: null, message: "Prepárate", subMessage: "Mira tu grupo y espera la entrada" };
}

function vibrate(pattern) {
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

function updateCountGuide(currentBeat) {
  document.querySelectorAll(".count-number").forEach((item) => {
    item.classList.toggle("is-current", Number(item.dataset.countNumber) === Number(currentBeat));
  });
}

// Devuelve un progreso de 0–1 basado en qué beat estamos (para actualizar karaoke del canto al cambiar de beat).
function getCurrentBeatProgress() {
  return -1;
}

function updateChantKaraoke() {
  const card = document.getElementById("chant-lyrics-card");
  const lyrics = document.getElementById("chant-lyrics");
  if (!card || card.hidden || !lyrics || currentCueState?.type !== "chant") return;
  lyrics.innerHTML = renderChantWords(getChantText(), getChantProgress(currentCueState));
}

function getChantProgress(cue = currentCueState) {
  if (!cue) return -1;
  const startedAt = Number(cue.updatedAtClient || Date.now());
  return Math.min(1, Math.max(0, Date.now() - startedAt) / 3000);
}

function getChantText(room = currentRoom) {
  return String(room?.chantText || CHANT_RESPONSE_TEXT);
}

function updateParticipantIntroOverlay(room = currentRoom) {
  const overlay = document.getElementById("participant-intro-overlay");
  if (!overlay) return;

  const projector = room?.projector || {};
  if (projector.view !== "intro") {
    overlay.hidden = true;
    overlay.innerHTML = "";
    return;
  }

  const slides = getParticipantIntroSlides();
  const slideIndex = Math.max(0, Math.min(slides.length - 1, Number(projector.introSlide || 0)));
  const slide = slides[slideIndex] || slides[0];
  overlay.hidden = false;
  overlay.innerHTML = `
    <div class="participant-intro-stage ${slide.bg}">
      <div class="participant-intro-progress" style="width:${(slideIndex / (slides.length - 1)) * 100}%"></div>
      <span class="participant-intro-count">${String(slideIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}</span>
      <span class="participant-intro-brand">MUSICALA</span>
      <div class="participant-intro-content">
        <p>${slide.label}</p>
        <h1>${slide.title}</h1>
        <div>${slide.body}</div>
      </div>
    </div>
  `;
}

function getParticipantIntroSlides() {
  return [
    { bg: "bg-radial", label: "Musicala · Especial", title: "EL RESTAURANTE<br><em>TAMBIÉN</em><br><span>SUENA</span>", body: "Especial Michael Jackson · They Don't Care About Us" },
    { bg: "bg-radial", label: "Atención, público querido", title: "Atención,<br>público querido", body: "En unos minutos este restaurante dejará de ser solo un restaurante." },
    { bg: "bg-red", label: "La canción de hoy", title: "They Don't Care<br>About Us", body: "Una canción intensa, directa, con energía de protesta y fuerza colectiva." },
    { bg: "bg-radial", label: "Michael Jackson", title: "Más grande<br>que una tarima", body: "Michael construía imágenes, coreografías y momentos más grandes que cualquier escenario." },
    { bg: "bg-split", label: "Spike Lee · Brasil", title: "El video<br>que se quedó", body: "Calles, comunidad, percusión, cuerpos en movimiento y pulso colectivo." },
    { bg: "bg-musicala", label: "El ritmo empieza aquí", title: "En el cuerpo", body: "Palmas, pies, piernas, mesa y vaso. Todos tienen una parte." },
    { bg: "bg-red", label: "Verdad liberadora", title: "No hay que ser<br>músico profesional", body: "Hay que escuchar, contar y entrar a tiempo." },
    { bg: "bg-radial", label: "La magia del ensamble", title: "Sencillo<br>en el momento correcto", body: "Cuando todo se junta, eso ya no es ruido: es ensamble." },
    { bg: "bg-musicala", label: "Tu misión de hoy", title: "Cada grupo<br>tiene una parte", body: "Pies, palmas, piernas y mesa / vaso entran poco a poco." },
    { bg: "bg-red", label: "La regla es simple", title: "Cuenta siempre<br>1 · 2 · 3 · 4", body: "Pantalla normal: espera. Pantalla morada: haz tu ritmo." },
    { bg: "bg-radial", label: "Frase coral", title: "Lee. Escucha.<br>Responde.", body: "No tiene que sonar perfecto. Tiene que sonar vivo." },
    { bg: "bg-musicala", label: "Prepárate", title: "Escanea · Elige · Entra", body: "Mira tu pantalla. Cuenta, espera y entra." },
    { bg: "bg-radial", label: "Porque hoy", title: "El escenario<br>es todo el restaurante", body: "Salvémoslos del Reggaetón 2026 · Especial Michael Jackson" }
  ];
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
