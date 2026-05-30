// ============================================================
// utils.js
// Utilidades puras compartidas entre todos los módulos UI.
// Sin dependencias de Firebase ni de estado de la app.
// ============================================================

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

// Renderiza palabras del canto con iluminación progresiva.
// progress: 0–1 (fracción de palabras iluminadas), -1 = ninguna.
export function renderChantWords(text, progress = -1) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const litCount = progress >= 0 ? Math.ceil(Math.min(1, progress) * words.length) : 0;
  return words
    .map((word, index) => `<span class="${index < litCount ? "is-lit" : ""}">${escapeHtml(word)}</span>`)
    .join(" ");
}

// URL base de la experiencia pública (GitHub Pages).
export const PARTICIPANT_BASE_URL = "https://musicalaescuela.github.io/theydontcareaboutus";

export function buildParticipantUrl(roomCode) {
  const url = new URL(PARTICIPANT_BASE_URL);
  url.searchParams.set("room", roomCode);
  return url.toString();
}

export function buildQrImageUrl(roomCode) {
  const participantUrl = buildParticipantUrl(roomCode);
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(participantUrl)}&ecc=M&margin=4&color=000000&bgcolor=ffffff`;
}
