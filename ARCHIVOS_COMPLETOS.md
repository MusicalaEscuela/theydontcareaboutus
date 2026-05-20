# index.html
```
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#7c3aed" />
  <meta name="description" content="Sala rítmica en vivo de Musicala para actividades musicales interactivas en eventos." />
  <title>Musicala · Sala rítmica en vivo</title>
  <link rel="preconnect" href="https://www.gstatic.com" crossorigin />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <noscript>
    <main class="noscript-card">
      <h1>Musicala</h1>
      <p>Esta experiencia necesita JavaScript para sincronizar la sala en vivo.</p>
    </main>
  </noscript>

  <div id="app" aria-live="polite">
    <section class="loading-screen">
      <div class="loading-mark">♪</div>
      <p>Preparando sala rítmica…</p>
    </section>
  </div>

  <script type="module" src="app.js"></script>
</body>
</html>
```

# styles.css
```
/* ============================================================
   styles.css
   Estética Musicala: clara, luminosa, mobile-first y usable en bar.
   ============================================================ */

:root {
  color-scheme: light;
  --bg: #fbf8ff;
  --bg-2: #eef8ff;
  --ink: #21163a;
  --muted: #655a78;
  --muted-2: #8a7d9f;
  --primary: #7c3aed;
  --primary-2: #a855f7;
  --pink: #ec4899;
  --cyan: #06b6d4;
  --blue: #60a5fa;
  --danger: #dc2626;
  --success: #16a34a;
  --warning: #d97706;
  --card: rgba(255, 255, 255, 0.82);
  --card-solid: #ffffff;
  --border: rgba(124, 58, 237, 0.16);
  --shadow: 0 24px 70px rgba(68, 38, 126, 0.16);
  --shadow-soft: 0 16px 40px rgba(68, 38, 126, 0.12);
  --radius-lg: 30px;
  --radius-md: 22px;
  --radius-sm: 16px;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: var(--bg);
}

body {
  min-height: 100svh;
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(circle at 10% 0%, rgba(236, 72, 153, 0.22), transparent 34rem),
    radial-gradient(circle at 100% 8%, rgba(96, 165, 250, 0.24), transparent 32rem),
    radial-gradient(circle at 50% 100%, rgba(124, 58, 237, 0.16), transparent 32rem),
    linear-gradient(135deg, var(--bg) 0%, #fff 50%, var(--bg-2) 100%);
}

button,
input,
select {
  font: inherit;
}

button {
  border: 0;
}

button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 4px solid rgba(124, 58, 237, 0.25);
  outline-offset: 3px;
}

button:disabled {
  cursor: wait;
  filter: grayscale(0.3);
  opacity: 0.68;
}

.hidden,
[hidden] {
  display: none !important;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.fade-in {
  animation: fadeIn 280ms ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-screen,
.error-state,
.noscript-card {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
}

.loading-screen p {
  margin: 14px 0 0;
  color: var(--muted);
  font-weight: 800;
}

.loading-mark {
  width: 86px;
  height: 86px;
  display: grid;
  place-items: center;
  border-radius: 28px;
  color: white;
  font-size: 2.7rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--pink));
  box-shadow: var(--shadow-soft);
  animation: floatPulse 1.4s ease-in-out infinite;
}

@keyframes floatPulse {
  50% {
    transform: translateY(-5px) scale(1.03);
  }
}

.brand-card,
.host-card {
  width: min(100%, 720px);
  padding: clamp(20px, 5vw, 34px);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--card);
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
}

.brand-topline {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.center-brand {
  justify-content: center;
}

.brand-logo,
.host-logo {
  width: auto;
  max-width: 168px;
  height: 54px;
  object-fit: contain;
}

.brand-fallback,
.host-brand strong {
  font-weight: 950;
  letter-spacing: -0.04em;
  color: var(--primary);
}

.event-kicker {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--pink);
  font-size: 0.78rem;
  font-weight: 950;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 10px;
  font-size: clamp(2.2rem, 12vw, 4.3rem);
  line-height: 0.92;
  letter-spacing: -0.08em;
}

h2 {
  font-size: clamp(1.1rem, 4vw, 1.45rem);
  letter-spacing: -0.04em;
}

.event-subtitle,
.microcopy,
.control-help {
  color: var(--muted);
}

.primary-action,
.secondary-action,
.ghost-button,
.round-button,
.segment-button,
.host-cue-button {
  min-height: 48px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 950;
  transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease, background 160ms ease;
  -webkit-tap-highlight-color: transparent;
}

.primary-action:hover,
.secondary-action:hover,
.ghost-button:hover,
.round-button:hover,
.segment-button:hover,
.host-cue-button:hover {
  transform: translateY(-1px);
}

.primary-action:active,
.secondary-action:active,
.ghost-button:active,
.round-button:active,
.segment-button:active,
.host-cue-button:active {
  transform: translateY(1px) scale(0.99);
}

.primary-action {
  width: 100%;
  padding: 14px 20px;
  color: white;
  background: linear-gradient(135deg, var(--primary), var(--pink));
  box-shadow: 0 14px 30px rgba(124, 58, 237, 0.22);
}

.secondary-action {
  width: 100%;
  padding: 14px 20px;
  color: var(--primary);
  background: #f4edff;
  border: 1px solid rgba(124, 58, 237, 0.22);
}

.ghost-button {
  padding: 11px 16px;
  color: var(--primary);
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(124, 58, 237, 0.18);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.small-button {
  min-height: 42px;
  padding: 9px 14px;
  font-size: 0.9rem;
}

.text-input,
.select-input {
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 18px;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.text-input::placeholder {
  color: var(--muted-2);
}

.inline-error {
  margin: 10px 0 0;
  padding: 12px 14px;
  border-radius: 16px;
  color: #991b1b;
  background: #fee2e2;
  font-weight: 800;
}

.error-detail {
  max-width: 100%;
  overflow: auto;
  padding: 12px;
  border-radius: 12px;
  color: #7f1d1d;
  background: #fee2e2;
  text-align: left;
  white-space: pre-wrap;
}

/* Landing */
.landing-shell,
.participant-shell {
  min-height: 100svh;
  padding: calc(18px + var(--safe-top)) 16px calc(18px + var(--safe-bottom));
  display: grid;
  place-items: center;
}

.landing-card {
  text-align: center;
}

.landing-actions {
  display: grid;
  gap: 14px;
  margin-top: 24px;
}

.entry-card {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid rgba(124, 58, 237, 0.14);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.68);
  text-align: left;
}

.entry-card h2,
.entry-card p {
  margin: 0;
}

.entry-card p {
  color: var(--muted);
}

.entry-icon {
  font-size: 2rem;
}

/* Participante: ingreso */
.join-shell {
  align-items: start;
}

.join-card {
  margin-top: 4px;
}

.room-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  margin: 12px 0 18px;
  padding: 0 18px;
  border-radius: 999px;
  color: white;
  font-weight: 950;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, var(--primary), var(--cyan));
}

.join-form {
  display: grid;
  gap: 15px;
}

.field-label,
.group-fieldset legend {
  color: var(--ink);
  font-weight: 950;
}

.field-label span {
  color: var(--muted);
  font-weight: 700;
}

.group-fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.group-fieldset legend {
  margin-bottom: 10px;
}

.group-options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.group-option {
  display: flex;
  gap: 12px;
  min-height: 76px;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 20px;
  background: var(--group-soft, rgba(124, 58, 237, 0.08));
  cursor: pointer;
}

.group-option input {
  inline-size: 22px;
  block-size: 22px;
  accent-color: var(--group-color, var(--primary));
}

.group-option:has(input:checked) {
  border-color: var(--group-color, var(--primary));
  box-shadow: 0 12px 24px rgba(124, 58, 237, 0.15);
}

.auto-option {
  margin-bottom: 10px;
  background: linear-gradient(135deg, #f4edff, #eef8ff);
}

.group-option-body {
  display: grid;
  gap: 2px;
}

.group-option-body small {
  color: var(--muted);
  font-weight: 750;
}

.group-option-emoji {
  font-size: 1.55rem;
}

/* Participante: sala */
.live-shell {
  display: block;
  max-width: 560px;
  margin: 0 auto;
}

.participant-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.connection-badge,
.host-connection {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 7px 11px;
  border-radius: 999px;
  color: #14532d;
  background: #dcfce7;
  font-size: 0.82rem;
  font-weight: 900;
}

.conn-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.16);
}

.connection-badge.is-offline,
.host-connection.is-offline {
  color: #7f1d1d;
  background: #fee2e2;
}

.connection-badge.is-offline .conn-dot,
.host-connection.is-offline .conn-dot {
  background: #ef4444;
  box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.16);
}

.activity-name {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.84rem;
  font-weight: 850;
}

.cue-card {
  position: relative;
  overflow: hidden;
  min-height: calc(100svh - 140px);
  padding: clamp(22px, 7vw, 36px);
  border: 1px solid rgba(124, 58, 237, 0.16);
  border-radius: 34px;
  background: var(--card-solid);
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 180ms ease, box-shadow 180ms ease, border 180ms ease, background 180ms ease;
}

.cue-card::before {
  content: "";
  position: absolute;
  inset: -25% -10% auto;
  height: 46%;
  background: radial-gradient(circle, var(--group-soft), transparent 70%);
  z-index: 0;
}

.cue-card > * {
  position: relative;
  z-index: 1;
}

.group-badge {
  display: inline-grid;
  gap: 2px;
  padding: 9px 16px;
  border-radius: 18px;
  color: var(--group-color);
  background: var(--group-soft);
  font-weight: 950;
}

.group-badge span {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.main-emoji {
  margin: 20px auto 14px;
  font-size: clamp(5.5rem, 28vw, 9rem);
  line-height: 1;
  filter: drop-shadow(0 18px 28px rgba(68, 38, 126, 0.13));
}

.cue-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  color: white;
  background: var(--group-color);
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.cue-message {
  margin: 18px 0 10px;
  font-size: clamp(2.5rem, 15vw, 5.6rem);
  line-height: 0.92;
  letter-spacing: -0.09em;
}

.cue-submessage {
  margin: 0 auto 18px;
  max-width: 32ch;
  color: var(--muted);
  font-size: clamp(1.05rem, 5vw, 1.4rem);
  font-weight: 850;
}

.pattern-panel {
  display: grid;
  gap: 4px;
  margin: 20px 0;
  padding: 16px;
  border-radius: 24px;
  background: linear-gradient(135deg, var(--group-soft), rgba(255, 255, 255, 0.72));
}

.pattern-label {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.pattern-panel strong {
  font-size: clamp(1.9rem, 9vw, 3rem);
  letter-spacing: -0.05em;
}

.pattern-panel small {
  color: var(--muted);
  font-weight: 850;
}

.step-grid {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  gap: 4px;
  margin-top: 12px;
}

.step-dot {
  height: 12px;
  border-radius: 999px;
  background: rgba(33, 22, 58, 0.12);
}

.step-dot.is-hit {
  background: var(--group-color);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--group-color) 16%, transparent);
}

.help-panel {
  margin-top: 14px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
}

.help-panel p {
  color: var(--muted);
  line-height: 1.45;
}

.cue-card.is-active {
  border-color: color-mix(in srgb, var(--group-color) 45%, transparent);
  box-shadow: 0 24px 80px color-mix(in srgb, var(--group-color) 25%, transparent);
  animation: cuePulse 620ms ease-out both;
}

.cue-card.is-all {
  --group-color: #dc2626;
  --group-soft: #fee2e2;
}

.cue-card.is-silence {
  --group-color: #1e293b;
  --group-soft: #e2e8f0;
}

.cue-card.is-cut {
  --group-color: #dc2626;
  --group-soft: #fee2e2;
}

.cue-card.is-pose {
  --group-color: #7c3aed;
  --group-soft: #ede9fe;
}

.cue-card.is-countdown {
  --group-color: #2563eb;
  --group-soft: #dbeafe;
}

@keyframes cuePulse {
  0% {
    transform: scale(0.985);
  }
  45% {
    transform: scale(1.014);
  }
  100% {
    transform: scale(1);
  }
}

/* Host */
.host-shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: calc(16px + var(--safe-top)) 14px calc(24px + var(--safe-bottom));
}

.host-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.host-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.host-brand img {
  max-width: 138px;
  height: 44px;
}

.host-brand > div {
  display: grid;
  gap: 4px;
}

.host-connection {
  width: fit-content;
  font-size: 0.76rem;
}

.host-warning {
  display: grid;
  gap: 4px;
  margin-bottom: 14px;
  padding: 14px 16px;
  border-radius: 20px;
  color: #7c2d12;
  background: #ffedd5;
  border: 1px solid #fed7aa;
}

.host-hero {
  display: grid;
  gap: 16px;
  align-items: stretch;
  margin-bottom: 16px;
  padding: clamp(20px, 4vw, 34px);
  border-radius: 34px;
  color: white;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.3), transparent 26rem),
    linear-gradient(135deg, #6d28d9, #db2777 58%, #0891b2);
  box-shadow: var(--shadow);
}

.host-hero h1 {
  max-width: 780px;
  margin-bottom: 8px;
}

.host-hero p {
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.86);
  font-weight: 800;
}

.room-projector-card {
  display: grid;
  place-items: center;
  gap: 6px;
  min-height: 150px;
  padding: 22px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(16px);
}

.room-projector-card span {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 950;
  color: rgba(255, 255, 255, 0.78);
}

.room-projector-card strong {
  font-size: clamp(3rem, 13vw, 6rem);
  line-height: 0.9;
  letter-spacing: -0.08em;
}

.host-grid-layout {
  display: grid;
  gap: 14px;
  margin-bottom: 14px;
}

.host-card {
  width: 100%;
}

.section-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.section-heading h2 {
  margin-bottom: 0;
}

.section-heading span,
.mini-pill {
  padding: 7px 10px;
  border-radius: 999px;
  color: var(--primary);
  background: #f4edff;
  font-size: 0.78rem;
  font-weight: 950;
  white-space: nowrap;
}

.url-box {
  overflow-wrap: anywhere;
  margin-bottom: 12px;
  padding: 14px;
  border-radius: 18px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.74);
  border: 1px dashed rgba(124, 58, 237, 0.28);
  font-weight: 800;
}

.current-cue-preview {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 96px;
  padding: 16px;
  border-radius: 24px;
  background: linear-gradient(135deg, #f4edff, #eef8ff);
}

.current-cue-preview p,
.current-cue-preview strong {
  margin: 0;
}

.current-cue-preview p {
  margin-top: 4px;
  color: var(--muted);
  font-weight: 800;
}

.preview-icon {
  font-size: 2.4rem;
}

.segmented-control {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.segment-button {
  padding: 12px;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(124, 58, 237, 0.14);
}

.segment-button.is-selected {
  color: white;
  background: linear-gradient(135deg, var(--primary), var(--pink));
  box-shadow: 0 14px 28px rgba(124, 58, 237, 0.18);
}

.bpm-card {
  margin-bottom: 14px;
}

.bpm-main-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.round-button {
  width: 58px;
  height: 58px;
  color: white;
  font-size: 1.4rem;
  background: linear-gradient(135deg, var(--primary), var(--pink));
}

.bpm-output {
  min-width: 132px;
  text-align: center;
  font-size: clamp(3rem, 12vw, 5.4rem);
  font-weight: 950;
  line-height: 1;
  letter-spacing: -0.08em;
}

.range-input {
  width: 100%;
  accent-color: var(--primary);
}

.metronome-visual {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.beat-dots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.beat-light {
  height: 24px;
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.13);
  transition: background 100ms ease, transform 100ms ease, box-shadow 100ms ease;
}

.beat-light.is-on {
  background: var(--primary);
  box-shadow: 0 0 0 7px rgba(124, 58, 237, 0.16);
  transform: scaleY(1.25);
}

.cue-card-host {
  margin-bottom: 14px;
}

.cue-buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.host-cue-button {
  display: grid;
  place-items: center;
  gap: 5px;
  min-height: 88px;
  padding: 14px 10px;
  border-radius: 22px;
  color: var(--ink);
  background: linear-gradient(135deg, #ffffff, #f4edff);
  border: 1px solid rgba(124, 58, 237, 0.16);
  box-shadow: 0 10px 20px rgba(68, 38, 126, 0.08);
}

.host-cue-button span {
  font-size: 1.7rem;
}

.host-cue-button.is-danger {
  color: #991b1b;
  background: #fee2e2;
  border-color: #fecaca;
}

.host-cue-button.is-working {
  animation: cuePulse 500ms ease-in-out infinite alternate;
}

.group-counts {
  display: grid;
  gap: 10px;
}

.group-count-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 20px;
  background: var(--group-soft);
}

.group-count-emoji {
  font-size: 1.8rem;
}

.group-count-card strong,
.group-count-card small {
  display: block;
}

.group-count-card small {
  color: var(--muted);
  font-weight: 800;
}

.group-count-card b {
  display: grid;
  place-items: center;
  min-width: 44px;
  height: 44px;
  border-radius: 15px;
  color: white;
  background: var(--group-color);
  font-size: 1.35rem;
}

.sequence-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 22px;
}

.sequence-list li {
  padding: 8px 10px;
  border-radius: 14px;
  color: var(--muted);
  font-weight: 850;
}

.sequence-list li.is-current {
  color: var(--primary);
  background: #f4edff;
}

.host-toast {
  position: fixed;
  inset: auto 16px calc(18px + var(--safe-bottom));
  z-index: 20;
  transform: translateY(18px);
  opacity: 0;
  pointer-events: none;
  padding: 14px 16px;
  border-radius: 18px;
  color: white;
  background: var(--ink);
  box-shadow: var(--shadow);
  font-weight: 900;
  transition: opacity 180ms ease, transform 180ms ease;
}

.host-toast.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.host-toast[data-type="error"] {
  background: var(--danger);
}

.host-toast[data-type="success"] {
  background: var(--success);
}

@media (min-width: 720px) {
  .landing-actions,
  .host-grid-layout,
  .controls-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .host-hero {
    grid-template-columns: 1.4fr 0.8fr;
  }

  .cue-buttons-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .metronome-visual {
    grid-template-columns: auto 1fr;
    align-items: center;
  }
}

@media (min-width: 1020px) {
  .cue-buttons-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

@media (max-width: 390px) {
  .group-options-grid,
  .cue-buttons-grid {
    grid-template-columns: 1fr;
  }

  .host-header,
  .participant-header {
    align-items: stretch;
    flex-direction: column;
  }

  .cue-card {
    border-radius: 28px;
  }
}

/* ============================================================
   Audio del host + pulso visual participante
   ============================================================ */

.metro-actions,
.audio-controls,
.url-audio-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.audio-panel {
  margin-bottom: 14px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(244, 237, 255, 0.9)),
    radial-gradient(circle at 10% 10%, rgba(236, 72, 153, 0.12), transparent 24rem);
}

.audio-panel h3 {
  margin: 0;
  font-size: 1.05rem;
}

.audio-controls {
  margin: 16px 0;
}

.audio-controls > button,
.metro-actions > button {
  flex: 1 1 150px;
}

.audio-grid {
  display: grid;
  gap: 12px;
  margin: 12px 0;
}

.audio-field {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 950;
}

.audio-field .text-input,
.audio-field .select-input {
  width: 100%;
}

.url-audio-row .text-input {
  flex: 999 1 240px;
}

.url-audio-row .secondary-action {
  flex: 1 1 130px;
}

.track-controls {
  margin-top: 18px;
  padding: 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(124, 58, 237, 0.14);
}

.compact-heading {
  margin-bottom: 8px;
}

.track-status,
.audio-status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  padding: 9px 12px;
  border-radius: 999px;
  color: var(--primary);
  background: #f4edff;
  font-size: 0.78rem;
  font-weight: 950;
}

.audio-status {
  margin-top: 10px;
  border-radius: 18px;
  white-space: normal;
}

.pulse-widget {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  margin: 0 0 14px;
  padding: 14px;
  border: 1px solid rgba(124, 58, 237, 0.16);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: var(--shadow-soft);
}

.pulse-copy {
  display: grid;
  gap: 2px;
}

.pulse-copy strong {
  font-size: 0.98rem;
  letter-spacing: -0.03em;
}

.pulse-copy span,
.pulse-bpm {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 850;
}

.pulse-light {
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: var(--primary);
  background: radial-gradient(circle, #fff 0 35%, #f4edff 36% 100%);
  border: 1px solid rgba(124, 58, 237, 0.16);
  box-shadow: inset 0 0 0 8px rgba(124, 58, 237, 0.08);
  transition: transform 80ms ease, box-shadow 80ms ease, background 80ms ease, color 80ms ease;
}

.pulse-count {
  font-size: 2rem;
  font-weight: 950;
  line-height: 1;
}

.pulse-light.is-active {
  color: white;
  background: radial-gradient(circle, var(--primary) 0 50%, var(--pink) 100%);
  box-shadow:
    0 0 0 8px rgba(124, 58, 237, 0.16),
    0 0 34px rgba(124, 58, 237, 0.42);
  transform: scale(1.08);
}

.pulse-light.is-accent {
  background: radial-gradient(circle, var(--pink) 0 42%, var(--primary) 100%);
  box-shadow:
    0 0 0 10px rgba(236, 72, 153, 0.18),
    0 0 44px rgba(236, 72, 153, 0.5);
  transform: scale(1.14);
}

.pulse-widget.meter-off {
  opacity: 0.82;
}

.pulse-widget.pulse-hit {
  animation: pulseWidgetHit 220ms ease-out both;
}

@keyframes pulseWidgetHit {
  0% { transform: scale(0.992); }
  55% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

@media (min-width: 760px) {
  .audio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: end;
  }

  .audio-field.full-width {
    grid-column: 1 / -1;
  }
}

@media (max-width: 520px) {
  .pulse-widget {
    grid-template-columns: 1fr auto;
  }

  .pulse-bpm {
    grid-column: 1 / -1;
  }

  .pulse-light {
    width: 64px;
    height: 64px;
  }

  .pulse-count {
    font-size: 1.75rem;
  }
}

/* ============================================================
   Caja de ritmos en vivo + combinador rítmico
   ============================================================ */
.rhythm-composer {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(246, 240, 255, 0.92)),
    radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.12), transparent 24rem),
    radial-gradient(circle at 100% 20%, rgba(236, 72, 153, 0.10), transparent 22rem);
}

.preset-controls,
.composer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: end;
  margin: 16px 0;
}

.preset-controls .audio-field {
  min-width: min(100%, 280px);
  flex: 1 1 280px;
}

.sync-status {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.10);
  color: var(--primary);
  font-weight: 950;
  font-size: 0.82rem;
}

.composer-time-editor {
  margin: 18px 0;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
}

.time-combo-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(190px, 1fr));
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.time-combo-card {
  min-width: 190px;
  padding: 14px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(237, 233, 254, 0.66));
  border: 1px solid rgba(124, 58, 237, 0.13);
}

.time-combo-card > strong {
  display: block;
  font-size: 1rem;
  color: var(--ink);
}

.time-combo-card > span {
  display: block;
  margin-bottom: 10px;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 900;
}

.combo-checkbox-group {
  display: grid;
  gap: 7px;
}

.combo-checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 9px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--muted);
  font-weight: 850;
  cursor: pointer;
}

.combo-checkbox-group input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.drum-scroll {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.drum-grid {
  min-width: 840px;
  display: grid;
  gap: 10px;
}

.drum-grid-header,
.drum-row {
  display: grid;
  grid-template-columns: 190px repeat(16, minmax(30px, 1fr));
  gap: 6px;
  align-items: center;
}

.drum-row-spacer,
.drum-step-label {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 950;
  text-align: center;
}

.drum-row-spacer {
  text-align: left;
  padding-left: 10px;
}

.drum-step-label.is-beat-start {
  color: var(--primary);
}

.drum-row {
  padding: 8px;
  border-radius: 22px;
  background: color-mix(in srgb, var(--group-soft) 45%, white);
  border: 1px solid color-mix(in srgb, var(--group-color) 18%, transparent);
}

.drum-row-label {
  display: flex;
  gap: 9px;
  align-items: center;
  min-width: 0;
}

.drum-row-label > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 16px;
  background: white;
  font-size: 1.45rem;
  box-shadow: 0 10px 26px rgba(68, 38, 126, 0.10);
}

.drum-row-label strong,
.drum-row-label small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drum-row-label strong {
  color: var(--ink);
  font-size: 0.96rem;
}

.drum-row-label small {
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 820;
}

.drum-step,
.composer-cell {
  aspect-ratio: 1 / 1;
  min-height: 30px;
  border-radius: 12px;
  background: rgba(33, 22, 58, 0.10);
  border: 1px solid rgba(33, 22, 58, 0.06);
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
}

.drum-step:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--group-color) 24%, white);
}

.drum-step.is-on,
.composer-cell.is-on {
  background: linear-gradient(135deg, var(--group-color), color-mix(in srgb, var(--group-color) 55%, var(--pink)));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--group-color) 24%, transparent);
  border-color: color-mix(in srgb, var(--group-color) 55%, white);
}

.drum-step.is-current,
.composer-cell.is-current {
  outline: 3px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.16), 0 10px 26px rgba(68, 38, 126, 0.18);
}

.drum-step.is-hit,
.composer-cell.is-hit {
  transform: scale(1.12);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--group-color) 22%, transparent), 0 0 24px color-mix(in srgb, var(--group-color) 54%, transparent);
}

.drum-step.is-beat-start,
.composer-cell.is-beat-start {
  border-left-width: 3px;
  border-left-color: color-mix(in srgb, var(--primary) 35%, transparent);
}

.step-dot.is-pattern {
  background: color-mix(in srgb, var(--group-color) 62%, rgba(33, 22, 58, 0.14));
}

.step-dot.is-current {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.15), 0 0 18px rgba(124, 58, 237, 0.28);
}

.step-dot.is-current.is-pattern,
.step-dot.is-hit {
  background: var(--group-color);
  transform: scaleY(1.5) scaleX(1.05);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--group-color) 18%, transparent), 0 0 24px color-mix(in srgb, var(--group-color) 52%, transparent);
}

.step-dot.is-accent {
  min-height: 13px;
}

.is-danger-soft {
  color: var(--danger) !important;
  background: rgba(220, 38, 38, 0.08) !important;
}

@media (max-width: 720px) {
  .drum-grid {
    min-width: 760px;
  }

  .drum-grid-header,
  .drum-row {
    grid-template-columns: 160px repeat(16, minmax(28px, 1fr));
    gap: 5px;
  }

  .drum-row-label > span {
    width: 36px;
    height: 36px;
    border-radius: 13px;
  }

  .time-combo-grid {
    grid-template-columns: repeat(4, 180px);
  }
}

/* Configuración de sala */
.room-config-card {
  width: min(100%, 980px);
  margin: 18px auto;
}

.room-config-grid {
  display: grid;
  gap: 16px;
  align-items: end;
}

.room-config-grid .secondary-action,
.room-config-grid .ghost-button {
  min-height: 54px;
}

#room-code-current[readonly] {
  color: var(--muted);
  background: rgba(124, 58, 237, 0.08);
  cursor: not-allowed;
}

.participant-room-title {
  margin: 6px 0 3px;
  color: var(--ink);
  font-size: 0.92rem;
  font-weight: 950;
  line-height: 1.15;
  letter-spacing: -0.03em;
}

@media (min-width: 780px) {
  .room-config-grid {
    grid-template-columns: minmax(180px, 0.65fr) minmax(260px, 1.3fr) auto;
  }

  .room-config-grid .audio-field:last-child {
    grid-column: 1 / -1;
  }
}
```

