import type { NextConfig } from 'next';

/**
 * Baseline response headers for every route.
 * Provisional: a Content-Security-Policy is intentionally NOT set yet — it depends on
 * auth, map and media providers that are still undecided (see docs/architecture.md).
 */
const baselineHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: '/:path*', headers: baselineHeaders }];
  },
};

export default nextConfig;
