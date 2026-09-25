import { ArrowRight, CheckCircle2, Clock, Crown, Flame, Gamepad2, Star } from "lucide-react";
import Link from "next/link";

import { AddGameButton } from "@/components/games/add-game-button";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { formatHours, formatNumber, formatRating } from "@/lib/format";
import type { DashboardData } from "@/lib/queries";

import { FamilyBars } from "./family-bars";
import { HighlightCard } from "./highlight-card";
import { PlatformDonut } from "./platform-donut";
import { RecentGames } from "./recent-games";
import { StatCard } from "./stat-card";

function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`flex min-w-0 flex-col gap-4 rounded-xl border bg-card/80 p-4 sm:p-6 ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Dashboard({ nickname, data }: { nickname: string; data: DashboardData }) {
  const { totals } = data;
  const completionRate = totals.games ? Math.round((totals.completed / totals.games) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <PageHeader
        eyebrow="Player status"
        title={
          <>
            Bem-vindo de volta, <span className="text-gradient">{nickname}</span>
          </>
        }
        description="Um resumo da sua jornada gamer."
        actions={<AddGameButton />}
      />

      {totals.games === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-card/40 px-6 py-16 text-center">
          <Gamepad2 className="size-12 text-primary" aria-hidden />
          <div>
            <p className="font-heading text-xl font-semibold">Nenhum jogo ainda</p>
            <p className="text-muted-foreground">
              Adicione seu primeiro jogo para liberar estatísticas, gráficos e recordes.
            </p>
          </div>
          <AddGameButton label="Adicionar primeiro jogo" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              label="Total de jogos"
              icon={Gamepad2}
              value={formatNumber(totals.games)}
              hint={`${totals.playing} jogando · ${totals.backlog} no backlog`}
            />
            <StatCard
              label="Horas jogadas"
              icon={Clock}
              value={formatHours(totals.hours)}
              hint={`≈ ${formatNumber(totals.hours / 24)} dias de jogatina`}
            />
            <StatCard
              label="Concluídos"
              icon={CheckCircle2}
              value={formatNumber(totals.completed)}
              hint={`${completionRate}% da coleção`}
            />
            <StatCard
              label="Melhor nota"
              icon={Star}
              value={formatRating(data.topRated?.rating ?? null)}
              hint={data.topRated?.title ?? "Nenhum jogo avaliado"}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <HighlightCard
              label="Mais jogado"
              icon={Flame}
              game={data.mostPlayed}
              metric="hours"
              empty="Registre horas jogadas para ver seu recordista."
            />
            <HighlightCard
              label="Mais bem avaliado"
              icon={Crown}
              game={data.topRated}
              metric="rating"
              empty="Dê notas aos seus jogos para ver o campeão."
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <Panel
              title="Jogos por plataforma"
              description="Distribuição percentual por console"
              className="lg:col-span-3"
            >
              <PlatformDonut data={data.byPlatform} />
            </Panel>
            <Panel title="Jogos por família" description="Jogos agrupados por plataforma" className="lg:col-span-2">
              <FamilyBars data={data.byFamily} />
            </Panel>
          </div>

          <Panel
            title="Últimos jogos cadastrados"
            description="Os 10 mais recentes"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/jogos">
                  Ver todos <ArrowRight />
                </Link>
              </Button>
            }
          >
            <RecentGames games={data.recent} />
          </Panel>
        </>
      )}
    </div>
  );
}
