import { verifyAdminSession } from "@/lib/auth/dal";
import { SITE } from "@/lib/site";
import { getReportLeads, resolveReportRange } from "@/lib/admin/reports";
import { csvResponse, toCsv } from "@/lib/reports/csv";
import { buildWorkbookBuffer, xlsxResponse } from "@/lib/reports/excel";

const HEADERS = [
  "Created at",
  "Name",
  "Email",
  "Phone",
  "Company",
  "Interest",
  "Message",
  "Status",
  "Source",
  "Form",
  "UTM source",
  "UTM medium",
  "UTM campaign",
  "Referrer",
  "Country",
  "City",
  "Device",
];

/** GET /api/reports/leads?format=csv|xlsx&range=30d (or &from=&to=) */
export async function GET(request: Request) {
  await verifyAdminSession();

  const params = new URL(request.url).searchParams;
  const format = params.get("format") ?? "csv";

  const range = resolveReportRange({
    range: params.get("range") ?? undefined,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
  });

  const leads = await getReportLeads(range);
  const stamp = range.from.toISOString().slice(0, 10);
  const base = `${SITE}-leads-${stamp}`;

  const rows = leads.map((lead) => [
    lead.createdAt,
    lead.name,
    lead.email,
    lead.phone,
    lead.company,
    lead.interest,
    lead.message,
    lead.status,
    lead.source,
    lead.formId,
    lead.session?.utmSource,
    lead.session?.utmMedium,
    lead.session?.utmCampaign,
    lead.session?.referrer,
    lead.visitor?.country,
    lead.visitor?.city,
    lead.visitor?.deviceType,
  ]);

  if (format === "csv") {
    return csvResponse(`${base}.csv`, toCsv(HEADERS, rows));
  }

  if (format === "xlsx") {
    const buffer = await buildWorkbookBuffer([
      { name: "Leads", headers: HEADERS, rows },
    ]);
    return xlsxResponse(`${base}.xlsx`, buffer);
  }

  return Response.json({ error: "Unsupported format. Use csv or xlsx." }, { status: 400 });
}
