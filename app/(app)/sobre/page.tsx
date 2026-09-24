import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Sobre" };

const STACK = [
  ["Next.js", "App Router, Server Components e Server Actions"],
  ["TypeScript", "tipagem estrita de ponta a ponta"],
  ["Tailwind CSS + shadcn/ui", "componentes acessíveis baseados em Radix"],
  ["Auth.js", "login com e-mail/senha e OAuth, sessão JWT"],
  ["Neon + Drizzle ORM", "PostgreSQL serverless com migrations versionadas"],
  ["Recharts", "gráficos do dashboard"],
  ["ExcelJS + jsPDF", "exportação em XLSX, CSV e PDF"],
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Readme.txt"
        title={`Sobre o ${SITE.name}`}
        description="Um catálogo pessoal para registrar, acompanhar e analisar sua jornada gamer."
      />
      <div className="flex flex-col gap-6 text-muted-foreground">
        <p>
          O {SITE.name} nasceu da vontade de ter, em um só lugar, a lista de tudo que já joguei, estou
          jogando e ainda quero jogar — com notas, horas e comentários — em vez de planilhas
          espalhadas.
        </p>
        <section className="rounded-xl border bg-card/80 p-5">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Feito com</h2>
          <ul className="flex flex-col gap-2">
            {STACK.map(([name, detail]) => (
              <li key={name}>
                <span className="font-medium text-foreground">{name}</span> — {detail}
              </li>
            ))}
          </ul>
        </section>
        <p className="text-sm">
          Seus dados são privados: cada jogo pertence apenas à sua conta e você pode exportá-los a
          qualquer momento.
        </p>
      </div>
    </div>
  );
}
