"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Platform } from "@/lib/platforms";
import { cn } from "@/lib/utils";

import { GameFormDialog } from "./game-form-dialog";

export function AddGameButton({
  defaultPlatform,
  className,
  label = "Adicionar jogo",
}: {
  defaultPlatform?: Platform;
  className?: string;
  label?: string;
}) {
  return (
    <GameFormDialog
      defaultPlatform={defaultPlatform}
      trigger={
        <Button size="lg" className={cn("glow", className)}>
          <Plus />
          {label}
        </Button>
      }
    />
  );
}
