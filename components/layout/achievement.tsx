"use client";

import { Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** "Conquista" desbloqueada quando o usuário chega ao fim da página. */
export function Achievement() {
  const ref = useRef<HTMLDivElement>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setUnlocked(true);
          observer.disconnect();
        }
      },
      { threshold: 0.9 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[68px]" aria-live="polite">
      {unlocked ? (
        <div className="animate-achievement glow inline-flex max-w-full items-center gap-3 rounded-xl border border-primary/30 bg-card/80 px-4 py-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-linear-to-br from-amber-300 to-amber-600 text-amber-950 shadow-[0_0_20px_-4px_rgb(245_158_11/0.8)]">
            <Trophy className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 text-left">
            <span className="block font-pixel text-[9px] leading-relaxed text-primary uppercase">
              Achievement Unlocked
            </span>
            <span className="block text-sm font-medium">Você rolou até o fim da página</span>
            <span className="block text-xs text-muted-foreground">+10 G · Explorador de Rodapés</span>
          </span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 text-muted-foreground">
          <Trophy className="size-5 opacity-40" aria-hidden />
          <span className="text-sm">Conquista secreta 🔒</span>
        </div>
      )}
    </div>
  );
}
