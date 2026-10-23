'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  GraduationCap,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  FileText,
  UserCheck,
} from 'lucide-react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';
import teachersJson from '@/data/teachersData.json';

interface ScheduleEntry {
  no: number;
  code: string;
  subjectName: string;
  teacherName: string;
  classLevel: string;
  categoryLabel: string;
  image: string;
}

// Data awal terisi otomatis dari teachersData.json
const defaultScheduleEntries: ScheduleEntry[] = Array.isArray(teachersJson) && teachersJson.length > 0
  ? teachersJson.map((t: any, idx: number) => ({
      no: Number(t.order_no) || idx + 1,
      code: String(t.code || t.order_no || idx + 1),
      subjectName: t.subject_name || '',
      teacherName: t.name || '',
      classLevel: t.class_level || 'Semua Kelas',
      categoryLabel: t.category_label || 'Pendidikan Agama Islam',
      image: t.image_url || '/hero/slide-1.jpg',
    }))
  : [
    {
      no: 1,
      code: '1',
      subjectName: "QUR'AN-HADITS",
      teacherName: 'TAJUDIN, S.Pd.I',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Pendidikan Agama Islam',
      image: '/hero/slide-3.jpg',
    },
    {
      no: 2,
      code: '2',
      subjectName: 'AQIDAH-AKHLAK',
      teacherName: 'JAKARIA, S.Pd.I',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Pendidikan Agama Islam',
      image: '/kelas.jpeg',
    },
    {
      no: 3,
      code: '3',
      subjectName: 'FIQIH KLS 11',
      teacherName: 'TAJUDIN, S.Pd.I',
      classLevel: 'Kelas XI',
      categoryLabel: 'Pendidikan Agama Islam',
      image: '/hero/slide-3.jpg',
    },
    {
      no: 4,
      code: '3',
      subjectName: 'FIQIH KLS 10 & 12',
      teacherName: 'JAKARIA, S.Pd.I',
      classLevel: 'Kelas X & XII',
      categoryLabel: 'Pendidikan Agama Islam',
      image: '/kelas.jpeg',
    },
    {
      no: 5,
      code: '4',
      subjectName: 'SKI',
      teacherName: 'YAHYA HIDAYATULLOH, S.Pd.I',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Sejarah Kebudayaan Islam',
      image: '/hero/slide-1.jpg',
    },
    {
      no: 6,
      code: '5',
      subjectName: 'BHS. ARAB',
      teacherName: 'SITI KHAERUNNISA, S.Pd.I',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Bahasa Asing',
      image: '/perpus2.jpeg',
    },
    {
      no: 7,
      code: '6',
      subjectName: 'PEND. PANCASILA',
      teacherName: 'Drs. MULYADI',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Pendidikan Kewarganegaraan',
      image: '/hero/slide-2.jpg',
    },
    {
      no: 8,
      code: '7',
      subjectName: 'B. INDONESIA',
      teacherName: 'KUSTYANINGSIH, S.Pd',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Bahasa & Sastra',
      image: '/kelas.jpeg',
    },
    {
      no: 9,
      code: '8',
      subjectName: 'MATEMATIKA',
      teacherName: 'MADROSYID, S.Pd',
      classLevel: 'Semua Kelas',
      categoryLabel: 'MIPA',
      image: '/perpus2.jpeg',
    },
    {
      no: 10,
      code: '9',
      subjectName: 'FISIKA',
      teacherName: 'SARNAH, S.Pd.I',
      classLevel: 'Peminatan MIPA',
      categoryLabel: 'MIPA',
      image: '/hero/slide-1.jpg',
    },
    {
      no: 11,
      code: '10',
      subjectName: 'BIOLOGI',
      teacherName: 'SARNAH, S.Pd.I',
      classLevel: 'Peminatan MIPA',
      categoryLabel: 'MIPA',
      image: '/hero/slide-1.jpg',
    },
    {
      no: 12,
      code: '11',
      subjectName: 'SEJARAH KLS 10&11',
      teacherName: 'AHMAD NURUL KAHFI, SE',
      classLevel: 'Kelas X & XI',
      categoryLabel: 'IPS',
      image: '/hero/slide-2.jpg',
    },
    {
      no: 13,
      code: '13',
      subjectName: 'EKONOMI',
      teacherName: 'AHMAD NURUL KAHFI, SE',
      classLevel: 'Peminatan IPS',
      categoryLabel: 'IPS',
      image: '/hero/slide-2.jpg',
    },
    {
      no: 14,
      code: '14',
      subjectName: 'SEJARAH KLS 12',
      teacherName: 'SARNAH, S.Pd.I',
      classLevel: 'Kelas XII',
      categoryLabel: 'IPS',
      image: '/hero/slide-1.jpg',
    },
    {
      no: 15,
      code: '15',
      subjectName: 'GEOGRAFI',
      teacherName: 'YAHYA HIDAYATULLOH, S.Pd.I',
      classLevel: 'Peminatan IPS',
      categoryLabel: 'IPS',
      image: '/hero/slide-1.jpg',
    },
    {
      no: 16,
      code: '16',
      subjectName: 'BHS. INGGRIS',
      teacherName: 'SITI KHAERUNNISA, S.Pd.I',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Bahasa Asing',
      image: '/perpus2.jpeg',
    },
    {
      no: 17,
      code: '17',
      subjectName: 'PENJASKES',
      teacherName: 'AHMAD NURUL KAHFI, SE',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Olahraga & Kesehatan',
      image: '/hero/slide-2.jpg',
    },
    {
      no: 18,
      code: '18',
      subjectName: 'SENI-BUDAYA 11 & 12',
      teacherName: 'LILIS KASTIRI, S.Pd.I',
      classLevel: 'Kelas XI & XII',
      categoryLabel: 'Seni & Budaya',
      image: '/kelas.jpeg',
    },
    {
      no: 19,
      code: '19',
      subjectName: 'MULOK (BTQ)',
      teacherName: 'TISKA PUSPITA DEWI, S.Pd.I',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Muatan Lokal',
      image: '/perpus2.jpeg',
    },
    {
      no: 20,
      code: '20',
      subjectName: 'PRAKARYA & WIRAUSAHA',
      teacherName: 'TISKA PUSPITA DEWI, S.Pd.I',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Prakarya & Kewirausahaan',
      image: '/perpus2.jpeg',
    },
    {
      no: 21,
      code: '21',
      subjectName: 'SENI BUDAYA 10',
      teacherName: 'TISKA PUSPITA DEWI, S.Pd.I',
      classLevel: 'Kelas X',
      categoryLabel: 'Seni & Budaya',
      image: '/perpus2.jpeg',
    },
    {
      no: 22,
      code: '22',
      subjectName: 'TIKOM',
      teacherName: 'MADROSYID, S.Pd',
      classLevel: 'Semua Kelas',
      categoryLabel: 'Teknologi Informasi & Komunikasi',
      image: '/perpus2.jpeg',
    },
  ];

