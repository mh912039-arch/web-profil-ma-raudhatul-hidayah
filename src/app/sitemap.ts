import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ma-raudlatul-hidayah.vercel.app';
  const currentDate = new Date().toISOString();

  const publicRoutes = [
    '',
    '/profil',
    '/profil/visi-misi',
    '/profil/sejarah',
    '/profil/fasilitas',
    '/profil/guru-tendik',
    '/akademik',
    '/akademik/kurikulum',
    '/akademik/ekstrakurikuler',
    '/akademik/foto-juara',
    '/kesiswaan',
    '/prestasi',
    '/warta',
    '/galeri',
    '/kontak',
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' || route === '/warta' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/profil') || route.startsWith('/akademik') ? 0.8 : 0.7,
  }));
}
