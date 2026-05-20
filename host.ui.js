// ============================================================
// host.ui.js
// Panel de control del host/director de la sala rítmica.
// Incluye audio con sonidos del secuenciador Musicala y pulso visual público.
// ============================================================

import {
  createOrOpenRoom,
  listenToConnection,
  listenToParticipants,
  listenToRoom,
  normalizeRoomCode,
  resetRoomCue,
  sendCue,
  stopListening,
  updateActivity,
  updateBpm,
  updateMetronome,
  updateMode,
  updateRoomTitle,
  listenPatterns,
  updateGroupPattern,
  updatePatterns,
  resetPatterns,
  applyPatternPreset,
  claimHostRoom
} from "./room.service.js";
import {
  ACTIVITIES,
  CUES,
  GROUPS,
  HOST_SEQUENCE,
  PATTERN_PRESETS,
  DEFAULT_PATTERNS,
  clonePatterns,
  getActivityById,
  getGroupPattern,
  getParticipantCounts,
  getTotalFreshParticipants,
  sanitizePatterns,
  stepsToPatternText,
  inferPatternHelper
} from "./rhythms.js";
import { AudioEngine, AUDIO_PRESETS } from "./audio.engine.js";
import { DEMO_TRACKS } from "./demo-tracks.js";

let currentRoomCode = "MJ30";
let isHostOwner = false;
let roomState = null;
let participantsState = {};
let roomUnsubscribe = null;
let participantsUnsubscribe = null;
let patternsUnsubscribe = null;
let connectionUnsubscribe = null;
let patternsState = clonePatterns(DEFAULT_PATTERNS);
let hostCurrentStep = -1;
let savePatternTimer = null;
let visualMetroTimer = null;
let visualMetroBeat = 0;
let audioEngine = null;

export async function initHost(roomCode) {
  currentRoomCode = normalizeRoomCode(roomCode);
  audioEngine = new AudioEngine();
  renderHostLoading(currentRoomCode);

  try {
    const result = await createOrOpenRoom(currentRoomCode);
    isHostOwner = result.isHostOwner;
    roomState = result.room;
    if (isHostOwner && !result.room?.patterns) {
      await updatePatterns(currentRoomCode, DEFAULT_PATTERNS);
      roomState = { ...roomState, patterns: clonePatterns(DEFAULT_PATTERNS) };
    }
    patternsState = sanitizePatterns(roomState?.patterns || DEFAULT_PATTERNS);
    if (audioEngine) audioEngine.setLivePatterns(patternsState);
    renderHostPanel(currentRoomCode, result);
    startHostListeners();
  } catch (error) {
    renderHostError(error.message || "No se pudo abrir la sala como host.");
  }
}

function renderHostLoading(roomCode) {
  document.getElementById("app").innerHTML = `
    <main class="host-shell">
      <section class="loading-screen">
        <div class="loading-mark">🎛️</div>
        <p>Abriendo sala ${escapeHtml(roomCode)}…</p>
      </section>
    </main>
  `;
}

