import type { Game } from "@/db/schema";
import { formatDateTime, formatIsoDate } from "@/lib/format";
import {
  FAMILY_META,
  PLATFORM_LABELS,
  STATUS_META,
  platformFamily,
} from "@/lib/platforms";

export type ExportFormat = "csv" | "xlsx" | "pdf";
export const EXPORT_FORMATS: ExportFormat[] = ["csv", "xlsx", "pdf"];

export type ExportRow = {
  title: string;
  platform: string;
  family: string;
  status: string;
  rating: number | null;
  hours: number;
  comment: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
};

export const EXPORT_COLUMNS: { key: keyof ExportRow; header: string; width: number }[] = [
  { key: "title", header: "Nome", width: 40 },
  { key: "platform", header: "Plataforma", width: 18 },
  { key: "family", header: "Família", width: 13 },
  { key: "status", header: "Status", width: 15 },
  { key: "rating", header: "Nota", width: 8 },
  { key: "hours", header: "Horas", width: 9 },
  { key: "comment", header: "Comentário", width: 50 },
  { key: "completedAt", header: "Concluído em", width: 14 },
  { key: "createdAt", header: "Criado em", width: 18 },
  { key: "updatedAt", header: "Atualizado em", width: 18 },
];

export function toExportRows(games: Game[]): ExportRow[] {
  return games.map((g) => ({
    title: g.title,
    platform: PLATFORM_LABELS[g.platform],
    family: FAMILY_META[platformFamily(g.platform)].label,
    status: STATUS_META[g.status].label,
    rating: g.rating,
    hours: g.hoursPlayed,
    comment: g.comment ?? "",
    completedAt: g.completedAt ? formatIsoDate(g.completedAt) : "",
    createdAt: formatDateTime(g.createdAt),
    updatedAt: formatDateTime(g.updatedAt),
  }));
}
