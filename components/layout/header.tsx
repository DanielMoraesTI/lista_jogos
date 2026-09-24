import { LogIn } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { displayName, getCurrentUser } from "@/lib/session";

import { HeaderShell } from "./header-shell";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { ThemeSwitcher } from "./theme-switcher";
import { UserMenu } from "./user-menu";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <HeaderShell>
      <div className="container-page flex h-16 items-center gap-2">
        {user && <MobileNav />}
        <Logo className="mr-2" />
        {user && <NavLinks />}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeSwitcher />
          {user ? (
            <UserMenu displayName={displayName(user)} email={user.email} image={user.image} />
          ) : (
            <Button asChild size="sm" className="glow-sm">
              <Link href="/login">
                <LogIn />
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </HeaderShell>
  );
}