function renderHostPanel(roomCode, result) {
  const participantUrl = getParticipantUrl(roomCode);
  const app = document.getElementById("app");

  app.innerHTML = `
    <main class="host-shell fade-in">
      <header class="host-header">
        <div class="host-brand">
          <img src="logo.png" alt="Musicala" class="host-logo" onerror="this.classList.add('hidden')" />
          <div>
            <strong>Musicala · Host</strong>
            <span id="host-conn-badge" class="host-connection"><span class="conn-dot"></span> Conectando…</span>
          </div>
        </div>
        <a class="ghost-button small-button" href="?room=${encodeURIComponent(roomCode)}" target="_blank" rel="noopener">Vista participante</a>
      </header>

      ${isHostOwner ? "" : `
        <section class="host-warning" role="alert">
          <strong>Esta sala ya tiene otro host.</strong>
          <span>Puedes mirar el panel, pero las reglas seguras bloquearán cambios si no eres el creador original de la sala. Firebase, portero de discoteca con complejo de imperio.</span>
          <button id="claim-host-dev" class="secondary-action small-button" type="button">Tomar control en desarrollo</button>
          <small>Este botón solo funciona si estás usando reglas abiertas de desarrollo. Con reglas seguras toca borrar la sala o usar el navegador creador.</small>
        </section>
      `}

      <section class="host-hero">
        <div>
          <p class="event-kicker">Sala rítmica en vivo</p>
          <h1 id="host-visible-title">${escapeHtml(roomState?.title || result.room?.title || "Salvémoslos del Reggaetón · Especial Michael Jackson")}</h1>
          <p>Base corporal, dirección visual y caja de ritmos en vivo</p>
        </div>
        <div class="room-projector-card">
          <span>Código de sala</span>
          <strong>${escapeHtml(roomCode)}</strong>
        </div>
      </section>

      <section class="host-card room-config-card">
        <div class="section-heading">
          <h2>Configuración de sala</h2>
          <span>Nombre visible / código</span>
        </div>
        <p class="control-help">El nombre visible puede cambiar sin afectar el QR. El código de sala es la ruta técnica que usa Firebase, así que cambiarlo abre otra sala. Sí, hasta los nombres tienen burocracia.</p>

        <div class="room-config-grid">
          <label class="audio-field">
            <span>Código de sala actual</span>
            <input id="room-code-current" class="text-input" type="text" value="${escapeHtml(roomCode)}" readonly />
          </label>

          <label class="audio-field">
            <span>Nombre visible de la sala</span>
            <input id="room-title-input" class="text-input" type="text" maxlength="80" value="${escapeHtml(result.room?.title || "Salvémoslos del Reggaetón · Especial Michael Jackson")}" />
          </label>

          <button id="save-room-title" class="secondary-action" type="button">Guardar nombre</button>

          <label class="audio-field">
            <span>Abrir otra sala</span>
            <div class="url-audio-row">
              <input id="open-room-code" class="text-input" type="text" maxlength="24" value="${escapeHtml(roomCode)}" aria-label="Nuevo código de sala" />
              <button id="open-room-code-btn" class="ghost-button" type="button">Abrir</button>
            </div>
          </label>
        </div>
      </section>

      <section class="host-grid-layout">
        <article class="host-card share-card">
          <div class="section-heading">
            <h2>Entrada del público</h2>
            <span>QR / URL</span>
          </div>
          <div class="url-box" id="participant-url">${escapeHtml(participantUrl)}</div>
          <button id="copy-url-btn" class="secondary-action" type="button">Copiar URL participante</button>
        </article>

        <article class="host-card current-card">
          <div class="section-heading">
            <h2>Estado actual</h2>
            <span id="room-mode-pill" class="mini-pill">Ensayo</span>
          </div>
          <div id="current-cue-preview" class="current-cue-preview">
            <span class="preview-icon">🎬</span>
            <div>
              <strong>Prepárate</strong>
              <p>Mira tu grupo y espera la entrada</p>
            </div>
          </div>
        </article>
      </section>

      <section class="host-grid-layout controls-layout">
        <article class="host-card">
          <div class="section-heading">
            <h2>Actividad</h2>
            <span>3 modos</span>
          </div>
          <label class="sr-only" for="activity-select">Seleccionar actividad</label>
          <select id="activity-select" class="select-input">
            ${Object.values(ACTIVITIES).map((activity) => `
              <option value="${activity.id}">${activity.name}</option>
            `).join("")}
          </select>
          <p id="activity-description" class="control-help"></p>
        </article>

        <article class="host-card">
          <div class="section-heading">
            <h2>Modo</h2>
            <span>Ensayo / Show</span>
          </div>
          <div class="segmented-control" role="group" aria-label="Modo de sala">
            <button id="mode-rehearsal" class="segment-button is-selected" data-mode="rehearsal" type="button">🎓 Ensayo</button>
            <button id="mode-show" class="segment-button" data-mode="show" type="button">🔴 Show</button>
          </div>
        </article>
      </section>

      <section class="host-card bpm-card">
        <div class="section-heading">
          <h2>BPM maestro</h2>
          <span>Audio + pulso</span>
        </div>
        <div class="bpm-main-row">
          <button class="round-button" data-bpm-step="-5" type="button">−5</button>
          <output id="bpm-output" class="bpm-output">96</output>
          <button class="round-button" data-bpm-step="5" type="button">+5</button>
        </div>
        <input id="bpm-slider" class="range-input" type="range" min="40" max="240" value="96" />
        <div class="metronome-visual">
          <div class="metro-actions">
            <button id="visual-metro-toggle" class="ghost-button" type="button">▶ Activar pulso público</button>
            <button id="visual-metro-restart" class="ghost-button" type="button">↻ Reiniciar pulso</button>
          </div>
          <div class="beat-dots" aria-hidden="true">
            <span class="beat-light" data-beat="0"></span>
            <span class="beat-light" data-beat="1"></span>
            <span class="beat-light" data-beat="2"></span>
            <span class="beat-light" data-beat="3"></span>
          </div>
          <p id="metro-status" class="control-help">El público verá una luz sincronizada con este BPM.</p>
        </div>
      </section>

      <section class="host-card rhythm-composer" id="rhythm-composer">
        <div class="section-heading">
          <h2>Caja de ritmos en vivo</h2>
          <span id="patterns-sync-status" class="sync-status">Patrones sincronizados</span>
        </div>
        <p class="control-help">Edita qué hacen pies, palmas, piernas, mesa/vaso y voz en cada uno de los 16 pasos. El público ve su fila actualizada al instante. Qué concepto tan raro: coordinación.</p>

        <div class="preset-controls">
          <label class="audio-field">
            <span>Preset de patrones</span>
            <select id="pattern-preset-select" class="select-input">
              ${Object.values(PATTERN_PRESETS).map((preset) => `<option value="${preset.id}">${preset.name}</option>`).join("")}
            </select>
          </label>
          <button id="apply-pattern-preset" class="secondary-action" type="button">Aplicar preset</button>
          <button id="restore-default-patterns" class="ghost-button" type="button">Restaurar base</button>
          <button id="clear-patterns" class="ghost-button is-danger-soft" type="button">Limpiar todo</button>
        </div>

        <div class="composer-time-editor">
          <div class="section-heading compact-heading">
            <h3>Editor rápido por tiempos</h3>
            <span>1, 2, 3, 4</span>
          </div>
          <div id="time-combo-grid" class="time-combo-grid">
            ${renderTimeComboEditor()}
          </div>
          <div class="audio-controls">
            <button id="apply-time-combo" class="secondary-action" type="button">Aplicar combinación</button>
            <button id="apply-time-combo-clean" class="ghost-button" type="button">Aplicar y limpiar intermedios</button>
          </div>
        </div>

        <div class="drum-scroll" role="region" aria-label="Caja de ritmos editable" tabindex="0">
          <div id="live-drum-grid" class="drum-grid">
            ${renderDrumGrid(patternsState)}
          </div>
        </div>
      </section>

      <section class="host-card audio-panel">
        <div class="section-heading">
          <h2>Audio del evento</h2>
          <span>Solo host</span>
        </div>
        <p class="control-help">El audio suena únicamente en este dispositivo. Conecta este equipo al sonido del evento y deja los celulares del público en modo visual, porque el caos de latencias no necesita invitación.</p>

        <div class="audio-controls">
          <button id="audio-unlock" class="primary-action" type="button">🔓 Activar audio</button>
          <button id="beat-play" class="secondary-action" type="button">▶ Reproducir beat</button>
          <button id="beat-pause" class="ghost-button" type="button">⏸ Pausar beat</button>
          <button id="beat-stop" class="ghost-button" type="button">■ Detener beat</button>
        </div>

        <div class="audio-grid">
          <label class="audio-field">
            <span>Fuente del beat</span>
            <select id="beat-source" class="select-input">
              <option value="preset">Preset de audio</option>
              <option value="live">Caja de ritmos en vivo</option>
            </select>
          </label>

          <label class="audio-field">
            <span>Preset de beat</span>
            <select id="audio-preset" class="select-input">
              ${AUDIO_PRESETS.map((preset) => `<option value="${preset.id}">${preset.name}</option>`).join("")}
            </select>
          </label>

          <label class="audio-field">
            <span>Volumen beat</span>
            <input id="beat-volume" class="range-input" type="range" min="0" max="100" value="88" />
          </label>
        </div>

        <div class="track-controls">
          <div class="section-heading compact-heading">
            <h3>Pista opcional</h3>
            <span id="track-status" class="track-status">Sin pista</span>
          </div>

          <div class="audio-grid">
            <label class="audio-field">
              <span>Pistas de ejemplo</span>
              <select id="demo-track-select" class="select-input">
                ${DEMO_TRACKS.map((track) => `<option value="${track.id}">${track.name}</option>`).join("")}
              </select>
            </label>
            <button id="load-demo-track" class="secondary-action" type="button">Cargar ejemplo</button>
          </div>

          <div class="audio-controls">
            <button id="load-local-track" class="secondary-action" type="button">Cargar pista local</button>
            <button id="track-play" class="secondary-action" type="button">▶ Pista</button>
            <button id="track-pause" class="ghost-button" type="button">⏸ Pausar</button>
            <button id="track-stop" class="ghost-button" type="button">■ Detener</button>
          </div>

          <label class="audio-field full-width">
            <span>URL directa de audio (.mp3, .wav, .ogg, .m4a)</span>
            <div class="url-audio-row">
              <input id="track-url" class="text-input" type="url" placeholder="https://.../beat.mp3" />
              <button id="use-track-url" class="secondary-action" type="button">Usar URL</button>
            </div>
          </label>

          <label class="audio-field">
            <span>Volumen pista</span>
            <input id="track-volume" class="range-input" type="range" min="0" max="100" value="80" />
          </label>
        </div>

        <div id="audio-status" class="audio-status">Audio sin activar · BPM <b id="audio-bpm">96</b></div>
      </section>

      <section class="host-card cue-card-host">
        <div class="section-heading">
          <h2>Controles en vivo</h2>
          <span>Botones grandes, cero delicadeza innecesaria</span>
        </div>
        <div class="cue-buttons-grid">
          ${Object.entries(CUES).map(([key, cue]) => `
            <button class="host-cue-button ${key === "reset" ? "is-danger" : ""}" data-cue="${key}" type="button">
              <span>${cue.icon}</span>
              <strong>${cue.label}</strong>
            </button>
          `).join("")}
        </div>
      </section>

      <section class="host-grid-layout">
        <article class="host-card participants-card">
          <div class="section-heading">
            <h2>Participantes</h2>
            <span id="participants-total">0 conectados</span>
          </div>
          <div id="group-counts" class="group-counts"></div>
        </article>

        <article class="host-card sequence-card">
          <div class="section-heading">
            <h2>Secuencia sugerida</h2>
            <span>Actividad principal</span>
          </div>
          <ol class="sequence-list">
            ${HOST_SEQUENCE.map((key) => `
              <li data-sequence-cue="${key}">${CUES[key].icon} ${CUES[key].label}</li>
            `).join("")}
          </ol>
        </article>
      </section>
    </main>
  `;

  bindHostEvents();
  updateHostRoomView(result.room);
  updateAudioStatus();
}

