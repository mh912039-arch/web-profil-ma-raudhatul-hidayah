/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Menghilangkan header 'X-Powered-By' agar tidak dapat di-fingerprint
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    domains: ['images.unsplash.com', 'picsum.photos', 'zzgobrlhnnqvspuwugkz.supabase.co'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 1. HTTP Strict Transport Security (HSTS) - Standar Maksimal A+ / Sucuri Minimal Risk
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // 2. Proteksi Clickjacking (Anti-Iframe Abuse)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 3. Pencegahan Eksploitasi MIME Type Sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 4. Filter Perlindungan Cross-Site Scripting (XSS)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // 5. Pembatasan Pengiriman Informasi Referrer
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 6. Pembatasan Izin Akses Perangkat Keras (Hardware Sandbox)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()',
          },
          // 7. Isolasi Cross-Origin Opener
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          // 8. Kontrol Prefetch DNS Aman
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // 9. Content Security Policy (CSP) Komprehensif
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://picsum.photos https://api.dicebear.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://api.dicebear.com https://vitals.vercel-insights.com",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
