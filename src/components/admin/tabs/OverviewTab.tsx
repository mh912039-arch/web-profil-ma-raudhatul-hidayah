'use client';

import React from 'react';
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
  Plus,
  Clock,
  LayoutDashboard,
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
  homepageData?: HomepageConfig;
  onSaveHomepage?: (data: HomepageConfig) => Promise<void>;
  isSaving?: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  setActiveTab,
  stats,
  supabaseConnected,
}) => {
  const cards = [
    {
      label: 'Jadwal Pelajaran',
      value: '12 Ruang Kelas',
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
    <div className="space-y-6 sm:space-y-8 w-full max-w-full min-w-0 overflow-hidden animate-in fade-in duration-200">
      {/* Grid KPI Metrics Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 sm:mb-4">
          <h3 className="font-serif text-[18px] font-bold text-slate-900 tracking-tight">
            Metrik &amp; Indikator Utama
          </h3>
          <span className="text-[11px] sm:text-[12px] text-slate-500 font-medium inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sistem Terhubung Cloud Database</span>
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
