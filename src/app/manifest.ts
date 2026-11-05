import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MAS RH Mobile',
    short_name: 'MAS RH Mobile',
    description: 'Portal Akademik, Jadwal Pelajaran, dan Layanan MAS Raudlatul Hidayah',
    start_url: '/admin',
    id: '/admin',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Jadwal Pelajaran',
        short_name: 'Jadwal',
        description: 'Buka Jadwal Pelajaran dan Agenda Mengajar',
        url: '/admin',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Masuk Portal',
        short_name: 'Masuk',
        description: 'Masuk ke Portal Madrasah',
        url: '/masuk',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
