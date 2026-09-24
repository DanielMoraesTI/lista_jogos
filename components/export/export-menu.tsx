"use client";

import { Download, FileSpreadsheet, FileText, Loader2, Sheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExportFormat } from "@/lib/export/columns";
import type { GameFilters } from "@/lib/filters";
import { FAMILY_META, PLATFORM_LABELS, type Family } from "@/lib/platforms";

type Scope = "all" | "family" | "filtered";

const FORMATS: { value: ExportFormat; label: string; icon: typeof Sheet }[] = [
  { value: "xlsx", label: "Excel (.xlsx)", icon: FileSpreadsheet },
  { value: "csv", label: "CSV (.csv)", icon: Sheet },
  { value: "pdf", label: "PDF (.pdf)", icon: FileText },
];

export function ExportMenu({
  family,
  filters,
  hasFilters,
  disabled,
}: {
  family?: Family;
  filters: GameFilters;
  hasFilters: boolean;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  const scopes: { value: Scope; label: string }[] = [{ value: "all", label: "Todos os jogos" }];
  if (family) scopes.push({ value: "family", label: `Só ${FAMILY_META[family].label}` });
  if (hasFilters) {
    scopes.push({
      value: "filtered",
      label: filters.platform ? `Só ${PLATFORM_LABELS[filters.platform]} (filtro atual)` : "Filtro atual",
    });
  }
  const [scope, setScope] = useState<Scope>(hasFilters ? "filtered" : family ? "family" : "all");
  const effectiveScope = scopes.some((s) => s.value === scope) ? scope : scopes[scopes.length - 1]!.value;

  async function download(format: ExportFormat) {
    const params = new URLSearchParams({ scope: effectiveScope, format });
    if (family) params.set("family", family);
    if (effectiveScope === "filtered") {
      if (filters.q) params.set("q", filters.q);
      if (filters.status) params.set("status", filters.status);
      if (filters.platform) params.set("platform", filters.platform);
      params.set("sort", filters.sort);
      params.set("dir", filters.dir);
    }

    setBusy(true);
    const toastId = toast.loading("Gerando arquivo...");
    try {
      const response = await fetch(`/api/export?${params}`);
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Falha na exportação.");
      }
      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? `jogos.${format}`;
      const count = response.headers.get("X-Export-Count");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast.success(`Exportação concluída: ${count ?? ""} jogos`, { id: toastId, description: filename });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha na exportação.", { id: toastId });
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || busy}>
          {busy ? <Loader2 className="animate-spin" /> : <Download />}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>O que exportar?</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={effectiveScope} onValueChange={(v) => setScope(v as Scope)}>
          {scopes.map((s) => (
            <DropdownMenuRadioItem key={s.value} value={s.value} onSelect={(e) => e.preventDefault()}>
              {s.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Formato</DropdownMenuLabel>
        {FORMATS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onSelect={() => download(value)}>
            <Icon />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
