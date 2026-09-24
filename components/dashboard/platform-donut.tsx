"use client";

import { Cell, Label, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { PLATFORM_COLORS, PLATFORM_LABELS, PLATFORMS, type Platform } from "@/lib/platforms";

type Datum = { platform: Platform; total: number };

const config = Object.fromEntries(
  PLATFORMS.map((p) => [p, { label: PLATFORM_LABELS[p], color: PLATFORM_COLORS[p] }]),
) satisfies ChartConfig;

const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

/** Distribuição percentual de jogos por console (rosca + legenda com valores). */
export function PlatformDonut({ data }: { data: Datum[] }) {
  const total = data.reduce((acc, d) => acc + d.total, 0);
  // Ordem fixa por família/console (não por tamanho): cores vizinhas são degraus da mesma família.
  const ordered = PLATFORMS.map((p) => data.find((d) => d.platform === p)).filter(
    (d): d is Datum => Boolean(d),
  );

  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <ChartContainer config={config} className="mx-auto aspect-square w-full max-w-64">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              const item = payload?.[0]?.payload as Datum | undefined;
              if (!active || !item) return null;
              return (
                <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
                  <p className="flex items-center gap-2 font-medium">
                    <span className="size-2.5 rounded-sm" style={{ backgroundColor: PLATFORM_COLORS[item.platform] }} />
                    {PLATFORM_LABELS[item.platform]}
                  </p>
                  <p className="text-muted-foreground tabular-nums">
                    {item.total} {item.total === 1 ? "jogo" : "jogos"} · {percent.format(item.total / total)}
                  </p>
                </div>
              );
            }}
          />
          <Pie
            data={ordered}
            dataKey="total"
            nameKey="platform"
            innerRadius="62%"
            outerRadius="100%"
            stroke="var(--card)"
            strokeWidth={2}
            isAnimationActive={false}
          >
            {ordered.map((d) => (
              <Cell key={d.platform} fill={PLATFORM_COLORS[d.platform]} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground font-heading text-3xl font-bold">
                      {total}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 22} className="fill-muted-foreground text-xs">
                      jogos
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Legenda = tabela de valores: a identidade nunca depende só da cor. */}
      <table className="w-full text-sm">
        <caption className="sr-only">Jogos por plataforma</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Plataforma</th>
            <th scope="col">Jogos</th>
            <th scope="col">Percentual</th>
          </tr>
        </thead>
        <tbody>
          {[...ordered]
            .sort((a, b) => b.total - a.total)
            .map((d) => (
              <tr key={d.platform} className="border-b border-border/50 last:border-0">
                <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: PLATFORM_COLORS[d.platform] }} />
                    <span className="truncate">{PLATFORM_LABELS[d.platform]}</span>
                  </span>
                </th>
                <td className="py-1.5 text-right font-medium tabular-nums">{d.total}</td>
                <td className="w-16 py-1.5 text-right text-muted-foreground tabular-nums">
                  {percent.format(d.total / total)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
