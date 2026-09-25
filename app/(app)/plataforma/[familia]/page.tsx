import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AddGameButton } from "@/components/games/add-game-button";
import { GamesView } from "@/components/games/games-view";
import { PageHeader } from "@/components/page-header";
import { parseFilters } from "@/lib/filters";
import { FAMILY_META, PLATFORM_SHORT_LABELS, isFamily, platformsOfFamily } from "@/lib/platforms";
import { requireUser } from "@/lib/session";

const DESCRIPTIONS = {
  pc: "Mouse, teclado e mods infinitos.",
  xbox: "Do Xbox original ao Series X|S.",
  playstation: "Do PS1 ao PS5 — a linhagem Sony, portáteis incluídos.",
  nintendo: "Do NES ao Switch 2, com todos os portáteis.",
  sega: "Do Master System ao Dreamcast — a era de ouro da Sega.",
  mobile: "iOS e Android — a jogatina que cabe no bolso.",
} as const;

export async function generateMetadata(props: PageProps<"/plataforma/[familia]">): Promise<Metadata> {
  const { familia } = await props.params;
  return { title: isFamily(familia) ? FAMILY_META[familia].label : "Plataforma" };
}

export default async function FamilyPage(props: PageProps<"/plataforma/[familia]">) {
  const { familia } = await props.params;
  if (!isFamily(familia)) notFound();

  const user = await requireUser();
  const searchParams = await props.searchParams;
  const filters = parseFilters(searchParams, familia);
  const meta = FAMILY_META[familia];
  const platforms = platformsOfFamily(familia);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-25 blur-3xl"
        style={{ background: `radial-gradient(40rem 12rem at 20% 0%, ${meta.color}, transparent 70%)` }}
      />
      <PageHeader
        eyebrow={
          platforms.length === 1
            ? "Master Race"
            : platforms.length === 2
              ? platforms.map((p) => PLATFORM_SHORT_LABELS[p]).join(" · ")
              : `${PLATFORM_SHORT_LABELS[platforms[0]!]} → ${PLATFORM_SHORT_LABELS[platforms.at(-1)!]} · ${platforms.length} consoles`
        }
        accent={meta.color}
        title={meta.label}
        description={DESCRIPTIONS[familia]}
        actions={<AddGameButton defaultPlatform={filters.platform ?? platforms[0]} />}
      />
      <GamesView
        userId={user.id}
        filters={filters}
        family={familia}
        pathname={`/plataforma/${familia}`}
        searchParams={searchParams}
      />
    </>
  );
}