function bindHostEvents() {
  document.getElementById("copy-url-btn").addEventListener("click", copyParticipantUrl);
  document.getElementById("claim-host-dev")?.addEventListener("click", claimHostForDevelopment);
  document.getElementById("save-room-title")?.addEventListener("click", saveVisibleRoomTitle);
  document.getElementById("open-room-code-btn")?.addEventListener("click", openAnotherRoom);
  document.getElementById("open-room-code")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      openAnotherRoom();
    }
  });

  document.querySelectorAll(".host-cue-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const cueKey = button.dataset.cue;
      await runHostAction(button, async () => {
        if (cueKey === "reset") await resetRoomCue(currentRoomCode);
        else await sendCue(currentRoomCode, cueKey);
      });
    });
  });

  document.getElementById("activity-select").addEventListener("change", async (event) => {
    await runHostAction(event.currentTarget, () => updateActivity(currentRoomCode, event.currentTarget.value));
  });

  document.querySelectorAll(".segment-button").forEach((button) => {
    button.addEventListener("click", async () => {
      await runHostAction(button, () => updateMode(currentRoomCode, button.dataset.mode));
    });
  });

  document.querySelectorAll("[data-bpm-step]").forEach((button) => {
    button.addEventListener("click", async () => {
      const current = Number(document.getElementById("bpm-slider").value || 96);
      const next = clamp(current + Number(button.dataset.bpmStep), 40, 240);
      setBpmLocally(next);
      await runHostAction(button, () => applyMasterBpm(next));
    });
  });

  const bpmSlider = document.getElementById("bpm-slider");
  bpmSlider.addEventListener("input", () => setBpmLocally(Number(bpmSlider.value)));
  bpmSlider.addEventListener("change", async () => {
    await runHostAction(bpmSlider, () => applyMasterBpm(Number(bpmSlider.value)));
  });

  document.getElementById("visual-metro-toggle").addEventListener("click", toggleVisualMetronome);
  document.getElementById("visual-metro-restart").addEventListener("click", restartPublicMetronome);

  bindPatternComposerEvents();

  document.getElementById("audio-unlock").addEventListener("click", unlockAudio);
  document.getElementById("beat-play").addEventListener("click", startBeat);
  document.getElementById("beat-pause").addEventListener("click", pauseBeat);
  document.getElementById("beat-stop").addEventListener("click", stopBeat);
  document.getElementById("beat-source").addEventListener("change", (event) => {
    audioEngine.setBeatSource(event.currentTarget.value);
    updateAudioStatus();
  });
  document.getElementById("audio-preset").addEventListener("change", (event) => {
    audioEngine.setPreset(event.currentTarget.value);
    updateAudioStatus();
  });
  document.getElementById("beat-volume").addEventListener("input", (event) => {
    audioEngine.setVolume(Number(event.currentTarget.value));
    updateAudioStatus();
  });

  document.getElementById("load-local-track").addEventListener("click", () => loadTrack("assets/audio/pista-evento.mp3"));
  document.getElementById("load-demo-track").addEventListener("click", loadSelectedDemoTrack);
  document.getElementById("use-track-url").addEventListener("click", () => {
    const url = document.getElementById("track-url").value.trim();
    loadTrack(url);
  });
  document.getElementById("track-play").addEventListener("click", playTrack);
  document.getElementById("track-pause").addEventListener("click", pauseTrack);
  document.getElementById("track-stop").addEventListener("click", stopTrack);
  document.getElementById("track-volume").addEventListener("input", (event) => {
    audioEngine.setTrackVolume(Number(event.currentTarget.value));
    updateAudioStatus();
  });

  audioEngine.setOnStep((stepIndex) => {
    clearBeatLights();
    if (stepIndex < 0) return;
    const beat = Math.floor(stepIndex / 4) % 4;
    const light = document.querySelector(`[data-beat="${beat}"]`);
    if (light) light.classList.add("is-on");
    updateHostStepCursor(stepIndex);
  });
}

