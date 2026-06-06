import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Безпека зображень ───────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "crafatar.com", // Minecraft аватари
      },
    ],
  },

  // ── HTTP Security Headers ───────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control",  value: "on" },
          { key: "X-Frame-Options",         value: "DENY" },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-XSS-Protection",        value: "1; mode=block" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // ── Редіректи ─────────────────────────────────────────────
  async redirects() {
    return [
      // Редірект /auth → /auth/login
      { source: "/auth", destination: "/auth/login", permanent: false },
    ];
  },

  // ── Оптимізації ───────────────────────────────────────────
  compress: true,
  poweredByHeader: false, // Не показувати X-Powered-By: Next.js
};

export default nextConfig;
