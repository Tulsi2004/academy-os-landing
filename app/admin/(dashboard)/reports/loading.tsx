import {
  SkeletonScreen,
  SkeletonPageHeader,
  SkeletonStatGrid,
  SkeletonCard,
  SkeletonTable,
  Skeleton,
} from "@/components/admin/Skeleton";

export default function ReportsLoading() {
  return (
    <SkeletonScreen label="Loading reports">
      <SkeletonPageHeader />

      <SkeletonCard title subtitle>
        <SkeletonPillRow />
      </SkeletonCard>

      <SkeletonStatGrid tiles={9} />

      <SkeletonCard title subtitle>
        <SkeletonPillRow />
      </SkeletonCard>

      <SkeletonCard title subtitle>
        <SkeletonTable columns={[{}, {}, {}, { numeric: true }]} rows={6} />
      </SkeletonCard>
    </SkeletonScreen>
  );
}

/** The range selector and the export buttons are both rows of small controls. */
function SkeletonPillRow() {
  return (
    <div className="adm-row">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} width={116} height={32} radius={8} />
      ))}
    </div>
  );
}
