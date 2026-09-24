import "server-only";

type RawgSearchResponse = {
  results?: { name: string; background_image: string | null }[];
};

/**
 * Busca a capa de um jogo na RAWG (https://rawg.io/apidocs).
 * Opcional: sem RAWG_API_KEY retorna null e os cards usam a capa gerada.
 * Qualquer falha (timeout, limite, rede) também retorna null, sem quebrar o cadastro.
 */
export async function findCoverUrl(title: string): Promise<string | null> {
  const key = process.env.RAWG_API_KEY;
  if (!key) return null;

  const url = new URL("https://api.rawg.io/api/games");
  url.searchParams.set("key", key);
  url.searchParams.set("search", title);
  url.searchParams.set("page_size", "1");
  url.searchParams.set("search_precise", "true");

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data = (await response.json()) as RawgSearchResponse;
    const image = data.results?.[0]?.background_image;
    if (!image || !image.startsWith("https://media.rawg.io/")) return null;

    // Versão recortada e mais leve da imagem, adequada para cards.
    return image.replace("/media/games/", "/media/crop/600/400/games/");
  } catch {
    return null;
  }
}
