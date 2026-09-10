import { SkeletonScreen, SkeletonPageHeader, SkeletonTable } from "@/components/admin/Skeleton";

export default function FormsLoading() {
  return (
    <SkeletonScreen label="Loading forms">
      <SkeletonPageHeader actions />
      <SkeletonTable
        columns={[
          {},
          { numeric: true },
          { numeric: true },
          { numeric: true },
          { numeric: true },
          { numeric: true },
          { numeric: true },
        ]}
        rows={7}
      />
    </SkeletonScreen>
  );
}