# app.js
```
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
```

# firebase-config.js
```
// ============================================================
// firebase-config.js
// Configuración central de Firebase para GitHub Pages.
// Si tu Realtime Database muestra otra URL, cambia solo databaseURL.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAfhIfFHuYF_n7vsWrnRp-8idWTnrHf1W4",
  authDomain: "they-don-t-care-about-us.firebaseapp.com",
  databaseURL: "https://they-don-t-care-about-us-default-rtdb.firebaseio.com",
  projectId: "they-don-t-care-about-us",
  storageBucket: "they-don-t-care-about-us.firebasestorage.app",
  messagingSenderId: "386965308484",
  appId: "1:386965308484:web:062d0164d68528dd762811",
  measurementId: "G-SVG6C7DPZF"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getDatabase(firebaseApp);

let authPromise = null;

export function ensureAuth() {
  if (!firebaseConfig.databaseURL || firebaseConfig.databaseURL.includes("REEMPLAZA") || firebaseConfig.databaseURL.includes("TU_DATABASE")) {
    return Promise.reject(new Error("Falta databaseURL en firebase-config.js. Crea Realtime Database y copia la URL exacta."));
  }

  if (auth.currentUser) return Promise.resolve(auth.currentUser);

  if (!authPromise) {
    authPromise = new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        }
      }, reject);

      signInAnonymously(auth).catch((error) => {
        unsubscribe();
        authPromise = null;
        reject(error);
      });
    });
  }

  return authPromise;
}
```

