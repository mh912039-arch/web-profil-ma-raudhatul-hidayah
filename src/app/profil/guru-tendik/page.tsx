'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  FileText,
  Heart,
  X,
  School,
  Building2,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import teachersJson from '@/data/teachersData.json';

export interface TeacherEntry {
  no: number;
  code: string;
  name: string;
  nip: string;
  certification_year: string;
  status: string;
  education: string;
  subject_name: string;
  class_level: string;
  gender: string;
  religion: string;
  rank_group: string;
  birth_date: string;
  position: string;
  jenjang?: 'sd' | 'smp' | 'sma';
  category_label: string;
  image: string;
  is_active: boolean;
}

// Inisialisasi awal terisi otomatis dari teachersData.json
const defaultScheduleEntries: TeacherEntry[] = Array.isArray(teachersJson) && teachersJson.length > 0
  ? teachersJson.map((t: any, idx: number) => ({
      no: Number(t.order_no) || idx + 1,
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
      jenjang: t.jenjang || 'sma',
      category_label: t.category_label || 'Pendidikan Agama Islam',
      image: t.image_url || '/hero/slide-1.jpg',
      is_active: t.is_active !== undefined ? Boolean(t.is_active) : true,
    }))
  : [];

function getInitials(name: string): string {
  if (!name) return 'GP';
  const clean = name
    .replace(/\b(drs|dra|ir|dr|kh|prof|h|hj|se|st|s\.pd|s\.kom|s\.pd\.i|m\.pd|m\.si|lc)\b\.?/gi, '')
    .replace(/,\s*[a-z0-9\.\s]+$/i, '')
    .trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'GP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function isGenericPlaceholder(img?: string): boolean {
  if (!img) return true;
  return (
    img.includes('/hero/') ||
    img.includes('/kelas.') ||
    img.includes('/perpus') ||
    img.includes('placeholder')
  );
}

