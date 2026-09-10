import { SkeletonScreen, SkeletonPageHeader, SkeletonTable } from "@/components/admin/Skeleton";

export default function SessionsLoading() {
  return (
    <SkeletonScreen label="Loading sessions">
      <SkeletonPageHeader />
      <SkeletonTable
        columns={[
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          { numeric: true },
          { numeric: true },
          {},
          { width: 64 },
        ]}
        rows={10}
      />
    </SkeletonScreen>
  );
}
