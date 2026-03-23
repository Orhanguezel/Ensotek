import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },

  // Workspace root — bun hoisting nedeniyle next paketi üst dizinde çözümlenir
  turbopack: {
    root: path.resolve(import.meta.dirname, '..'),
  },

  // ✅ Image optimization config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8086',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ✅ kaldırıyoruz: /admin/dashboard -> /admin/dashboard/default
  async redirects() {
    return [
      // İstersen eski linkleri yakalamak için tersine redirect bırakabilirsin:
      // { source: '/admin/dashboard/default', destination: '/admin/dashboard', permanent: false },
    ];
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const apiBase = (
      process.env.PANEL_API_URL ||
      process.env.NEXT_PUBLIC_PANEL_API_URL ||
      'http://localhost:8086'
    ).replace(/\/+$/, '');

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' blob: data: https://res.cloudinary.com https://www.ensotek.de https://ensotek.de",
      `connect-src 'self' ${isDev ? apiBase : ''} ${(process.env.NEXT_PUBLIC_CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean).join(' ')} https://cdn.jsdelivr.net https://api.cloudinary.com`.trim(),
      "font-src 'self' https://fonts.gstatic.com data:",
      "object-src 'none'",
      `frame-src 'self' ${isDev ? apiBase : ''} https://www.ensotek.de https://ensotek.de`.trim(),
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ];
  },

  async rewrites() {
    const origin =
      process.env.PANEL_API_URL || process.env.NEXT_PUBLIC_PANEL_API_URL || 'http://localhost:8086';

    const base = String(origin).replace(/\/+$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${base}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${base}/uploads/:path*`,
      },
      {
        source: '/storage/:path*',
        destination: `${base}/api/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
