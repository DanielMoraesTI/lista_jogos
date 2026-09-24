import { Ghost } from "lucide-react";

import { ExportMenu } from "@/components/export/export-menu";
import type { GameFilters } from "@/lib/filters";
import { platformsOfFamily, type Family } from "@/lib/platforms";
import { getGamesPage, getPlatformCounts } from "@/lib/queries";
import { cn } from "@/lib/utils";

import { AddGameButton } from "./add-game-button";
import { FiltersBar } from "./filters-bar";
import { GameCard } from "./game-card";
import { GameTable } from "./game-table";
import { GamesPagination } from "./games-pagination";

/**
 * Listagem completa (filtros + cards/tabela + paginação + exportação),
 * compartilhada por "Meus Jogos" e pelas páginas de plataforma.
 */
export async function GamesView({
  userId,
  filters,
  family,
  pathname,
  searchParams,
}: {
  userId: string;
  filters: GameFilters;
  family?: Family;
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [{ items, total, page, pageCount }, platformCounts] = await Promise.all([
    getGamesPage(userId, filters, family),
    getPlatformCounts(userId, family),
  ]);

  const defaultPlatform = filters.platform ?? (family ? platformsOfFamily(family)[0] : undefined);
  const hasFilters = Boolean(filters.q || filters.status || filters.platform);

  return (
    <div className="flex flex-col gap-6">
      <FiltersBar filters={filters} family={family} platformCounts={platformCounts} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {total === 0
            ? "Nenhum jogo encontrado"
            : `${total} ${total === 1 ? "jogo" : "jogos"}${pageCount > 1 ? ` · página ${page} de ${pageCount}` : ""}`}
        </p>
        <ExportMenu family={family} filters={filters} hasFilters={hasFilters} disabled={total === 0 && !hasFilters} />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-card/40 px-6 py-16 text-center">
          <Ghost className="size-12 text-muted-foreground" aria-hidden />
          <div>
            <p className="font-heading text-lg font-semibold">
              {hasFilters ? "Nada por aqui com esses filtros" : "Sua coleção está vazia"}
            </p>
            <p className="text-sm text-muted-foreground">
              {hasFilters
                ? "Tente ajustar a busca ou limpar os filtros."
                : "Adicione o primeiro jogo e comece a registrar sua jornada."}
            </p>
          </div>
          {!hasFilters && <AddGameButton defaultPlatform={defaultPlatform} />}
        </div>
      ) : (
        <>
          {/* Tabela só a partir de 1024px, onde cabe inteira; abaixo disso, sempre cards. */}
          {filters.view === "table" && (
            <div className="hidden lg:block">
              <GameTable games={items} />
            </div>
          )}
          <ul
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
              filters.view === "table" && "lg:hidden",
            )}
          >
            {items.map((game) => (
              <li key={game.id}>
                <GameCard game={game} />
              </li>
            ))}
          </ul>
        </>
      )}

      <GamesPagination page={page} pageCount={pageCount} pathname={pathname} searchParams={searchParams} />
    </div>
  );
}
