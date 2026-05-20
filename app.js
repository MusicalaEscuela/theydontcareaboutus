// ============================================================
// app.js
// Punto de entrada: detecta modo host/participante/landing.
// ============================================================

import { ensureAuth } from "./firebase-config.js";
import { initHost } from "./host.ui.js";
import { initParticipant } from "./participant.ui.js";
import { normalizeRoomCode } from "./room.service.js";

window.addEventListener("DOMContentLoaded", bootstrapApp);

async function bootstrapApp() {
  const app = document.getElementById("app");
  const params = new URLSearchParams(window.location.search);
  const roomCode = normalizeRoomCode(params.get("room") || "MJ30");
  const isHost = params.get("host") === "1" || params.has("host");
  const isParticipantDirect = params.has("room") && !isHost;

  try {
    await ensureAuth();

    if (isHost) {
      await initHost(roomCode);
      return;
    }

    if (isParticipantDirect) {
      await initParticipant(roomCode);
      return;
    }

    renderLanding();
  } catch (error) {
    console.error("Error al iniciar la app:", error);
    app.innerHTML = `
      <main class="error-state">
        <section class="brand-card">
          <div class="main-emoji">⚠️</div>
          <h1>Error de conexión</h1>
          <p>No se pudo iniciar Firebase. Revisa <code>firebase-config.js</code>, Authentication anónima y Realtime Database.</p>
          <pre class="error-detail">${escapeHtml(error.message || String(error))}</pre>
          <button class="primary-action" type="button" onclick="window.location.reload()">Reintentar</button>
        </section>
      </main>
    `;
  }
}

function renderLanding() {
  document.getElementById("app").innerHTML = `
    <main class="landing-shell fade-in">
      <section class="brand-card landing-card">
        <div class="brand-topline center-brand">
          <img src="logo.png" alt="Musicala" class="brand-logo" onerror="this.classList.add('hidden')" />
          <span class="brand-fallback">Musicala</span>
        </div>

        <p class="event-kicker">Sala rítmica en vivo</p>
        <h1>Salvémoslos del Reggaetón</h1>
        <p class="event-subtitle">Especial Michael Jackson · experiencia Musicala</p>

        <div class="landing-actions">
          <form id="participant-entry" class="entry-card">
            <span class="entry-icon">📱</span>
            <h2>Participante</h2>
            <p>Entra con el código de sala.</p>
            <input class="text-input" name="room" value="MJ30" maxlength="24" aria-label="Código de sala participante" />
            <button class="primary-action" type="submit">Entrar</button>
          </form>

          <form id="host-entry" class="entry-card host-entry-card">
            <span class="entry-icon">🎛️</span>
            <h2>Host</h2>
            <p>Controla la actividad en vivo.</p>
            <input class="text-input" name="room" value="MJ30" maxlength="24" aria-label="Código de sala host" />
            <button class="secondary-action" type="submit">Abrir panel host</button>
          </form>
        </div>
      </section>
    </main>
  `;

  document.getElementById("participant-entry").addEventListener("submit", (event) => {
    event.preventDefault();
    const room = normalizeRoomCode(new FormData(event.currentTarget).get("room"));
    window.location.href = `?room=${encodeURIComponent(room)}`;
  });

  document.getElementById("host-entry").addEventListener("submit", (event) => {
    event.preventDefault();
    const room = normalizeRoomCode(new FormData(event.currentTarget).get("room"));
    window.location.href = `?host=1&room=${encodeURIComponent(room)}`;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
