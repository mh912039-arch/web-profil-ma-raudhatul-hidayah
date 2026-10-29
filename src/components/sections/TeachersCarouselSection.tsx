'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Facebook,
  Instagram,
  Heart,
} from 'lucide-react';
import teachersJson from '@/data/teachersData.json';

export interface TeacherItem {
  id?: string;
  order_no: number;
  code: string;
  name: string;
  nip?: string;
  certification_year?: string;
  status?: string;
  education?: string;
  subject_name: string;
  class_level?: string;
  gender?: string;
  religion?: string;
  rank_group?: string;
  birth_date?: string;
  position?: string;
  category_label?: string;
  image_url: string;
  is_active: boolean;
}

// Inisialisasi awal langsung dari file JSON lokal
const initialTeachers: TeacherItem[] = Array.isArray(teachersJson) && teachersJson.length > 0
  ? teachersJson
      .filter((t: any) => t.is_active !== false)
      .map((t: any, idx: number) => ({
        id: t.id || `t-${idx}`,
        order_no: Number(t.order_no) || idx + 1,
        code: String(t.code || t.order_no || idx + 1),
        name: t.name || '',
        nip: t.nip || '-',
        certification_year: t.certification_year || '0000',
        status: t.status || 'Guru',
        education: t.education || 'S1',
        subject_name: t.subject_name || '',
        class_level: t.class_level || 'Semua Kelas',
        gender: t.gender || 'L',
        religion: t.religion || 'Islam',
        rank_group: t.rank_group || '-',
        birth_date: t.birth_date || '0000-00-00',
        position: t.position || t.role || 'Guru Mata Pelajaran',
        category_label: t.category_label || 'Umum',
        image_url: t.image_url || '/hero/slide-1.jpg',
        is_active: true,
      }))
  : [];

