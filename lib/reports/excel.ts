import ExcelJS from "exceljs";

export type SheetSpec = {
  name: string;
  headers: string[];
  rows: Array<Array<string | number | Date | null | undefined>>;
};

/** Builds a multi-sheet .xlsx workbook in memory. */
export async function buildWorkbookBuffer(sheets: SheetSpec[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();

  for (const spec of sheets) {
    // Excel sheet names cannot exceed 31 chars or contain : \ / ? * [ ]
    const safeName = spec.name.replace(/[:\\/?*[\]]/g, "-").slice(0, 31);
    const sheet = workbook.addWorksheet(safeName);

    sheet.addRow(spec.headers);
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: "middle" };

    for (const row of spec.rows) {
      sheet.addRow(row.map((v) => (v === undefined ? null : v)));
    }

    // Size each column to its widest value, within reason.
    sheet.columns.forEach((column, index) => {
      const header = spec.headers[index] ?? "";
      let widest = header.length;
      for (const row of spec.rows) {
        const value = row[index];
        const length = value instanceof Date ? 20 : String(value ?? "").length;
        if (length > widest) widest = length;
      }
      column.width = Math.min(Math.max(widest + 2, 10), 60);
    });

    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function xlsxResponse(filename: string, body: Buffer): Response {
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
