import { Star } from "lucide-react";

import { formatRating } from "@/lib/format";
import {
  FAMILY_META,
  PLATFORM_LABELS,
  PLATFORM_SHORT_LABELS,
  STATUS_META,
  platformFamily,
  type GameStatus,
  type Platform,
} from "@/lib/platforms";
import { cn } from "@/lib/utils";

export function PlatformBadge({
  platform,
  short = false,
  className,
}: {
  platform: Platform;
  short?: boolean;
  className?: string;
}) {
  const meta = FAMILY_META[platformFamily(platform)];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        meta.badgeClass,
        className,
      )}
      title={PLATFORM_LABELS[platform]}
    >
      <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {short ? PLATFORM_SHORT_LABELS[platform] : PLATFORM_LABELS[platform]}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: GameStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        meta.badgeClass,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {meta.label}
    </span>
  );
}

/** Cor da nota: verde (ótimo), âmbar (ok), vermelho (fraco). */
export function ratingTone(rating: number) {
  if (rating >= 8.5) return "text-emerald-500";
  if (rating >= 6.5) return "text-amber-500";
  return "text-red-500";
}

export function RatingBadge({ rating, className }: { rating: number | null; className?: string }) {
  if (rating === null) {
    return <span className={cn("text-sm text-muted-foreground", className)}>Sem nota</span>;
  }
  return (
    <span
      className={cn("inline-flex items-center gap-1 font-heading font-bold tabular-nums", className)}
      aria-label={`Nota ${formatRating(rating)} de 10`}
    >
      <Star className={cn("size-4 fill-current", ratingTone(rating))} aria-hidden />
      {formatRating(rating)}
    </span>
  );
}
