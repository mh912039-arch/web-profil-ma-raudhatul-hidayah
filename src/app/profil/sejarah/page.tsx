'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

interface MilestoneItem {
  year?: string;
  badge?: string;
  title: string;
  desc: string;
}

interface HistoryData {
  title: string;
  subtitle: string;
  lead: string;
  paragraphs?: string[];
  image?: string;
  imageCaptionTitle?: string;
  imageCaptionSubtitle?: string;
  stat1Label?: string;
  stat1Value?: string;
  stat2Label?: string;
  stat2Value?: string;
  periodSectionTitle?: string;
  periodSectionSubtitle?: string;
  milestones: MilestoneItem[];
}

const defaultHistory: HistoryData = {
  title: 'Dedikasi Membangun Generasi di Mauk',
  subtitle: 'Tonggak Sejarah',
  lead: 'Bermula dari kepedulian tulus para tokoh masyarakat terhadap masa depan pendidikan generasi muda di pesisir utara Kabupaten Tangerang, yayasan telah melangkah konsisten menghadirkan akses pendidikan Islam yang berkualitas, beradab, dan terjangkau.',
  paragraphs: [
    'Bermula dari kepedulian tulus para tokoh masyarakat terhadap masa depan pendidikan generasi muda di pesisir utara Kabupaten Tangerang, yayasan telah melangkah konsisten menghadirkan akses pendidikan Islam yang berkualitas, beradab, dan terjangkau.',
  ],
  image: '/halaman-sekolah.jpeg',
  imageCaptionTitle: 'Lingkungan Gedung Utama MAS Raudlatul Hidayah',
  imageCaptionSubtitle: 'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01, Desa Tanjung Anom, Kec. Mauk',
  stat1Label: 'Tahun Berdiri',
  stat1Value: '2015',
  stat2Label: 'NPSN Resmi',
  stat2Value: '69941777',
  periodSectionTitle: 'Periodisasi Perkembangan Sekolah',
  periodSectionSubtitle:
    'Tahapan pertumbuhan kelembagaan dan pemenuhan sarana pendidikan sejak awal berdiri hingga saat ini.',
  milestones: [
    {
      year: '2015',
      title: 'Pendirian & Pembukaan Layanan Pendidikan',
      desc: 'MAS Raudlatul Hidayah mulai beroperasi di Desa Tanjung Anom untuk menjawab kebutuhan akses pendidikan menengah Islam bagi lulusan sekolah dasar dan madrasah tsanawiyah di wilayah Kecamatan Mauk yang sebelumnya harus menempuh jarak jauh.',
    },
    {
      year: '2016 – 2020',
      title: 'Penguatan Kelembagaan & Penataan Ruang Belajar',
      desc: 'Penetapan kelembagaan resmi di bawah Kementerian Agama (NPSN 69941777) disertai pembangunan ruang kelas permanen, sarana musholla, serta penataan lapangan upacara dan olahraga.',
    },
    {
      year: '2021 – 2023',
      title: 'Peningkatan Sarana Penunjang & Akreditasi',
      desc: 'Pemenuhan fasilitas perpustakaan, sarana praktikum komputer, serta pencapaian peringkat Akreditasi dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M).',
    },
    {
      year: '2024 – Sekarang',
      title: 'Pelaksanaan Kurikulum Merdeka & Pembinaan Bakat',
      desc: 'Penerapan Kurikulum Merdeka secara bertahap, penguatan kegiatan ekstrakurikuler kepanduan Pramuka, olahraga, seni Islami, serta penataan lingkungan belajar yang bersih dan asri.',
    },
  ],
};