export default function GuruTendikPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [entries, setEntries] = useState<ScheduleEntry[]>(defaultScheduleEntries);

  useEffect(() => {
    fetch('/api/teachers', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ScheduleEntry[] = data.map((t: any, idx: number) => ({
            no: Number(t.order_no) || idx + 1,
            code: String(t.code || t.order_no || idx + 1),
            subjectName: t.subject_name || '',
            teacherName: t.name || '',
            classLevel: t.class_level || 'Semua Kelas',
            categoryLabel: t.category_label || 'Pendidikan Agama Islam',
            image: t.image_url || '/hero/slide-1.jpg',
          }));
          setEntries(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic teachers:', err));
  }, []);

  // Filtering dynamic entries based on search query
  const filteredEntries = entries.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.subjectName.toLowerCase().includes(q) ||
      item.teacherName.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.classLevel.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-12 sm:py-20 bg-[#fbfbfa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header section with Title and Search Input */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-200/80">
              <div>
                <span className="text-[12px] font-bold text-amber-700 uppercase tracking-widest block mb-2">
                  Bagian II Dokumen Resmi Madrasah
                </span>
                <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                  Keterangan Kode Pendidik &amp; Mata Pelajaran
                </h1>
                <div className="w-12 h-1 bg-amber-500 rounded-full mt-2 mb-3" />
                <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-600 max-w-xl leading-relaxed">
                  Daftar mata pelajaran resmi beserta kode dan guru pengampu MAS Raudhatul Hidayah sesuai jadwal pembagian tugas mengajar.
                </p>
              </div>

              {/* Search Bar & View Mode Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <div className="w-full sm:w-72 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari mapel, kode, atau guru..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white font-sans text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 border border-slate-200 shadow-sm"
                  />
                </div>

                {/* View Switcher: Cards vs Table */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kartu ({entries.length} Mapel)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tabel Resmi ({entries.length} Baris)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Spotlight Kepala Madrasah */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <Image
                  src="/kepala-madrasah.jpg"
                  alt="A. KHUTBI. AR, S.Pd"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
                  Pimpinan Madrasah &amp; Pengesah Dokumen
                </span>
                <h2 className="font-serif text-[20px] sm:text-[22px] font-bold text-slate-900 leading-snug">
                  A. KHUTBI. AR, S.Pd
                </h2>
                <p className="font-sans text-[13px] text-slate-600 mt-0.5">
                  Kepala Madrasah MAS Raudhatul Hidayah • Penanggung Jawab Distribusi Beban Mengajar Pendidik
                </p>
              </div>
              <div className="text-center sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 text-[12px] text-slate-500">
                <span className="block font-semibold text-slate-800">Tangerang, 13 Juli 2026</span>
                <span className="block text-emerald-700 font-medium mt-0.5">Tervalidasi &amp; Ditandatangani</span>
              </div>
            </div>

            {/* Counter bar */}
            <div className="flex items-center justify-between text-[13px] text-slate-600 font-medium mb-6">
              <span>
                Menampilkan <strong className="text-slate-900 font-bold">{filteredEntries.length}</strong> dari {entries.length} Mata Pelajaran &amp; Pendidik
              </span>
              <span className="text-[12px] text-slate-400">
                Tahun Ajaran 2026/2027 • Jenjang MA
              </span>
            </div>

            {/* View Mode 1: 22 Cards View */}
            {viewMode === 'cards' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEntries.map((item) => (
                    <div
                      key={item.no}
                      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-3.5 border border-slate-200/90 group"
                    >
                      {/* Portrait Container - Clean, no floating badges */}
                      <div className="relative w-full h-52 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                        <Image
                          src={item.image}
                          alt={item.teacherName}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Body Content */}
                      <div className="flex flex-col gap-2 flex-1">
                        {/* Subject Header */}
                        <div>
                          <h3 className="font-serif text-[18px] font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                            {item.subjectName}
                          </h3>
                        </div>

                        {/* Teacher & Level Info */}
                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[12.5px]">
                          <div>
                            <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-bold block">
                              Guru Pengampu:
                            </span>
                            <span className="font-bold text-slate-900 text-[13.5px]">
                              {item.teacherName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11.5px] text-slate-500 mt-1">
                            <span>Alokasi: <strong className="text-slate-700">{item.classLevel}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-slate-500 font-medium">
                        <span className="text-slate-400">Jadwal Resmi</span>
                        <span className="font-semibold text-slate-600">Tingkat MA</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredEntries.length === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
                    <p className="font-serif text-lg font-bold text-slate-800 mb-1">
                      Data Tidak Ditemukan
                    </p>
                    <p className="font-sans text-[13.5px] text-slate-500 mb-4">
                      Tidak ada mata pelajaran atau guru yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Reset Pencarian
                    </button>
                  </div>
                )}
              </>
            )}

            {/* View Mode 2: 22 Rows Official Table */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Table Header Banner */}
                <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                      Bagian II Dokumen Jadwal Madrasah
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                      II. Keterangan Kode Pendidik dan Mata Pelajaran
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Daftar {entries.length} entri mata pelajaran dan guru pengampu resmi MAS Raudhatul Hidayah
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-amber-300">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>{entries.length} Item Lengkap</span>
                  </div>
                </div>

                {/* Table with all 22 rows */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-[12px] uppercase font-bold tracking-wider">
                        <th className="py-3.5 px-4 w-14 text-center">No</th>
                        <th className="py-3.5 px-4 w-20 text-center">Kode</th>
                        <th className="py-3.5 px-4">Mata Pelajaran</th>
                        <th className="py-3.5 px-4">Alokasi Kelas</th>
                        <th className="py-3.5 px-4">Pendidik Pengampu</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
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
                          <td className="py-3.5 px-4 text-center">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                              {item.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {item.subjectName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-[11.5px] font-medium bg-slate-100 text-slate-700">
                              {item.classLevel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-blue-900">
                            {item.teacherName}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Aktif</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Signatory Footer (Matching document signature) */}
                <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="text-xs text-slate-500 max-w-md">
                    <p className="font-semibold text-slate-700">Pengesahan Jadwal &amp; Tugas Mengajar:</p>
                    <p className="mt-0.5">
                      Distribusi beban mengajar pendidik MAS Raudhatul Hidayah mengacu pada kalender pendidikan dan ketentuan Kurikulum Merdeka Kementerian Agama Republik Indonesia.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-4 text-right shadow-sm shrink-0">
                    <span className="text-[11.5px] text-slate-500 block">
                      Tangerang, 13 Juli 2026
                    </span>
                    <span className="text-[12px] font-bold text-slate-700 block mt-0.5">
                      Kepala Madrasah,
                    </span>
                    <div className="font-serif font-bold text-[15px] text-slate-900 mt-5">
                      A. KHUTBI. AR, S.Pd
                    </div>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      NIP. -
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  );
}
