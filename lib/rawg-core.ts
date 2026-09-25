import type { Platform } from "./platforms";

type RawgGame = {
  name: string;
  released: string | null;
  background_image: string | null;
  platforms?: { platform: { slug: string } }[] | null;
};
type RawgSearchResponse = { results?: RawgGame[] };

/** Slug da plataforma na RAWG, usado para desempatar remakes/reboots. */
const RAWG_PLATFORM_SLUGS: Record<Platform, string[]> = {
  PC: ["pc"],
  XBOX: ["xbox-old"],
  XBOX_360: ["xbox360"],
  XBOX_ONE: ["xbox-one"],
  XBOX_SERIES: ["xbox-series-x"],
  PS1: ["playstation1"],
  PS2: ["playstation2"],
  PSP: ["psp"],
  PS3: ["playstation3"],
  PS_VITA: ["ps-vita"],
  PS4: ["playstation4"],
  PS5: ["playstation5"],
  NES: ["nes"],
  GB: ["game-boy"],
  SNES: ["snes"],
  N64: ["nintendo-64"],
  GBC: ["game-boy-color"],
  GBA: ["game-boy-advance"],
  GAMECUBE: ["gamecube"],
  NDS: ["nintendo-ds", "nintendo-dsi"],
  WII: ["wii"],
  N3DS: ["nintendo-3ds"],
  WII_U: ["wii-u"],
  SWITCH: ["nintendo-switch"],
  SWITCH_2: ["nintendo-switch-2", "nintendo-switch"],
  MASTER_SYSTEM: ["sega-master-system"],
  // Na RAWG o Mega Drive aparece com o nome americano (Genesis).
  MEGA_DRIVE: ["genesis"],
  SATURN: ["sega-saturn"],
  DREAMCAST: ["dreamcast"],
  IOS: ["ios"],
  ANDROID: ["android"],
};

export type CoverHints = {
  platform?: Platform;
  /** Data de conclusão (YYYY-MM-DD): o jogo não pode ter saído depois dela. */
  completedAt?: string | null;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s*\(\d{4}\)\s*$/, "") // "Fable (2004)" -> "fable"
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Entre os primeiros resultados da RAWG, escolhe o mais provável:
 * mesma plataforma > nome exato > lançado antes da conclusão.
 * Empates ficam com a ordem de relevância da própria RAWG.
 */
function pickBest(results: RawgGame[], title: string, hints: CoverHints): RawgGame | undefined {
  const wanted = normalize(title);
  const slugs = hints.platform ? RAWG_PLATFORM_SLUGS[hints.platform] : [];
  const completedYear = hints.completedAt ? Number(hints.completedAt.slice(0, 4)) : null;

  let best: RawgGame | undefined;
  let bestScore = -Infinity;
  for (const game of results) {
    if (!game.background_image) continue;
    let score = 0;
    const gameSlugs = game.platforms?.map((p) => p.platform.slug) ?? [];
    if (slugs.some((s) => gameSlugs.includes(s))) score += 4;
    if (normalize(game.name) === wanted) score += 2;
    const releasedYear = game.released ? Number(game.released.slice(0, 4)) : null;
    if (completedYear && releasedYear) score += releasedYear <= completedYear ? 1 : -3;
    if (score > bestScore) {
      best = game;
      bestScore = score;
    }
  }
  return best;
}

async function search(title: string, key: string, timeoutMs: number): Promise<RawgGame[] | null> {
  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", key);
  url.searchParams.set("search", title);
  url.searchParams.set("page_size", "5");
  url.searchParams.set("search_precise", "true");
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
    if (!response.ok) return null;
    return ((await response.json()) as RawgSearchResponse).results ?? [];
  } catch {
    return null;
  }
}

export type CoverResult = { url: string; matchedName: string; released: string | null };

/**
 * Busca a capa de um jogo na RAWG (https://rawg.io/apidocs).
 * Retorna null sem chave ou em qualquer falha, para nunca quebrar o cadastro.
 * Sem "server-only" para ser usado também pelo script `npm run db:covers`.
 */
export async function fetchRawgCover(
  title: string,
  key: string | undefined,
  hints: CoverHints = {},
  { timeoutMs = 4000, retries = 1 } = {},
): Promise<CoverResult | null> {
  if (!key) return null;

  let results: RawgGame[] | null = null;
  for (let attempt = 0; attempt <= retries && results === null; attempt++) {
    results = await search(title, key, timeoutMs);
  }
  const best = results && pickBest(results, title, hints);
  const image = best?.background_image;
  if (!best || !image || !image.startsWith("https://media.rawg.io/")) return null;

  return {
    // Versão recortada e mais leve da imagem, adequada para cards.
    url: image.replace("/media/games/", "/media/crop/600/400/games/"),
    matchedName: best.name,
    released: best.released,
  };
}
