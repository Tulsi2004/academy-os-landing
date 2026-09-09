import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads its built-in .afm font metrics from disk relative to its own
  // module directory, which breaks if the bundler inlines it. Required for the
  // PDF report export to work at runtime.
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
