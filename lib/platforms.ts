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
  "PS2",
  "PS3",
  "PS4",
  "PS5",
  "N64",
  "WII",
  "WII_U",
  "SWITCH",
  "SWITCH_2",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const FAMILIES = ["pc", "xbox", "playstation", "nintendo"] as const;
export type Family = (typeof FAMILIES)[number];

export const GAME_STATUSES = ["completed", "playing", "backlog"] as const;
export type GameStatus = (typeof GAME_STATUSES)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  PC: "PC",
  XBOX: "Xbox",
  XBOX_360: "Xbox 360",
  XBOX_ONE: "Xbox One",
  XBOX_SERIES: "Xbox Series X|S",
  PS2: "PlayStation 2",
  PS3: "PlayStation 3",
  PS4: "PlayStation 4",
  PS5: "PlayStation 5",
  N64: "Nintendo 64",
  WII: "Wii",
  WII_U: "Wii U",
  SWITCH: "Switch",
  SWITCH_2: "Switch 2",
};

/** Rótulo curto para chips e badges em telas pequenas. */
export const PLATFORM_SHORT_LABELS: Record<Platform, string> = {
  PC: "PC",
  XBOX: "Xbox",
  XBOX_360: "360",
  XBOX_ONE: "One",
  XBOX_SERIES: "Series",
  PS2: "PS2",
  PS3: "PS3",
  PS4: "PS4",
  PS5: "PS5",
  N64: "N64",
  WII: "Wii",
  WII_U: "Wii U",
  SWITCH: "Switch",
  SWITCH_2: "Switch 2",
};

const PLATFORM_FAMILY: Record<Platform, Family> = {
  PC: "pc",
  XBOX: "xbox",
  XBOX_360: "xbox",
  XBOX_ONE: "xbox",
  XBOX_SERIES: "xbox",
  PS2: "playstation",
  PS3: "playstation",
  PS4: "playstation",
  PS5: "playstation",
  N64: "nintendo",
  WII: "nintendo",
  WII_U: "nintendo",
  SWITCH: "nintendo",
  SWITCH_2: "nintendo",
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
  PS2: "#1d4ed8",
  PS3: "#2563eb",
  PS4: "#3b82f6",
  PS5: "#60a5fa",
  N64: "#b91c1c",
  WII: "#dc2626",
  WII_U: "#ef4444",
  SWITCH: "#f87171",
  SWITCH_2: "#fca5a5",
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
