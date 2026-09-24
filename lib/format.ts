import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

const numberFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const ratingFormat = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function formatHours(hours: number) {
  return `${numberFormat.format(hours)} h`;
}

export function formatNumber(value: number) {
  return numberFormat.format(value);
}

export function formatRating(rating: number | null) {
  return rating === null ? "—" : ratingFormat.format(rating);
}

/** "2024-02-18" → "18/02/2024" (sem conversão de fuso horário). */
export function formatIsoDate(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateTime(date: Date) {
  return dateTimeFormat.format(date);
}

export function timeAgo(date: Date) {
  return formatDistanceToNowStrict(date, { locale: ptBR, addSuffix: true });
}

/** Data local de hoje no formato ISO `YYYY-MM-DD`. */
export function todayIso() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Foi editado depois de criado (margem de 1 minuto)? */
export function wasEdited(createdAt: Date, updatedAt: Date) {
  return updatedAt.getTime() - createdAt.getTime() > 60_000;
}
