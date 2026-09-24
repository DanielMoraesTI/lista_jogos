import { PlatformBadge, RatingBadge, StatusBadge } from "@/components/games/badges";
import { GameActions, TimeWithTooltip } from "@/components/games/game-actions";
import { GameCover } from "@/components/games/game-cover";
import type { Game } from "@/db/schema";
import { formatDateTime, formatHours, timeAgo } from "@/lib/format";

/** Últimos jogos cadastrados em mini-cards horizontais. */
export function RecentGames({ games }: { games: Game[] }) {
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2">
      {games.map((game, index) => (
        <li
          key={game.id}
          className="group flex min-w-0 items-center gap-2 rounded-xl border bg-card/70 p-2 pr-2 transition-colors hover:border-primary/40 sm:gap-3 sm:pr-3"
        >
          <span className="hidden w-5 shrink-0 text-center font-pixel text-[9px] text-muted-foreground sm:block" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
          <GameCover
            title={game.title}
            platform={game.platform}
            coverUrl={game.coverUrl}
            className="aspect-4/3 w-16 shrink-0 rounded-lg [&_span]:text-xs sm:w-20"
            sizes="80px"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate font-medium" title={game.title}>
              {game.title}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <PlatformBadge platform={game.platform} short />
              <StatusBadge status={game.status} className="hidden sm:inline-flex" />
            </div>
            <p className="text-xs text-muted-foreground">
              <TimeWithTooltip label={timeAgo(game.createdAt)} full={formatDateTime(game.createdAt)} />
              {" · "}
              <span className="tabular-nums">{formatHours(game.hoursPlayed)}</span>
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <RatingBadge rating={game.rating} className="text-sm" />
            <GameActions game={game} />
          </div>
        </li>
      ))}
    </ol>
  );
}