export default function SejarahPage() {
  const [history, setHistory] = useState<HistoryData>(defaultHistory);

  useEffect(() => {
    fetch('/api/profile?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.history) {
          const h = data.history;
          const splitParas =
            typeof h.lead === 'string' && h.lead.trim().length > 0
              ? h.lead
                  .split(/\n\s*\n/)
                  .map((p: string) => p.trim())
                  .filter(Boolean)
              : Array.isArray(h.paragraphs) && h.paragraphs.length > 0
              ? h.paragraphs
              : [];

          setHistory((prev) => ({
            ...prev,
            title: typeof h.title === 'string' && h.title ? h.title : prev.title,
            subtitle: typeof h.subtitle === 'string' ? h.subtitle : prev.subtitle,
            lead: typeof h.lead === 'string' ? h.lead : prev.lead,
            paragraphs: splitParas.length > 0 ? splitParas : prev.paragraphs,
            image: h.image || prev.image,
            imageCaptionTitle: typeof h.imageCaptionTitle === 'string' ? h.imageCaptionTitle : prev.imageCaptionTitle,
            imageCaptionSubtitle:
              typeof h.imageCaptionSubtitle === 'string' ? h.imageCaptionSubtitle : prev.imageCaptionSubtitle,
            stat1Label: typeof h.stat1Label === 'string' ? h.stat1Label : prev.stat1Label,
            stat1Value: typeof h.stat1Value === 'string' ? h.stat1Value : data.profile?.foundedYear || prev.stat1Value,
            stat2Label: typeof h.stat2Label === 'string' ? h.stat2Label : prev.stat2Label,
            stat2Value: typeof h.stat2Value === 'string' ? h.stat2Value : data.profile?.npsn || prev.stat2Value,
            periodSectionTitle:
              typeof h.periodSectionTitle === 'string' ? h.periodSectionTitle : prev.periodSectionTitle,
            periodSectionSubtitle:
              typeof h.periodSectionSubtitle === 'string' ? h.periodSectionSubtitle : prev.periodSectionSubtitle,
            milestones: Array.isArray(h.milestones) ? h.milestones : prev.milestones,
          }));
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic history:', err));
  }, []);

  // Membagi paragraf secara otomatis jika data berasal dari teks tunggal 'lead'
  const renderedParagraphs = useMemo(() => {
    if (typeof history.lead === 'string' && history.lead.trim().length > 0) {
      return history.lead
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }
    if (Array.isArray(history.paragraphs) && history.paragraphs.length > 0) {
      return history.paragraphs.filter((p) => typeof p === 'string' && p.trim().length > 0);
    }
    return defaultHistory.paragraphs || [];
  }, [history.lead, history.paragraphs]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fbfbfa] font-sans text-slate-800">
      <StitchNavbar />

      <main className="w-full flex-grow pt-28 sm:pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* =========================================================
              BAGIAN ATAS (SESUAI SSAN GAMBAR 1): Narasi & Foto Gedung
          ========================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Kolom Kiri: Judul Besar Editorial & Paragraf Narasi */}
            <div className="lg:col-span-7 flex flex-col">
              {history.subtitle && (
                <div className="mb-3.5">
                  <span className="font-sans font-bold text-[13px] sm:text-[14px] text-[#1e3a8a] tracking-[0.16em] uppercase">
                    {history.subtitle}
                  </span>
                </div>
              )}

              <h1 className="font-serif text-[32px] sm:text-[44px] lg:text-[48px] font-bold text-slate-900 leading-[1.15] tracking-tight mb-6 sm:mb-8">
                {history.title}
              </h1>

              {/* Paragraf-paragraf Sejarah (Tipografi Tajam & Jelas) */}
              <div className="space-y-5 text-[15px] sm:text-[16px] text-slate-700 leading-relaxed font-sans">
                {renderedParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Kolom Kanan: Foto Gedung Utama + Keterangan + 2 Kotak Statistik */}
            <div className="lg:col-span-5 flex flex-col">
              {/* Kartu Foto Gedung dengan Keterangan Bawah */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md">
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                  <Image
                    src={history.image || '/halaman-sekolah.jpeg'}
                    alt={history.imageCaptionTitle || history.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="p-4 sm:p-5 bg-white border-t border-slate-100">
                  <h2 className="font-sans font-bold text-[14.5px] sm:text-[15px] text-slate-900 leading-snug">
                    {history.imageCaptionTitle || 'Lingkungan Gedung Utama MAS Raudlatul Hidayah'}
                  </h2>
                  <p className="font-sans text-[12px] sm:text-[12.5px] text-slate-500 mt-1 leading-normal">
                    {history.imageCaptionSubtitle ||
                      'Jl. Raya Tanjung Kait No. 33, RT 02 / RW 01, Desa Tanjung Anom, Kec. Mauk'}
                  </p>
                </div>
              </div>

              {/* 2 Kotak Statistik Berdampingan di Bawah Foto (Tahun Berdiri & NPSN Resmi) */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="font-sans text-[12px] font-medium text-slate-500 block">
                    {history.stat1Label || 'Tahun Berdiri'}
                  </span>
                  <span className="font-serif text-[26px] sm:text-[30px] font-bold text-slate-900 mt-1 block tracking-tight">
                    {history.stat1Value || '2015'}
                  </span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="font-sans text-[12px] font-medium text-slate-500 block">
                    {history.stat2Label || 'NPSN Resmi'}
                  </span>
                  <span className="font-serif text-[26px] sm:text-[30px] font-bold text-slate-900 mt-1 block tracking-tight">
                    {history.stat2Value || '69941777'}
                  </span>
                </div>
              </div>
            </div>

          </section>

          {/* =========================================================
              BAGIAN BAWAH (SESUAI SSAN GAMBAR 2 & 3): Periodisasi Perkembangan
          ========================================================= */}
          <section className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-slate-200/80">
            <div className="mb-6 sm:mb-8">
              <h2 className="font-serif text-[28px] sm:text-[36px] font-bold text-slate-900 tracking-tight leading-tight">
                {history.periodSectionTitle || 'Periodisasi Perkembangan Sekolah'}
              </h2>
              <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-600 mt-2 max-w-3xl leading-relaxed">
                {history.periodSectionSubtitle ||
                  'Tahapan pertumbuhan kelembagaan dan pemenuhan sarana pendidikan sejak awal berdiri hingga saat ini.'}
              </p>
            </div>

            {/* Kartu Daftar Periodisasi Garis Waktu */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 divide-y divide-slate-100">
              {history.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start gap-3 sm:gap-8 py-6 sm:py-8 first:pt-2 last:pb-2"
                >
                  {/* Kolom Kiri: Tahun / Periode (Warna Navy MAS Sesuai Web Profil MAS) */}
                  <div className="w-full sm:w-48 lg:w-56 shrink-0 font-bold text-[16px] sm:text-[17px] text-[#1e3a8a] tracking-tight leading-snug">
                    {m.year || m.badge || 'Tahun'}
                  </div>

                  {/* Kolom Kanan: Judul Peristiwa & Deskripsi Lengkap */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <h3 className="font-sans text-[16.5px] sm:text-[18px] font-bold text-slate-900 leading-snug">
                      {m.title}
                    </h3>
                    <p className="font-sans text-[14px] sm:text-[14.5px] text-slate-600 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <StitchFooter />
    </div>
  );
}