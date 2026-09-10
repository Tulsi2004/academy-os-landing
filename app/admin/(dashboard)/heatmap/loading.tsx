import {
  SkeletonScreen,
  SkeletonPageHeader,
  SkeletonPills,
  SkeletonCard,
  Skeleton,
} from "@/components/admin/Skeleton";

export default function HeatmapLoading() {
  return (
    <SkeletonScreen label="Loading heatmap">
      <SkeletonPageHeader />
      <SkeletonPills count={4} />
      <SkeletonPills count={2} />
      <SkeletonCard title={false} subtitle>
        {/* Stands in for the page screenshot the overlay is plotted on. */}
        <Skeleton width="100%" height={460} radius={10} />
      </SkeletonCard>
    </SkeletonScreen>
  );
}
