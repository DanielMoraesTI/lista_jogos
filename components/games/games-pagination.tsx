import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Números de página a exibir, com reticências: 1 … 4 5 6 … 12 */
function pageWindow(page: number, pageCount: number): (number | "…")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (const p of sorted) {
    const last = result.at(-1);
    if (typeof last === "number" && p - last > 1) result.push("…");
    result.push(p);
  }
  return result;
}

export function GamesPagination({
  page,
  pageCount,
  pathname,
  searchParams,
}: {
  page: number;
  pageCount: number;
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (pageCount <= 1) return null;

  const href = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === "string" && key !== "page") params.set(key, value);
    }
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-1">
      <Button asChild={page > 1} variant="ghost" size="sm" disabled={page <= 1}>
        {page > 1 ? (
          <Link href={href(page - 1)} aria-label="Página anterior">
            <ChevronLeft /> <span className="hidden sm:inline">Anterior</span>
          </Link>
        ) : (
          <span>
            <ChevronLeft /> <span className="hidden sm:inline">Anterior</span>
          </span>
        )}
      </Button>
      {pageWindow(page, pageCount).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <Button
            key={p}
            asChild
            variant={p === page ? "outline" : "ghost"}
            size="icon-sm"
            className={cn(p === page && "glow-sm border-primary/50")}
          >
            <Link href={href(p)} aria-current={p === page ? "page" : undefined} aria-label={`Página ${p}`}>
              {p}
            </Link>
          </Button>
        ),
      )}
      <Button asChild={page < pageCount} variant="ghost" size="sm" disabled={page >= pageCount}>
        {page < pageCount ? (
          <Link href={href(page + 1)} aria-label="Próxima página">
            <span className="hidden sm:inline">Próxima</span> <ChevronRight />
          </Link>
        ) : (
          <span>
            <span className="hidden sm:inline">Próxima</span> <ChevronRight />
          </span>
        )}
      </Button>
    </nav>
  );
}
