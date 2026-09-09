import { verifyAdminSession } from "@/lib/auth/dal";
import { SITE, SITE_LABEL } from "@/lib/site";
import { getReportOverview, resolveReportRange } from "@/lib/admin/reports";
import { getDailyTimeSeries } from "@/lib/admin/queries";
import { csvResponse, toCsv } from "@/lib/reports/csv";
import { buildWorkbookBuffer, xlsxResponse } from "@/lib/reports/excel";
import { buildSummaryPdf, pdfResponse } from "@/lib/reports/pdf";

/** GET /api/reports/overview?format=csv|xlsx|pdf&range=30d (or &from=&to=) */
export async function GET(request: Request) {
  await verifyAdminSession();

  const params = new URL(request.url).searchParams;
  const format = params.get("format") ?? "csv";

  const range = resolveReportRange({
    range: params.get("range") ?? undefined,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
  });

  const overview = await getReportOverview(range);
  const stamp = range.from.toISOString().slice(0, 10);
  const base = `${SITE}-overview-${stamp}`;

  const stats: Array<[string, string | number]> = [
    ["Visitors", overview.visitors],
    ["Sessions", overview.sessions],
    ["Page views", overview.pageViews],
    ["Leads", overview.leads],
    ["Conversion rate", `${overview.conversionRate.toFixed(2)}%`],
    ["Bounce rate", `${overview.bounceRate.toFixed(2)}%`],
    ["Avg session duration", `${overview.avgDurationSeconds}s`],
    ["CTA clicks", overview.ctaClicks],
    ["JS errors", overview.errors],
  ];

  if (format === "csv") {
    const sections = [
      toCsv(["Metric", "Value"], stats.map(([label, value]) => [label, value])),
      "\r\n",
      toCsv(
        ["Source", "Medium", "Campaign", "Sessions", "Leads"],
        overview.sources.map((s) => [s.source, s.medium, s.campaign, s.sessions, s.leads]),
      ),
    ];
    return csvResponse(`${base}.csv`, sections.join(""));
  }

  if (format === "xlsx") {
    const series = await getDailyTimeSeries(range.days);
    const buffer = await buildWorkbookBuffer([
      {
        name: "Overview",
        headers: ["Metric", "Value"],
        rows: stats.map(([label, value]) => [label, value]),
      },
      {
        name: "Traffic sources",
        headers: ["Source", "Medium", "Campaign", "Sessions", "Leads"],
        rows: overview.sources.map((s) => [s.source, s.medium, s.campaign, s.sessions, s.leads]),
      },
      {
        name: "Daily",
        headers: ["Date", "Visitors", "Sessions", "Leads"],
        rows: series.map((p) => [p.date, p.visitors, p.sessions, p.leads]),
      },
    ]);
    return xlsxResponse(`${base}.xlsx`, buffer);
  }

  if (format === "pdf") {
    const buffer = await buildSummaryPdf({
      title: `${SITE_LABEL} — traffic overview`,
      subtitle: range.label,
      stats: stats.map(([label, value]) => ({ label, value: String(value) })),
      tables: [
        {
          title: "Traffic sources",
          headers: ["Source", "Medium", "Campaign", "Sessions", "Leads"],
          rows: overview.sources
            .slice(0, 20)
            .map((s) => [s.source, s.medium, s.campaign, String(s.sessions), String(s.leads)]),
        },
      ],
    });
    return pdfResponse(`${base}.pdf`, buffer);
  }

  return Response.json({ error: "Unsupported format. Use csv, xlsx or pdf." }, { status: 400 });
}
