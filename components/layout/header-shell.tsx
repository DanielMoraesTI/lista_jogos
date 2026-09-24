"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Aplica o efeito de vidro fosco quando a página é rolada. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "glass border-border/70 shadow-[0_8px_30px_-12px_color-mix(in_oklch,var(--glow)_35%,transparent)]"
          : "border-transparent bg-transparent",
      )}
    >
      {children}
    </header>
  );
}
