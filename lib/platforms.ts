/**
 * Fonte única de verdade sobre plataformas, famílias e status.
 * Usada pelo schema do banco, validações, filtros, badges, gráficos e exportação.
 */

export const PLATFORMS = [
  "PC",
  "XBOX",
  "XBOX_360",
  "XBOX_ONE",
  "XBOX_SERIES",
  "PS1",
  "PS2",
  "PSP",
  "PS3",
  "PS_VITA",
  "PS4",
  "PS5",
  "NES",
  "GB",
  "SNES",
  "N64",
  "GBC",
  "GBA",
  "GAMECUBE",
  "NDS",
  "WII",
  "N3DS",
  "WII_U",
  "SWITCH",
  "SWITCH_2",
  "MASTER_SYSTEM",
  "MEGA_DRIVE",
  "SATURN",
  "DREAMCAST",
  "IOS",
  "ANDROID",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const FAMILIES = ["pc", "xbox", "playstation", "nintendo", "sega", "mobile"] as const;
export type Family = (typeof FAMILIES)[number];

export const GAME_STATUSES = ["completed", "playing", "backlog"] as const;
export type GameStatus = (typeof GAME_STATUSES)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  PC: "PC",
  XBOX: "Xbox",
  XBOX_360: "Xbox 360",
  XBOX_ONE: "Xbox One",
  XBOX_SERIES: "Xbox Series X|S",
  PS1: "PlayStation 1",
  PS2: "PlayStation 2",
  PSP: "PSP",
  PS3: "PlayStation 3",
  PS_VITA: "PS Vita",
  PS4: "PlayStation 4",
  PS5: "PlayStation 5",
  NES: "NES",
  GB: "Game Boy",
  SNES: "Super Nintendo",
  N64: "Nintendo 64",
  GBC: "Game Boy Color",
  GBA: "Game Boy Advance",
  GAMECUBE: "GameCube",
  NDS: "Nintendo DS",
  WII: "Wii",
  N3DS: "Nintendo 3DS",
  WII_U: "Wii U",
  SWITCH: "Switch",
  SWITCH_2: "Switch 2",
  MASTER_SYSTEM: "Master System",
  MEGA_DRIVE: "Mega Drive",
  SATURN: "Sega Saturn",
  DREAMCAST: "Dreamcast",
  IOS: "iOS",
  ANDROID: "Android",
};

/** Rótulo curto para chips e badges em telas pequenas. */
export const PLATFORM_SHORT_LABELS: Record<Platform, string> = {
  PC: "PC",
  XBOX: "Xbox",
  XBOX_360: "360",
  XBOX_ONE: "One",
  XBOX_SERIES: "Series",
  PS1: "PS1",
  PS2: "PS2",
  PSP: "PSP",
  PS3: "PS3",
  PS_VITA: "Vita",
  PS4: "PS4",
  PS5: "PS5",
  NES: "NES",
  GB: "GB",
  SNES: "SNES",
  N64: "N64",
  GBC: "GBC",
  GBA: "GBA",
  GAMECUBE: "GameCube",
  NDS: "DS",
  WII: "Wii",
  N3DS: "3DS",
  WII_U: "Wii U",
  SWITCH: "Switch",
  SWITCH_2: "Switch 2",
  MASTER_SYSTEM: "Master",
  MEGA_DRIVE: "Mega Drive",
  SATURN: "Saturn",
  DREAMCAST: "Dreamcast",
  IOS: "iOS",
  ANDROID: "Android",
};

const PLATFORM_FAMILY: Record<Platform, Family> = {
  PC: "pc",
  XBOX: "xbox",
  XBOX_360: "xbox",
  XBOX_ONE: "xbox",
  XBOX_SERIES: "xbox",
  PS1: "playstation",
  PS2: "playstation",
  PSP: "playstation",
  PS3: "playstation",
  PS_VITA: "playstation",
  PS4: "playstation",
  PS5: "playstation",
  NES: "nintendo",
  GB: "nintendo",
  SNES: "nintendo",
  N64: "nintendo",
  GBC: "nintendo",
  GBA: "nintendo",
  GAMECUBE: "nintendo",
  NDS: "nintendo",
  WII: "nintendo",
  N3DS: "nintendo",
  WII_U: "nintendo",
  SWITCH: "nintendo",
  SWITCH_2: "nintendo",
  MASTER_SYSTEM: "sega",
  MEGA_DRIVE: "sega",
  SATURN: "sega",
  DREAMCAST: "sega",
  IOS: "mobile",
  ANDROID: "mobile",
};

