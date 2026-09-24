"use client";

import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  FilterX,
  LayoutGrid,
  Loader2,
  Rows3,
  Search,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { defaultDir, SORT_OPTIONS, type GameFilters, type SortKey } from "@/lib/filters";
import {
  FAMILIES,
  FAMILY_META,
  GAME_STATUSES,
  PLATFORM_LABELS,
  PLATFORM_SHORT_LABELS,
  STATUS_META,
  platformsOfFamily,
  type Family,
  type Platform,
} from "@/lib/platforms";
import { cn } from "@/lib/utils";

type FiltersBarProps = {
  filters: GameFilters;
  family?: Family;
  platformCounts: Partial<Record<Platform, number>>;
};

function Chip({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap sm:px-3 sm:py-1.5 sm:text-sm transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "glow-sm border-primary/60 bg-primary/15 text-foreground"
          : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {color && <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: color }} />}
      {children}
    </button>
  );
}

/** Contagem do chip; o leitor de tela ouve "(6 jogos)" em vez de só "6". */
function Count({ value }: { value: number }) {
  return (
    <span className="text-xs opacity-70">
      <span className="sr-only">(</span>
      {value}
      <span className="sr-only"> {value === 1 ? "jogo" : "jogos"})</span>
    </span>
  );
}

export function FiltersBar({ filters, family, platformCounts }: FiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.q);
  const lastPushedQuery = useRef(filters.q);

  function update(changes: Record<string, string | null>, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    if (resetPage) params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  // Busca com debounce para não recarregar a cada tecla.
  useEffect(() => {
    if (query.trim() === lastPushedQuery.current) return;
    const timeout = setTimeout(() => {
      lastPushedQuery.current = query.trim();
      update({ q: query.trim() || null });
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const familyPlatforms = family ? platformsOfFamily(family) : [];
  const familyTotal = familyPlatforms.reduce((acc, p) => acc + (platformCounts[p] ?? 0), 0);
  const hasFilters = Boolean(filters.q || filters.status || filters.platform);

  return (
    <div className="flex flex-col gap-4">
      {/* Subcategorias (chips de console) nas páginas de família */}
      {family && (
        <div
          role="group"
          aria-label="Filtrar por console"
          className="flex flex-wrap gap-2"
        >
          <Chip active={!filters.platform} onClick={() => update({ platform: null })}>
            Todos <Count value={familyTotal} />
          </Chip>
          {familyPlatforms.map((platform) => (
            <Chip
              key={platform}
              active={filters.platform === platform}
              onClick={() => update({ platform: filters.platform === platform ? null : platform })}
              color={FAMILY_META[family].color}
            >
              <span className="sm:hidden">{PLATFORM_SHORT_LABELS[platform]}</span>
              <span className="hidden sm:inline">{PLATFORM_LABELS[platform]}</span>
              <Count value={platformCounts[platform] ?? 0} />
            </Chip>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center">
        {/* Linha 1: busca + status */}
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
          {/* Busca */}
          <div className="relative md:w-72 md:shrink-0">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar pelo nome..."
              aria-label="Buscar jogos pelo nome"
              className="pl-9"
              maxLength={100}
            />
          </div>

          {/* Status */}
          <div
            role="group"
            aria-label="Filtrar por status"
            className="flex min-w-0 flex-wrap gap-2"
          >
            <Chip active={!filters.status} onClick={() => update({ status: null })}>
              Todos
            </Chip>
            {GAME_STATUSES.map((status) => (
              <Chip
                key={status}
                active={filters.status === status}
                onClick={() => update({ status: filters.status === status ? null : status })}
              >
                <span aria-hidden className={cn("size-2 rounded-full", STATUS_META[status].dotClass)} />
                {STATUS_META[status].label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Linha 2: plataforma, ordenação, visualização */}
        <div className="flex flex-wrap items-center gap-2 2xl:ml-auto">
          {/* Plataforma (apenas em "Meus Jogos") */}
          {!family && (
            <Select
              value={filters.platform ?? "all"}
              onValueChange={(v) => update({ platform: v === "all" ? null : v })}
            >
              <SelectTrigger className="w-full sm:w-48" aria-label="Filtrar por plataforma">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-80">
                <SelectItem value="all">Todas as plataformas</SelectItem>
                {FAMILIES.map((f) => (
                  <SelectGroup key={f}>
                    <SelectLabel>{FAMILY_META[f].label}</SelectLabel>
                    {platformsOfFamily(f).map((p) => (
                      <SelectItem key={p} value={p}>
                        <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: FAMILY_META[f].color }} />
                        {PLATFORM_LABELS[p]}
                        <span className="text-xs text-muted-foreground">({platformCounts[p] ?? 0})</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Ordenação */}
          <Select
            value={filters.sort}
            onValueChange={(v) => update({ sort: v, dir: defaultDir(v as SortKey) }, false)}
          >
            <SelectTrigger className="min-w-0 flex-1 sm:w-44 sm:flex-none" aria-label="Ordenar por">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => update({ dir: filters.dir === "asc" ? "desc" : "asc" }, false)}
            aria-label={filters.dir === "asc" ? "Ordem crescente (inverter)" : "Ordem decrescente (inverter)"}
            title={filters.dir === "asc" ? "Crescente" : "Decrescente"}
          >
            {filters.dir === "asc" ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}
          </Button>

          {/* Cards / tabela */}
          <ToggleGroup
            type="single"
            variant="outline"
            value={filters.view}
            onValueChange={(v) => v && update({ view: v === "table" ? "table" : null }, false)}
            aria-label="Modo de exibição"
            className="hidden lg:flex"
          >
            <ToggleGroupItem value="cards" aria-label="Exibir em cards" className="size-9">
              <LayoutGrid />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Exibir em tabela" className="size-9">
              <Rows3 />
            </ToggleGroupItem>
          </ToggleGroup>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                lastPushedQuery.current = "";
                update({ q: null, status: null, platform: null });
              }}
            >
              <FilterX />
              Limpar
            </Button>
          )}
          {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Carregando" />}
        </div>
      </div>
    </div>
  );
}