export const TeachersCarouselSection: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherItem[]>(initialTeachers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Touch swipe support
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Esc listener for detail modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTeacher(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch updated teachers from API
  useEffect(() => {
    fetch('/api/teachers', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter((t: any) => t.is_active !== false);
          if (active.length > 0) {
            setTeachers(active);
          }
        }
      })
      .catch((err) => console.warn('TeachersCarousel sync notice:', err));
  }, []);

  // Responsive items count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(4);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, teachers.length - itemsPerPage);

  // Auto-slide every 4 seconds (4000ms)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (teachers.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-[#f2f7fb] border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Guru & Subtitle (Sesuai Referensi) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-serif text-[32px] sm:text-[40px] font-bold text-slate-900 tracking-tight leading-tight">
            Guru
          </h2>
          <div className="w-14 h-1 bg-amber-400 rounded-full mx-auto mt-2.5" />
          <p className="font-sans text-[14.5px] sm:text-[16px] text-slate-600 mt-3 leading-relaxed">
            Menyambut Anda ke Dunia Pembelajaran yang Dipandu Guru-guru Terbaik
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrow Left */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Geser ke Pendidik Sebelumnya"
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 shadow-md border border-slate-200/90 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Navigation Arrow Right */}
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Geser ke Pendidik Selanjutnya"
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 shadow-md border border-slate-200/90 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Carousel Track Wrapper */}
          <div className="overflow-hidden py-3">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translate3d(-${currentIndex * (100 / itemsPerPage)}%, 0, 0)`,
              }}
            >
              {teachers.map((teacher, idx) => {
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={teacher.id || idx}
                    style={{ width: `${100 / itemsPerPage}%`, flexShrink: 0 }}
                    className="px-3 sm:px-4 flex flex-col items-center"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      onClick={() => setSelectedTeacher(teacher)}
                      className="group flex flex-col items-center cursor-pointer w-full text-center"
                    >
                      {/* Circular Portrait Image (Sesuai Referensi Screenshot) */}
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto border-4 border-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] bg-slate-100 group-hover:shadow-[0_8px_24px_rgba(0,163,224,0.25)] transition-all duration-300 transform group-hover:scale-105">
                        <Image
                          src={teacher.image_url || '/hero/slide-1.jpg'}
                          alt={teacher.name}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 200px"
                        />
                      </div>

                      {/* Teacher Name (Bold, Cyan-Blue on Hover Sesuai Referensi Screenshot) */}
                      <h3
                        className={`font-bold text-[15px] sm:text-[16px] leading-snug mt-4 px-2 transition-colors duration-200 line-clamp-1 uppercase tracking-tight ${
                          isHovered
                            ? 'text-[#00a3e0]'
                            : 'text-slate-800 group-hover:text-[#00a3e0]'
                        }`}
                        title={teacher.name}
                      >
                        {teacher.name}
                      </h3>

                      {/* Subject Name (Mata Pelajaran di Bawah Nama) */}
                      <p className="font-sans text-[13px] sm:text-[13.5px] text-slate-500 font-medium mt-1">
                        {teacher.subject_name}
                      </p>

                      {/* Social Media Icons (Facebook & Instagram Sesuai Screenshot) */}
                      <div className="flex items-center justify-center gap-3 mt-2.5 text-slate-400">
                        <span
                          className="p-1 hover:text-blue-600 transition-colors"
                          title="Facebook"
                        >
                          <Facebook className="w-3.5 h-3.5" />
                        </span>
                        <span
                          className="p-1 hover:text-pink-600 transition-colors"
                          title="Instagram"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          {maxIndex > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Ke halaman pendidik ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === dotIdx
                      ? 'w-6 bg-[#00a3e0]'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA to Full Directory */}
        <div className="flex justify-center mt-10">
          <Link
            href="/profil/guru-tendik"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-[13.5px] font-bold transition-all duration-200 shadow-2xs active:scale-[0.98] group"
          >
            <span>Lihat Semua Pendidik &amp; Tenaga Kependidikan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* MODAL BIODATA DETAIL GURU (11 Atribut Resmi Sesuai Screenshot 1 & 2) */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedTeacher(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup X */}
            <button
              type="button"
              onClick={() => setSelectedTeacher(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Layout 2 Kolom: Foto di Kiri, Rincian Tabel di Kanan */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start pt-2">
              {/* Kolom Kiri: Foto Pendidik */}
              <div className="w-full md:w-5/12 aspect-[3/4] md:aspect-auto md:h-[460px] relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs shrink-0">
                <Image
                  src={selectedTeacher.image_url || '/hero/slide-1.jpg'}
                  alt={selectedTeacher.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                />
              </div>

              {/* Kolom Kanan: Rincian Tabel 11 Atribut Resmi */}
              <div className="flex-1 w-full flex flex-col divide-y divide-slate-200/80 font-sans text-[13.5px] sm:text-[14.5px]">
                {/* 1. Nama */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Nama</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-800 font-bold flex-1 break-words">
                    {selectedTeacher.name}
                  </span>
                </div>

                {/* 2. Nip */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Nip</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 font-mono flex-1 break-words">
                    {selectedTeacher.nip || '-'}
                  </span>
                </div>

                {/* 3. Tahun Sertifikasi */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Tahun Sertifikasi</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.certification_year || '0000'}
                  </span>
                </div>

                {/* 4. Status */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Status</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.status || 'Guru'}
                  </span>
                </div>

                {/* 5. Pendidikan */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Pendidikan</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.education || 'S1'}
                  </span>
                </div>

                {/* 6. Mata Pelajaran */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Mata Pelajaran</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.subject_name}
                  </span>
                </div>

                {/* 7. Kelamin Jenis */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Kelamin Jenis</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.gender || 'L'}
                  </span>
                </div>

                {/* 8. Agama */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Agama</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.religion || 'Islam'}
                  </span>
                </div>

                {/* 9. Pangkat Golongan */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Pangkat Golongan</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.rank_group || '-'}
                  </span>
                </div>

                {/* 10. Tanggal Lahir */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Tanggal Lahir</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.birth_date || '0000-00-00'}
                  </span>
                </div>

                {/* 11. Jabatan */}
                <div className="py-2.5 sm:py-3 flex items-start">
                  <span className="w-36 sm:w-44 font-bold text-slate-900 shrink-0">Jabatan</span>
                  <span className="w-6 text-center text-slate-700 font-bold shrink-0">:</span>
                  <span className="text-slate-700 flex-1 break-words">
                    {selectedTeacher.position || 'Guru Mata Pelajaran'}
                  </span>
                </div>

                {/* Footer action */}
                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedTeacher(null)}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    Tutup Profil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
