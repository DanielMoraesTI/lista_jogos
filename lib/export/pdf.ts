import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import { SITE } from "@/lib/site";

import type { ExportRow } from "./columns";

/**
 * Remove caracteres fora do Latin-1 (ex.: emojis), que a fonte padrão
 * do PDF não consegue desenhar. Acentos do português são mantidos.
 */
function latin1(value: string) {
  return value.replace(/[^\u0000-ÿ]/g, "").trim();
}

export function buildPdf(rows: ExportRow[], subtitle: string): Buffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const exportedAt = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(109, 40, 217);
  doc.text(SITE.name, 14, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 110);
  doc.text(latin1(`${subtitle} · ${rows.length} jogos · exportado em ${exportedAt}`), 14, 21);

  autoTable(doc, {
    startY: 26,
    head: [["Nome", "Plataforma", "Status", "Nota", "Horas", "Comentário", "Concluído", "Atualizado"]],
    body: rows.map((r) => [
      latin1(r.title),
      r.platform,
      r.status,
      r.rating === null ? "-" : r.rating.toFixed(2).replace(".", ","),
      r.hours.toFixed(1).replace(".", ","),
      latin1(r.comment),
      r.completedAt || "-",
      r.updatedAt,
    ]),
    styles: { font: "helvetica", fontSize: 8, cellPadding: 1.8, overflow: "linebreak" },
    headStyles: { fillColor: [109, 40, 217], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [244, 241, 251] },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 28 },
      2: { cellWidth: 24 },
      3: { cellWidth: 13, halign: "right" },
      4: { cellWidth: 14, halign: "right" },
      5: { cellWidth: "auto" },
      6: { cellWidth: 20 },
      7: { cellWidth: 26 },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: () => {
      const pageSize = doc.internal.pageSize;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${doc.getNumberOfPages()}`,
        pageSize.getWidth() - 14,
        pageSize.getHeight() - 8,
        { align: "right" },
      );
    },
  });

  return Buffer.from(doc.output("arraybuffer"));
}