function startHostListeners() {
  stopListening(roomUnsubscribe);
  stopListening(participantsUnsubscribe);
  stopListening(patternsUnsubscribe);
  stopListening(connectionUnsubscribe);

  roomUnsubscribe = listenToRoom(currentRoomCode, (room) => {
    roomState = room;
    updateHostRoomView(room);
  }, (error) => showHostToast(error.message, "error"));

  participantsUnsubscribe = listenToParticipants(currentRoomCode, (participants) => {
    participantsState = participants || {};
    updateParticipantCounts(participantsState);
  }, (error) => showHostToast(error.message, "error"));

  patternsUnsubscribe = listenPatterns(currentRoomCode, (patterns) => {
    patternsState = sanitizePatterns(patterns || DEFAULT_PATTERNS);
    if (audioEngine) audioEngine.setLivePatterns(patternsState);
    updatePatternComposerView(patternsState);
  }, (error) => showHostToast(error.message, "error"));

  connectionUnsubscribe = listenToConnection((connected) => {
    const badge = document.getElementById("host-conn-badge");
    if (!badge) return;
    badge.classList.toggle("is-offline", !connected);
    badge.innerHTML = connected
      ? `<span class="conn-dot"></span> Conectado`
      : `<span class="conn-dot"></span> Sin conexión`;
  });
}

function updateHostRoomView(room) {
  if (!room) return;

  const activity = getActivityById(room.activity);
  const activitySelect = document.getElementById("activity-select");
  const description = document.getElementById("activity-description");
  const modePill = document.getElementById("room-mode-pill");
  const visibleTitle = document.getElementById("host-visible-title");
  const titleInput = document.getElementById("room-title-input");
  const title = String(room.title || "Salvémoslos del Reggaetón · Especial Michael Jackson");

  if (visibleTitle) visibleTitle.textContent = title;
  if (titleInput && document.activeElement !== titleInput) titleInput.value = title;

  if (activitySelect) activitySelect.value = activity.id;
  if (description) description.textContent = activity.description;
  if (modePill) modePill.textContent = room.mode === "show" ? "Show" : "Ensayo";

  document.querySelectorAll(".segment-button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.mode === (room.mode || "rehearsal"));
  });

  setBpmLocally(Number(room.bpm || activity.defaultBpm));
  updateCuePreview(room.currentCue);
  updateSequenceHighlight(room.currentCue);
  updateMetronomeStatus(room.metronome);
  if (room.patterns) {
    patternsState = sanitizePatterns(room.patterns);
    if (audioEngine) audioEngine.setLivePatterns(patternsState);
    updatePatternComposerView(patternsState);
  }
}

