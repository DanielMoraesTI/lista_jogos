import { Ghost } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <Ghost className="size-14 text-primary" aria-hidden />
      <p className="font-pixel text-xs tracking-widest text-primary uppercase">Erro 404</p>
      <h1 className="text-3xl font-bold sm:text-4xl">Esta fase não existe</h1>
      <p className="max-w-md text-muted-foreground">
        Parece que você encontrou uma área fora do mapa. Nenhum segredo por aqui... desta vez.
      </p>
      <Button asChild size="lg" className="glow">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </main>
  );
}