# room.service.js
```
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
```

# participant.ui.js
```
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
```

# host.ui.js
```
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
```

# rhythms.js
```
// ============================================================
// rhythms.js
// Actividades, grupos, patrones y cues de la sala rítmica.
// Todo está centralizado aquí para adaptar futuras dinámicas.
// ============================================================

export const GROUPS = [
  {
    id: 1,
    key: "feet",
    name: "Pies",
    emoji: "👟",
    color: "#7c3aed",
    softColor: "#ede9fe",
    action: "Marca el pulso con los pies",
    pattern: "1 · 2 · 3 · 4",
    patternShort: "Todos los tiempos",
    patternDetail: "Golpea el piso en cada tiempo: uno, dos, tres y cuatro. Constante, como una marcha de estadio.",
    steps16: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    help: "Tu misión es sostener el piso del ritmo. No corras, no adornes, solo mantén el pulso firme. Heroico y simple, como casi todo lo que funciona."
  },
  {
    id: 2,
    key: "claps",
    name: "Palmas",
    emoji: "👏",
    color: "#db2777",
    softColor: "#fce7f3",
    action: "Aplaude en el 2 y el 4",
    pattern: "2 · 4",
    patternShort: "Backbeat",
    patternDetail: "Aplaude únicamente en el tiempo dos y en el tiempo cuatro. Fuerte, corto y con actitud.",
    steps16: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    help: "Tu aplauso es el golpe que hace que todo suene más grande. Si dudas, escucha a los pies y entra en dos y cuatro."
  },
  {
    id: 3,
    key: "legs",
    name: "Piernas",
    emoji: "🦵",
    color: "#0891b2",
    softColor: "#cffafe",
    action: "Golpea suave las piernas",
    pattern: "1 · 3",
    patternShort: "Base grave",
    patternDetail: "Palmea tus piernas en el tiempo uno y en el tiempo tres. Suave, seco y parejo.",
    steps16: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    help: "Eres la capa grave de la percusión corporal. Menos show, más estabilidad. Qué raro: algo discreto sosteniendo todo."
  },
  {
    id: 4,
    key: "table",
    name: "Mesa / vaso",
    emoji: "🥁",
    color: "#d97706",
    softColor: "#fef3c7",
    action: "Golpes cortos sobre mesa o vaso",
    pattern: "1 · y · 3 · y",
    patternShort: "Golpes cortos",
    patternDetail: "Haz golpes secos en uno, en la y después del uno, en tres y en la y después del tres.",
    steps16: [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    help: "Usa dedos o nudillos suaves. La idea es sonar rítmico, no demandar al restaurante por daños emocionales al mobiliario."
  },
  {
    id: 5,
    key: "voice",
    name: "Voz / grito",
    emoji: "🎤",
    color: "#16a34a",
    softColor: "#dcfce7",
    action: "Grita ¡Hey! en el 4",
    pattern: "4 · ¡Hey!",
    patternShort: "Grito en el cuatro",
    patternDetail: "Espera hasta el tiempo cuatro y lanza un ¡Hey! corto, claro y con energía de estadio.",
    steps16: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    help: "No grites todo el tiempo. Tu poder está en esperar. Terrible lección para la humanidad, pero funciona."
  }
];

function makePattern(group, overrides = {}) {
  return {
    label: overrides.label || group.name,
    icon: overrides.icon || group.emoji,
    action: overrides.action || group.action,
    patternText: overrides.patternText || group.pattern,
    helper: overrides.helper || group.patternShort,
    detail: overrides.detail || group.patternDetail,
    help: overrides.help || group.help,
    color: overrides.color || group.color,
    softColor: overrides.softColor || group.softColor,
    steps: normalizePatternSteps(overrides.steps || group.steps16)
  };
}

export const DEFAULT_PATTERNS = GROUPS.reduce((acc, group) => {
  acc[String(group.id)] = makePattern(group);
  return acc;
}, {});

export const PATTERN_PRESETS = {
  tdcau_body_groove: {
    id: "tdcau_body_groove",
    name: "Base corporal estadio",
    description: "Patrón principal para la dinámica de percusión corporal de estadio.",
    patterns: clonePatterns(DEFAULT_PATTERNS)
  },
  simple_count: {
    id: "simple_count",
    name: "Conteo simple",
    description: "Entradas muy claras para ensayo con los cuatro tiempos principales.",
    patterns: buildPatternsFromActiveSteps({
      1: [0, 4, 8, 12],
      2: [4, 12],
      3: [0, 8],
      4: [0, 8],
      5: [12]
    })
  },
  dense_stadium: {
    id: "dense_stadium",
    name: "Estadio intenso",
    description: "Más movimiento para show: capas de respuesta y golpes intermedios.",
    patterns: buildPatternsFromActiveSteps({
      1: [0, 4, 8, 12],
      2: [4, 12],
      3: [2, 3, 6, 7, 10, 11, 14, 15],
      4: [0, 2, 4, 6, 8, 10, 12, 14],
      5: [12, 15]
    }, {
      3: { patternText: "e-a · e-a · e-a · e-a", helper: "Ghost corporal" },
      4: { patternText: "1 & 2 & 3 & 4 &", helper: "Mesa constante" },
      5: { patternText: "4 · a", helper: "Respuesta vocal" }
    })
  },
  empty: {
    id: "empty",
    name: "Vacío",
    description: "Limpia todos los patrones para construir desde cero.",
    patterns: buildPatternsFromActiveSteps({
      1: [],
      2: [],
      3: [],
      4: [],
      5: []
    }, {
      1: { patternText: "—", helper: "Sin golpes" },
      2: { patternText: "—", helper: "Sin golpes" },
      3: { patternText: "—", helper: "Sin golpes" },
      4: { patternText: "—", helper: "Sin golpes" },
      5: { patternText: "—", helper: "Sin golpes" }
    })
  }
};

export function normalizePatternSteps(steps) {
  const out = Array(16).fill(false);
  if (!Array.isArray(steps)) return out;
  steps.slice(0, 16).forEach((value, index) => {
    out[index] = value === true || value === 1 || value === "1";
  });
  return out;
}

export function clonePatterns(patterns = DEFAULT_PATTERNS) {
  const out = {};
  GROUPS.forEach((group) => {
    const source = patterns[String(group.id)] || DEFAULT_PATTERNS[String(group.id)];
    out[String(group.id)] = {
      ...source,
      steps: normalizePatternSteps(source.steps)
    };
  });
  return out;
}

export function buildPatternsFromActiveSteps(map, overrides = {}) {
  const patterns = {};
  GROUPS.forEach((group) => {
    const active = new Set((map[group.id] || []).map(Number));
    const steps = Array.from({ length: 16 }, (_, index) => active.has(index));
    patterns[String(group.id)] = makePattern(group, {
      ...(overrides[group.id] || {}),
      steps,
      patternText: overrides[group.id]?.patternText || stepsToPatternText(steps),
      helper: overrides[group.id]?.helper || inferPatternHelper(steps)
    });
  });
  return patterns;
}

export function getPatternPreset(presetId) {
  return PATTERN_PRESETS[presetId] || PATTERN_PRESETS.tdcau_body_groove;
}

export function getGroupPattern(patterns, groupId) {
  const id = String(Number(groupId));
  const fallback = DEFAULT_PATTERNS[id] || DEFAULT_PATTERNS["1"];
  const source = patterns?.[id] || fallback;
  return {
    ...fallback,
    ...source,
    steps: normalizePatternSteps(source.steps || fallback.steps)
  };
}

export function sanitizePatterns(patterns = DEFAULT_PATTERNS) {
  const clean = {};
  GROUPS.forEach((group) => {
    const pattern = getGroupPattern(patterns, group.id);
    clean[String(group.id)] = {
      label: String(pattern.label || group.name).slice(0, 40),
      icon: String(pattern.icon || group.emoji).slice(0, 8),
      action: String(pattern.action || group.action).slice(0, 120),
      patternText: String(pattern.patternText || stepsToPatternText(pattern.steps)).slice(0, 80),
      helper: String(pattern.helper || inferPatternHelper(pattern.steps)).slice(0, 80),
      detail: String(pattern.detail || group.patternDetail).slice(0, 240),
      help: String(pattern.help || group.help).slice(0, 360),
      color: pattern.color || group.color,
      softColor: pattern.softColor || group.softColor,
      steps: normalizePatternSteps(pattern.steps)
    };
  });
  return clean;
}

export function stepsToPatternText(steps) {
  const normalized = normalizePatternSteps(steps);
  const beatNames = ["1", "e", "&", "a", "2", "e", "&", "a", "3", "e", "&", "a", "4", "e", "&", "a"];
  const active = normalized
    .map((value, index) => value ? beatNames[index] : null)
    .filter(Boolean);
  return active.length ? active.join(" · ") : "—";
}

export function inferPatternHelper(steps) {
  const normalized = normalizePatternSteps(steps);
  const count = normalized.filter(Boolean).length;
  if (count === 0) return "Sin golpes";
  if (count === 1) return "Una entrada";
  if (count <= 2) return "Entrada simple";
  if (count <= 4) return "Patrón base";
  if (count <= 8) return "Patrón activo";
  return "Patrón denso";
}


export const ACTIVITIES = {
  tdcau_body_groove: {
    id: "tdcau_body_groove",
    name: "They Don't Care About Us · Base corporal",
    shortName: "Base corporal",
    description: "Base rítmica original con energía de marcha, protesta, percusión corporal y estadio. No usa audio, letra ni samples originales.",
    defaultBpm: 96,
    groups: GROUPS
  },
  beat_challenge: {
    id: "beat_challenge",
    name: "Beat Challenge por zonas",
    shortName: "Beat Challenge",
    description: "Dinámica por sectores del lugar: cada zona responde cuando el host la activa.",
    defaultBpm: 104,
    groups: GROUPS
  },
  groove_machine: {
    id: "groove_machine",
    name: "Máquina del groove",
    shortName: "Máquina del groove",
    description: "Construcción progresiva de capas rítmicas: una máquina humana de percusión corporal.",
    defaultBpm: 90,
    groups: GROUPS
  }
};

export const CUES = {
  prepare: {
    key: "prepare",
    type: "prepare",
    activeGroup: null,
    label: "Preparar",
    icon: "🎬",
    message: "Prepárate",
    subMessage: "Mira tu grupo y espera la entrada",
    participantStatus: "espera",
    tone: "neutral"
  },
  countdown: {
    key: "countdown",
    type: "countdown",
    activeGroup: null,
    label: "Iniciar conteo",
    icon: "🔢",
    message: "Viene el ritmo",
    subMessage: "Cinco · cuatro · tres · dos · uno",
    participantStatus: "espera",
    tone: "attention"
  },
  group1: {
    key: "group1",
    type: "group",
    activeGroup: 1,
    label: "Entra Grupo 1",
    icon: "👟",
    message: "Entran los pies",
    subMessage: "Grupo 1 marca 1 · 2 · 3 · 4",
    participantStatus: "entra",
    tone: "group"
  },
  group2: {
    key: "group2",
    type: "group",
    activeGroup: 2,
    label: "Entra Grupo 2",
    icon: "👏",
    message: "Entran las palmas",
    subMessage: "Grupo 2 aplaude en 2 y 4",
    participantStatus: "entra",
    tone: "group"
  },
  group3: {
    key: "group3",
    type: "group",
    activeGroup: 3,
    label: "Entra Grupo 3",
    icon: "🦵",
    message: "Entran las piernas",
    subMessage: "Grupo 3 golpea suave en 1 y 3",
    participantStatus: "entra",
    tone: "group"
  },
  group4: {
    key: "group4",
    type: "group",
    activeGroup: 4,
    label: "Entra Grupo 4",
    icon: "🥁",
    message: "Entra mesa / vaso",
    subMessage: "Grupo 4 hace golpes cortos en 1 · y · 3 · y",
    participantStatus: "entra",
    tone: "group"
  },
  group5: {
    key: "group5",
    type: "group",
    activeGroup: 5,
    label: "Entra Grupo 5",
    icon: "🎤",
    message: "Entra la voz",
    subMessage: "Grupo 5 grita ¡Hey! en el 4",
    participantStatus: "entra",
    tone: "group"
  },
  all: {
    key: "all",
    type: "all",
    activeGroup: null,
    label: "Todos juntos",
    icon: "🔥",
    message: "Todos juntos",
    subMessage: "Sigue tu patrón · Todos juntos",
    participantStatus: "todos",
    tone: "success"
  },
  lower: {
    key: "lower",
    type: "lower",
    activeGroup: null,
    label: "Bajar energía",
    icon: "🔽",
    message: "Baja la energía",
    subMessage: "Más suave · Mantén el pulso",
    participantStatus: "espera",
    tone: "neutral"
  },
  silence: {
    key: "silence",
    type: "silence",
    activeGroup: null,
    label: "Silencio",
    icon: "🤫",
    message: "Silencio total",
    subMessage: "Para ahora · escucha al host",
    participantStatus: "silencio",
    tone: "silence"
  },
  cut: {
    key: "cut",
    type: "cut",
    activeGroup: null,
    label: "Corte final",
    icon: "✂️",
    message: "Corte final",
    subMessage: "Para en seco · todos al tiempo",
    participantStatus: "corte",
    tone: "danger"
  },
  pose: {
    key: "pose",
    type: "pose",
    activeGroup: null,
    label: "Pose MJ",
    icon: "🕺",
    message: "Pose Michael Jackson",
    subMessage: "Congélate en una pose final",
    participantStatus: "pose final",
    tone: "pose"
  },
  reset: {
    key: "reset",
    type: "prepare",
    activeGroup: null,
    label: "Reiniciar sala",
    icon: "🔄",
    message: "Sala reiniciada",
    subMessage: "Volvemos a preparar la entrada",
    participantStatus: "espera",
    tone: "neutral"
  }
};

export const HOST_SEQUENCE = [
  "prepare",
  "group1",
  "group2",
  "group3",
  "group4",
  "group5",
  "all",
  "silence",
  "cut",
  "pose"
];

export function getGroupById(groupId) {
  return GROUPS.find((group) => group.id === Number(groupId)) || null;
}

export function getCueByKey(key) {
  return CUES[key] || CUES.prepare;
}

export function getActivityById(activityId) {
  return ACTIVITIES[activityId] || ACTIVITIES.tdcau_body_groove;
}

export function getGroupCueKey(groupId) {
  return `group${Number(groupId)}`;
}

export function getLeastPopulatedGroup(participants = {}) {
  const counts = getParticipantCounts(participants);
  return GROUPS.reduce((candidate, group) => {
    if (counts[group.id] < counts[candidate.id]) return group;
    return candidate;
  }, GROUPS[0]).id;
}

export function getParticipantCounts(participants = {}, maxAgeMs = 90000) {
  const now = Date.now();
  const counts = GROUPS.reduce((acc, group) => {
    acc[group.id] = 0;
    return acc;
  }, {});

  Object.values(participants || {}).forEach((participant) => {
    const groupId = Number(participant.group);
    const lastSeen = Number(participant.lastSeen || participant.joinedAt || 0);
    const isFresh = !lastSeen || now - lastSeen <= maxAgeMs;
    if (counts[groupId] !== undefined && isFresh) counts[groupId] += 1;
  });

  return counts;
}

export function getTotalFreshParticipants(participants = {}, maxAgeMs = 90000) {
  const now = Date.now();
  return Object.values(participants || {}).filter((participant) => {
    const lastSeen = Number(participant.lastSeen || participant.joinedAt || 0);
    return !lastSeen || now - lastSeen <= maxAgeMs;
  }).length;
}
```

