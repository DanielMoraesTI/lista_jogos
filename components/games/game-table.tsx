import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Game } from "@/db/schema";
import { formatDateTime, formatHours, formatIsoDate, timeAgo } from "@/lib/format";

import { PlatformBadge, RatingBadge, StatusBadge } from "./badges";
import { GameActions, TimeWithTooltip } from "./game-actions";

/** Modo tabela: mais denso, ideal para coleções grandes. Exibido apenas em telas >= 1024px. */
export function GameTable({ games }: { games: Game[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card/80">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-48 pl-4">Jogo</TableHead>
            <TableHead>Plataforma</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Nota</TableHead>
            <TableHead className="text-right">Horas</TableHead>
            <TableHead>Concluído em</TableHead>
            <TableHead>Atualizado</TableHead>
            <TableHead className="w-24 pr-4 text-right">
              <span className="sr-only">Ações</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell className="max-w-80 pl-4">
                <p className="truncate font-medium" title={game.title}>
                  {game.title}
                </p>
                {game.comment && (
                  <p className="truncate text-xs text-muted-foreground italic">
                    “{game.comment}”
                  </p>
                )}
              </TableCell>
              <TableCell>
                <PlatformBadge platform={game.platform} short />
              </TableCell>
              <TableCell>
                <StatusBadge status={game.status} />
              </TableCell>
              <TableCell className="text-right">
                <RatingBadge rating={game.rating} className="justify-end" />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatHours(game.hoursPlayed)}
              </TableCell>
              <TableCell>
                {formatIsoDate(game.completedAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <TimeWithTooltip
                  label={timeAgo(game.updatedAt)}
                  full={formatDateTime(game.updatedAt)}
                />
              </TableCell>
              <TableCell className="pr-4">
                <div className="flex justify-end">
                  <GameActions game={game} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
