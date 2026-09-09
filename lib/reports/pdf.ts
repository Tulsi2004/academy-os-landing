import PDFDocument from "pdfkit";

/**
 * PDF summary export.
 *
 * pdfkit loads its built-in .afm font metrics from disk relative to its own
 * module directory, so it must stay unbundled — see `serverExternalPackages`
 * in next.config.ts.
 */

export type PdfStat = { label: string; value: string };
export type PdfTable = { title: string; headers: string[]; rows: string[][] };

export type PdfSpec = {
  title: string;
  subtitle?: string;
  stats: PdfStat[];
  tables?: PdfTable[];
};

const PAGE_MARGIN = 50;
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const RULE = "#dcdcdc";

export async function buildSummaryPdf(spec: PdfSpec): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: PAGE_MARGIN, bufferPages: true });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<void>((resolve, reject) => {
    doc.on("end", () => resolve());
    doc.on("error", reject);
  });

  const contentWidth = doc.page.width - PAGE_MARGIN * 2;

  // --- Header ---
  doc.font("Helvetica-Bold").fontSize(20).fillColor(INK).text(spec.title);
  if (spec.subtitle) {
    doc.moveDown(0.25);
    doc.font("Helvetica").fontSize(10).fillColor(MUTED).text(spec.subtitle);
  }
  doc.moveDown(0.75);
  doc
    .strokeColor(RULE)
    .lineWidth(1)
    .moveTo(PAGE_MARGIN, doc.y)
    .lineTo(PAGE_MARGIN + contentWidth, doc.y)
    .stroke();
  doc.moveDown(1);

  // --- Stat grid (three across) ---
  const columns = 3;
  const cellWidth = contentWidth / columns;
  const rowHeight = 46;
  let gridTop = doc.y;

  spec.stats.forEach((stat, index) => {
    const column = index % columns;
    if (column === 0 && index > 0) gridTop += rowHeight;

    if (gridTop + rowHeight > doc.page.height - PAGE_MARGIN) {
      doc.addPage();
      gridTop = doc.y;
    }

    const x = PAGE_MARGIN + column * cellWidth;
    doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(stat.label, x, gridTop, {
      width: cellWidth - 10,
    });
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(INK)
      .text(stat.value, x, gridTop + 14, { width: cellWidth - 10 });
  });

  doc.y = gridTop + rowHeight;
  doc.x = PAGE_MARGIN;

  // --- Tables ---
  for (const table of spec.tables ?? []) {
    doc.moveDown(1);
    if (doc.y > doc.page.height - PAGE_MARGIN - 90) doc.addPage();

    doc.font("Helvetica-Bold").fontSize(12).fillColor(INK).text(table.title, PAGE_MARGIN, doc.y);
    doc.moveDown(0.5);

    const columnWidth = contentWidth / Math.max(table.headers.length, 1);

    const writeRow = (cells: string[], bold: boolean) => {
      if (doc.y > doc.page.height - PAGE_MARGIN - 30) doc.addPage();
      const top = doc.y;
      let tallest = 0;

      cells.forEach((cell, index) => {
        doc
          .font(bold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(9)
          .fillColor(bold ? INK : MUTED)
          .text(cell, PAGE_MARGIN + index * columnWidth, top, {
            width: columnWidth - 8,
            ellipsis: true,
            lineBreak: false,
          });
        tallest = Math.max(tallest, doc.y - top);
      });

      doc.y = top + Math.max(tallest, 12) + 4;
      doc.x = PAGE_MARGIN;
    };

    writeRow(table.headers, true);
    doc
      .strokeColor(RULE)
      .lineWidth(0.5)
      .moveTo(PAGE_MARGIN, doc.y - 2)
      .lineTo(PAGE_MARGIN + contentWidth, doc.y - 2)
      .stroke();

    for (const row of table.rows) writeRow(row, false);
  }

  // --- Footer on every page ---
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(MUTED)
      .text(
        `Generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC  ·  page ${i + 1} of ${range.count}`,
        PAGE_MARGIN,
        doc.page.height - PAGE_MARGIN + 12,
        { width: contentWidth, align: "center", lineBreak: false },
      );
  }

  doc.end();
  await done;
  return Buffer.concat(chunks);
}

export function pdfResponse(filename: string, body: Buffer): Response {
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
