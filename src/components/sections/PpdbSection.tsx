'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  ZoomIn,
  X,
  Download,
} from 'lucide-react';

export interface PpdbData {
  category: string;
  title: string;
  academicYear: string;
  badgeText: string;
  description: string;
  features: string[];
  contactWa: string;
  contactPhone: string;
  registrationLink: string;
  brochureLink?: string;
  posterUrl?: string;
  isRegistrationOpen: boolean;
}

const defaultPpdbData: PpdbData = {
  category: 'PENERIMAAN PESERTA DIDIK BARU (PPDB) • MAS RAUDHATUL HIDAYAH',
  title: 'Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia',
  academicYear: '2027/2028',
  badgeText: 'TELAH DIBUKA!',
  description:
    'MAS Raudhatul Hidayah hadir sebagai kawah candradimuka yang mendampingi setiap murid untuk bertumbuh menjadi generasi yang tangguh, unggul, dan berkarakter islami. Melalui pembelajaran kontekstual berbasis Kurikulum Merdeka yang bermakna serta pembiasaan adab luhur kepesantrenan, santri didorong untuk menemukan potensi, mengembangkan bakat, dan meraih prestasi terbaiknya.',
  features: [
    'Kurikulum Merdeka Terpadu (Fase E & F)',
    'Pembentukan Karakter & Adab Islami',
    'Pembelajaran Kontekstual & Deep Learning',
    'Pengembangan Potensi, Minat & Bakat',
    'Program Bimbingan Prestasi KSM & Olahraga',
    'Biaya Pendidikan Terjangkau & Beasiswa Prestasi',
  ],
  contactWa: '628176614723',
  contactPhone: '0817-6614-723',
  registrationLink:
    'https://wa.me/628176614723?text=Halo%20Panitia%20PPDB%20MA%20Raudhatul%20Hidayah,%20saya%20ingin%20mendaftar%20dan%20konsultasi%20PPDB%202027/2028',
  brochureLink: '/kontak',
  posterUrl: 'https://zzgobrlhnnqvspuwugkz.supabase.co/storage/v1/object/public/articles/img-1793069689752-1bguos.jpeg',
  isRegistrationOpen: true,
};

interface PpdbSectionProps {
  onOpenRegister?: () => void;
}

export function PpdbSection({ onOpenRegister }: PpdbSectionProps) {
  const [data, setData] = useState<PpdbData>(defaultPpdbData);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  useEffect(() => {
    // 1. Immediately read cached data from localStorage if available to avoid any flicker/jump
    try {
      const cached = localStorage.getItem('cached_ppdb_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.posterUrl) {
          setData(parsed);
          setIsLoading(false);
        }
      }
    } catch (_) {}

    async function fetchPpdbData() {
      try {
        const res = await fetch('/api/ppdb', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setData(json);
          try {
            localStorage.setItem('cached_ppdb_data', JSON.stringify(json));
          } catch (_) {}
        }
      } catch (err) {
        console.error('Failed to load PPDB data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPpdbData();

    // Listen to local storage updates if updated from admin tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ppdb_updated') {
        fetchPpdbData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-white relative border-b border-slate-200/80 overflow-hidden" id="ppdb">
      {/* Decorative Warm Backlights */}
      <div className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-[#1e3a8a]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* =========================================================
              LEFT COLUMN: Visual Poster Flyer (Dynamic from Admin)
          ========================================================= */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              onClick={() => setIsPosterModalOpen(true)}
              className="relative w-full max-w-md sm:max-w-lg aspect-[765/1024] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.18)] border-2 border-amber-500/80 group bg-slate-50 cursor-pointer"
              title="Klik untuk melihat poster ukuran penuh"
            >
              {/* Background Official SPMB Poster */}
              <Image
                src={data.posterUrl || '/poster-ppdb.png'}
                alt="Brosur Poster Resmi SPMB MAS Raudhatul Hidayah"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority
              />

              {/* Hover Overlay Hint */}
              <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-lg backdrop-blur-xs transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                  <ZoomIn className="w-4 h-4 text-blue-700" />
                  <span>Lihat Poster Ukuran Penuh</span>
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Information Copy & Bullet Highlights
          ========================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Category Subtitle */}
            <div>
              <span className="font-sans text-[12px] font-bold text-amber-600 uppercase tracking-widest block">
                {data.category}
              </span>
              <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[48px] font-bold text-slate-900 tracking-tight leading-[1.14] mt-1.5">
                {data.title}
              </h2>
              <div className="w-14 h-1 bg-amber-500 rounded-full mt-3" />
            </div>

            {/* Description Paragraph */}
            <p className="font-sans text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
              {data.description}
            </p>

            {/* Bullet Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {data.features && data.features.length > 0
                ? data.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-[#f8fafc] p-3 rounded-xl border border-slate-200/80 hover:border-amber-400/60 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-sans text-[13.5px] font-semibold text-slate-800 leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))
                : null}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenRegister) {
                    onOpenRegister();
                  } else {
                    window.dispatchEvent(new CustomEvent('open-ppdb-registration'));
                  }
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#1e3a8a] hover:bg-[#172554] text-white font-sans text-[13.5px] font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] border-b-2 border-amber-400"
              >
                <span>Daftar PPDB Online Sekarang</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <a
                href={`https://wa.me/${data.contactWa}?text=Halo%20Panitia%20PPDB%20MA%20Raudhatul%20Hidayah,%20mohon%20informasi%20syarat%20dan%20alur%20pendaftaran.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-sans text-[13.5px] font-semibold border border-slate-300 transition-colors active:scale-[0.98] shadow-2xs"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Konsultasi Panitia PPDB</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FULL POSTER LIGHTBOX MODAL
      ========================================================= */}
      {isPosterModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsPosterModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Poster Resmi SPMB / PPDB
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={data.posterUrl || '/poster-ppdb.png'}
                  download="Poster-PPDB-MA-Raudhatul-Hidayah.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors cursor-pointer"
                  title="Unduh Poster"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsPosterModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  title="Tutup Pratinjau"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Poster Image Container */}
            <div className="relative w-full aspect-[765/1024] max-h-[82vh] rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-slate-900">
              <Image
                src={data.posterUrl || '/poster-ppdb.png'}
                alt="Brosur Poster Resmi SPMB MAS Raudhatul Hidayah"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
