"use client";

import { LogOut, Palette, User } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { logoutAction } from "@/actions/auth";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ThemeOptions } from "./theme-switcher";

export function UserMenu({
  displayName,
  email,
  image,
}: {
  displayName: string;
  email: string;
  image: string | null;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:rounded-lg sm:py-1 sm:pr-2 sm:pl-1 sm:hover:bg-accent/60"
        aria-label="Menu do usuário"
      >
        <UserAvatar src={image} name={displayName} className="size-8" />
        {/* Entre 1024 e 1279px o menu principal ocupa o espaço: só o avatar. */}
        <span className="hidden max-w-32 truncate text-sm font-medium sm:inline lg:hidden xl:inline">{displayName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate font-heading text-sm text-foreground">{displayName}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <User />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette />
            Tema
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44">
            <ThemeOptions current={theme} onSelect={setTheme} />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem asChild variant="destructive">
            <button type="submit" className="w-full">
              <LogOut />
              Sair
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
