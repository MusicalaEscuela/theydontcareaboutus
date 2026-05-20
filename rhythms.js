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
