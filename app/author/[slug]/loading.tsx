import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  SkeletonScreen,
  SkeletonPostGrid,
  SkeletonText,
  Skeleton,
} from "@/components/Skeleton";

export default function AuthorLoading() {
  return (
    <>
      <SiteHeader />
      <SkeletonScreen label="Loading author">
        <header className="page-hero author-hero">
          <div className="container page-hero-inner">
            <Skeleton width={92} height={92} radius={999} />
            <Skeleton width={104} height={12} style={{ marginTop: 18 }} />
            <Skeleton width="42%" height={36} radius={9} style={{ margin: "12px 0 8px" }} />
            <Skeleton width={168} height={13} />
          </div>
        </header>

        <main className="blog-main">
          <div className="container">
            <div className="author-bio">
              <SkeletonText lines={3} width="72%" />
            </div>
            <Skeleton width={188} height={20} radius={6} style={{ margin: "36px 0 22px" }} />
            <SkeletonPostGrid count={3} />
          </div>
        </main>
      </SkeletonScreen>
      <SiteFooter />
    </>
  );
}
