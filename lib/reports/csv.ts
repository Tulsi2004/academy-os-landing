export type CsvValue = string | number | boolean | Date | null | undefined;

function cell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();

  let text = String(value);

  // CSV injection guard: a leading =, +, - or @ makes Excel/Sheets evaluate the
  // cell as a formula. Lead names and messages are attacker-controlled.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;

  if (/["\n\r,]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

/** Builds an RFC 4180 CSV. BOM-prefixed so Excel reads UTF-8 correctly. */
export function toCsv(headers: string[], rows: CsvValue[][]): string {
  const lines = [headers.map(cell).join(","), ...rows.map((row) => row.map(cell).join(","))];
  return `﻿${lines.join("\r\n")}\r\n`;
}

export function csvResponse(filename: string, body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
