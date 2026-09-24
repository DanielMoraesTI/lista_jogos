import { CalendarDays, CheckCircle2, Clock, Gamepad2, Heart } from "lucide-react";
import type { Metadata } from "next";

import { PlatformBadge } from "@/components/games/badges";
import { PageHeader } from "@/components/page-header";
import { AvatarPicker } from "@/components/profile/avatar-picker";
import { ProfileForm } from "@/components/profile/profile-form";
import { UserAvatar } from "@/components/user-avatar";
import { formatHours, formatNumber } from "@/lib/format";
import { getProfileStats } from "@/lib/queries";
import { displayName, requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Perfil" };

const memberSince = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

export default async function ProfilePage() {
  const user = await requireUser();
  const stats = await getProfileStats(user.id);
  const name = displayName(user);

  // Nível "de brincadeira": 1 nível a cada 50 horas jogadas.
  const level = Math.floor(stats.hours / 50) + 1;
  const xp = Math.round(((stats.hours % 50) / 50) * 100);

  return (
    <>
      <PageHeader eyebrow="Character sheet" title="Perfil" description="Seu personagem e suas estatísticas." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <section className="glow flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-card p-6 text-center">
          <UserAvatar src={user.image} name={name} className="size-28 ring-4" />
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold">{name}</h2>
            {user.name && <p className="truncate text-muted-foreground">{user.name}</p>}
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden /> Membro desde {memberSince.format(user.createdAt)}
            </p>
          </div>

          <div className="w-full">
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-pixel text-[9px] text-primary uppercase">Lv. {level}</span>
              <span className="text-muted-foreground tabular-nums">{xp}% p/ próximo nível</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-primary/15"
              role="progressbar"
              aria-valuenow={xp}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso de nível"
            >
              <div className="h-full rounded-full bg-linear-to-r from-glow to-glow-2" style={{ width: `${xp}%` }} />
            </div>
          </div>

          <ul className="grid w-full grid-cols-3 gap-2 text-center" aria-label="Estatísticas">
            <li className="rounded-xl bg-muted/60 p-3">
              <Gamepad2 className="mx-auto mb-1 size-4 text-primary" aria-hidden />
              <p className="font-heading text-xl font-bold tabular-nums">{formatNumber(stats.total)}</p>
              <p className="text-xs text-muted-foreground">jogos</p>
            </li>
            <li className="rounded-xl bg-muted/60 p-3">
              <Clock className="mx-auto mb-1 size-4 text-primary" aria-hidden />
              <p className="font-heading text-xl font-bold tabular-nums">{formatHours(stats.hours)}</p>
              <p className="text-xs text-muted-foreground">jogadas</p>
            </li>
            <li className="rounded-xl bg-muted/60 p-3">
              <CheckCircle2 className="mx-auto mb-1 size-4 text-primary" aria-hidden />
              <p className="font-heading text-xl font-bold tabular-nums">{formatNumber(stats.completed)}</p>
              <p className="text-xs text-muted-foreground">zerados</p>
            </li>
          </ul>

          <div className="flex flex-col items-center gap-1.5">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="size-3.5 text-red-500" aria-hidden /> Plataforma favorita
            </p>
            {stats.favoritePlatform ? (
              <PlatformBadge platform={stats.favoritePlatform} className="text-sm" />
            ) : (
              <span className="text-sm text-muted-foreground">Ainda indefinida</span>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border bg-card/80 p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Dados do jogador</h2>
            <ProfileForm defaults={{ nickname: user.nickname ?? "", name: user.name ?? "" }} email={user.email} />
          </section>
          <section className="rounded-2xl border bg-card/80 p-5 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold">Avatar</h2>
            <p className="mb-4 text-sm text-muted-foreground">Escolha um sprite ou envie sua própria imagem.</p>
            <AvatarPicker current={user.image} uploadEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
          </section>
        </div>
      </div>
    </>
  );
}
