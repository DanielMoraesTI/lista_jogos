"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Game } from "@/db/schema";

import { DeleteGameDialog } from "./delete-game-dialog";
import { GameFormDialog } from "./game-form-dialog";

/** Ações rápidas de um jogo: editar (modal preenchido) e excluir (com confirmação). */
export function GameActions({ game }: { game: Game }) {
  return (
    <div className="flex items-center gap-1">
      <GameFormDialog
        game={game}
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Editar ${game.title}`}>
            <Pencil />
          </Button>
        }
      />
      <DeleteGameDialog
        id={game.id}
        title={game.title}
        trigger={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Excluir ${game.title}`}
          >
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}

/** Texto relativo ("há 2 dias") com tooltip mostrando a data completa. */
export function TimeWithTooltip({ label, full }: { label: string; full: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default" suppressHydrationWarning>
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent>{full}</TooltipContent>
    </Tooltip>
  );
}