export default function GuruTendikPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState<'all' | 'sma' | 'smp' | 'sd'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [entries, setEntries] = useState<TeacherEntry[]>(defaultScheduleEntries);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherEntry | null>(null);

  // Esc key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTeacher(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch dynamic teachers from unified API
  useEffect(() => {
    fetch('/api/teachers', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: TeacherEntry[] = data.map((t: any, idx: number) => ({
            no: Number(t.order_no) || idx + 1,
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
            jenjang: t.jenjang || 'sma',
            category_label: t.category_label || 'Pendidikan Agama Islam',
            image: t.image_url || '/hero/slide-1.jpg',
            is_active: t.is_active !== undefined ? Boolean(t.is_active) : true,
          }));
          setEntries(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic teachers:', err));
  }, []);

  // Filter entries
  const filteredEntries = entries.filter((item) => {
    const matchesJenjang = selectedJenjang === 'all' || item.jenjang === selectedJenjang;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesJenjang;
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.subject_name.toLowerCase().includes(q) ||
      item.nip.toLowerCase().includes(q) ||
      item.position.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.class_level.toLowerCase().includes(q) ||
      item.category_label.toLowerCase().includes(q);
    return matchesJenjang && matchesSearch;
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-10 sm:py-16 bg-[#fbfbfa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header section with Title and Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200/80">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-2">
                  Profil Tenaga Pendidik &amp; Kependidikan
                </span>
                <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                  Guru dan Staf Pendidik
                </h1>
                <p className="font-sans text-[14px] sm:text-[15.5px] text-slate-600 max-w-2xl leading-relaxed mt-1">
                  Direktori resmi pendidik dan tenaga kependidikan MA Raudlatul Hidayah. Klik &quot;Read More&quot; pada profil guru untuk melihat rincian biodata pendidik lengkap.
                </p>
              </div>

              {/* Search Bar & View Mode Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <div className="w-full sm:w-72 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari guru, NIP, mapel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white font-sans text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 border border-slate-200 shadow-xs"
                  />
                </div>

                {/* View Switcher: Cards vs Table */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                    <span>Direktori ({filteredEntries.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tabel Roster</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Jenjang Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
              <button
                type="button"
                onClick={() => setSelectedJenjang('all')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Semua Jenjang ({entries.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedJenjang('sma')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'sma'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>MA / SMA ({entries.filter((t) => t.jenjang === 'sma').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedJenjang('smp')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'smp'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>SMP ({entries.filter((t) => t.jenjang === 'smp').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedJenjang('sd')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedJenjang === 'sd'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>SD ({entries.filter((t) => t.jenjang === 'sd').length})</span>
              </button>
            </div>

            {/* Spotlight Kepala Madrasah */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs">
                <Image
                  src="/kepala-madrasah.jpg"
                  alt="A. KHUTBI. AR, S.Pd"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
                  Kepala Madrasah
                </span>
                <h2 className="font-serif text-[20px] sm:text-[22px] font-bold text-slate-900 leading-snug">
                  A. KHUTBI. AR, S.Pd
                </h2>
                <p className="font-sans text-[13px] text-slate-600 mt-0.5">
                  Kepala Satuan Pendidikan MA Raudlatul Hidayah • Penanggung Jawab Distribusi Tugas Pendidik &amp; Tenaga Kependidikan
                </p>
                <p className="text-[12px] text-slate-500 font-mono mt-1">
                  NIP: - • Pendidikan: S1 • Status: Guru Tetap
                </p>
              </div>
              <div className="text-center sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 text-[12px] text-slate-500">
                <span className="block font-semibold text-slate-800">Tangerang, 13 Juli 2026</span>
                <span className="block text-emerald-700 font-medium mt-0.5">Tervalidasi &amp; Terakreditasi</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTeacher({
                      no: 0,
                      code: 'KM',
                      name: 'A. KHUTBI. AR, S.Pd',
                      nip: '-',
                      certification_year: '2015',
                      status: 'Kepala Madrasah',
                      education: 'S1',
                      subject_name: 'Kepemimpinan & Manajemen Pendidikan',
                      class_level: 'Semua Jenjang',
                      gender: 'L',
                      religion: 'Islam',
                      rank_group: 'Pembina - IV/a',
                      birth_date: '0000-00-00',
                      position: 'Kepala Madrasah MA Raudlatul Hidayah',
                      jenjang: 'sma',
                      category_label: 'Pimpinan Satuan Pendidikan',
                      image: '/kepala-madrasah.jpg',
                      is_active: true,
                    });
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                  <span>Lihat Biodata Lengkap</span>
                </button>
              </div>
            </div>

            {/* View Mode 1: Direktori Kartu Guru (Sesuai Screenshot 3) */}
            {viewMode === 'cards' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
                  {filteredEntries.map((item) => {
                    const hasCustomPhoto = !isGenericPlaceholder(item.image);

                    return (
                      <div
                        key={item.no}
                        onClick={() => setSelectedTeacher(item)}
                        className="group relative flex flex-col items-center bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        {/* Container Foto Portrait (Sesuai Screenshot 3) */}
                        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60">
                          {hasCustomPhoto ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700">
                              <span className="font-mono text-2xl font-bold tracking-wider">
                                {getInitials(item.name)}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium mt-1">
                                {item.subject_name}
                              </span>
                            </div>
                          )}

                          {/* Hover Overlay Kuning/Amber & Tombol Cyan Read More (Sesuai Screenshot 3) */}
                          <div className="absolute inset-0 bg-[#e5a035]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4 backdrop-blur-[0.5px]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTeacher(item);
                              }}
                              className="inline-flex items-center gap-2 bg-[#00a3e0] hover:bg-[#0092c8] text-white font-bold text-xs sm:text-[13px] px-4 py-2.5 rounded shadow-lg transform scale-95 group-hover:scale-100 transition-transform active:scale-90 cursor-pointer"
                            >
                              <Heart className="w-4 h-4 fill-white text-white shrink-0" />
                              <span>Read More</span>
                            </button>
                          </div>
                        </div>

                        {/* Nama Guru di Bawah Foto (Teks Biru Tebal Sesuai Screenshot 3) */}
                        <div className="w-full text-center mt-3 px-1 flex flex-col items-center">
                          <h3
                            className="font-bold text-[#0066cc] group-hover:text-blue-800 text-center text-[15px] sm:text-[15.5px] leading-snug transition-colors line-clamp-2 uppercase tracking-tight"
                            title={item.name}
                          >
                            {item.name}
                          </h3>
                          <p className="text-[12px] text-slate-500 font-medium mt-1 truncate max-w-full">
                            {item.position || item.subject_name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {filteredEntries.length === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
                    <p className="font-serif text-lg font-bold text-slate-800 mb-1">
                      Data Tidak Ditemukan
                    </p>
                    <p className="font-sans text-[13.5px] text-slate-500 mb-4">
                      Tidak ada pendidik atau tenaga kependidikan yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedJenjang('all');
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                )}
              </>
            )}

            {/* View Mode 2: Tabel Roster Resmi */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                      Roster Pendidik dan Mata Pelajaran
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Daftar {filteredEntries.length} entri mata pelajaran dan guru pengampu resmi MA Raudlatul Hidayah
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-amber-300">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>{filteredEntries.length} Pendidik</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-[12px] uppercase font-bold tracking-wider">
                        <th className="py-3.5 px-4 w-14 text-center">No</th>
                        <th className="py-3.5 px-4">Pendidik</th>
                        <th className="py-3.5 px-4">NIP</th>
                        <th className="py-3.5 px-4">Mata Pelajaran</th>
                        <th className="py-3.5 px-4">Jabatan</th>
                        <th className="py-3.5 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
                      {filteredEntries.map((item) => (
                        <tr
                          key={item.no}
                          className="hover:bg-blue-50/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-semibold">
                            {item.no}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover object-top"
                                />
                              </div>
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                            {item.nip}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">
                            {item.subject_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {item.position}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedTeacher(item)}
                              className="px-3 py-1 rounded bg-[#00a3e0] hover:bg-[#0092c8] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL BIODATA DETAIL GURU (Sesuai Screenshot 1 & 2) */}
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

            {/* Layout 2 Kolom: Foto di Kiri, Rincian Tabel di Kanan (Sesuai Screenshot 1 & 2) */}
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start pt-2">
              {/* Kolom Kiri: Foto Pendidik */}
              <div className="w-full md:w-5/12 aspect-[3/4] md:aspect-auto md:h-[460px] relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs shrink-0">
                <Image
                  src={selectedTeacher.image}
                  alt={selectedTeacher.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                />
              </div>

              {/* Kolom Kanan: Rincian Tabel 11 Atribut Resmi (Sesuai Screenshot 1 & 2) */}
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

      <StitchFooter />
    </div>
  );
}
