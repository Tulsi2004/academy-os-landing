import { SkeletonScreen, SkeletonPageHeader, SkeletonTable } from "@/components/admin/Skeleton";

export default function ErrorsLoading() {
  return (
    <SkeletonScreen label="Loading errors">
      <SkeletonPageHeader />
      <SkeletonTable columns={[{}, { width: 88 }, { width: "90%" }, {}]} rows={10} />
    </SkeletonScreen>
  );
}