function renderTimeComboEditor() {
  const timeLabels = ["Tiempo 1", "Tiempo 2", "Tiempo 3", "Tiempo 4"];
  return timeLabels.map((label, timeIndex) => `
    <article class="time-combo-card">
      <strong>${label}</strong>
      <span>Paso ${timeIndex * 4 + 1}</span>
      <div class="combo-checkbox-group">
        ${GROUPS.map((group) => `
          <label>
            <input type="checkbox" data-time-combo="${timeIndex}" data-group-combo="${group.id}" />
            <span>${group.emoji} ${group.name}</span>
          </label>
        `).join("")}
      </div>
    </article>
  `).join("");
}

function renderDrumGrid(patterns = DEFAULT_PATTERNS) {
  const labels = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];
  return `
    <div class="drum-grid-header">
      <span class="drum-row-spacer">Grupo</span>
      ${labels.map((label, index) => `<span class="drum-step-label ${index % 4 === 0 ? "is-beat-start" : ""}">${label}</span>`).join("")}
    </div>
    ${GROUPS.map((group) => {
      const pattern = getGroupPattern(patterns, group.id);
      return `
        <div class="drum-row" style="--group-color:${pattern.color || group.color}; --group-soft:${pattern.softColor || group.softColor};">
          <div class="drum-row-label">
            <span>${pattern.icon || group.emoji}</span>
            <div>
              <strong>${escapeHtml(pattern.label || group.name)}</strong>
              <small>${escapeHtml(pattern.action || group.action)}</small>
            </div>
          </div>
          ${pattern.steps.map((active, index) => `
            <button class="drum-step ${active ? "is-on" : ""} ${index % 4 === 0 ? "is-beat-start" : ""}"
              type="button"
              data-pattern-cell="1"
              data-group-id="${group.id}"
              data-step-index="${index}"
              aria-label="${escapeHtml(group.name)} paso ${index + 1}">
            </button>
          `).join("")}
        </div>
      `;
    }).join("")}
  `;
}

function bindPatternComposerEvents() {
  document.getElementById("live-drum-grid")?.addEventListener("click", async (event) => {
    const cell = event.target.closest("[data-pattern-cell]");
    if (!cell) return;
    await togglePatternCell(Number(cell.dataset.groupId), Number(cell.dataset.stepIndex), cell);
  });

  document.getElementById("apply-pattern-preset")?.addEventListener("click", async (event) => {
    const presetId = document.getElementById("pattern-preset-select")?.value || "tdcau_body_groove";
    await runHostAction(event.currentTarget, async () => {
      setPatternStatus("Guardando preset…");
      const preset = await applyPatternPreset(currentRoomCode, presetId);
      patternsState = sanitizePatterns(preset.patterns);
      if (audioEngine) audioEngine.setLivePatterns(patternsState);
      updatePatternComposerView(patternsState);
      setPatternStatus("Preset sincronizado");
    });
  });

  document.getElementById("restore-default-patterns")?.addEventListener("click", async (event) => {
    await runHostAction(event.currentTarget, async () => {
      setPatternStatus("Restaurando base…");
      await resetPatterns(currentRoomCode);
      setPatternStatus("Base restaurada");
    });
  });

  document.getElementById("clear-patterns")?.addEventListener("click", async (event) => {
    await runHostAction(event.currentTarget, async () => {
      setPatternStatus("Limpiando…");
      await applyPatternPreset(currentRoomCode, "empty");
      setPatternStatus("Patrones vacíos");
    });
  });

  document.getElementById("apply-time-combo")?.addEventListener("click", (event) => applyTimeCombination(false, event.currentTarget));
  document.getElementById("apply-time-combo-clean")?.addEventListener("click", (event) => applyTimeCombination(true, event.currentTarget));
}

async function togglePatternCell(groupId, stepIndex, control) {
  if (!isHostOwner) {
    showHostToast("Solo el host creador puede editar la caja de ritmos.", "error");
    return;
  }

  const pattern = getGroupPattern(patternsState, groupId);
  const nextSteps = pattern.steps.slice();
  nextSteps[stepIndex] = !nextSteps[stepIndex];
  const nextPattern = {
    ...pattern,
    steps: nextSteps,
    patternText: stepsToPatternText(nextSteps),
    helper: inferPatternHelper(nextSteps)
  };

  patternsState = sanitizePatterns({ ...patternsState, [String(groupId)]: nextPattern });
  updatePatternComposerView(patternsState);
  if (audioEngine) audioEngine.setLivePatterns(patternsState);

  setPatternStatus("Guardando cambios…");
  clearTimeout(savePatternTimer);
  savePatternTimer = window.setTimeout(async () => {
    try {
      await updateGroupPattern(currentRoomCode, groupId, nextPattern);
      setPatternStatus("Patrón sincronizado");
    } catch (error) {
      setPatternStatus("Error al guardar");
      showHostToast(error.message || "No se pudo guardar el patrón.", "error");
    }
  }, 160);
}

async function applyTimeCombination(cleanIntermediates, button) {
  const next = sanitizePatterns(patternsState);
  GROUPS.forEach((group) => {
    const pattern = getGroupPattern(next, group.id);
    const steps = cleanIntermediates ? Array(16).fill(false) : pattern.steps.slice();
    [0, 4, 8, 12].forEach((stepIndex, timeIndex) => {
      const checked = document.querySelector(`[data-time-combo="${timeIndex}"][data-group-combo="${group.id}"]`)?.checked || false;
      steps[stepIndex] = checked;
    });
    next[String(group.id)] = {
      ...pattern,
      steps,
      patternText: stepsToPatternText(steps),
      helper: inferPatternHelper(steps)
    };
  });

  await runHostAction(button, async () => {
    setPatternStatus("Aplicando combinación…");
    await updatePatterns(currentRoomCode, next);
    patternsState = sanitizePatterns(next);
    if (audioEngine) audioEngine.setLivePatterns(patternsState);
    updatePatternComposerView(patternsState);
    setPatternStatus("Combinación sincronizada");
  });
}

