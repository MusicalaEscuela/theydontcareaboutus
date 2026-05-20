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
