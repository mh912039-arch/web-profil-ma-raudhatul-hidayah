'use client';

import React, { useState } from 'react';
import { Award, GraduationCap, CheckCircle2, FileText, Download, Filter, Search } from 'lucide-react';

export const GraduationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kenaikan & Kelulusan</h2>
          <p className="text-sm text-slate-600 mt-1">
            Monitoring kriteria ketuntasan minimal (KKM), rekapitulasi kelulusan, dan kenaikan kelas santri.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Berita Acara Kelulusan</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tingkat Kelulusan Angkatan Terakhir</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">100%</span>
            <span className="text-xs font-semibold text-blue-600">55/55 Santri Lulus</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tahun Pelajaran 2025/2026</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Calon Peserta Ujian Madrasah 2027</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">55</span>
            <span className="text-xs font-semibold text-slate-600">Santri Terdaftar</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Kelas IX (31) & Kelas XII (55)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Status Verifikasi Rapor & Ijazah</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600">Lengkap</span>
            <span className="text-xs font-semibold text-slate-600">Sinkron Emis</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tervalidasi Kemenag Kab. Tangerang</p>
        </div>
      </div>

      {/* Criteria Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Syarat & Kriteria Kelulusan MA Raudhatul Hidayah</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900">1. Ketuntasan Kurikulum</span>
            <p className="text-slate-600">
              Menyelesaikan seluruh program pembelajaran dari semester 1 sampai semester 6 secara lengkap.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900">2. Nilai Sikap & Perilaku Baik</span>
            <p className="text-slate-600">
              Memperoleh nilai sikap/perilaku minimal Baik (B) dalam pembiasaan adab dan akhlak islami harian.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900">3. Mengikuti Asesmen Madrasah</span>
            <p className="text-slate-600">
              Mengikuti seluruh rangkaian Asesmen Madrasah (AM) teori, praktik ibadah, dan tahfidz juz 30.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900">4. Bebas Tanggungan Perpustakaan</span>
            <p className="text-slate-600">
              Menyerahkan bukti bebas pinjaman buku dari perpustakaan dan administrasi madrasah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