# audio.engine.js
```
// ============================================================
// audio.engine.js
// Motor de audio para host Musicala.
// Adapta la lógica del secuenciador Musicala:
// - 16 pasos en 4/4.
// - BPM 40-240.
// - Samples bombo/redoblante/platillo del secuenciador original,
//   con fallback sintético si los WAV no cargan.
// - Reproductor opcional de pista local o URL directa.
// ============================================================

export const AUDIO_PRESETS = [
  {
    id: "stadium_march",
    name: "Marcha estadio",
    description: "Pulso fuerte, corporal, de marcha y público.",
    bpm: 96,
    pattern: {
      bd: steps([1, 5, 9, 13]),
      sn: steps([5, 13]),
      hh: steps([1, 3, 9, 11]),
      table: steps([1, 3, 9, 11]),
      accent: steps([16])
    }
  },
  {
    id: "body_groove",
    name: "Groove corporal",
    description: "Base clara para palmas, pies y percusión corporal.",
    bpm: 100,
    pattern: {
      bd: steps([1, 7, 9, 15]),
      sn: steps([5, 13]),
      hh: steps([1, 4, 9, 12]),
      table: steps([1, 4, 9, 12]),
      accent: steps([])
    }
  },
  {
    id: "protest_pulse",
    name: "Pulso estadio",
    description: "Energía de marcha, llamado colectivo y percusión corporal.",
    bpm: 96,
    pattern: {
      bd: steps([1, 5, 9, 13]),
      sn: steps([5, 13]),
      hh: steps([1, 3, 5, 7, 9, 11, 13, 15]),
      table: steps([1, 3, 5, 7, 9, 11, 13, 15]),
      accent: steps([])
    }
  },
  {
    id: "musicala_rock",
    name: "Rock Musicala",
    description: "Adaptación del preset rock del secuenciador Musicala.",
    bpm: 92,
    pattern: {
      hh: bools([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
      sn: bools([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
      bd: bools([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]),
      table: steps([]),
      accent: steps([])
    }
  },
  {
    id: "musicala_funk",
    name: "Funk Musicala",
    description: "Adaptación del preset funk del secuenciador Musicala.",
    bpm: 98,
    pattern: {
      hh: bools([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]),
      sn: bools([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
      bd: bools([1,0,0,1, 0,0,1,0, 1,0,0,0, 0,1,0,0]),
      table: steps([]),
      accent: steps([])
    }
  }
];

const SAMPLE_SOURCES = {
  bd: [
    "assets/sounds/bombo.wav",
    "https://musicalaescuela.github.io/secuenciadormusicala/assets/sounds/bombo.wav"
  ],
  sn: [
    "assets/sounds/redoblante.wav",
    "https://musicalaescuela.github.io/secuenciadormusicala/assets/sounds/redoblante.wav"
  ],
  hh: [
    "assets/sounds/platillo.wav",
    "https://musicalaescuela.github.io/secuenciadormusicala/assets/sounds/platillo.wav"
  ]
};

const DIRECT_AUDIO_RE = /\.(mp3|wav|ogg|m4a)(\?.*)?$/i;
const MIN_BPM = 40;
const MAX_BPM = 240;

export class AudioEngine {
  constructor() {
    this.context = null;
    this.master = null;
    this.trackAudio = null;
    this.trackGain = 0.8;
    this.unlocked = false;
    this.samples = new Map();
    this.sampleStatus = "sin cargar";
    this.bpm = 96;
    this.volume = 0.88;
    this.presetId = "stadium_march";
    this.preset = getPresetById(this.presetId);
    this.beatSource = "preset";
    this.livePatterns = null;
    this.isBeatRunning = false;
    this.currentStep = 0;
    this.nextStepTime = 0;
    this.timerId = null;
    this.lookaheadMs = 25;
    this.scheduleAheadSec = 0.12;
    this.onStep = null;
    this.trackStatus = "Sin pista";
    this.trackSrc = "";
    this.trackBaseBpm = 96;
    this.trackFollowsBpm = true;
  }

  async init() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("Este navegador no soporta Web Audio API.");
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.context.destination);
      this.trackAudio = new Audio();
      this.trackAudio.preload = "auto";
      this.trackAudio.crossOrigin = "anonymous";
      this.trackAudio.volume = this.trackGain;
      this.syncTrackPlaybackRate();
      this.trackAudio.addEventListener("error", () => {
        this.trackStatus = "Error al cargar pista";
      });
    }
    return this;
  }

  async unlock() {
    await this.init();
    if (this.context.state !== "running") await this.context.resume();
    this.unlocked = true;
    this.loadMusicalaSamples().catch((error) => {
      console.warn("No se pudieron cargar algunos samples Musicala. Se usará fallback sintético.", error);
    });
    return true;
  }

  async loadMusicalaSamples() {
    await this.init();
    const entries = Object.entries(SAMPLE_SOURCES);
    await Promise.all(entries.map(async ([id, urls]) => {
      if (this.samples.has(id)) return;
      const buffer = await loadFirstAvailableAudioBuffer(this.context, urls);
      this.samples.set(id, buffer);
    }));
    this.sampleStatus = "Samples Musicala cargados";
  }

  async startBeat() {
    await this.unlock();
    if (this.isBeatRunning) return true;
    this.isBeatRunning = true;
    this.currentStep = 0;
    this.nextStepTime = this.context.currentTime + 0.045;
    this.scheduler();
    this.timerId = window.setInterval(() => this.scheduler(), this.lookaheadMs);
    return true;
  }

  pauseBeat() {
    this.clearScheduler();
    this.isBeatRunning = false;
  }

  stopBeat() {
    this.clearScheduler();
    this.isBeatRunning = false;
    this.currentStep = 0;
    if (typeof this.onStep === "function") this.onStep(-1);
  }

  setBpm(bpm) {
    this.bpm = clampNumber(Number(bpm), MIN_BPM, MAX_BPM, 96);
    this.syncTrackPlaybackRate();
    return this.bpm;
  }

  setTrackBaseBpm(bpm) {
    this.trackBaseBpm = clampNumber(Number(bpm), MIN_BPM, MAX_BPM, this.bpm || 96);
    this.syncTrackPlaybackRate();
    return this.trackBaseBpm;
  }

  setTrackFollowsBpm(value) {
    this.trackFollowsBpm = value !== false;
    this.syncTrackPlaybackRate();
    return this.trackFollowsBpm;
  }

  syncTrackPlaybackRate() {
    if (!this.trackAudio) return 1;
    const base = clampNumber(Number(this.trackBaseBpm), MIN_BPM, MAX_BPM, this.bpm || 96);
    const rate = this.trackFollowsBpm ? clampNumber((this.bpm || base) / base, 0.35, 3, 1) : 1;
    this.trackAudio.playbackRate = rate;
    return rate;
  }

  setVolume(value) {
    const normalized = normalizeVolume(value);
    this.volume = normalized;
    if (this.master) this.master.gain.setTargetAtTime(normalized, this.context.currentTime, 0.015);
    return normalized;
  }

  setPreset(presetId) {
    const preset = getPresetById(presetId) || getPresetById("stadium_march");
    this.preset = preset;
    this.presetId = preset.id;
    return preset;
  }

  setBeatSource(source) {
    this.beatSource = source === "live" ? "live" : "preset";
    return this.beatSource;
  }

  setLivePatterns(patterns) {
    this.livePatterns = normalizeLivePatterns(patterns);
    return this.livePatterns;
  }

  async loadTrack(src, options = {}) {
    await this.init();
    if (options.baseBpm) this.setTrackBaseBpm(options.baseBpm);
    const cleanSrc = String(src || "").trim();
    if (!cleanSrc) throw new Error("No hay ruta de pista para cargar.");
    if (!DIRECT_AUDIO_RE.test(cleanSrc)) {
      throw new Error("Usa una URL directa a un archivo .mp3, .wav, .ogg o .m4a.");
    }

    this.trackAudio.pause();
    this.trackAudio.removeAttribute("src");
    this.trackAudio.load();

    this.trackSrc = cleanSrc;
    this.trackStatus = "Cargando pista…";

    await new Promise((resolve, reject) => {
      const audio = this.trackAudio;
      const cleanup = () => {
        audio.removeEventListener("canplaythrough", onReady);
        audio.removeEventListener("loadeddata", onReady);
        audio.removeEventListener("error", onError);
      };
      const onReady = () => {
        cleanup();
        this.trackStatus = cleanSrc.startsWith("assets/") ? "Pista local cargada" : "Pista cargada desde URL";
        resolve(true);
      };
      const onError = () => {
        cleanup();
        this.trackStatus = "Error al cargar pista";
        reject(new Error("No se pudo cargar la pista. Revisa ruta, formato o CORS."));
      };
      audio.addEventListener("canplaythrough", onReady, { once: true });
      audio.addEventListener("loadeddata", onReady, { once: true });
      audio.addEventListener("error", onError, { once: true });
      audio.src = cleanSrc;
      audio.load();
      window.setTimeout(() => {
        if (audio.readyState >= 2) onReady();
      }, 1200);
    });

    this.syncTrackPlaybackRate();
    return true;
  }

  async playTrack(options = {}) {
    await this.unlock();
    if (!this.trackAudio?.src) {
      throw new Error("Primero carga una pista local o una URL directa.");
    }
    if (options.restart) {
      try { this.trackAudio.currentTime = 0; } catch (_) {}
    }
    this.syncTrackPlaybackRate();
    await this.trackAudio.play();
    this.trackStatus = "Reproduciendo pista";
  }

  pauseTrack() {
    if (!this.trackAudio) return;
    this.trackAudio.pause();
    this.trackStatus = "Pista pausada";
  }

  stopTrack() {
    if (!this.trackAudio) return;
    this.trackAudio.pause();
    try { this.trackAudio.currentTime = 0; } catch (_) {}
    this.trackStatus = this.trackAudio.src ? "Pista detenida" : "Sin pista";
  }

  setTrackVolume(value) {
    const normalized = normalizeVolume(value);
    this.trackGain = normalized;
    if (this.trackAudio) this.trackAudio.volume = normalized;
    return normalized;
  }

  setOnStep(callback) {
    this.onStep = typeof callback === "function" ? callback : null;
  }

  getState() {
    return {
      unlocked: this.unlocked,
      isBeatRunning: this.isBeatRunning,
      bpm: this.bpm,
      volume: this.volume,
      presetId: this.presetId,
      presetName: this.preset?.name || "",
      beatSource: this.beatSource,
      currentStep: this.currentStep,
      sampleStatus: this.sampleStatus,
      trackStatus: this.trackStatus,
      trackSrc: this.trackSrc,
      trackVolume: this.trackGain,
      trackBaseBpm: this.trackBaseBpm,
      trackPlaybackRate: this.trackAudio?.playbackRate || 1,
      isTrackPlaying: Boolean(this.trackAudio?.src && !this.trackAudio.paused && !this.trackAudio.ended)
    };
  }

  scheduler() {
    if (!this.context || !this.isBeatRunning) return;
    while (this.nextStepTime < this.context.currentTime + this.scheduleAheadSec) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.nextStep();
    }
  }

  scheduleStep(stepIndex, time) {
    if (this.beatSource === "live" && this.livePatterns) {
      this.scheduleLivePatternStep(stepIndex, time);
    } else {
      const pattern = this.preset?.pattern || {};
      if (pattern.bd?.[stepIndex]) this.playInstrument("bd", time);
      if (pattern.sn?.[stepIndex]) this.playInstrument("sn", time);
      if (pattern.hh?.[stepIndex]) this.playInstrument("hh", time);
      if (pattern.table?.[stepIndex]) this.playInstrument("table", time);
      if (pattern.accent?.[stepIndex]) this.playInstrument("accent", time);
    }

    if (typeof this.onStep === "function") {
      window.setTimeout(() => this.onStep(stepIndex), Math.max(0, (time - this.context.currentTime) * 1000));
    }
  }

  scheduleLivePatternStep(stepIndex, time) {
    const map = {
      1: "bd",
      2: "sn",
      3: "table",
      4: "hh",
      5: "accent"
    };
    Object.entries(map).forEach(([groupId, instrument]) => {
      if (this.livePatterns?.[groupId]?.[stepIndex]) {
        this.playInstrument(instrument, time);
      }
    });
  }

  nextStep() {
    const secondsPerBeat = 60 / this.bpm;
    const stepDuration = secondsPerBeat / 4;
    this.nextStepTime += stepDuration;
    this.currentStep = (this.currentStep + 1) % 16;
  }

  playInstrument(id, time) {
    const sampleId = id === "table" || id === "accent" ? "hh" : id;
    const buffer = this.samples.get(sampleId);
    if (buffer) {
      this.playBuffer(buffer, time, getSampleGain(id));
      return;
    }
    this.playSynthetic(id, time);
  }

  playBuffer(buffer, time, gainValue = 1) {
    if (!this.context || !this.master) return;
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(gainValue, time);
    source.connect(gain).connect(this.master);
    source.start(time);
  }

  playSynthetic(id, time) {
    if (id === "bd") return this.syntheticKick(time);
    if (id === "sn") return this.syntheticSnare(time);
    if (id === "hh") return this.syntheticHat(time);
    if (id === "table") return this.syntheticTable(time);
    if (id === "accent") return this.syntheticAccent(time);
  }

  syntheticKick(time) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(48, time + 0.13);
    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    osc.connect(gain).connect(this.master);
    osc.start(time);
    osc.stop(time + 0.2);
  }

  syntheticSnare(time) {
    const noise = this.createNoise(0.13);
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    filter.type = "bandpass";
    filter.frequency.value = 1400;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(0.38, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    noise.connect(filter).connect(gain).connect(this.master);
    noise.start(time);
    noise.stop(time + 0.13);
  }

  syntheticHat(time) {
    const noise = this.createNoise(0.055);
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    filter.type = "highpass";
    filter.frequency.value = 5200;
    gain.gain.setValueAtTime(0.16, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);
    noise.connect(filter).connect(gain).connect(this.master);
    noise.start(time);
    noise.stop(time + 0.055);
  }

  syntheticTable(time) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, time);
    filter.type = "bandpass";
    filter.frequency.value = 820;
    filter.Q.value = 9;
    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
    osc.connect(filter).connect(gain).connect(this.master);
    osc.start(time);
    osc.stop(time + 0.075);
  }

  syntheticAccent(time) {
    this.syntheticKick(time);
    this.syntheticSnare(time + 0.01);
  }

  createNoise(durationSec) {
    const length = Math.max(1, Math.floor(this.context.sampleRate * durationSec));
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    return source;
  }

  clearScheduler() {
    if (this.timerId) window.clearInterval(this.timerId);
    this.timerId = null;
  }
}

function steps(stepNumbers) {
  const out = Array(16).fill(false);
  for (const stepNumber of stepNumbers) {
    const index = Number(stepNumber) - 1;
    if (index >= 0 && index < 16) out[index] = true;
  }
  return out;
}

function bools(values) {
  const out = Array(16).fill(false);
  values.slice(0, 16).forEach((value, index) => { out[index] = Boolean(value); });
  return out;
}

export function getPresetById(id) {
  return AUDIO_PRESETS.find((preset) => preset.id === id) || null;
}

function normalizeVolume(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0.8;
  if (numeric > 1) return clampNumber(numeric, 0, 100, 80) / 100;
  return clampNumber(numeric, 0, 1, 0.8);
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function getSampleGain(id) {
  if (id === "bd") return 0.95;
  if (id === "sn") return 0.72;
  if (id === "hh") return 0.34;
  if (id === "table") return 0.42;
  if (id === "accent") return 0.85;
  return 0.7;
}

function normalizeLivePatterns(patterns) {
  const out = {};
  [1, 2, 3, 4, 5].forEach((groupId) => {
    const raw = patterns?.[String(groupId)]?.steps || patterns?.[groupId]?.steps || [];
    out[String(groupId)] = Array.from({ length: 16 }, (_, index) => {
      const value = raw[index];
      return value === true || value === 1 || value === "1";
    });
  });
  return out;
}

async function loadFirstAvailableAudioBuffer(context, urls) {
  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, { mode: "cors", cache: "force-cache" });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();
      return await context.decodeAudioData(arrayBuffer);
    } catch (error) {
      lastError = error;
      console.warn(`[audio.engine] No cargó ${url}`, error);
    }
  }
  throw lastError || new Error("No se pudo cargar ningún sample.");
}
```

