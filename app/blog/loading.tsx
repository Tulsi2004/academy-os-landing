import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  SkeletonScreen,
  SkeletonPageHero,
  SkeletonPostGrid,
  Skeleton,
} from "@/components/Skeleton";

/**
 * Shown while the index waits on Sanity. The header and footer are repeated
 * here because the blog pages render their own chrome rather than inheriting it
 * from a layout — without them the page would lose its frame mid-load.
 */
export default function BlogLoading() {
  return (
    <>
      <SiteHeader />
      <SkeletonScreen label="Loading blog">
        <SkeletonPageHero lines={2} />
        <section className="blog-main">
          <div className="container">
            <div className="blog-search">
              <Skeleton width="100%" height={48} radius={10} />
            </div>
            <SkeletonPostGrid count={6} />
          </div>
        </section>
      </SkeletonScreen>
      <SiteFooter />
    </>
  );
}
