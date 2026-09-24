/**
 * Filtros da listagem, lidos da URL. O mesmo parser é usado pelas páginas e
 * pela rota de exportação, garantindo que "exportar o filtro atual" exporte
 * exatamente o que está na tela.
 */
import {
  GAME_STATUSES,
  isFamily,
  isPlatform,
  platformFamily,
  type Family,
  type GameStatus,
  type Platform,
} from "@/lib/platforms";

export const SORT_OPTIONS = [
  { value: "created", label: "Data de cadastro" },
  { value: "updated", label: "Última edição" },
  { value: "title", label: "Nome" },
  { value: "rating", label: "Nota" },
  { value: "hours", label: "Horas jogadas" },
  { value: "completed", label: "Data de conclusão" },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]["value"];
export type SortDir = "asc" | "desc";
export type ViewMode = "cards" | "table";

export type GameFilters = {
  q: string;
  status: GameStatus | null;
  platform: Platform | null;
  sort: SortKey;
  dir: SortDir;
  page: number;
  view: ViewMode;
};

export const PAGE_SIZE = 24;

type RawParams = Record<string, string | string[] | undefined> | URLSearchParams;

function read(params: RawParams, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

/** Direção padrão mais útil para cada ordenação. */
export function defaultDir(sort: SortKey): SortDir {
  return sort === "title" ? "asc" : "desc";
}

export function parseFilters(params: RawParams, family?: Family): GameFilters {
  const q = (read(params, "q") ?? "").trim().slice(0, 100);

  const rawStatus = read(params, "status");
  const status = GAME_STATUSES.find((s) => s === rawStatus) ?? null;

  const rawPlatform = read(params, "platform") ?? "";
  let platform: Platform | null = isPlatform(rawPlatform) ? rawPlatform : null;
  // Na página de uma família, ignora plataformas de outras famílias.
  if (platform && family && platformFamily(platform) !== family) platform = null;

  const rawSort = read(params, "sort");
  const sort = SORT_OPTIONS.find((o) => o.value === rawSort)?.value ?? "created";

  const rawDir = read(params, "dir");
  const dir: SortDir = rawDir === "asc" || rawDir === "desc" ? rawDir : defaultDir(sort);

  const page = Math.max(1, Math.min(10_000, Number.parseInt(read(params, "page") ?? "1", 10) || 1));
  const view: ViewMode = read(params, "view") === "table" ? "table" : "cards";

  return { q, status, platform, sort, dir, page, view };
}

/** Lê o parâmetro `family` (usado pela exportação). */
export function parseFamily(params: RawParams): Family | null {
  const value = read(params, "family") ?? "";
  return isFamily(value) ? value : null;
}