# demo-tracks.js
```
// ============================================================
// demo-tracks.js
// Pistas de ejemplo configurables.
// Usa únicamente URLs directas a archivos de audio (.mp3, .wav, .ogg, .m4a).
// Puedes borrar o reemplazar estas entradas cuando tengan las pistas definitivas.
// ============================================================

export const DEMO_TRACKS = [
  {
    id: "musicala_samples",
    name: "Usar beat generado con sonidos Musicala",
    bpm: 96,
    type: "generated",
    sourceLabel: "Samples del secuenciador Musicala",
    url: ""
  }
];
```

# README.md
```
# Musicala · Sala rítmica en vivo

Aplicación web mobile-first para crear una sala rítmica sincronizada en eventos en vivo.

Evento base:

**Salvémoslos del Reggaetón · Especial Michael Jackson**

La app permite que el público escanee un QR, entre desde el celular a una misma sala y reciba instrucciones en tiempo real según su grupo rítmico.

La actividad principal combina dirección visual para el público, pulso sincronizado y audio desde el dispositivo del host. El motor de beat usa la lógica del secuenciador Musicala y carga los sonidos base `bombo.wav`, `redoblante.wav` y `platillo.wav` del proyecto original si están disponibles; si no cargan, usa sonidos sintéticos de respaldo.

---

## Qué hace la app

Tiene dos modos:

### 1. Participante

URL sugerida:

```txt
index.html?room=MJ30
```

El participante puede:

- Entrar a la sala con código.
- Escribir su nombre opcionalmente.
- Elegir grupo manualmente o dejar asignación automática.
- Ver una tarjeta gigante con su grupo, acción, patrón y estado actual.
- Recibir cambios en tiempo real cuando el host cambia la indicación.
- Sentir una vibración corta cuando entra su grupo, si el celular lo permite.
- Consultar “¿Qué hago?” para leer una explicación breve.

Grupos:

1. 👟 Pies
2. 👏 Palmas
3. 🦵 Piernas
4. 🥁 Mesa / vaso
5. 🎤 Voz / grito

### 2. Host / director

URL sugerida:

```txt
index.html?host=1&room=MJ30
```

El host puede:

- Crear o abrir una sala por código.
- Ver el código grande para proyectarlo.
- Copiar la URL del participante para crear un QR.
- Cambiar actividad.
- Cambiar modo ensayo/show.
- Cambiar BPM visual de referencia entre 40 y 240.
- Ver contador de participantes por grupo.
- Lanzar cues en vivo:
  - Preparar
  - Iniciar conteo
  - Entra Grupo 1
  - Entra Grupo 2
  - Entra Grupo 3
  - Entra Grupo 4
  - Entra Grupo 5
  - Todos juntos
  - Bajar energía
  - Silencio
  - Corte final
  - Pose MJ
  - Reiniciar sala

---

## Estructura de archivos

```txt
musicala-sala-ritmica-mj/
├─ index.html
├─ styles.css
├─ app.js
├─ firebase-config.js
├─ room.service.js
├─ participant.ui.js
├─ host.ui.js
├─ rhythms.js
├─ audio.engine.js
├─ demo-tracks.js
├─ assets/
│  ├─ audio/
│  │  └─ pista-evento.mp3  # opcional, no incluida
│  └─ sounds/
│     ├─ bombo.wav         # opcional si quieren copiar los samples localmente
│     ├─ redoblante.wav    # opcional
│     └─ platillo.wav      # opcional
└─ README.md
```

---

## Audio del evento

El audio suena **solo desde el dispositivo del host**. Conecta ese computador/celular al sonido del bar. Los participantes no reproducen audio, solo ven instrucciones y una luz de pulso para evitar latencias raras entre celulares, porque un bar con veinte teléfonos sonando descuadrados no es groove, es castigo.

En el panel host encontrarás la sección **Audio del evento**:

1. Toca **Activar audio**. Los navegadores bloquean audio hasta que haya una acción del usuario.
2. Elige un preset:
   - Marcha estadio
   - Groove corporal
   - Pulso estadio
   - Rock Musicala
   - Funk Musicala
3. Toca **Reproducir beat**.
4. Ajusta BPM y volumen.

El motor intenta cargar estos sonidos del secuenciador Musicala:

```txt
assets/sounds/bombo.wav
assets/sounds/redoblante.wav
assets/sounds/platillo.wav
```

Si esos archivos no existen localmente, intenta cargarlos desde la URL pública del secuenciador original. Si tampoco cargan por red/CORS, usa fallback sintético con Web Audio API.

### Pista local

Puedes agregar una pista propia en:

```txt
assets/audio/pista-evento.mp3
```

Luego, en el host, toca **Cargar pista local** y después **Pista**.

Formatos admitidos:

```txt
.mp3
.wav
.ogg
.m4a
```

### URL directa de pista

También puedes pegar una URL directa a un archivo de audio. Debe terminar en `.mp3`, `.wav`, `.ogg` o `.m4a`. No sirve pegar enlaces de YouTube, SoundCloud o páginas HTML, porque el navegador no reproduce páginas disfrazadas de audio, aunque a veces el internet intente convencernos de lo contrario.

### Beats de ejemplo

Las pistas de ejemplo se configuran en:

```txt
demo-tracks.js
```

Por ahora incluye una opción que usa el **beat generado con sonidos Musicala**. Pueden reemplazar o agregar URLs directas cuando tengan pistas definitivas.

---

## Pulso visual para participantes

El host controla un metrónomo visual desde **BPM maestro**:

- **Activar pulso público**: los participantes ven una luz circular siguiendo el BPM.
- **Pausar pulso público**: apaga el pulso visual.
- **Reiniciar pulso**: vuelve a marcar el tiempo 1.

La sincronización usa Realtime Database:

```txt
rooms/{roomCode}/metronome
```

La app guarda `enabled`, `bpm`, `startedAt` y cada celular calcula la animación localmente usando `.info/serverTimeOffset`. No se envía un update a Firebase por cada beat. Firebase ya tiene suficientes dramas como para ponerlo a mandar un “tum” por cada pulso.

---

## Configurar Firebase

### 1. Crear proyecto

Entra a Firebase Console y crea un proyecto nuevo, por ejemplo:

```txt
musicala-sala-ritmica-mj
```

### 2. Crear app web

Dentro del proyecto:

1. Ve a **Configuración del proyecto**.
2. Baja a **Tus apps**.
3. Crea una app web.
4. Copia el objeto `firebaseConfig`.

### 3. Activar Realtime Database

1. Ve a **Build → Realtime Database**.
2. Crea una base de datos.
3. Elige la región.
4. Puedes iniciar en modo bloqueado y luego pegar las reglas de este README.

El campo `databaseURL` del `firebaseConfig` debe coincidir con la URL de tu Realtime Database.

### 4. Activar Authentication anónima

1. Ve a **Build → Authentication**.
2. Entra a **Sign-in method**.
3. Activa **Anonymous**.
4. Guarda.

### 5. Copiar firebaseConfig

Abre `firebase-config.js` y reemplaza únicamente este objeto:

```js
export const firebaseConfig = {
  apiKey: "REEMPLAZA_CON_TU_API_KEY",
  authDomain: "REEMPLAZA_CON_TU_AUTH_DOMAIN",
  databaseURL: "REEMPLAZA_CON_TU_DATABASE_URL",
  projectId: "REEMPLAZA_CON_TU_PROJECT_ID",
  storageBucket: "REEMPLAZA_CON_TU_STORAGE_BUCKET",
  messagingSenderId: "REEMPLAZA_CON_TU_MESSAGING_SENDER_ID",
  appId: "REEMPLAZA_CON_TU_APP_ID"
};
```

No cambies los imports si vas a usar GitHub Pages.

---

## Reglas de Firebase Realtime Database

### Opción rápida para prueba interna

Úsala solo para ensayos cerrados. Permite que cualquier usuario autenticado anónimo lea y escriba en salas.

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

### Opción recomendada para evento

Esta versión permite:

- Cualquier usuario autenticado anónimo puede leer la sala.
- Cualquier usuario autenticado anónimo puede registrarse como participante en su propio `uid`.
- Solo el host creador de la sala puede cambiar `currentCue`, `bpm`, `activity`, `mode` y `metronome`.

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null && !data.exists() && newData.child('hostUid').val() === auth.uid",

        "title": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "hostUid": {
          ".write": false
        },
        "createdAt": {
          ".write": false
        },
        "createdAtClient": {
          ".write": false
        },
        "updatedAt": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "updatedAtClient": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },

        "activity": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isString() && (newData.val() === 'tdcau_body_groove' || newData.val() === 'beat_challenge' || newData.val() === 'groove_machine')"
        },
        "mode": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isString() && (newData.val() === 'rehearsal' || newData.val() === 'show')"
        },
        "bpm": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isNumber() && newData.val() >= 40 && newData.val() <= 240"
        },

        "currentCue": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.hasChildren(['type', 'message', 'subMessage', 'participantStatus', 'updatedAtClient'])"
        },

        "metronome": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.hasChildren(['enabled', 'bpm', 'subdivision', 'accentEvery']) && newData.child('bpm').isNumber() && newData.child('bpm').val() >= 40 && newData.child('bpm').val() <= 240"
        },

        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid",
            ".validate": "newData.hasChildren(['uid', 'name', 'group', 'joinedAtClient', 'lastSeenClient']) && newData.child('uid').val() === auth.uid && newData.child('name').isString() && newData.child('name').val().length <= 32 && newData.child('group').isNumber() && newData.child('group').val() >= 1 && newData.child('group').val() <= 5"
          }
        }
      }
    }
  }
}
```

