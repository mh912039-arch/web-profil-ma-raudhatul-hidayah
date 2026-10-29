import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Manrope, Work_Sans } from 'next/font/google';
import './globals.css';
import { VisitorTracker } from '@/components/analytics/VisitorTracker';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['500', '600', '700', '800'],
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['500', '600', '700', '800'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
  weight: ['400', '500', '600'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e3a8a',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ma-raudlatul-hidayah.vercel.app'),
  title: 'MA Raudlatul Hidayah — Membentuk Generasi Berkarakter, Cerdas & Berintegritas',
  description: 'Portal Resmi MA Raudlatul Hidayah (Madrasah Aliyah). NPSN: 69941777, Mauk Tangerang Banten. Berlandaskan adab, Kurikulum Merdeka, dan keunggulan akademik.',
  keywords: 'MA Raudlatul Hidayah, MA Raudlatul Hidayah, MA Raudlatul Hidayah, Madrasah Aliyah Raudlatul Hidayah, Profil Madrasah Mauk, Tangerang Banten, Kurikulum Merdeka, NPSN 69941777',
  openGraph: {
    title: 'MA Raudlatul Hidayah — Madrasah Aliyah Unggulan Mauk Tangerang',
    description: 'Portal Resmi MA Raudlatul Hidayah (Madrasah Aliyah). NPSN: 69941777, Mauk Tangerang Banten. Berlandaskan adab, Kurikulum Merdeka, dan keunggulan akademik.',
    url: 'https://ma-raudlatul-hidayah.vercel.app',
    siteName: 'MA Raudlatul Hidayah',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/halaman-sekolah.jpeg',
        width: 1200,
        height: 630,
        alt: 'Kampus MA Raudlatul Hidayah Mauk',
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
      { url: '/school-logo.png', sizes: '180x180', type: 'image/png' },
    ],
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
  url: 'https://ma-raudlatul-hidayah.vercel.app',
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
    <html lang="id" className={`${playfair.variable} ${manrope.variable} ${workSans.variable}`}>
      <head>
        <link rel="icon" href="/school-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/school-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/school-logo.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
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
