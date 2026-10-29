'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

const defaultFacilities = [
  {
    id: 'fac-1',
    title: 'Ruang Kelas',
    subtitle: 'KBM Interaktif & Nyaman',
    desc: 'Ruang kelas yang bersih, sejuk, dan kondusif dengan pencahayaan alami optimal, proyektor multimedia, serta tata letak meja fleksibel untuk kegiatan diskusi dan belajar aktif.',
    image: '/kelas.jpeg',
    badge: 'Sarana Akademik',
  },
  {
    id: 'fac-2',
    title: 'Perpustakaan',
    subtitle: 'Literasi & Khazanah Ilmu',
    desc: 'Koleksi buku Kurikulum Merdeka terlengkap, ensiklopedia sains, referensi umum, ruang baca berkarpet, serta khazanah kitab keagamaan untuk menunjang budaya riset santri.',
    image: '/perpus2.jpeg',
    badge: 'Pusat Sumber Belajar',
  },
  {
    id: 'fac-3',
    title: 'Musholla Sekolah',
    subtitle: 'Ibadah & Pembiasaan Adab',
    desc: 'Sarana ibadah representatif untuk pelaksanaan salat fardhu berjamaah, salat dhuha rutin, tadarus dan tahfidz Al-Qur’an harian, serta pembinaan adab santun santri.',
    image: '/musholla.jpg',
    badge: 'Karakter & Spiritual',
  },
  {
    id: 'fac-4',
    title: 'Lapangan Olahraga',
    subtitle: 'Kebugaran & Prestasi Terbuka',
    desc: 'Area lapangan terbuka multifungsi berstandar untuk kegiatan olahraga futsal, basket, voli, upacara bendera mingguan, apel kesiapsiagaan, dan latihan kepanduan pramuka.',
    image: '/halaman-sekolah.jpeg',
    badge: 'Area Multifungsi',
  },
];

export default function FasilitasPage() {
  const [facilities, setFacilities] = useState(defaultFacilities);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.facilities && Array.isArray(data.facilities) && data.facilities.length > 0) {
          setFacilities(data.facilities);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic facilities:', err));
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-12 sm:py-20 bg-[#fbfbfa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-8 border-b border-slate-200/80">
              <div>
                <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                  Fasilitas Belajar Siswa
                </h1>
                <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-600 max-w-xl leading-relaxed">
                  Sarana dan prasarana representatif penunjang proses pembelajaran interaktif, penguatan literasi digital, pembiasaan ibadah harian, dan kebugaran santri.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {facilities.map((fac, idx) => (
                <div
                  key={fac.id || fac.title}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative w-full aspect-[16/10] bg-surface-container overflow-hidden">
                    <Image
                      src={fac.image || '/kelas.jpeg'}
                      alt={fac.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-primary font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {fac.badge || 'Fasilitas'}
                    </span>
                    <span className="absolute bottom-4 left-4 text-white font-sans text-[12px] font-semibold drop-shadow-sm">
                      0{idx + 1} • {fac.subtitle}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <h3 className="font-display text-[20px] font-bold text-primary group-hover:text-blue-700 transition-colors">
                        {fac.title}
                      </h3>
                      <p className="font-sans text-[14px] text-on-surface-variant mt-2 leading-relaxed">
                        {fac.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-surface-container flex items-center justify-between text-[12.5px] text-slate-500 font-medium">
                      <span>MAS Raudhatul Hidayah</span>
                      <span className="text-secondary font-semibold">Tersedia &amp; Terawat</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  );
}
