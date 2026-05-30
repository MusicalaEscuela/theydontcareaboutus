// ============================================================
// app.js
// Punto de entrada: detecta modo host/admin/participante/landing.
// Host solo es accesible por URL (?host).
// ============================================================

import { ensureAuth } from "./firebase-config.js";
import { initHost } from "./host.ui.js";
import { initParticipant } from "./participant.ui.js";
import { initProjector } from "./projector.ui.js";
import { normalizeRoomCode } from "./room.service.js";
import { escapeHtml } from "./utils.js";

window.addEventListener("DOMContentLoaded", bootstrapApp);

async function bootstrapApp() {
  const app = document.getElementById("app");
  const params = new URLSearchParams(window.location.search);
  const roomCode = normalizeRoomCode(params.get("room") || "MJ30");
  const isHost = params.get("host") === "1" || params.has("host");
  const isProjector = params.get("admin") === "1" || params.has("admin");
  const isParticipantDirect = params.has("room") && !isHost;

  try {
    await ensureAuth();

    if (isProjector) {
      initProjector(roomCode);
      return;
    }

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
            <h2>Entrar a la sala</h2>
            <p>Ingresa el código que te dieron.</p>
            <input class="text-input" name="room" value="MJ30" maxlength="24" aria-label="Código de sala" autocomplete="off" />
            <button class="primary-action" type="submit">Entrar</button>
          </form>
        </div>

        <p class="microcopy">No necesitas instalar nada. Qué civilizado por una vez.</p>
      </section>
    </main>
  `;

  document.getElementById("participant-entry").addEventListener("submit", (event) => {
    event.preventDefault();
    const room = normalizeRoomCode(new FormData(event.currentTarget).get("room"));
    window.location.href = `?room=${encodeURIComponent(room)}`;
  });
}
