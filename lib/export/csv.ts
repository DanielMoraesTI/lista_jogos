import { EXPORT_COLUMNS, type ExportRow } from "./columns";

/**
 * Evita "CSV injection": células que começam com = + - @ (ou tab/CR) seriam
 * interpretadas como fórmula pelo Excel. Prefixamos com apóstrofo.
 */
function sanitize(value: string) {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function escapeCell(value: string) {
  return /[";\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

const decimal = (n: number, digits: number) => n.toFixed(digits).replace(".", ",");

/**
 * CSV no padrão do Excel em português: separador ";", vírgula decimal
 * e BOM UTF-8 para os acentos abrirem corretamente.
 */
export function buildCsv(rows: ExportRow[]): string {
  const header = EXPORT_COLUMNS.map((c) => c.header).join(";");
  const lines = rows.map((row) =>
    EXPORT_COLUMNS.map(({ key }) => {
      const value = row[key];
      if (key === "rating") return value === null ? "" : decimal(value as number, 2);
      if (key === "hours") return decimal(value as number, 1);
      return escapeCell(sanitize(String(value ?? "")));
    }).join(";"),
  );
  return `﻿${[header, ...lines].join("\r\n")}\r\n`;
}
