import Image from "next/image";

import { FAMILY_META, platformFamily, type Platform } from "@/lib/platforms";
import { cn } from "@/lib/utils";

/** Capa do jogo: imagem da RAWG ou uma capa gerada com as cores da plataforma. */
export function GameCover({
  title,
  platform,
  coverUrl,
  className,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  title: string;
  platform: Platform;
  coverUrl: string | null;
  className?: string;
  sizes?: string;
}) {
  const meta = FAMILY_META[platformFamily(platform)];

  if (coverUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image src={coverUrl} alt="" fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  const initials = title
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden bg-linear-to-br", meta.gradient, className)}
    >
      <div className="bg-pixel-grid absolute inset-0 opacity-40" />
      <div className="absolute -right-6 -bottom-8 size-32 rounded-full bg-white/10 blur-2xl" />
      <span className="absolute inset-0 grid place-items-center font-pixel text-2xl text-white/85 drop-shadow-[0_2px_0_rgb(0_0_0/0.4)] sm:text-3xl">
        {initials || "?"}
      </span>
    </div>
  );
}
