import "server-only";

import { fetchRawgCover, type CoverHints } from "./rawg-core";

/** Capa do jogo via RAWG; opcional (sem RAWG_API_KEY, retorna null). */
export async function findCoverUrl(title: string, hints: CoverHints = {}): Promise<string | null> {
  const result = await fetchRawgCover(title, process.env.RAWG_API_KEY, hints);
  return result?.url ?? null;
}

export const rawgEnabled = () => Boolean(process.env.RAWG_API_KEY);