Importante: con reglas seguras, el host queda ligado al `uid` anónimo del navegador donde se creó la sala. Si abres el host en otro navegador, Firebase puede bloquear los cambios porque será otro usuario anónimo.

Para el evento, abre la sala desde el computador del host y no borres datos del navegador durante la jornada. La tecnología, tan avanzada, todavía depende de no tocar el botón equivocado.

---

## Cómo crear la sala

1. Publica la app.
2. Abre:

```txt
?host=1&room=MJ30
```

Agrégalo al final de la URL pública que te dé GitHub Pages.

3. Si la sala no existe, se crea automáticamente.
4. Deja ese navegador como host principal.

---

## Cómo entrar como participante

Abre:

```txt
?room=MJ30
```

La persona verá la pantalla de ingreso, podrá escribir su nombre y elegir grupo o dejar automático.

---

## Crear QR para participantes

Usa la URL pública de GitHub Pages con este parámetro al final:

```txt
?room=MJ30
```

Puedes crear el QR con cualquier generador confiable de QR o desde Canva.

Recomendación para el afiche:

```txt
Escanea y únete a la sala rítmica Musicala
Código: MJ30
```

---

## Cambiar patrones

Edita `rhythms.js`.

Cada grupo tiene esta estructura:

```js
{
  id: 1,
  name: "Pies",
  emoji: "👟",
  action: "Marca el pulso con los pies",
  pattern: "1 · 2 · 3 · 4",
  patternDetail: "Golpea el piso en cada tiempo...",
  steps16: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
}
```

