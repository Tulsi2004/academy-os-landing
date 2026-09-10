import {
  SkeletonScreen,
  SkeletonPageHeader,
  SkeletonCard,
  Skeleton,
} from "@/components/admin/Skeleton";

export default function ReplayLoading() {
  return (
    <SkeletonScreen label="Loading session replay">
      <SkeletonPageHeader actions />
      <SkeletonCard title={false} subtitle>
        {/* The player viewport, then its transport controls. */}
        <Skeleton width="100%" height={480} radius={10} />
        <div className="adm-row" style={{ marginTop: 14 }}>
          <Skeleton width={36} height={36} radius={999} />
          <Skeleton width="100%" height={8} radius={999} />
          <Skeleton width={64} height={12} />
        </div>
      </SkeletonCard>
    </SkeletonScreen>
  );
}
