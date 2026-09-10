import {
  SkeletonScreen,
  SkeletonPageHeader,
  SkeletonStatGrid,
  SkeletonCard,
  SkeletonChart,
  SkeletonFunnel,
  SkeletonTable,
} from "@/components/admin/Skeleton";

/**
 * Loading UI for the overview, and the fallback while the dashboard layout
 * verifies the session. Child routes declare their own, so this shape only
 * ever stands in for /admin itself.
 */
export default function OverviewLoading() {
  return (
    <SkeletonScreen label="Loading overview">
      <SkeletonPageHeader actions />
      <SkeletonStatGrid tiles={7} />

      <SkeletonCard title subtitle>
        <SkeletonChart height={240} />
      </SkeletonCard>

      <div className="adm-grid-2">
        <SkeletonCard title subtitle>
          <SkeletonFunnel stages={5} />
        </SkeletonCard>
        <SkeletonCard title subtitle>
          <SkeletonTable columns={4} rows={8} />
        </SkeletonCard>
      </div>

      <SkeletonCard title subtitle>
        <SkeletonTable
          columns={[{}, {}, {}, { numeric: true }, { numeric: true }, { numeric: true }]}
          rows={6}
        />
      </SkeletonCard>
    </SkeletonScreen>
  );
}
