import { SkeletonScreen, SkeletonPageHeader, SkeletonTable } from "@/components/admin/Skeleton";

export default function CtasLoading() {
  return (
    <SkeletonScreen label="Loading CTAs">
      <SkeletonPageHeader actions />
      <SkeletonTable
        columns={[
          {},
          { numeric: true },
          { numeric: true },
          { numeric: true },
          { numeric: true },
        ]}
        rows={9}
      />
    </SkeletonScreen>
  );
}
