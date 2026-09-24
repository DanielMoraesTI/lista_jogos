import { BarChart3, Download, Gamepad2, Layers, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FAMILY_META, FAMILIES } from "@/lib/platforms";

const FEATURES = [
  { icon: Gamepad2, title: "Tudo em um lugar", text: "PC, Xbox, PlayStation e Nintendo, do N64 ao Switch 2." },
  { icon: Trophy, title: "Notas e horas", text: "Dê notas de 0 a 10, conte horas e registre quando zerou." },
  { icon: BarChart3, title: "Dashboard", text: "Gráficos da sua jornada: plataformas, recordes e últimos jogos." },
  { icon: Layers, title: "Backlog organizado", text: "Separe o que zerou, o que está jogando e o que vem depois." },
  { icon: Download, title: "Exporte", text: "Baixe sua coleção em CSV, Excel ou PDF quando quiser." },
  { icon: Sparkles, title: "Do seu jeito", text: "Temas escuros neon, modo claro, cards ou tabela." },
];

export function Landing() {
  return (
    <div className="flex flex-col gap-16 py-6 sm:py-12">
      <section className="flex flex-col items-center gap-6 text-center">
        <p className="font-pixel text-[10px] tracking-widest text-primary uppercase sm:text-xs">
          Level 1 · Tutorial
        </p>
        <h1 className="max-w-3xl text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">
          Sua jornada gamer, <span className="text-gradient text-glow">salva em um só lugar</span>
        </h1>
        <p className="max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
          Registre os jogos que você zerou, está jogando e pretende jogar. Acompanhe horas, notas e
          descubra qual plataforma domina sua vida.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="glow">
            <Link href="/cadastro">Começar agora — é grátis</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>
        <ul className="flex flex-wrap justify-center gap-2 pt-2" aria-label="Plataformas suportadas">
          {FAMILIES.map((f) => (
            <li
              key={f}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${FAMILY_META[f].badgeClass}`}
            >
              {FAMILY_META[f].label}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recursos" className="flex flex-col gap-6">
        <h2 id="recursos" className="sr-only">Recursos</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="group rounded-xl border bg-card/60 p-5 transition-shadow hover:glow"
            >
              <span className="mb-3 grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
