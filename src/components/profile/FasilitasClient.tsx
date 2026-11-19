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

export interface FacilityItem {
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
    desc: 'Koleksi buku Kurikulum Merdeka terlengkap, ensiklopedia sains, referensi umum, ruang baca berkarpet, serta khazanah kitab keagamaan untuk menunjang budaya riset siswa dan siswi.',
    image: '/perpus2.jpeg',
    badge: 'Pusat Sumber Belajar',
  },
  {
    id: 'fac-3',
    title: 'Musholla Sekolah',
    subtitle: 'Ibadah & Pembiasaan Adab',
    desc: 'Sarana ibadah representatif untuk pelaksanaan salat fardhu berjamaah, salat dhuha rutin, tadarus dan tahfidz Al-Qur’an harian, serta pembinaan adab santun siswa dan siswi.',
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
    capacity: '32 - 36 Meja & Kursi Siswa dan Siswi per Kelas',
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
      'Jadwal Halaqah Tahfidz & Kultum Siswa dan Siswi Mingguan',
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
      'Penunjang Aktivitas Belajar dan Karakter Siswa dan Siswi',
      'Standar Keamanan dan Kenyamanan Penggunaan Terjaga',
      'Pemeliharaan dan Perawatan Sarana Secara Berkala',
    ],
  };
}

export function FasilitasClient({ initialFacilities }: { initialFacilities?: FacilityItem[] }) {
  const [facilities, setFacilities] = useState<FacilityItem[]>(
    Array.isArray(initialFacilities) && initialFacilities.length > 0
      ? initialFacilities
      : defaultFacilities
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/profile?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.facilities && Array.isArray(data.facilities) && data.facilities.length > 0) {
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

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  const activeFac = selectedIndex !== null ? facilities[selectedIndex] : null;
  const activeMeta = activeFac ? getFacilityMeta(activeFac) : null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fbfbfa] font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-24 sm:pt-28 pb-16 sm:pb-24 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-14 max-w-3xl">
            <span className="font-sans font-bold text-xs sm:text-sm text-blue-900 tracking-wider uppercase mb-2 inline-block">
              Sarana &amp; Prasarana
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Fasilitas Pendukung Pembelajaran
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              MA Raudlatul Hidayah menyediakan lingkungan fisik yang nyaman, bersih, dan memadai guna mendukung
              seluruh aktivitas kurikuler, pembinaan adab santri, serta pengembangan minat bakat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {facilities.map((fac, idx) => {
              const meta = getFacilityMeta(fac);
              return (
                <div
                  key={fac.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  <div
                    className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer"
                    onClick={() => handleOpenDetail(idx)}
                  >
                    <Image
                      src={fac.image || '/kelas.jpeg'}
                      alt={fac.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                        <Maximize2 className="w-3.5 h-3.5 text-blue-700" />
                        Detail Fasilitas
                      </span>
                    </div>
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-2xs">
                      {fac.badge || 'Fasilitas Madrasah'}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-800 tracking-wide uppercase">
                        {fac.subtitle}
                      </span>
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2.5 leading-snug">
                        {fac.title}
                      </h2>
                      <p className="text-xs sm:text-[13px] text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {fac.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {meta.specs.length} Spesifikasi Tersedia
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(idx)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 group/btn cursor-pointer"
                      >
                        Lihat Rincian
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* DETAIL MODAL / POPUP */}
      <AnimatePresence>
        {selectedIndex !== null && activeFac && activeMeta && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header Bar */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {activeFac.badge || 'Fasilitas'}
                  </span>
                  <span className="text-xs text-slate-500">
                    Fasilitas {selectedIndex + 1} dari {facilities.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
                <div className="relative w-full aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden shadow-2xs">
                  <Image
                    src={activeFac.image || '/kelas.jpeg'}
                    alt={activeFac.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
                    {activeFac.subtitle}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                    {activeFac.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {activeFac.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Lokasi:</span>
                      <span className="text-slate-600 leading-snug">{activeMeta.location}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Users className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Kapasitas:</span>
                      <span className="text-slate-600 leading-snug">{activeMeta.capacity}</span>
                    </div>
                  </div>
                </div>

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

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <StitchFooter />
    </div>
  );
}
