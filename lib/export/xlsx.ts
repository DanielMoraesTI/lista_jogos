import ExcelJS from "exceljs";

import { SITE } from "@/lib/site";

import { EXPORT_COLUMNS, type ExportRow } from "./columns";

export async function buildXlsx(rows: ExportRow[], subtitle: string): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = SITE.name;
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Jogos", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { defaultRowHeight: 18 },
  });

  sheet.columns = EXPORT_COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));
  // Valores como texto/número puros (nunca fórmulas).
  sheet.addRows(rows);

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6D28D9" } };
  header.alignment = { vertical: "middle" };
  header.height = 22;

  sheet.getColumn("rating").numFmt = "0.00";
  sheet.getColumn("hours").numFmt = "0.0";
  sheet.getColumn("comment").alignment = { wrapText: true, vertical: "top" };
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: EXPORT_COLUMNS.length } };

  // Linhas zebradas para facilitar a leitura.
  for (let i = 2; i <= sheet.rowCount; i++) {
    if (i % 2 === 0) {
      sheet.getRow(i).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4F1FB" } };
    }
  }

  const info = workbook.addWorksheet("Sobre");
  info.addRows([
    [SITE.name],
    [subtitle],
    [`Exportado em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`],
    [`Total de jogos: ${rows.length}`],
  ]);
  info.getColumn(1).width = 60;
  info.getRow(1).font = { bold: true, size: 14 };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
