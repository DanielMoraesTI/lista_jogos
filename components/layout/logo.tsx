import { Gamepad2 } from "lucide-react";
import Link from "next/link";

import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50", className)}
      aria-label={`${SITE.name} — início`}
    >
      <span className="glow-sm grid size-9 place-items-center rounded-lg bg-linear-to-br from-glow to-glow-2 text-primary-foreground transition-transform group-hover:-rotate-6">
        <Gamepad2 className="size-5" aria-hidden />
      </span>
      {!compact && (
        <span className="font-heading text-lg font-bold tracking-tight">
          Game<span className="text-gradient">Vault</span>
        </span>
      )}
    </Link>
  );
}
