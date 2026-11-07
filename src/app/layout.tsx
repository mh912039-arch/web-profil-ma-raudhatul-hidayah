import type { Metadata, Viewport } from 'next';
import './globals.css';
import { VisitorTracker } from '@/components/analytics/VisitorTracker';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e3a8a',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mas-raudlatul-hidayah.vercel.app'),
  title: 'MAS Raudlatul Hidayah — Membentuk Generasi Berkarakter, Cerdas & Berintegritas',
  description: 'Portal Resmi MAS Raudlatul Hidayah (Madrasah Aliyah Swasta). NPSN: 69941777, Mauk Tangerang Banten. Berlandaskan adab, Kurikulum Merdeka, dan keunggulan akademik.',
  keywords: 'MAS Raudlatul Hidayah, MAS Raudlatul Hidayah, Madrasah Aliyah Swasta Raudlatul Hidayah, Profil Madrasah Mauk, Tangerang Banten, Kurikulum Merdeka, NPSN 69941777',
  openGraph: {
    title: 'MAS Raudlatul Hidayah — Madrasah Aliyah Swasta Unggulan Mauk Tangerang',
    description: 'Portal Resmi MAS Raudlatul Hidayah (Madrasah Aliyah Swasta). NPSN: 69941777, Mauk Tangerang Banten. Berlandaskan adab, Kurikulum Merdeka, dan keunggulan akademik.',
    url: 'https://mas-raudlatul-hidayah.vercel.app',
    siteName: 'MAS Raudlatul Hidayah',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/halaman-sekolah.jpeg',
        width: 1200,
        height: 630,
        alt: 'Kampus MAS Raudlatul Hidayah Mauk',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/school-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/school-logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/school-logo.png',
    apple: [
      { url: '/icon-192.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MAS RH Mobile',
  },
  formatDetection: {
    telephone: false,
  },
};

const schoolJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'School',
  name: 'MA Raudlatul Hidayah',
  alternateName: [
    'MA Raudlatul Hidayah',
    'MA Raudlatul Hidayah',
    'Madrasah Aliyah Raudlatul Hidayah',
    'MA Raudlatul Hidayah',
    'MA Raudlatul Hidayah Mauk',
  ],
  url: 'https://mas-raudlatul-hidayah.vercel.app',
  logo: 'https://ma-raudlatul-hidayah.vercel.app/school-logo.png',
  image: 'https://ma-raudlatul-hidayah.vercel.app/halaman-sekolah.jpeg',
  telephone: '+628176614723',
  email: 'info@maraudlatulhidayah.sch.id',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01',
    addressLocality: 'Mauk',
    addressRegion: 'Kabupaten Tangerang',
    postalCode: '15330',
    addressCountry: 'ID',
  },
  identifier: {
    '@type': 'PropertyValue',
    name: 'NPSN',
    value: '69941777',
  },
  sameAs: [
    'https://www.instagram.com/ma_raudlatulhidayah/',
    'https://www.tiktok.com/@ma_raudlatulhidayah',
    'https://maps.app.goo.gl/4dKTkXuw5VBhmgACA',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/school-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/school-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/school-logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
