import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SkeletonScreen, SkeletonText, Skeleton } from "@/components/Skeleton";

export default function ArticleLoading() {
  return (
    <>
      <SiteHeader />
      <SkeletonScreen label="Loading article">
        <header className="page-hero article-hero">
          <div className="container article-hero-inner">
            <Skeleton width={104} height={13} />
            <div className="post-card-tags" style={{ marginTop: 18 }}>
              <Skeleton width={72} height={22} radius={999} />
              <Skeleton width={58} height={22} radius={999} />
            </div>
            <Skeleton width="88%" height={42} radius={10} style={{ margin: "16px 0 8px" }} />
            <Skeleton width="64%" height={42} radius={10} />
            <div className="article-meta" style={{ marginTop: 20 }}>
              <Skeleton width={112} height={12} />
              <Skeleton width={92} height={12} />
              <Skeleton width={76} height={12} />
            </div>
          </div>
        </header>

        <main className="article-main">
          <div className="container article-container">
            <div className="article-cover">
              <Skeleton width="100%" height="100%" radius={0} />
            </div>
            <div className="article-body">
              <SkeletonText lines={3} />
              <div style={{ height: 28 }} />
              <Skeleton width="46%" height={24} radius={7} />
              <div style={{ height: 18 }} />
              <SkeletonText lines={5} />
              <div style={{ height: 28 }} />
              <SkeletonText lines={4} />
            </div>
          </div>
        </main>
      </SkeletonScreen>
      <SiteFooter />
    </>
  );
}