function updatePatternComposerView(patterns) {
  const grid = document.getElementById("live-drum-grid");
  if (grid) {
    grid.innerHTML = renderDrumGrid(patterns);
    updateHostStepCursor(hostCurrentStep);
  }
  updateTimeComboEditor(patterns);
}

function updateTimeComboEditor(patterns) {
  [0, 4, 8, 12].forEach((stepIndex, timeIndex) => {
    GROUPS.forEach((group) => {
      const checkbox = document.querySelector(`[data-time-combo="${timeIndex}"][data-group-combo="${group.id}"]`);
      if (!checkbox) return;
      checkbox.checked = Boolean(getGroupPattern(patterns, group.id).steps[stepIndex]);
    });
  });
}

function updateHostStepCursor(stepIndex) {
  hostCurrentStep = Number(stepIndex);
  document.querySelectorAll(".drum-step").forEach((cell) => {
    const current = Number(cell.dataset.stepIndex) === hostCurrentStep;
    const active = cell.classList.contains("is-on");
    cell.classList.toggle("is-current", current);
    cell.classList.toggle("is-hit", current && active);
  });
}

function setPatternStatus(message) {
  const status = document.getElementById("patterns-sync-status");
  if (status) status.textContent = message;
}

function updateCuePreview(cue) {
  const preview = document.getElementById("current-cue-preview");
  if (!preview) return;

  const icon = cue?.icon || "🎬";
  const message = cue?.message || "Prepárate";
  const subMessage = cue?.subMessage || "Mira tu grupo y espera la entrada";

  preview.innerHTML = `
    <span class="preview-icon">${icon}</span>
    <div>
      <strong>${escapeHtml(message)}</strong>
      <p>${escapeHtml(subMessage)}</p>
    </div>
  `;
}

function updateSequenceHighlight(cue) {
  const currentKey = cue?.key;
  document.querySelectorAll("[data-sequence-cue]").forEach((item) => {
    item.classList.toggle("is-current", item.dataset.sequenceCue === currentKey);
  });
}

function updateParticipantCounts(participants) {
  const counts = getParticipantCounts(participants);
  const total = getTotalFreshParticipants(participants);
  const totalEl = document.getElementById("participants-total");
  const countsEl = document.getElementById("group-counts");

  if (totalEl) totalEl.textContent = `${total} conectado${total === 1 ? "" : "s"}`;
  if (!countsEl) return;

  countsEl.innerHTML = GROUPS.map((group) => `
    <div class="group-count-card" style="--group-color:${group.color}; --group-soft:${group.softColor};">
      <span class="group-count-emoji">${group.emoji}</span>
      <div>
        <strong>Grupo ${group.id}</strong>
        <small>${group.name}</small>
      </div>
      <b>${counts[group.id] || 0}</b>
    </div>
  `).join("");
}

async function runHostAction(control, action) {
  if (!isHostOwner) {
    showHostToast("Esta sesión no es la dueña de la sala. Abre el host desde el navegador donde se creó.", "error");
    return;
  }

  const originalText = control.textContent;
  control.disabled = true;
  control.classList.add("is-working");

  try {
    await action();
  } catch (error) {
    showHostToast(formatFirebaseWriteError(error, "No se pudo aplicar el cambio."), "error");
  } finally {
    control.disabled = false;
    control.classList.remove("is-working");
    if (control.tagName === "BUTTON" && originalText) control.textContent = originalText;
  }
}

async function applyMasterBpm(value, options = {}) {
  const bpm = clamp(Number(value), 40, 240);
  const stateBefore = audioEngine?.getState?.() || {};
  const shouldRestartAudio = options.restartAudioIfRunning !== false && (stateBefore.isBeatRunning || stateBefore.isTrackPlaying);

  setBpmLocally(bpm);
  await updateBpm(currentRoomCode, bpm);

  if (shouldRestartAudio) {
    if (stateBefore.isBeatRunning) {
      audioEngine.stopBeat();
      await audioEngine.startBeat();
    }
    if (stateBefore.isTrackPlaying) {
      await audioEngine.playTrack({ restart: true });
    }
    await syncPublicPulseFromAudio(true);
  }
}

async function syncPublicPulseFromAudio(restart = true) {
  if (!isHostOwner) return;
  const bpm = getCurrentBpm();
  try {
    await updateMetronome(currentRoomCode, {
      enabled: true,
      bpm,
      subdivision: "quarter",
      accentEvery: 4,
      restart
    });
    startVisualMetronome();
  } catch (error) {
    showHostToast(formatFirebaseWriteError(error, "No se pudo sincronizar el pulso público."), "error");
  }
}

async function stopPublicPulseIfAudioStopped() {
  if (!isHostOwner) return;
  const state = audioEngine?.getState?.() || {};
  if (state.isBeatRunning || state.isTrackPlaying) return;

  try {
    await updateMetronome(currentRoomCode, {
      enabled: false,
      bpm: getCurrentBpm(),
      subdivision: "quarter",
      accentEvery: 4,
      restart: true
    });
    stopVisualMetronomePreview();
  } catch (error) {
    showHostToast(formatFirebaseWriteError(error, "No se pudo apagar el pulso público."), "error");
  }
}

