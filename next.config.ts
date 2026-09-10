import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads its built-in .afm font metrics from disk relative to its own
  // module directory, which breaks if the bundler inlines it. Required for the
  // PDF report export to work at runtime.
  serverExternalPackages: ["pdfkit"],

  images: {
    // Blog images are served from Sanity's CDN. next/image refuses any remote
    // host that is not listed here, so without this every post image 400s.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" }],
  },
};

export default nextConfig;
