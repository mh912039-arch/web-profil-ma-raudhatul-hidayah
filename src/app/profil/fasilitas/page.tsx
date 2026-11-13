'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Users,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

interface FacilityItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  badge: string;
  location?: string;
  capacity?: string;
  specs?: string[];
}

const defaultFacilities: FacilityItem[] = [
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

const FACILITY_METADATA: Record<
  string,
  { specs: string[]; capacity: string; location: string; hours?: string }
> = {
  'ruang kelas': {
    capacity: '32 - 36 Meja & Kursi Santri per Kelas',
    location: 'Gedung Pembelajaran Lantai 1 & 2',
    hours: 'Setiap Hari Efektif KBM (07.00 - 15.00 WIB)',
    specs: [
      'Pendingin Udara (AC) & Sirkulasi Alami Sehat',
      'Proyektor LCD Interaktif & Screen Wall Presentasi',
      'Papan Tulis Ganda (Whiteboard & Mading Portofolio)',
      'Meja & Kursi Ergonomis Berstandar Madrasah',
      'Pencahayaan Jendela Alami Maksimal & Asri',
      'Akses Stopkontak & Jaringan Internet Pembelajaran',
    ],
  },
  perpustakaan: {
    capacity: 'Koleksi 1.500+ Judul Buku & Ruang Baca 40 Siswa',
    location: 'Gedung Perpustakaan & Literasi Lantai 1',
    hours: 'Senin - Sabtu (07.30 - 16.00 WIB)',
    specs: [
      'Buku Teks Kurikulum Merdeka Terlengkap & Up to Date',
      'Khazanah Kitab Kuning & Kajian Turots Keislaman',
      'Area Baca Lesehan Berkarpet Nyaman & Meja Riset',
      'Ensiklopedia Umum, Sains Islam, & Buku Referensi',
      'Sistem Administrasi Peminjaman Rapi & Terdata',
      'Ruang Berpendingin Udara Tenang & Bebas Bising',
    ],
  },
  'musholla sekolah': {
    capacity: 'Daya Tampung 120+ Jamaah Salat',
    location: 'Sayap Barat Kompleks Madrasah',
    hours: 'Setiap Waktu Salat & Kegiatan Ekstrakurikuler Keagamaan',
    specs: [
      'Ruang Ibadah Bersih, Suci, dan Berkarpet Tebal',
      'Tempat Wudhu Nyaman Terpisah Putra dan Putri',
      'Sistem Tata Suara Akustik Jernih untuk Adzan & Doa',
      'Penyediaan Kitab Suci Al-Qur’an Standar Kemenag',
      'Sentra Pembiasaan Salat Dhuha & Dzuhur Berjamaah',
      'Jadwal Halaqah Tahfidz & Kultum Santri Mingguan',
    ],
  },
  'lapangan olahraga': {
    capacity: 'Area Terbuka Luas untuk 500+ Siswa',
    location: 'Halaman Utama MA Raudlatul Hidayah',
    hours: 'Digunakan saat KBM Penjas, Upacara, & Ekstrakurikuler',
    specs: [
      'Lapangan Multifungsi Futsal, Voli, & Bulu Tangkis',
      'Panggung & Tiang Bendera Upacara Resmi Hari Senin',
      'Lintasan Latihan Baris-Berbaris & Kepanduan Pramuka',
      'Inventaris Peralatan Olahraga Lengkap & Terawat',
      'Dikelilingi Pepohonan Rindang & Area Asri',
      'Sarana Kebugaran Jasmani & Senam Pagi Bersama',
    ],
  },
  'lab komputer': {
    capacity: '36 Unit Komputer PC & Jaringan LAN Gigabit',
    location: 'Gedung Pembelajaran Lantai 2',
    hours: 'Praktikum TIK, Asesmen Nasional, & Riset Mandiri',
    specs: [
      'Komputer PC Spesifikasi Modern untuk Pembelajaran TIK & Ujian',
      'Koneksi Internet Dedicated Fiber Optic Madrasah Berkecepatan Tinggi',
      'Proyektor LCD Instruktur & Screen Wall Interaktif',
      'Pendingin Udara (AC) untuk Kenyamanan Riset Digital',
      'Headset Audio & Perangkat Input Lengkap Setiap Meja Siswa',
      'Sistem Keamanan Jaringan & Filter Konten Edukatif Terpadu',
    ],
  },
};

function getFacilityMeta(fac: FacilityItem) {
  const customSpecs = Array.isArray(fac.specs) && fac.specs.length > 0 ? fac.specs : null;
  const customLoc = fac.location?.trim();
  const customCap = fac.capacity?.trim();

  const titleLower = (fac.title || '').toLowerCase();
  let defaultMeta = null;

  for (const [key, val] of Object.entries(FACILITY_METADATA)) {
    if (titleLower.includes(key) || key.includes(titleLower)) {
      defaultMeta = val;
      break;
    }
  }

  // Pencocokan kata kunci fleksibel jika judul diubah admin
  if (!defaultMeta) {
    if (titleLower.includes('kelas') || titleLower.includes('belajar')) {
      defaultMeta = FACILITY_METADATA['ruang kelas'];
    } else if (titleLower.includes('perpus') || titleLower.includes('baca') || titleLower.includes('literasi') || titleLower.includes('buku')) {
      defaultMeta = FACILITY_METADATA['perpustakaan'];
    } else if (titleLower.includes('musholla') || titleLower.includes('masjid') || titleLower.includes('ibadah') || titleLower.includes('salam')) {
      defaultMeta = FACILITY_METADATA['musholla sekolah'];
    } else if (titleLower.includes('lapangan') || titleLower.includes('olahraga') || titleLower.includes('halaman')) {
      defaultMeta = FACILITY_METADATA['lapangan olahraga'];
    } else if (titleLower.includes('komputer') || titleLower.includes('lab') || titleLower.includes('tik') || titleLower.includes('multimedia')) {
      defaultMeta = FACILITY_METADATA['lab komputer'];
    }
  }

  return {
    capacity: customCap || defaultMeta?.capacity || 'Sarana Representatif & Memadai',
    location: customLoc || defaultMeta?.location || 'Kompleks MA Raudlatul Hidayah',
    hours: defaultMeta?.hours || 'Hari Kerja & Jam Kegiatan Sekolah',
    specs: customSpecs || defaultMeta?.specs || [
      'Kondisi Fasilitas Bersih, Rapi, dan Terawat',
      'Penunjang Aktivitas Belajar dan Karakter Santri',
      'Standar Keamanan dan Kenyamanan Penggunaan Terjaga',
      'Pemeliharaan dan Perawatan Sarana Secara Berkala',
    ],
  };
}

export default function FasilitasPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>(defaultFacilities);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/profile?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.facilities && Array.isArray(data.facilities)) {
          setFacilities(data.facilities);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic facilities:', err));
  }, []);

  const handleOpenDetail = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? facilities.length - 1 : prev - 1;
    });
  }, [facilities.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === facilities.length - 1 ? 0 : prev + 1;
    });
  }, [facilities.length]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  const activeFac = selectedIndex !== null ? facilities[selectedIndex] : null;
  const activeMeta = activeFac ? getFacilityMeta(activeFac) : null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-12 sm:py-20 bg-[#fbfbfa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-10 pb-8 border-b border-slate-200/80">
              <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                Fasilitas Belajar Siswa
              </h1>
            </div>

            {/* Facility Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {facilities.map((fac, idx) => (
                <div
                  key={fac.id || fac.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenDetail(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenDetail(idx);
                    }
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col group cursor-pointer active:scale-[0.99] text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-label={`Lihat detail lengkap fasilitas ${fac.title}`}
                >
                  {/* Photo Container */}
                  <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                    <Image
                      src={fac.image || '/kelas.jpeg'}
                      alt={fac.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 580px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-[21px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                        {fac.title}
                      </h3>
                      <p className="font-sans text-[13.5px] sm:text-[14px] text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {fac.desc}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">MA Raudlatul Hidayah</span>

                      <span className="inline-flex items-center gap-1 font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
                        <span>Lihat Sarana</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          LIGHTBOX / DETAIL MODAL FASILITAS SEKOLAH
      ========================================================================= */}
      <AnimatePresence>
        {selectedIndex !== null && activeFac && activeMeta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={handleClose}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl border border-slate-200 shadow-2xl z-10 flex flex-col md:flex-row overflow-hidden text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Top Right */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Tutup jendela"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left / Top: High-Resolution Photo Display */}
              <div className="relative w-full md:w-[48%] aspect-[4/3] md:aspect-auto bg-slate-950 shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={activeFac.image || '/kelas.jpeg'}
                  alt={activeFac.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                  priority
                />

                {/* Navigation Arrows on Photo */}
                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-xs transition-colors border border-white/20 active:scale-95 cursor-pointer"
                    title="Fasilitas Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-1.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-xs transition-colors border border-white/20 active:scale-95 cursor-pointer"
                    title="Fasilitas Berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right / Bottom: Specifications & Detail Content */}
              <div className="p-6 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto flex-1 gap-5">
                <div className="space-y-4">
                  {/* Category & School Pill */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <span>{activeFac.badge || 'Fasilitas Madrasah'}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>MA Raudlatul Hidayah</span>
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                      {activeFac.title}
                    </h2>
                    <p className="text-xs sm:text-[13px] font-bold text-blue-700 mt-1 uppercase tracking-wide">
                      {activeFac.subtitle}
                    </p>
                  </div>

                  {/* Full Description */}
                  <p className="text-xs sm:text-[13.5px] text-slate-600 leading-relaxed">
                    {activeFac.desc}
                  </p>

                  {/* Location & Capacity Info Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">Lokasi Sarana:</span>
                        <span className="text-slate-600 leading-snug">{activeMeta.location}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">Kapasitas / Skala:</span>
                        <span className="text-slate-600 leading-snug">{activeMeta.capacity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specifications / Highlights List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5 flex items-center gap-1.5">
                      <span>Kelengkapan &amp; Standar Fasilitas</span>
                    </h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {activeMeta.specs.map((spec, sIdx) => (
                        <li
                          key={sIdx}
                          className="flex items-start gap-2 text-xs sm:text-[12.5px] text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 active:scale-98 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sebelumnya</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 active:scale-98 cursor-pointer"
                    >
                      <span className="hidden sm:inline">Berikutnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-98 cursor-pointer shadow-xs"
                  >
                    Tutup Pratinjau
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <StitchFooter />
    </div>
  );
}
