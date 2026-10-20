'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ArrowRight,
  PhoneCall,
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
  isRegistrationOpen: boolean;
}

const defaultPpdbData: PpdbData = {
  category: 'PENERIMAAN PESERTA DIDIK BARU (PPDB) • MA RAUDHATUL HIDAYAH',
  title: 'Membentuk Generasi Berkarakter, Cerdas & Berakhlak Mulia',
  academicYear: '2027/2028',
  badgeText: 'TELAH DIBUKA!',
  description:
    'MA Raudhatul Hidayah hadir sebagai kawah candradimuka yang mendampingi setiap murid untuk bertumbuh menjadi generasi yang tangguh, unggul, dan berkarakter islami. Melalui pembelajaran kontekstual berbasis Kurikulum Merdeka yang bermakna serta pembiasaan adab luhur kepesantrenan, santri didorong untuk menemukan potensi, mengembangkan bakat, dan meraih prestasi terbaiknya.',
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
  isRegistrationOpen: true,
};

interface PpdbSectionProps {
  onOpenRegister?: () => void;
}

export function PpdbSection({ onOpenRegister }: PpdbSectionProps) {
  const [data, setData] = useState<PpdbData>(defaultPpdbData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPpdbData() {
      try {
        const res = await fetch('/api/ppdb', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setData(json);
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
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* =========================================================
              LEFT COLUMN: Visual Poster Flyer (Inspired by Reference)
          ========================================================= */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[765/1024] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.18)] border-2 border-amber-500/80 group bg-slate-50">
              {/* Background Official SPMB Poster */}
              <Image
                src="/poster-ppdb.jpeg"
                alt="Brosur Poster Resmi SPMB MA Raudhatul Hidayah"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority
              />
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
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-sans text-[13.5px] font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] border-b-2 border-amber-400"
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
    </section>
  );
}
