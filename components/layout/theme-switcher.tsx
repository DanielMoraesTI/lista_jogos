"use client";

import { Check, Palette } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { THEMES } from "@/lib/themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Trocar tema">
          <Palette className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeOptions current={theme} onSelect={setTheme} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeOptions({
  current,
  onSelect,
}: {
  current: string | undefined;
  onSelect: (value: string) => void;
}) {
  return THEMES.map((t) => (
    <DropdownMenuItem key={t.value} onSelect={() => onSelect(t.value)}>
      <span
        aria-hidden
        className="size-4 rounded-full ring-1 ring-foreground/20"
        style={{ background: t.swatch }}
      />
      {t.label}
      <Check
        className={current === t.value ? "ml-auto" : "ml-auto opacity-0"}
      />
    </DropdownMenuItem>
  ));
}
