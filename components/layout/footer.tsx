import { Heart, Info } from "lucide-react";
import Link from "next/link";

import { GitHubIcon, LinkedInIcon } from "@/components/auth/brand-icons";
import { randomQuote } from "@/lib/quotes";
import { rawgEnabled } from "@/lib/rawg";
import { SITE } from "@/lib/site";

import { Achievement } from "./achievement";

export function Footer() {
  const quote = randomQuote();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-border/70">
      {/* Borda "pixelada" em degraus */}
      <div
        aria-hidden
        className="absolute inset-x-0 -top-1.5 h-1.5 bg-[linear-gradient(90deg,var(--glow)_25%,transparent_25%,transparent_50%,var(--glow-2)_50%,var(--glow-2)_75%,transparent_75%)] bg-size-[24px_6px] opacity-60"
      />
      <div className="bg-pixel-grid">
        <div className="container-page grid gap-10 py-10 md:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <figure className="flex flex-col gap-2">
              <p className="font-pixel text-[9px] tracking-widest text-primary uppercase">
                &gt; mensagem do dia<span className="animate-blink">_</span>
              </p>
              <blockquote className="font-heading text-lg font-semibold text-balance sm:text-xl">
                “{quote.text}”
              </blockquote>
              <figcaption className="text-sm text-muted-foreground">— {quote.source}</figcaption>
            </figure>
            <Achievement />
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="flex flex-col gap-3">
              <p className="font-pixel text-[9px] tracking-widest text-muted-foreground uppercase">Menu</p>
              <Link href="/" className="hover:text-primary">Início</Link>
              <Link href="/jogos" className="hover:text-primary">Meus Jogos</Link>
              <Link href="/perfil" className="hover:text-primary">Perfil</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-pixel text-[9px] tracking-widest text-muted-foreground uppercase">Projeto</p>
              <Link href="/sobre" className="inline-flex items-center gap-1.5 hover:text-primary">
                <Info className="size-4" /> Sobre
              </Link>
              <a
                href={SITE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primary"
              >
                <GitHubIcon className="size-4" /> GitHub
              </a>
              {SITE.linkedinUrl && (
                <a
                  href={SITE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                >
                  <LinkedInIcon className="size-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border/60">
          <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row">
            <p>
              © {year} {SITE.name} · Feito com <Heart className="inline size-3 fill-red-500 text-red-500" aria-label="amor" /> e muito café
              {rawgEnabled() && (
                <>
                  {" · "}Capas:{" "}
                  <a
                    href="https://rawg.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:text-primary hover:underline"
                  >
                    RAWG
                  </a>
                </>
              )}
            </p>
            <p className="font-pixel text-[8px] tracking-widest uppercase">
              Insert coin to continue ▸ Credits: ∞
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