function setBpmLocally(value) {
  const bpm = clamp(Number(value), 40, 240);
  const output = document.getElementById("bpm-output");
  const slider = document.getElementById("bpm-slider");
  const audioBpm = document.getElementById("audio-bpm");

  if (output) output.textContent = String(bpm);
  if (audioBpm) audioBpm.textContent = String(bpm);
  if (slider && Number(slider.value) !== bpm) slider.value = String(bpm);
  if (audioEngine) audioEngine.setBpm(bpm);

  if (visualMetroTimer) restartVisualMetronome();
}

async function toggleVisualMetronome() {
  const button = document.getElementById("visual-metro-toggle");
  const bpm = getCurrentBpm();

  if (roomState?.metronome?.enabled) {
    await runHostAction(button, () => updateMetronome(currentRoomCode, {
      enabled: false,
      bpm,
      subdivision: "quarter",
      accentEvery: 4
    }));
    stopVisualMetronomePreview();
    return;
  }

  await runHostAction(button, () => updateMetronome(currentRoomCode, {
    enabled: true,
    bpm,
    subdivision: "quarter",
    accentEvery: 4,
    restart: true
  }));
  startVisualMetronome();
}

async function restartPublicMetronome() {
  const button = document.getElementById("visual-metro-restart");
  const bpm = getCurrentBpm();
  await runHostAction(button, () => updateMetronome(currentRoomCode, {
    enabled: true,
    bpm,
    subdivision: "quarter",
    accentEvery: 4,
    restart: true
  }));
  restartVisualMetronome();
}

function updateMetronomeStatus(metronome) {
  const button = document.getElementById("visual-metro-toggle");
  const status = document.getElementById("metro-status");
  if (!button || !status) return;

  if (metronome?.enabled) {
    button.textContent = "⏸ Pausar pulso público";
    status.textContent = `Pulso activo para participantes · ${metronome.bpm || getCurrentBpm()} BPM`;
    if (!visualMetroTimer) startVisualMetronome();
  } else {
    button.textContent = "▶ Activar pulso público";
    status.textContent = "Pulso en espera · actívalo para que el público vea la luz.";
    stopVisualMetronomePreview();
  }
}

function startVisualMetronome() {
  stopVisualMetronomePreview();
  const bpm = getCurrentBpm();
  const interval = 60000 / clamp(bpm, 40, 240);
  tickVisualMetronome();
  visualMetroTimer = window.setInterval(tickVisualMetronome, interval);
}

function restartVisualMetronome() {
  if (!visualMetroTimer) return;
  startVisualMetronome();
}

function stopVisualMetronomePreview() {
  if (visualMetroTimer) window.clearInterval(visualMetroTimer);
  visualMetroTimer = null;
  visualMetroBeat = 0;
  clearBeatLights();
}

function tickVisualMetronome() {
  clearBeatLights();
  const beat = visualMetroBeat % 4;
  const light = document.querySelector(`[data-beat="${beat}"]`);
  if (light) light.classList.add("is-on");
  visualMetroBeat += 1;
}

function clearBeatLights() {
  document.querySelectorAll(".beat-light").forEach((light) => light.classList.remove("is-on"));
}

async function unlockAudio() {
  const button = document.getElementById("audio-unlock");
  await runAudioAction(button, async () => {
    await audioEngine.unlock();
    showHostToast("Audio activado. Los samples Musicala intentarán cargar automáticamente.", "success");
    updateAudioStatus();
  });
}

async function startBeat() {
  const button = document.getElementById("beat-play");
  await runAudioAction(button, async () => {
    audioEngine.stopTrack();
    await audioEngine.startBeat();
    await syncPublicPulseFromAudio(true);
    updateAudioStatus();
  });
}

async function pauseBeat() {
  const button = document.getElementById("beat-pause");
  await runAudioAction(button, async () => {
    audioEngine.pauseBeat();
    await stopPublicPulseIfAudioStopped();
    updateAudioStatus();
  });
}

async function stopBeat() {
  const button = document.getElementById("beat-stop");
  await runAudioAction(button, async () => {
    audioEngine.stopBeat();
    clearBeatLights();
    await stopPublicPulseIfAudioStopped();
    updateAudioStatus();
  });
}

async function loadSelectedDemoTrack() {
  const select = document.getElementById("demo-track-select");
  const track = DEMO_TRACKS.find((item) => item.id === select.value);
  if (!track) return;

  if (track.type === "generated" || !track.url) {
    showHostToast("Este ejemplo usa el beat generado con sonidos Musicala. Dale reproducir beat.", "success");
    return;
  }

  if (track.bpm) {
    audioEngine.setTrackBaseBpm(track.bpm);
    setBpmLocally(track.bpm);
    await applyMasterBpm(track.bpm, { restartAudioIfRunning: false });
  }
  await loadTrack(track.url, track.bpm || getCurrentBpm());
}

async function loadTrack(src, baseBpm = getCurrentBpm()) {
  const button = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
  await runAudioAction(button, async () => {
    audioEngine.setTrackBaseBpm(baseBpm);
    await audioEngine.loadTrack(src, { baseBpm });
    updateAudioStatus();
    showHostToast("Pista cargada.", "success");
  });
}

async function playTrack() {
  const button = document.getElementById("track-play");
  await runAudioAction(button, async () => {
    audioEngine.stopBeat();
    clearBeatLights();
    await audioEngine.playTrack({ restart: true });
    await syncPublicPulseFromAudio(true);
    updateAudioStatus();
  });
}

