'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Building2, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export interface FacilityItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  highlights: string[];
}

export const facilitiesData: FacilityItem[] = [
  {
    id: 'ruang-kelas',
    title: 'Ruang Kelas Pembelajaran',
    category: 'KBM Representatif',
    image: '/kelas.jpeg',
    description:
      'Ruang belajar yang bersih, tertata rapi, dan kondusif untuk mendukung kegiatan belajar mengajar aktif dengan pencahayaan serta sirkulasi udara yang nyaman bagi seluruh santri.',
    highlights: ['Meja & kursi siswa terawat', 'Papan tulis interaktif & ventilasi alami', 'Suasana fokus & kondusif'],
  },
  {
    id: 'perpus',
    title: 'Perpustakaan & Sumber Belajar',
    category: 'Khazanah Literasi',
    image: '/perpus2.jpeg',
    description:
      'Pusat literasi madrasah yang menyediakan buku pelajaran Kurikulum Merdeka, referensi umum, ensiklopedia pengetahuan, serta buku keagamaan pendukung wawasan santri.',
    highlights: ['Buku paket Kurikulum Merdeka', 'Ruang baca mandiri santri', 'Koleksi referensi & keagamaan'],
  },
  {
    id: 'musholla',
    title: 'Musholla Sekolah',
    category: 'Ibadah & Karakter',
    image: '/musholla.jpg',
    description:
      'Sarana ibadah yang bersih dan asri untuk pelaksanaan shalat fardhu berjamaah, pembiasaan shalat dhuha harian, tadarus Al-Qur’an, serta penguatan adab Islami santri.',
    highlights: ['Karpet shaf shalat bersih & terawat', 'Tempat wudhu terpisah & representatif', 'Pusat bimbingan ibadah harian'],
  },
  {
    id: 'lapangan',
    title: 'Lapangan Olahraga & Halaman Upacara',
    category: 'Sarana Terbuka',
    image: '/halaman-sekolah.jpeg',
    description:
      'Area terbuka multifungsi yang luas di lingkungan sekolah untuk kegiatan olahraga siswa (futsal, basket), senam pagi, upacara bendera mingguan, dan latihan pramuka.',
    highlights: ['Ring basket & lapangan futsal', 'Area upacara bendera berkala', 'Ruang gerak aktif & ekstrakurikuler'],
  },
];

interface FacilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FacilitiesModal({ isOpen, onClose }: FacilitiesModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedImageIndex !== null) {
          setSelectedImageIndex(null);
        } else {
          onClose();
        }
      }
      if (selectedImageIndex !== null) {
        if (e.key === 'ArrowRight') {
          setSelectedImageIndex((prev) => (prev! + 1) % facilitiesData.length);
        } else if (e.key === 'ArrowLeft') {
          setSelectedImageIndex((prev) => (prev! - 1 + facilitiesData.length) % facilitiesData.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll on body
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, selectedImageIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md transition-opacity duration-200 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (selectedImageIndex !== null) setSelectedImageIndex(null);
          else onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="facilities-modal-title"
    >
      {/* Lightbox Overlay for Fullscreen Image View */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Tutup Tampilan Gambar Penuh"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[80vh] aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={facilitiesData[selectedImageIndex].image}
              alt={facilitiesData[selectedImageIndex].title}
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                {facilitiesData[selectedImageIndex].category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                {facilitiesData[selectedImageIndex].title}
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl font-sans">
                {facilitiesData[selectedImageIndex].description}
              </p>
            </div>
          </div>

          {/* Navigation Controls in Lightbox */}
          <div className="flex items-center gap-4 mt-4" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedImageIndex((prev) => (prev! - 1 + facilitiesData.length) % facilitiesData.length)}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
            <span className="text-white/70 text-xs font-mono">
              {selectedImageIndex + 1} / {facilitiesData.length}
            </span>
            <button
              type="button"
              onClick={() => setSelectedImageIndex((prev) => (prev! + 1) % facilitiesData.length)}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Modal Dialog Box */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shrink-0 shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="facilities-modal-title"
                className="font-serif text-[20px] sm:text-[24px] font-bold text-slate-900 tracking-tight leading-snug"
              >
                Fasilitas Belajar &amp; Sarana Sekolah
              </h2>
              <p className="font-sans text-[12.5px] sm:text-[13px] text-slate-500">
                Sarana prasarana penunjang kegiatan belajar mengajar santri MA Raudlatul Hidayah
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition-colors active:scale-95 shrink-0"
            aria-label="Tutup Jendela Fasilitas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 md:p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {facilitiesData.map((item, idx) => (
              <div
                key={item.id}
                className="group relative bg-[#fbfbfa] rounded-2xl border border-slate-200/80 hover:border-blue-400/60 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image Container with Hover Overlay & Enlarge Button */}
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-slate-900 font-sans text-[11px] font-bold tracking-wider uppercase shadow-2xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Enlarge Hint Button */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 flex items-center justify-center shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[13px] text-slate-600 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="pt-3 border-t border-slate-200/70 flex flex-wrap gap-1.5">
                    {item.highlights.map((hl, hlIdx) => (
                      <span
                        key={hlIdx}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-sans text-[11px] font-medium"
                      >
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>Klik foto fasilitas manapun untuk memperbesar tampilan</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
