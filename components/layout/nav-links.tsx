"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FAMILY_META } from "@/lib/platforms";
import { cn } from "@/lib/utils";

import { NAV_ITEMS, isActive } from "./nav-items";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground xl:px-3 transition-colors outline-none hover:bg-accent/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
              active && "text-foreground",
            )}
          >
            {item.family && (
              <span
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ backgroundColor: FAMILY_META[item.family].color }}
              />
            )}
            {item.label}
            {active && (
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary shadow-[0_0_10px_var(--glow)]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
