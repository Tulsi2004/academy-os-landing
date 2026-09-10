import {
  SkeletonScreen,
  SkeletonPageHeader,
  SkeletonCard,
  SkeletonFunnel,
  SkeletonTable,
} from "@/components/admin/Skeleton";

export default function FunnelsLoading() {
  return (
    <SkeletonScreen label="Loading funnels">
      <SkeletonPageHeader actions />
      <SkeletonCard title>
        <SkeletonFunnel stages={6} />
      </SkeletonCard>
      <SkeletonCard title>
        <SkeletonTable
          columns={[{}, { numeric: true }, { numeric: true }, { numeric: true }]}
          rows={6}
        />
      </SkeletonCard>
    </SkeletonScreen>
  );
}
