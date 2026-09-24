"use client";

import { RotateCcw, Skull } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center">
      <Skull className="size-14 text-destructive" aria-hidden />
      <p className="font-pixel text-xs tracking-widest text-destructive uppercase">Game Over</p>
      <h1 className="text-3xl font-bold">Algo deu errado</h1>
      <p className="max-w-md text-muted-foreground">
        Um erro inesperado aconteceu. Tente de novo — se persistir, verifique a conexão com o banco
        de dados.
      </p>
      {error.digest && <p className="font-mono text-xs text-muted-foreground">Código: {error.digest}</p>}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset} size="lg" className="glow">
          <RotateCcw /> Continue? (tentar de novo)
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