`steps16` representa 16 semicorcheas en un compás de 4/4.

- `1` = golpe activo.
- `0` = silencio.

Ejemplo para palmas en 2 y 4:

```js
steps16: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
```

---

## Probar localmente

Por ser JavaScript modular, no abras `index.html` directamente con doble clic. Usa un servidor local.

Con Python:

```bash
python -m http.server 5500
```

Luego abre:

```txt
http://localhost:5500/?host=1&room=MJ30
```

Y en otro navegador o pestaña:

```txt
http://localhost:5500/?room=MJ30
```

---

## Subir a GitHub Pages

1. Crea un repositorio, por ejemplo:

```txt
sala-ritmica-mj
```

2. Sube todos los archivos a la raíz del repo.
3. En GitHub entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda.
6. Abre la URL pública de GitHub Pages.

Cuando GitHub Pages entregue la URL pública, usa estas variantes al final:

```txt
?host=1&room=MJ30
?room=MJ30
```

---

## Flujo sugerido para la actividad principal

1. Preparar
2. Entra Grupo 1
3. Entra Grupo 2
4. Entra Grupo 3
5. Entra Grupo 4
6. Entra Grupo 5
7. Todos juntos
8. Silencio
9. Corte final
10. Pose MJ

Patrones principales:

| Grupo | Acción | Patrón |
|---|---|---|
| 1 · Pies | Marca el pulso | 1 · 2 · 3 · 4 |
| 2 · Palmas | Aplaude | 2 y 4 |
| 3 · Piernas | Golpea suave | 1 y 3 |
| 4 · Mesa / vaso | Golpes cortos | 1 · y · 3 · y |
| 5 · Voz | Grita | ¡Hey! en el 4 |

---

## Notas de producción

- No usa backend propio.
- No usa Node en producción.
- No usa frameworks pesados.
- Usa Firebase Authentication anónima.
- Usa Firebase Realtime Database.
- El metrónomo es visual y local para el host, no sincroniza audio.
- La sincronización importante es el `currentCue` en Realtime Database.
- La app está pensada para celular, con botones grandes y textos legibles.
- El archivo `logo.png` es opcional. Si lo pones en la raíz del proyecto, la app lo muestra automáticamente.


---

## Solución de errores de audio y pulso

### El beat no suena

1. Toca **Activar audio**.
2. Sube el volumen del beat.
3. Revisa que el navegador no esté bloqueando audio.
4. Si los samples no cargan, la app debe usar fallback sintético.

