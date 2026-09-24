import type { LucideIcon } from "lucide-react";

import { PlatformBadge, RatingBadge } from "@/components/games/badges";
import { GameCover } from "@/components/games/game-cover";
import type { Game } from "@/db/schema";
import { formatHours } from "@/lib/format";

/** Card especial com brilho para "mais jogado" / "melhor nota". */
export function HighlightCard({
  label,
  icon: Icon,
  game,
  metric,
  empty,
}: {
  label: string;
  icon: LucideIcon;
  game: Game | null;
  metric: "hours" | "rating";
  empty: string;
}) {
  return (
    <section className="glow relative overflow-hidden rounded-2xl border border-primary/30 bg-card">
      {game ? (
        <div className="grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <GameCover
            title={game.title}
            platform={game.platform}
            coverUrl={game.coverUrl}
            className="aspect-video sm:aspect-auto sm:h-full"
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
          />
          <div className="flex min-w-0 flex-col gap-3 p-5">
            <p className="flex items-center gap-2 font-pixel text-[9px] tracking-widest text-primary uppercase">
              <Icon className="size-4" aria-hidden />
              {label}
            </p>
            <h3 className="line-clamp-2 text-xl font-bold" title={game.title}>
              {game.title}
            </h3>
            <PlatformBadge platform={game.platform} className="w-fit" />
            <div className="mt-auto flex items-end justify-between gap-3">
              {metric === "hours" ? (
                <p className="font-heading text-3xl font-bold text-glow tabular-nums sm:text-4xl">
                  {formatHours(game.hoursPlayed)}
                </p>
              ) : (
                <RatingBadge rating={game.rating} className="text-3xl text-glow sm:text-4xl [&_svg]:size-7" />
              )}
              {metric === "hours" ? (
                <RatingBadge rating={game.rating} className="text-sm" />
              ) : (
                <span className="text-sm text-muted-foreground tabular-nums">{formatHours(game.hoursPlayed)}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-5">
          <p className="flex items-center gap-2 font-pixel text-[9px] tracking-widest text-primary uppercase">
            <Icon className="size-4" aria-hidden />
            {label}
          </p>
          <p className="text-sm text-muted-foreground">{empty}</p>
        </div>
      )}
    </section>
  );
}
