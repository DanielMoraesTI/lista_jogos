"use client";

import { Bookmark, Gamepad2, Trophy } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { STATUS_META, type GameStatus } from "@/lib/platforms";
import { cn } from "@/lib/utils";

const ICONS = { completed: Trophy, playing: Gamepad2, backlog: Bookmark } as const;
const ACTIVE = {
  completed: "data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-600 dark:data-[state=on]:text-emerald-300 data-[state=on]:ring-emerald-500/50",
  playing: "data-[state=on]:bg-amber-500/15 data-[state=on]:text-amber-600 dark:data-[state=on]:text-amber-300 data-[state=on]:ring-amber-500/50",
  backlog: "data-[state=on]:bg-sky-500/15 data-[state=on]:text-sky-600 dark:data-[state=on]:text-sky-300 data-[state=on]:ring-sky-500/50",
} as const;

/** Controle segmentado visual para escolher o status do jogo. */
export function StatusToggle({
  value,
  onChange,
  id,
}: {
  value: GameStatus;
  onChange: (value: GameStatus) => void;
  id?: string;
}) {
  return (
    <ToggleGroup
      id={id}
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as GameStatus)}
      className="grid w-full grid-cols-3 gap-2"
      aria-label="Status"
    >
      {(Object.keys(ICONS) as GameStatus[]).map((status) => {
        const Icon = ICONS[status];
        return (
          <ToggleGroupItem
            key={status}
            value={status}
            className={cn(
              "h-auto! flex-col gap-1 rounded-lg! border-0 py-2.5 ring-1 ring-border transition-all ring-inset data-[state=on]:shadow-sm",
              ACTIVE[status],
            )}
          >
            <Icon className="size-5" aria-hidden />
            <span className="text-xs font-medium sm:text-sm">{STATUS_META[status].label}</span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
