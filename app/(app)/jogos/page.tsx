import type { Metadata } from "next";

import { AddGameButton } from "@/components/games/add-game-button";
import { GamesView } from "@/components/games/games-view";
import { PageHeader } from "@/components/page-header";
import { parseFilters } from "@/lib/filters";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Meus Jogos" };

export default async function MyGamesPage(props: PageProps<"/jogos">) {
  const user = await requireUser();
  const searchParams = await props.searchParams;
  const filters = parseFilters(searchParams);

  return (
    <>
      <PageHeader
        eyebrow="Inventário"
        title="Meus Jogos"
        description="Toda a sua coleção, com busca, filtros e exportação."
        actions={<AddGameButton defaultPlatform={filters.platform ?? undefined} />}
      />
      <GamesView userId={user.id} filters={filters} pathname="/jogos" searchParams={searchParams} />
    </>
  );
}