### La pista local no carga

Revisa que exista exactamente:

```txt
assets/audio/pista-evento.mp3
```

También puedes usar `.wav`, `.ogg` o `.m4a`, pero si cambias el nombre debes cargarlo por URL directa o ajustar el código.

### Una URL de audio no carga

Causas comunes:

- No es una URL directa a archivo.
- El servidor bloquea CORS.
- El archivo requiere permisos.
- Es una página de reproducción y no un audio real.

Solución práctica: descarga/sube el archivo permitido al proyecto en `assets/audio/` y úsalo localmente.

### El pulso no aparece en participantes

1. Abre el host.
2. Toca **Activar pulso público**.
3. Revisa que los participantes estén conectados a la misma sala.
4. Revisa reglas de Realtime Database para permitir lectura de `rooms/{roomCode}/metronome`.

### El BPM no cambia en participantes

Revisa que el host sea el dueño de la sala. Con reglas seguras, solo el navegador que creó la sala puede cambiar `bpm` y `metronome`.

---

## Caja de ritmos en vivo

Esta versión agrega una **Caja de ritmos en vivo** al panel host, inspirada en el secuenciador Musicala.

El host puede editar una matriz de **5 filas x 16 pasos**:

```txt
              1 e & a | 2 e & a | 3 e & a | 4 e & a
Pies          □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
Palmas        □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
Piernas       □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
Mesa / vaso   □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
Voz / grito   □ □ □ □ | □ □ □ □ | □ □ □ □ | □ □ □ □
```

Cada celda puede activarse o desactivarse desde el host. Un mismo paso puede tener varios grupos al tiempo, por ejemplo:

```txt
Paso 1: Pies + Mesa
Paso 5: Palmas
Paso 9: Piernas
Paso 13: Voz
```

La fuente de verdad está en Firebase:

```txt
rooms/{roomCode}/patterns/{groupId}/steps
```

Los participantes **no editan**. Cada participante ve únicamente el patrón de su grupo, y la fila de 16 pasos se actualiza en tiempo real cuando el host hace cambios. Sí, por fin algo sincronizado sin tener que gritar “¿ya les salió?” treinta veces.

### Presets de patrones

El host puede aplicar estos presets:

- **Base corporal estadio**: patrón principal de la dinámica.
- **Conteo simple**: entradas básicas para ensayo.
- **Estadio intenso**: patrón más cargado para show.
- **Vacío**: limpia todos los pasos.

### Editor rápido por tiempos

Además de la matriz completa, hay un editor rápido por tiempos:

```txt
Tiempo 1 → paso 1
Tiempo 2 → paso 5
Tiempo 3 → paso 9
Tiempo 4 → paso 13
```

Desde ahí el host puede crear combinaciones como:

```txt
Tiempo 1: Pies
Tiempo 2: Palmas
Tiempo 3: Piernas
Tiempo 4: Voz
```

Botones disponibles:

- **Aplicar combinación**: modifica solo los tiempos 1, 2, 3 y 4, sin borrar pasos intermedios.
- **Aplicar y limpiar intermedios**: deja solo los tiempos principales y borra los demás pasos.
- **Limpiar todo**: deja todos los grupos en silencio.
- **Restaurar base**: vuelve al patrón principal.

### Fuente del beat

En **Audio del evento**, el host ahora puede elegir:

- **Preset de audio**: usa los presets internos del motor de audio.
- **Caja de ritmos en vivo**: el beat del host reproduce la matriz editable.

Asignación sonora de la caja en vivo:

```txt
Grupo 1 / Pies        → Kick / stomp
Grupo 2 / Palmas      → Snare / clap
Grupo 3 / Piernas     → Golpe corporal / mesa
Grupo 4 / Mesa / vaso → Click / platillo suave
Grupo 5 / Voz         → Acento sintético
```

El audio sigue sonando **solo en el dispositivo del host**.

---

## Reglas de Firebase actualizadas para patterns

Para pruebas rápidas, puedes usar:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

Para una versión más segura de evento, agrega permisos específicos para `patterns`:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null && !data.exists() && newData.child('hostUid').val() === auth.uid",

        "activity": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "mode": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "bpm": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "currentCue": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "metronome": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "patterns": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    }
  }
}
```

Si aparece `permission_denied` al editar la caja de ritmos, el problema casi seguro está en las reglas de `patterns`. Firebase, ese portero que no deja pasar ni al baterista si no está en lista.

---

## Nombre visible vs código de sala

La app ahora separa dos conceptos que antes estaban mezclados:

```txt
Código de sala: MJ30
Nombre visible: Salvémoslos del Reggaetón · Especial Michael Jackson
```

### Código de sala

Es el identificador técnico usado en la URL y en Firebase:

```txt
index.html?host=1&room=MJ30
index.html?room=MJ30
rooms/MJ30
```

Cambiar el código de sala **abre o crea otra sala**. No se recomienda cambiarlo durante una sesión en vivo porque el QR de los participantes tendría que cambiar también. Qué sorpresa, incluso un QR tiene problemas de mudanza.

### Nombre visible

Es el título que se muestra en host y participantes. Se guarda en:

```txt
rooms/{roomCode}/title
```

Puede cambiarse desde el panel host sin afectar el QR ni sacar a nadie de la sala.

### Configuración en el host

En el panel host existe una sección llamada **Configuración de sala** con:

- Código actual de sala.
- Campo editable de nombre visible.
- Botón **Guardar nombre**.
- Campo para abrir otra sala por código.

### Normalización del código de sala

El código de sala conserva letras y números. Por ejemplo:

```txt
MJ30 → MJ30
```

No debe convertirse en `MJ0`. Si eso aparece en consola, hay que revisar que la URL tenga realmente `?room=MJ30` y que no haya una versión vieja del archivo en caché.

---

## Reglas recomendadas de desarrollo

Mientras estás construyendo y probando, puedes usar reglas abiertas para usuarios autenticados anónimos:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null",
        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    }
  }
}
```

Estas reglas son cómodas para desarrollo, no son las más finas para evento real. Básicamente dejan entrar al equipo técnico sin pedir cédula, que para probar sirve, para producción da sustico.

---

## Reglas recomendadas para evento

Estas reglas permiten:

- Leer la sala a cualquier usuario autenticado anónimo.
- Crear una sala nueva si el `hostUid` coincide con el usuario que la crea.
- Permitir al host escribir `title`, `activity`, `mode`, `bpm`, `currentCue`, `metronome` y `patterns`.
- Permitir que cada participante escriba solo su propio nodo.

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null && !data.exists() && newData.child('hostUid').val() === auth.uid",

        "title": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isString() && newData.val().length <= 80"
        },
        "activity": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "mode": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "bpm": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid",
          ".validate": "newData.isNumber() && newData.val() >= 40 && newData.val() <= 240"
        },
        "currentCue": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "metronome": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "patterns": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "updatedAt": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "updatedAtClient": {
          ".write": "auth != null && root.child('rooms').child($roomCode).child('hostUid').val() === auth.uid"
        },
        "participants": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    }
  }
}
```

### Nota sobre `permission_denied`

En esta versión el código evita escribir cambios parciales directamente en:

```txt
rooms/{roomCode}
```

Para evitar bloqueos por reglas segmentadas, ahora escribe directamente en rutas específicas como:

```txt
rooms/{roomCode}/patterns
rooms/{roomCode}/metronome
rooms/{roomCode}/currentCue
rooms/{roomCode}/title
rooms/{roomCode}/bpm
```

Si todavía aparece `permission_denied`, revisa dos cosas:

1. Que la sala haya sido creada por el mismo navegador que está usando el host.
2. Que el nodo `rooms/{roomCode}/hostUid` coincida con el `auth.uid` actual.

Si cambiaste de navegador, borraste caché o pasaste de localhost a GitHub Pages, puede que tengas otro usuario anónimo. En ese caso, borra la sala de prueba y créala de nuevo desde el host.

---

## Actualización: BPM maestro unido a beat, pista y pulso

Esta versión usa un solo **BPM maestro** para todo:

- Beat generado por código.
- Pista cargada localmente o por URL directa.
- Pulso visual del host.
- Pulso visual de participantes.
- Cursor de 16 pasos de la caja de ritmos.

Cuando cambias el BPM desde el host, la app actualiza:

```txt
rooms/{roomCode}/bpm
rooms/{roomCode}/metronome/bpm
AudioEngine.setBpm(bpm)
playbackRate de la pista cargada
```

Si hay audio sonando y cambias el BPM, la app reinicia el reloj visual para evitar que el público quede viendo un tiempo que ya no corresponde. Porque tener tres tempos distintos en una dinámica rítmica sería básicamente inventar el tráfico de Bogotá, pero musical.

### Pistas y BPM

Las pistas cargadas tienen un **BPM base**. La app usa ese BPM base para calcular la velocidad de reproducción:

```txt
playbackRate = BPM maestro / BPM base de la pista
```

Ejemplo:

```txt
Pista base: 96 BPM
BPM maestro: 104 BPM
playbackRate: 1.08x aprox.
```

Para pistas locales (`assets/audio/pista-evento.mp3`), la app toma como BPM base el BPM actual al momento de cargarla. Para pistas demo, usa el `bpm` definido en `demo-tracks.js`.

### Al iniciar audio

Cuando el host toca **Reproducir beat** o **Reproducir pista**:

1. El audio arranca desde el inicio.
2. Se activa `rooms/{roomCode}/metronome`.
3. Se reinicia `startedAt`.
4. Los participantes ven el pulso desde el tiempo 1.

### Al pausar o detener audio

Cuando el host pausa o detiene el beat o la pista:

1. El audio se detiene o pausa.
2. Si ya no queda ningún audio sonando, el pulso público se apaga.
3. El metrónomo se reinicia internamente para que la próxima reproducción vuelva a arrancar desde tiempo 1.

---

## Si sigue apareciendo `permission_denied` al editar

La app ya escribe los patrones directamente en rutas específicas:

```txt
rooms/{roomCode}/patterns/{groupId}
rooms/{roomCode}/patterns
```

Si todavía aparece `permission_denied`, el problema casi seguro está en Firebase, no en la celda del secuenciador.

Durante desarrollo usa estas reglas temporales:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

Luego borra la sala vieja en:

```txt
Realtime Database → Data → rooms → MJ30 → Delete
```

Y vuelve a abrir:

```txt
index.html?host=1&room=MJ30
```

Si la sala ya tiene un `hostUid` viejo, también puedes probar el botón:

```txt
Tomar control en desarrollo
```

Ese botón solo funciona con reglas abiertas de desarrollo. Con reglas seguras, Firebase no permite cambiar el `hostUid`, porque aparentemente hasta una caja de ritmos necesita seguridad de aeropuerto.

```