async function pauseTrack() {
  const button = document.getElementById("track-pause");
  await runAudioAction(button, async () => {
    audioEngine.pauseTrack();
    await stopPublicPulseIfAudioStopped();
    updateAudioStatus();
  });
}

async function stopTrack() {
  const button = document.getElementById("track-stop");
  await runAudioAction(button, async () => {
    audioEngine.stopTrack();
    await stopPublicPulseIfAudioStopped();
    updateAudioStatus();
  });
}

async function runAudioAction(button, action) {
  const originalText = button?.textContent || "";
  if (button) {
    button.disabled = true;
    button.classList.add("is-working");
  }
  try {
    await action();
  } catch (error) {
    showHostToast(formatFirebaseWriteError(error, "No se pudo usar el audio."), "error");
  } finally {
    if (button) {
      button.disabled = false;
      button.classList.remove("is-working");
      button.textContent = originalText;
    }
    updateAudioStatus();
  }
}

function updateAudioStatus() {
  if (!audioEngine) return;
  const state = audioEngine.getState();
  const status = document.getElementById("audio-status");
  const trackStatus = document.getElementById("track-status");
  const audioBpm = document.getElementById("audio-bpm");

  if (audioBpm) audioBpm.textContent = String(getCurrentBpm());
  if (trackStatus) trackStatus.textContent = state.trackStatus;
  if (status) {
    const beatState = state.isBeatRunning ? "Beat sonando" : "Beat detenido";
    const trackState = state.isTrackPlaying ? "Pista sonando" : state.trackSrc ? "Pista lista" : "Sin pista";
    const lockState = state.unlocked ? "Audio activo" : "Audio sin activar";
    const sourceLabel = state.beatSource === "live" ? "Caja en vivo" : escapeHtml(state.presetName);
    const rate = Number(state.trackPlaybackRate || 1).toFixed(2);
    status.innerHTML = `${lockState} · ${beatState} · ${trackState} · ${sourceLabel} · ${escapeHtml(state.sampleStatus)} · BPM <b id="audio-bpm">${getCurrentBpm()}</b> · pista x${rate}`;
  }
}

async function claimHostForDevelopment(event) {
  const button = event?.currentTarget || document.getElementById("claim-host-dev");
  const originalText = button?.textContent || "";
  if (button) {
    button.disabled = true;
    button.textContent = "Tomando control…";
  }

  try {
    await claimHostRoom(currentRoomCode);
    isHostOwner = true;
    showHostToast("Host reasignado para desarrollo. Si esto falló antes, las reglas seguras estaban haciendo de portero.", "success");
    const room = await createOrOpenRoom(currentRoomCode);
    roomState = room.room;
    renderHostPanel(currentRoomCode, room);
    startHostListeners();
  } catch (error) {
    showHostToast(formatFirebaseWriteError(error, "No se pudo tomar control. Usa reglas abiertas de desarrollo o borra rooms/" + currentRoomCode + "."), "error");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }
  }
}

async function saveVisibleRoomTitle(event) {
  const button = event?.currentTarget || document.getElementById("save-room-title");
  const input = document.getElementById("room-title-input");
  const title = input?.value || "";

  await runHostAction(button, async () => {
    const savedTitle = await updateRoomTitle(currentRoomCode, title);
    const visibleTitle = document.getElementById("host-visible-title");
    if (visibleTitle) visibleTitle.textContent = savedTitle;
    if (input) input.value = savedTitle;
    showHostToast("Nombre visible actualizado.", "success");
  });
}

function openAnotherRoom() {
  const input = document.getElementById("open-room-code");
  const nextCode = normalizeRoomCode(input?.value || currentRoomCode);
  if (!nextCode) return;

  const current = normalizeRoomCode(currentRoomCode);
  if (nextCode === current) {
    showHostToast("Ya estás en esa sala.", "success");
    return;
  }

  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("host", "1");
  url.searchParams.set("room", nextCode);
  window.location.href = url.toString();
}

async function copyParticipantUrl() {
  const url = getParticipantUrl(currentRoomCode);
  try {
    await navigator.clipboard.writeText(url);
    showHostToast("URL copiada para crear el QR.", "success");
  } catch {
    showHostToast("No se pudo copiar. Selecciona la URL manualmente.", "error");
  }
}

function getParticipantUrl(roomCode) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("room", roomCode);
  return url.toString();
}

function getCurrentBpm() {
  return clamp(Number(document.getElementById("bpm-slider")?.value || roomState?.bpm || 96), 40, 240);
}

function showHostToast(message, type = "success") {
  let toast = document.getElementById("host-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "host-toast";
    toast.className = "host-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add("is-visible");
  window.clearTimeout(toast._timer);
  toast._timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function renderHostError(message) {
  document.getElementById("app").innerHTML = `
    <main class="host-shell error-state">
      <section class="brand-card">
        <div class="main-emoji">⚠️</div>
        <h1>No se pudo abrir el panel host</h1>
        <p>${escapeHtml(message)}</p>
        <button class="primary-action" onclick="window.location.reload()">Reintentar</button>
      </section>
    </main>
  `;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function formatFirebaseWriteError(error, fallback) {
  const message = String(error?.message || error || fallback);
  const code = String(error?.code || "").toLowerCase();

  if (code.includes("permission_denied") || message.toLowerCase().includes("permission_denied") || message.toLowerCase().includes("permission denied")) {
    return `${fallback} Permission denied: revisa que esta sesión sea el host dueño, borra rooms/${currentRoomCode} o usa reglas abiertas de desarrollo mientras pruebas.`;
  }

  return message || fallback;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
