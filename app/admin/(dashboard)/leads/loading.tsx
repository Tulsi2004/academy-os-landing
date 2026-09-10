import {
  SkeletonScreen,
  SkeletonPageHeader,
  SkeletonPills,
  SkeletonTable,
} from "@/components/admin/Skeleton";

export default function LeadsLoading() {
  return (
    <SkeletonScreen label="Loading leads">
      <SkeletonPageHeader actions />
      <SkeletonPills count={5} />
      <SkeletonTable columns={9} rows={10} />
    </SkeletonScreen>
  );
}
