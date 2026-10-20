import type { Metadata } from 'next';
import { Playfair_Display, Manrope, Work_Sans } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'MA Raudhatul Hidayah — Membentuk Generasi Berkarakter, Cerdas & Berintegritas',
  description: 'Portal Resmi MA Raudhatul Hidayah (Madrasah Aliyah). NPSN: 69941777, Mauk Tangerang Banten. Berlandaskan adab, Kurikulum Merdeka, dan keunggulan akademik.',
  keywords: 'MA Raudhatul Hidayah, Madrasah Aliyah Raudhatul Hidayah, Profil Madrasah Mauk, Tangerang Banten, Kurikulum Merdeka, NPSN 69941777',
};

import { VisitorTracker } from '@/components/analytics/VisitorTracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${manrope.variable} ${workSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
