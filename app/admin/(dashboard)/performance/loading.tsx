import {
  SkeletonScreen,
  SkeletonPageHeader,
  SkeletonCard,
  SkeletonTable,
} from "@/components/admin/Skeleton";

export default function PerformanceLoading() {
  return (
    <SkeletonScreen label="Loading performance">
      <SkeletonPageHeader actions />
      <SkeletonTable
        columns={[{}, { numeric: true }, { numeric: true }, { width: "88%" }, { numeric: true }]}
        rows={5}
      />
      <SkeletonCard title={false} subtitle />
    </SkeletonScreen>
  );
}
