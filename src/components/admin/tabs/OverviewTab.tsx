'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Newspaper,
  Trophy,
  Mail,
  UserCheck,
  ArrowRight,
  Database,
  CheckCircle2,
  ExternalLink,
  Plus,
  Clock,
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Save,
  Award,
} from 'lucide-react';
import { AdminTab } from '../AdminSidebar';
import { VisitorAnalyticsSection } from '../analytics/VisitorAnalyticsSection';
import { HomepageConfig } from './HomepageTab';

interface OverviewTabProps {
  setActiveTab: (tab: AdminTab) => void;
  stats: {
    teachersCount: number;
    articlesCount: number;
    championshipCount: number;
    unreadMessages: number;
    registrationsCount: number;
    academicYear: string;
    isPpdbOpen: boolean;
  };
  supabaseConnected: boolean;
  homepageData: HomepageConfig;
  onSaveHomepage: (data: HomepageConfig) => Promise<void>;
  isSaving: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  setActiveTab,
  stats,
  supabaseConnected,
  homepageData,
  onSaveHomepage,
  isSaving,
}) => {
  const [statsForm, setStatsForm] = useState({
    stat1Value: homepageData?.stat1Value || '152',
    stat1Label: homepageData?.stat1Label || 'Santri Aktif MA',
    stat2Value: homepageData?.stat2Value || '22',
    stat2Label: homepageData?.stat2Label || 'Guru & Staf',
    stat3Value: homepageData?.stat3Value || '35+',
    stat3Label: homepageData?.stat3Label || 'Prestasi',
  });

  useEffect(() => {
    if (homepageData) {
      setStatsForm({
        stat1Value: homepageData.stat1Value || '152',
        stat1Label: homepageData.stat1Label || 'Santri Aktif MA',
        stat2Value: homepageData.stat2Value || '22',
        stat2Label: homepageData.stat2Label || 'Guru & Staf',
        stat3Value: homepageData.stat3Value || '35+',
        stat3Label: homepageData.stat3Label || 'Prestasi',
      });
    }
  }, [homepageData]);

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveHomepage({
      ...homepageData,
      ...statsForm,
    });
  };
  const cards = [
    {
      label: 'Jadwal Pelajaran',
      value: '12 Rombel Aktif',
      detail: 'Jenjang SD, SMP, & SMA',
      icon: Clock,
      color: 'bg-blue-50 text-blue-900 border-blue-200',
      iconColor: 'text-blue-600',
      targetTab: 'schedules' as AdminTab,
    },
    {
      label: 'Status PPDB Madrasah',
      value: stats.isPpdbOpen ? 'Buka Pendaftaran' : 'Pendaftaran Tutup',
      detail: `Tahun Ajaran ${stats.academicYear}`,
      icon: GraduationCap,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      iconColor: 'text-amber-600',
      targetTab: 'ppdb' as AdminTab,
    },
    {
      label: 'Dewan Guru & Tendik',
      value: `${stats.teachersCount} Pendidik`,
      detail: 'Mata pelajaran terverifikasi',
      icon: Users,
      color: 'bg-slate-50 text-slate-900 border-slate-200',
      iconColor: 'text-blue-700',
      targetTab: 'teachers' as AdminTab,
    },
    {
      label: 'Berita & Agenda',
      value: `${stats.articlesCount} Publikasi`,
      detail: 'Warta berita & agenda aktif',
      icon: Newspaper,
      color: 'bg-sky-50 text-sky-900 border-sky-200',
      iconColor: 'text-sky-700',
      targetTab: 'articles' as AdminTab,
    },
    {
      label: 'Dokumentasi Juara',
      value: `${stats.championshipCount} Dokumentasi`,
      detail: 'Piala juara & dokumentasi prestasi',
      icon: Trophy,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      iconColor: 'text-amber-600',
      targetTab: 'achievements' as AdminTab,
    },
    {
      label: 'Pendaftar PPDB Online',
      value: `${stats.registrationsCount} Santri`,
      detail: 'Calon santri terdata',
      icon: UserCheck,
      color: 'bg-blue-50 text-blue-900 border-blue-200',
      iconColor: 'text-blue-700',
      targetTab: 'registrations' as AdminTab,
    },
    {
      label: 'Pesan Masuk (Buku Tamu)',
      value: `${stats.unreadMessages} Belum Dibaca`,
      detail: 'Dari formulir kontak publik',
      icon: Mail,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      iconColor: 'text-rose-600',
      targetTab: 'messages' as AdminTab,
    },
    {
      label: 'Pengaturan & Slider Hero',
      value: 'Hero & Sambutan',
      detail: 'Kelola teks, foto & marquee',
      icon: LayoutDashboard,
      color: 'bg-slate-50 text-slate-800 border-slate-200',
      iconColor: 'text-slate-700',
      targetTab: 'homepage' as AdminTab,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Hero Welcome & Quick Status Banner (Matching Web Profil Navy & Gold) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e3a8a] via-[#172554] to-slate-900 text-white p-6 sm:p-8 shadow-md border border-blue-900/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11.5px] font-bold tracking-wider uppercase mb-3 border border-white/15">
            <span>Portal Akademik Resmi</span>
          </div>
          <h2 className="font-serif text-[24px] sm:text-[30px] font-bold tracking-tight text-white leading-tight">
            Selamat Datang di Portal Akademik Resmi MA Raudhatul Hidayah
          </h2>
          <p className="font-sans text-[14px] sm:text-[15px] text-slate-300 mt-2 leading-relaxed">
            Kelola jadwal pelajaran harian, dewan guru, kelas &amp; rombel, informasi SPMB PPDB 2027/2028, serta publikasi website madrasah secara terpadu.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => setActiveTab('schedules')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[13px] transition-all shadow-sm active:scale-95"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Susun Jadwal Pelajaran</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ppdb')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-[13px] transition-all shadow-sm active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Kelola PPDB 2027/2028</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('teachers')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[13px] border border-white/20 transition-all active:scale-95"
            >
              <Users className="w-4 h-4 text-blue-300" />
              <span>Dewan Guru &amp; Tendik</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Grid KPI Metrics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-[18px] font-bold text-slate-900 tracking-tight">
            Metrik &amp; Indikator Utama
          </h3>
          <span className="text-[12px] text-slate-500 font-medium">
            Terhubung ke proyek: <strong className="font-mono text-slate-700">zzgobrlhnnqvspuwugkz</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                onClick={() => setActiveTab(c.targetTab)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] flex flex-col justify-between gap-4 bg-white border-slate-200/90 group`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-slate-500 tracking-wide uppercase">
                      {c.label}
                    </span>
                    <span className="font-serif text-[22px] sm:text-[24px] font-bold text-slate-900 mt-1 leading-tight group-hover:text-blue-700 transition-colors">
                      {c.value}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl ${c.color} border shrink-0`}>
                    <Icon className={`w-5 h-5 ${c.iconColor}`} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[12px]">
                  <span className="text-slate-500 font-medium">{c.detail}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Buka
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2.5 Quick Stat Counter Editor (152 Santri Aktif MA, 22 Guru & Staf, 35+ Prestasi) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-slate-900">
                  Statistik Kunci Halaman Depan Web Profil
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Tampil Langsung di Web
                </span>
              </div>
              <p className="text-[12.5px] text-slate-500 mt-0.5">
                Ubah 3 angka statistik utama (Siswa, Guru, Prestasi) yang tampil di samping sambutan Kepala Madrasah. Perubahan langsung tersimpan ke Supabase dan aktif di web profil.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('homepage')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-semibold transition-all shrink-0 active:scale-95"
          >
            <span>Buka Semua Pengaturan Beranda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Preview Bar matching the user's screenshot */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50/70 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pratinjau Tampilan di Web Profil (Live Preview)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              / (Halaman Depan Profil)
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs max-w-xl">
            <div className="grid grid-cols-3 gap-6 divide-x divide-slate-100">
              <div>
                <span className="font-serif text-[28px] sm:text-[34px] font-bold text-slate-900 block leading-tight">
                  {statsForm.stat1Value || '152'}
                </span>
                <span className="font-sans text-[12px] sm:text-[13px] text-slate-500 font-medium block mt-1">
                  {statsForm.stat1Label || 'Santri Aktif MA'}
                </span>
              </div>
              <div className="pl-4 sm:pl-6">
                <span className="font-serif text-[28px] sm:text-[34px] font-bold text-slate-900 block leading-tight">
                  {statsForm.stat2Value || '22'}
                </span>
                <span className="font-sans text-[12px] sm:text-[13px] text-slate-500 font-medium block mt-1">
                  {statsForm.stat2Label || 'Guru & Staf'}
                </span>
              </div>
              <div className="pl-4 sm:pl-6">
                <span className="font-serif text-[28px] sm:text-[34px] font-bold text-amber-600 block leading-tight">
                  {statsForm.stat3Value || '35+'}
                </span>
                <span className="font-sans text-[12px] sm:text-[13px] text-slate-500 font-medium block mt-1">
                  {statsForm.stat3Label || 'Prestasi'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Edit Form */}
        <form onSubmit={handleSaveStats} className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: Siswa */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                1. Data Siswa / Santri
              </span>
              <div className="space-y-1">
                <label className="text-[11.5px] font-semibold text-slate-700">Jumlah Siswa / Nilai</label>
                <input
                  type="text"
                  value={statsForm.stat1Value}
                  onChange={(e) => setStatsForm((prev) => ({ ...prev, stat1Value: e.target.value }))}
                  placeholder="152"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[14px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11.5px] font-semibold text-slate-700">Label Keterangan</label>
                <input
                  type="text"
                  value={statsForm.stat1Label}
                  onChange={(e) => setStatsForm((prev) => ({ ...prev, stat1Label: e.target.value }))}
                  placeholder="Santri Aktif MA"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Stat 2: Guru */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                2. Data Guru &amp; Staf
              </span>
              <div className="space-y-1">
                <label className="text-[11.5px] font-semibold text-slate-700">Jumlah Guru / Nilai</label>
                <input
                  type="text"
                  value={statsForm.stat2Value}
                  onChange={(e) => setStatsForm((prev) => ({ ...prev, stat2Value: e.target.value }))}
                  placeholder="22"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[14px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11.5px] font-semibold text-slate-700">Label Keterangan</label>
                <input
                  type="text"
                  value={statsForm.stat2Label}
                  onChange={(e) => setStatsForm((prev) => ({ ...prev, stat2Label: e.target.value }))}
                  placeholder="Guru &amp; Staf"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Stat 3: Prestasi */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                3. Data Prestasi
              </span>
              <div className="space-y-1">
                <label className="text-[11.5px] font-semibold text-slate-700">Jumlah Prestasi / Nilai</label>
                <input
                  type="text"
                  value={statsForm.stat3Value}
                  onChange={(e) => setStatsForm((prev) => ({ ...prev, stat3Value: e.target.value }))}
                  placeholder="35+"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[14px] font-bold text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11.5px] font-semibold text-slate-700">Label Keterangan</label>
                <input
                  type="text"
                  value={statsForm.stat3Label}
                  onChange={(e) => setStatsForm((prev) => ({ ...prev, stat3Label: e.target.value }))}
                  placeholder="Prestasi"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[12px] text-slate-500">
              Perubahan angka langsung tersimpan ke Supabase dan diperbarui di halaman beranda web profil.
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan 3 Angka Statistik'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Live Traffic & Visitor Analytics (Domain & Public Profile Tracker) */}
      <VisitorAnalyticsSection />

      {/* 4. Integrasi & Status Supabase Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-[16px] font-bold text-slate-900">
                  Status Koneksi Supabase PostgreSQL
                </h4>
                <p className="text-[12.5px] text-slate-500">
                  Sinkronisasi langsung antara dashboard CMS dan tampilan website publik
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${
                supabaseConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                }`}
              />
              {supabaseConnected ? 'Live Connected' : 'Siap Sinkron'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Project ID</span>
              <span className="font-mono text-[13px] font-bold text-slate-800 truncate block mt-0.5">
                zzgobrlhnnqvspuwugkz
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Tabel Database</span>
              <span className="text-[13px] font-bold text-slate-800 block mt-0.5">
                15 Tabel Terkonfigurasi
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Keamanan RLS</span>
              <span className="text-[13px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
                Aktif &amp; Terlindungi
              </span>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5 flex flex-col justify-between">
          <div>
            <h4 className="font-serif text-[16px] font-bold text-slate-900">
              Aksi Cepat Admin
            </h4>
            <p className="text-[12.5px] text-slate-500 mt-0.5">
              Pintasan tugas harian madrasah
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setActiveTab('articles')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-[13px] font-semibold border border-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Tulis Artikel Baru
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('teachers')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-[13px] font-semibold border border-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Perbarui Jadwal Guru
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-[13px] font-semibold border border-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-600" />
                Periksa Buku Tamu
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
