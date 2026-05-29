// ============================================================
// projector.ui.js
// Vista para pantallas del restaurante.
// ============================================================

import {
  listenMetronome,
  listenServerTimeOffset,
  listenToRoom,
  normalizeRoomCode
} from "./room.service.js";
import { CHANT_RESPONSE_TEXT, DEFAULT_PATTERNS, GROUPS, getGroupPattern, sanitizePatterns } from "./rhythms.js";

let currentRoomCode = "MJ30";
let roomState = null;
let metronomeState = null;
let serverTimeOffset = 0;
let projectorFrame = null;
let currentStep16 = -1;
let currentBeat = -1;
let lastProjectorView = "";

export function initProjector(roomCode) {
  currentRoomCode = normalizeRoomCode(roomCode);
  renderProjectorShell();
  window.addEventListener("storage", (event) => {
    if (event.key !== getLocalProjectorKey() || !event.newValue) return;
    applyLocalProjectorState(event.newValue);
  });
  const localState = localStorage.getItem(getLocalProjectorKey());
  if (localState) applyLocalProjectorState(localState);
  listenToRoom(currentRoomCode, (room) => {
    roomState = room;
    const local = readLocalProjectorState();
    if (local) {
      roomState = { ...roomState, projector: { ...(roomState?.projector || {}), ...local } };
    }
    renderProjectorContent();
    ensureProjectorLoop();
  });
  listenMetronome(currentRoomCode, (metronome) => {
    metronomeState = metronome;
    ensureProjectorLoop();
  });
  listenServerTimeOffset((offset) => {
    serverTimeOffset = Number(offset || 0);
    ensureProjectorLoop();
  });
}

function getLocalProjectorKey() {
  return `musicala-projector-${currentRoomCode}`;
}

