"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { formatHours } from "@/lib/format";
import { FAMILY_META, type Family } from "@/lib/platforms";

type Datum = { family: Family; total: number; hours: number };

const config = {
  total: { label: "Jogos" },
} satisfies ChartConfig;

/** Jogos por família de plataforma: uma série, colunas finas com o valor no topo. */
export function FamilyBars({ data }: { data: Datum[] }) {
  const rows = data.map((d) => ({ ...d, label: FAMILY_META[d.family].label }));

  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={rows} margin={{ top: 24, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          content={({ active, payload }) => {
            const item = payload?.[0]?.payload as (Datum & { label: string }) | undefined;
            if (!active || !item) return null;
            return (
              <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
                <p className="flex items-center gap-2 font-medium">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: FAMILY_META[item.family].color }} />
                  {item.label}
                </p>
                <p className="text-muted-foreground tabular-nums">
                  {item.total} {item.total === 1 ? "jogo" : "jogos"} · {formatHours(item.hours)}
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false}>
          {rows.map((d) => (
            <Cell key={d.family} fill={FAMILY_META[d.family].color} />
          ))}
          <LabelList dataKey="total" position="top" offset={8} className="fill-foreground text-xs font-medium tabular-nums" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