export function platformFamily(platform: Platform): Family {
  return PLATFORM_FAMILY[platform];
}

export function platformsOfFamily(family: Family): Platform[] {
  return PLATFORMS.filter((p) => PLATFORM_FAMILY[p] === family);
}

export type FamilyMeta = {
  label: string;
  /** Cor da marca (usada em gráficos e acentos). */
  color: string;
  /** Classes Tailwind para badges/chips, legíveis em temas claro e escuro. */
  badgeClass: string;
  /** Gradiente usado nas capas geradas. */
  gradient: string;
};

export const FAMILY_META: Record<Family, FamilyMeta> = {
  pc: {
    label: "PC",
    color: "#8b5cf6",
    badgeClass:
      "bg-violet-500/15 text-violet-700 ring-violet-500/30 dark:text-violet-300",
    gradient: "from-violet-600 via-purple-700 to-slate-900",
  },
  xbox: {
    label: "Xbox",
    color: "#16a34a",
    badgeClass:
      "bg-green-500/15 text-green-700 ring-green-500/30 dark:text-green-300",
    gradient: "from-green-500 via-emerald-700 to-slate-900",
  },
  playstation: {
    label: "PlayStation",
    color: "#2563eb",
    badgeClass:
      "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:text-blue-300",
    gradient: "from-blue-500 via-indigo-700 to-slate-900",
  },
  nintendo: {
    label: "Nintendo",
    color: "#dc2626",
    badgeClass: "bg-red-500/15 text-red-700 ring-red-500/30 dark:text-red-300",
    gradient: "from-red-500 via-rose-700 to-slate-900",
  },
  sega: {
    label: "Sega",
    color: "#0891b2",
    badgeClass: "bg-cyan-500/15 text-cyan-700 ring-cyan-500/30 dark:text-cyan-300",
    gradient: "from-cyan-500 via-sky-700 to-slate-900",
  },
  mobile: {
    label: "Mobile",
    color: "#d97706",
    badgeClass: "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:text-amber-300",
    gradient: "from-amber-500 via-orange-700 to-slate-900",
  },
};

/**
 * Cor fixa de cada console (usada no gráfico de rosca): degraus de
 * luminosidade da cor da família. A cor acompanha a plataforma, nunca a
 * posição no ranking, então um filtro não repinta as demais fatias.
 */
export const PLATFORM_COLORS: Record<Platform, string> = {
  PC: "#8b5cf6",
  XBOX: "#15803d",
  XBOX_360: "#16a34a",
  XBOX_ONE: "#22c55e",
  XBOX_SERIES: "#4ade80",
  PS1: "#1e3a8a",
  PS2: "#1d4ed8",
  PSP: "#4338ca",
  PS3: "#2563eb",
  PS_VITA: "#6366f1",
  PS4: "#3b82f6",
  PS5: "#60a5fa",
  NES: "#7f1d1d",
  GB: "#9a3412",
  SNES: "#991b1b",
  N64: "#b91c1c",
  GBC: "#c2410c",
  GBA: "#ea580c",
  GAMECUBE: "#be185d",
  NDS: "#db2777",
  WII: "#dc2626",
  N3DS: "#f472b6",
  WII_U: "#ef4444",
  SWITCH: "#f87171",
  SWITCH_2: "#fca5a5",
  MASTER_SYSTEM: "#155e75",
  MEGA_DRIVE: "#0e7490",
  SATURN: "#0891b2",
  DREAMCAST: "#22d3ee",
  IOS: "#d97706",
  ANDROID: "#fbbf24",
};

export function isFamily(value: string): value is Family {
  return (FAMILIES as readonly string[]).includes(value);
}

export function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value);
}

export const STATUS_META: Record<
  GameStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  completed: {
    label: "Concluído",
    badgeClass:
      "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
  playing: {
    label: "Jogando",
    badgeClass:
      "bg-amber-500/15 text-amber-700 ring-amber-500/30 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  backlog: {
    label: "Pretendo jogar",
    badgeClass:
      "bg-sky-500/15 text-sky-700 ring-sky-500/30 dark:text-sky-300",
    dotClass: "bg-sky-500",
  },
};
