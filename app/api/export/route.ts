import type { NextRequest } from "next/server";

import { EXPORT_FORMATS, toExportRows, type ExportFormat } from "@/lib/export/columns";
import { buildCsv } from "@/lib/export/csv";
import { buildPdf } from "@/lib/export/pdf";
import { buildXlsx } from "@/lib/export/xlsx";
import { parseFamily, parseFilters } from "@/lib/filters";
import {
  FAMILY_META,
  PLATFORM_LABELS,
  STATUS_META,
} from "@/lib/platforms";
import { getGamesForExport, type GameScope } from "@/lib/queries";
import { getSessionUserId } from "@/lib/session";

// Geração de arquivos usa APIs do Node (Buffer, exceljs).
export const runtime = "nodejs";

const CONTENT_TYPES: Record<ExportFormat, string> = {
  csv: "text/csv; charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pdf: "application/pdf",
};

const SCOPES = ["all", "family", "filtered"] as const;
type Scope = (typeof SCOPES)[number];

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * GET /api/export?scope=all|family|filtered&format=csv|xlsx|pdf
 *   &family=xbox&platform=XBOX_360&status=completed&q=halo&sort=rating&dir=desc
 *
 * - all:      todos os jogos do usuário
 * - family:   apenas a família atual (ignora os demais filtros)
 * - filtered: exatamente o que está na tela (família + console + status + busca)
 */
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const format = params.get("format") as ExportFormat;
  const scope = params.get("scope") as Scope;
  if (!EXPORT_FORMATS.includes(format) || !SCOPES.includes(scope)) {
    return Response.json({ error: "Parâmetros inválidos." }, { status: 400 });
  }

  const family = parseFamily(params);
  const filters = parseFilters(params, family ?? undefined);
  if (scope === "family" && !family) {
    return Response.json({ error: "Família não informada." }, { status: 400 });
  }

  let gameScope: GameScope = {};
  const labelParts: string[] = [];
  if (scope === "all") {
    labelParts.push("Todos os jogos");
  } else if (scope === "family") {
    gameScope = { family };
    labelParts.push(FAMILY_META[family!].label);
  } else {
    gameScope = { family, filters };
    if (filters.platform) labelParts.push(PLATFORM_LABELS[filters.platform]);
    else if (family) labelParts.push(FAMILY_META[family].label);
    if (filters.status) labelParts.push(STATUS_META[filters.status].label);
    if (filters.q) labelParts.push(`busca "${filters.q}"`);
    if (labelParts.length === 0) labelParts.push("Todos os jogos");
  }
  const subtitle = labelParts.join(" · ");

  const games = await getGamesForExport(
    userId,
    gameScope,
    scope === "filtered" ? filters.sort : "title",
    scope === "filtered" ? filters.dir : "asc",
  );
  const rows = toExportRows(games);

  const date = new Date().toISOString().slice(0, 10);
  const filename = `gamevault-${slug(subtitle) || "jogos"}-${date}.${format}`;

  let body: string | Buffer;
  try {
    body =
      format === "csv"
        ? buildCsv(rows)
        : format === "xlsx"
          ? await buildXlsx(rows, subtitle)
          : buildPdf(rows, subtitle);
  } catch (error) {
    console.error("[export]", error);
    return Response.json({ error: "Falha ao gerar o arquivo." }, { status: 500 });
  }

  return new Response(typeof body === "string" ? body : new Uint8Array(body), {
    headers: {
      "Content-Type": CONTENT_TYPES[format],
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Export-Count": String(rows.length),
    },
  });
}