function readLocalProjectorState() {
  try {
    const value = localStorage.getItem(getLocalProjectorKey());
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function applyLocalProjectorState(value) {
  try {
    const projector = typeof value === "string" ? JSON.parse(value) : value;
    roomState = {
      ...(roomState || {}),
      title: roomState?.title || "Sala rítmica Musicala",
      bpm: roomState?.bpm || 96,
      currentCue: roomState?.currentCue || { type: "prepare" },
      patterns: roomState?.patterns || DEFAULT_PATTERNS,
      projector: {
        ...(roomState?.projector || {}),
        ...projector
      }
    };
    renderProjectorContent();
    ensureProjectorLoop();
  } catch (error) {
    console.warn("No se pudo aplicar estado local de pantalla:", error);
  }
}

function renderProjectorShell() {
  document.getElementById("app").innerHTML = `
    <main class="projector-shell">
      <aside class="projector-qr-slot">
        <img src="assets/qr.png" alt="QR de ingreso" onerror="this.hidden=true; this.nextElementSibling.hidden=false;" />
        <span hidden>QR aquí</span>
      </aside>
      <section id="projector-content" class="projector-content"></section>
    </main>
  `;
}

function renderProjectorContent() {
  const target = document.getElementById("projector-content");
  if (!target || !roomState) return;

  const projector = roomState.projector || {};
  if (lastProjectorView !== projector.view) {
    lastProjectorView = projector.view || "";
  }
  if (projector.view === "intro") {
    renderIntroDeck(target);
    return;
  }

  const cue = roomState.currentCue || {};
  const patterns = sanitizePatterns(roomState.patterns || DEFAULT_PATTERNS);
  const chantActive = cue.type === "chant" || projector.view === "chant";
  const selectedGroup = Number(projector.activeGroup || cue.activeGroup || 0);
  const groups = projector.view === "group" && selectedGroup
    ? GROUPS.filter((group) => group.id === selectedGroup)
    : GROUPS;

  target.innerHTML = `
    <div class="projector-topbar">
      <strong>${escapeHtml(roomState.title || "Sala rítmica Musicala")}</strong>
      <div id="projector-count-guide" class="projector-count-guide" aria-label="Conteo 1 2 3 4">
        ${[1, 2, 3, 4].map((number) => `<span class="projector-count-number" data-projector-count="${number}">${number}</span>`).join("")}
      </div>
      <span>Sala ${escapeHtml(currentRoomCode)}</span>
    </div>
    <div class="projector-stage ${chantActive ? "has-chant" : ""}">
      <div class="projector-groups ${groups.length === 1 ? "is-single" : ""}">
        ${groups.map((group) => renderProjectorGroup(group, patterns, cue)).join("")}
      </div>
      ${chantActive ? `
        <div class="projector-chant-card">
          <span>TODOS RESPONDEN</span>
          <div id="projector-chant-lyrics" class="chant-lyrics projector-chant-lyrics">
            ${renderChantWords(getChantText(), getChantProgress(cue))}
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function renderIntroDeck(target) {
  const slides = getIntroSlides();
  const introSlide = Math.max(0, Math.min(slides.length - 1, Number(roomState?.projector?.introSlide || 0)));
  const slide = slides[introSlide] || slides[0];
  target.innerHTML = `
    <div class="mj-intro-stage ${slide.bg}">
      <div class="mj-progress" style="width:${(introSlide / (slides.length - 1)) * 100}%"></div>
      <div class="mj-slide-num">${String(introSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}</div>
      <div class="mj-badge">MUSICALA · BOGOTÁ</div>
      <section class="mj-slide">
        <p class="mj-label">${slide.label}</p>
        <h1 class="mj-title">${slide.title}</h1>
        <div class="mj-gold-line"></div>
        <div class="mj-body">${slide.body}</div>
      </section>
    </div>
  `;
}

function getIntroSlides() {
  return [
    {
      bg: "bg-radial",
      label: "Musicala · Especial",
      title: "EL RESTAURANTE<br><em>TAMBIÉN</em><br><span>SUENA</span>",
      body: "<p>Especial Michael Jackson · They Don't Care About Us</p>"
    },
    {
      bg: "bg-radial",
      label: "Atención, público querido",
      title: "Atención,<br>público querido",
      body: "<p>En unos minutos este restaurante dejará de ser solo un restaurante.</p><p>Las mesas, las palmas, los pies y las voces van a tener trabajo.</p>"
    },
    {
      bg: "bg-red",
      label: "La canción de hoy",
      title: "They Don't Care<br>About Us",
      body: "<p>Una canción <strong>intensa, directa</strong>, con energía de protesta, fuerza colectiva y una frase que se queda dando vueltas.</p>"
    },
    {
      bg: "bg-radial",
      label: "Michael Jackson",
      title: "Más grande<br>que una tarima",
      body: "<p>Michael construía imágenes, coreografías y momentos que parecían más grandes que cualquier escenario.</p>"
    },
    {
      bg: "bg-split",
      label: "Spike Lee · Brasil",
      title: "El video<br>que se quedó",
      body: "<p>Calles, comunidad, percusión, cuerpos en movimiento y una sensación clara: la música vive en la gente.</p>"
    },
    {
      bg: "bg-musicala",
      label: "El ritmo empieza aquí",
      title: "En el cuerpo",
      body: "<p>El ritmo puede empezar con palmas, pies, piernas, mesa y vaso. La gente reunida haciendo algo al mismo tiempo.</p>"
    },
    {
      bg: "bg-red",
      label: "Verdad liberadora",
      title: "No hay que ser<br>músico profesional",
      body: "<p>Hay que <strong>escuchar</strong>, <strong>contar</strong> y <strong>entrar a tiempo</strong>.</p>"
    },
    {
      bg: "bg-radial",
      label: "La magia del ensamble",
      title: "Sencillo<br>en el momento correcto",
      body: "<p>Uno sostiene el pulso, otro responde, otro agrega textura. Cuando todo se junta, eso ya no es ruido: es ensamble.</p>"
    },
    {
      bg: "bg-musicala",
      label: "Tu misión de hoy",
      title: "Cada grupo<br>tiene una parte",
      body: "<p>Pies sostienen el pulso. Palmas responden. Piernas hacen base. Mesa / vaso agrega golpes rítmicos.</p>"
    },
    {
      bg: "bg-red",
      label: "La regla es simple",
      title: "Cuenta siempre<br>1 · 2 · 3 · 4",
      body: "<p>Pantalla normal: espera y sigue contando. Pantalla morada: haz tu ritmo. TODOS AHORA: entran todos.</p>"
    },
    {
      bg: "bg-radial",
      label: "Frase coral",
      title: "Lee. Escucha.<br>Responde.",
      body: "<p>No tiene que sonar perfecto. Tiene que sonar vivo, con energía, escucha y conexión.</p>"
    },
    {
      bg: "bg-musicala",
      label: "Prepárate",
      title: "Escanea · Elige · Entra",
      body: "<p>Escanea el QR, entra a la sala y mira tu pantalla. Cuenta, espera y entra.</p>"
    },
    {
      bg: "bg-radial",
      label: "Porque hoy",
      title: "El escenario<br>es todo el restaurante",
      body: "<p>Salvémoslos del Reggaetón 2026 · Especial Michael Jackson · Musicala</p>"
    }
  ];
}

function renderProjectorGroup(group, patterns, cue) {
  const pattern = getGroupPattern(patterns, group.id);
  const active = cue.type === "all" || Number(cue.activeGroup) === group.id;
  return `
    <article class="projector-group-card ${active ? "is-active" : ""}" style="--group-color:${pattern.color || group.color}; --group-soft:${pattern.softColor || group.softColor};">
      <span class="projector-group-emoji">${pattern.icon || group.emoji}</span>
      <div>
        <strong>${escapeHtml(group.name)}</strong>
        <p>${escapeHtml(pattern.action || group.action)}</p>
        <small>${escapeHtml(pattern.patternText || "")}</small>
        <div class="projector-step-grid" aria-label="Patrón de ${escapeHtml(group.name)}">
          ${renderProjectorSteps(pattern.steps)}
        </div>
      </div>
    </article>
  `;
}

function renderProjectorSteps(steps = []) {
  return Array.from({ length: 16 }, (_, index) => {
    const active = Boolean(steps[index]);
    return `<span class="projector-step-dot ${active ? "is-pattern" : ""} ${index % 4 === 0 ? "is-accent" : ""}" data-projector-step="${index}"></span>`;
  }).join("");
}

function ensureProjectorLoop() {
  if (projectorFrame) return;
  projectorFrame = requestAnimationFrame(updateProjectorLoop);
}

function updateProjectorLoop() {
  updatePulseState();
  updateProjectorCount();
  updateProjectorSteps();
  const lyrics = document.getElementById("projector-chant-lyrics");
  const cue = roomState?.currentCue || {};
  if (lyrics && cue.type === "chant") {
    lyrics.innerHTML = renderChantWords(getChantText(), getChantProgress(cue));
  }
  projectorFrame = requestAnimationFrame(updateProjectorLoop);
}

function updatePulseState() {
  const bpm = clampNumber(Number(metronomeState?.bpm || roomState?.bpm || 96), 40, 240, 96);
  const enabled = Boolean(metronomeState?.enabled);
  const startedAt = Number(metronomeState?.startedAt || metronomeState?.startedAtClient || 0);
  const accentEvery = clampNumber(Number(metronomeState?.accentEvery || 4), 1, 16, 4);
  if (!enabled || !startedAt) {
    currentStep16 = -1;
    currentBeat = -1;
    return;
  }
  const serverNow = Date.now() + serverTimeOffset;
  const elapsed = Math.max(0, serverNow - startedAt);
  const beatDurationMs = 60000 / bpm;
  const beatIndex = Math.floor(elapsed / beatDurationMs);
  currentBeat = (beatIndex % accentEvery) + 1;
  currentStep16 = Math.floor(elapsed / (beatDurationMs / 4)) % 16;
}

function updateProjectorCount() {
  document.querySelectorAll(".projector-count-number").forEach((item) => {
    item.classList.toggle("is-current", Number(item.dataset.projectorCount) === currentBeat);
  });
}

function updateProjectorSteps() {
  document.querySelectorAll(".projector-step-dot").forEach((dot) => {
    const isCurrent = Number(dot.dataset.projectorStep) === currentStep16;
    dot.classList.toggle("is-current", isCurrent);
    dot.classList.toggle("is-hit", isCurrent && dot.classList.contains("is-pattern"));
  });
}

function getChantText() {
  return roomState?.chantText || CHANT_RESPONSE_TEXT;
}

function getChantProgress(cue) {
  if (cue?.type !== "chant") return -1;
  const startedAt = Number(cue.updatedAtClient || Date.now());
  return Math.min(1, Math.max(0, Date.now() - startedAt) / 3000);
}

function renderChantWords(text, progress = -1) {
  const words = String(text || CHANT_RESPONSE_TEXT).split(/\s+/).filter(Boolean);
  const litCount = progress >= 0 ? Math.ceil(Math.min(1, progress) * words.length) : 0;
  return words.map((word, index) => `<span class="${index < litCount ? "is-lit" : ""}">${escapeHtml(word)}</span>`).join(" ");
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
