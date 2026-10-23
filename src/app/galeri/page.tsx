import React from 'react';
import type { Metadata } from 'next';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import { GalleryMasonry } from '@/components/sections/GalleryMasonry';

export const metadata: Metadata = {
  title: 'Galeri Foto Kegiatan — MAS Raudhatul Hidayah',
  description: 'Dokumentasi visual kegiatan belajar, perpustakaan, halaman sekolah, dan agenda siswa MAS Raudhatul Hidayah.',
};

export default function GaleriPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="relative w-full bg-surface-container-lowest overflow-hidden border-b border-surface-container py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-secondary text-[12px] font-bold uppercase tracking-wider mb-3 border border-secondary/10">
                <span className="material-symbols-outlined text-[16px]">photo_library</span>
                <span>Dokumentasi Visual Sekolah</span>
              </div>
              <h1 className="font-display text-[32px] sm:text-[44px] font-extrabold text-primary tracking-tight leading-tight">
                Galeri Kegiatan &amp; Dinamika Santri
              </h1>
              <p className="font-sans text-[16px] text-on-surface-variant mt-2 leading-relaxed">
                Merekam jejak khidmah, keceriaan santri, serta kekhidmatan majelis ilmu di lingkungan sekolah MAS Raudhatul Hidayah, Kecamatan Mauk, Kabupaten Tangerang.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <GalleryMasonry />
      </main>

      <StitchFooter />
    </div>
  );
}
