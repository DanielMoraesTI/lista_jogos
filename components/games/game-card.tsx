import { CalendarCheck, Clock, History } from "lucide-react";

import type { Game } from "@/db/schema";
import { formatDateTime, formatHours, formatIsoDate, timeAgo, wasEdited } from "@/lib/format";

import { PlatformBadge, RatingBadge, StatusBadge } from "./badges";
import { GameActions, TimeWithTooltip } from "./game-actions";
import { GameCover } from "./game-cover";

export function GameCard({ game }: { game: Game }) {
  const edited = wasEdited(game.createdAt, game.updatedAt);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card/80 transition-all duration-300 hover:-translate-y-0.5 hover:glow motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative overflow-hidden">
        <GameCover
          title={game.title}
          platform={game.platform}
          coverUrl={game.coverUrl}
          className="aspect-[21/9] transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none sm:aspect-video"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card to-transparent" />
        <div className="absolute top-2 left-2">
          <PlatformBadge platform={game.platform} className="bg-background/80 backdrop-blur" />
        </div>
        <div className="absolute top-2 right-2">
          <StatusBadge status={game.status} className="bg-background/80 backdrop-blur" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 pt-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="line-clamp-2 font-heading text-base leading-snug font-semibold"
            title={game.title}
          >
            {game.title}
          </h3>
          <RatingBadge rating={game.rating} className="shrink-0 text-lg" />
        </div>

        {game.comment && (
          <p className="line-clamp-2 text-sm text-muted-foreground italic">“{game.comment}”</p>
        )}

        <dl className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Horas jogadas</dt>
            <Clock className="size-3.5" aria-hidden />
            <dd className="tabular-nums">{formatHours(game.hoursPlayed)}</dd>
          </div>
          {game.completedAt && (
            <div className="flex items-center gap-1">
              <dt className="sr-only">Concluído em</dt>
              <CalendarCheck className="size-3.5" aria-hidden />
              <dd>{formatIsoDate(game.completedAt)}</dd>
            </div>
          )}
        </dl>

        <div className="flex items-center justify-between gap-2 border-t pt-2">
          <p className="flex min-w-0 items-center gap-1 truncate text-xs text-muted-foreground">
            <History className="size-3.5 shrink-0" aria-hidden />
            <TimeWithTooltip
              label={`${edited ? "editado" : "adicionado"} ${timeAgo(edited ? game.updatedAt : game.createdAt)}`}
              full={`Criado em ${formatDateTime(game.createdAt)} · Atualizado em ${formatDateTime(game.updatedAt)}`}
            />
          </p>
          <GameActions game={game} />
        </div>
      </div>
    </article>
  );
}
