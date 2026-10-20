'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Database,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  setIsOpenMobile: (open: boolean) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  supabaseConnected: boolean;
  onLogout?: () => void;
  userRole?: 'admin' | 'guru' | 'siswa';
}

const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Beranda',
    subtitle: 'Statistik utama, performa website, dan aktivitas operasional madrasah',
  },
  schedules: {
    title: 'Jadwal Pelajaran',
    subtitle: 'Susun jadwal mata pelajaran harian untuk setiap rombel kelas',
  },
  teachers: {
    title: 'Guru Mata Pelajaran',
    subtitle: 'Kelola daftar pendidik resmi, penugasan mata pelajaran, dan beban jam mengajar',
  },
  classes: {
    title: 'Kelas & Wali Kelas',
    subtitle: 'Manajemen rombongan belajar (rombel), penetapan wali kelas, dan kuota santri',
  },
  calendar: {
    title: 'Kalender Akademik',
    subtitle: 'Agenda tahun ajaran aktif, jadwal ujian CBT/PAS, libur semester, dan agenda PPDB',
  },
  users: {
    title: 'Direktori Pengguna',
    subtitle: 'Daftar 65 akun terdaftar dewan guru, staf TU, dan pimpinan madrasah',
  },
  activation: {
    title: 'Aktivasi Akun Pengguna',
    subtitle: 'Otorisasi akses akun guru baru dan pembagian kredensial portal',
  },
  homepage: {
    title: 'Pengaturan & Slider Hero',
    subtitle: 'Kustomisasi judul hero, foto latar, running marquee PPDB, sambutan, dan metrik statistik',
  },
  articles: {
    title: 'Berita & Agenda',
    subtitle: 'Tulis, sunting, dan publikasikan warta berita, agenda kegiatan, serta dinamika madrasah',
  },
  agenda: {
    title: 'Agenda Kegiatan Sekolah',
    subtitle: 'Kalender dan jadwal agenda kegiatan civitas madrasah tahun ajaran aktif',
  },
  'website-teachers': {
    title: 'Dewan Guru & Pendidik',
    subtitle: 'Profil tenaga pendidik yang ditampilkan pada direktori website publik',
  },
  achievements: {
    title: 'Dokumentasi Juara',
    subtitle: 'Galeri piala kejuaraan, piagam prestasi, dan foto dokumentasi kemenangan santri madrasah',
  },
  facilities: {
    title: 'Fasilitas & Sarpras',
    subtitle: 'Sarana, prasarana gedung, laboratorium, dan fasilitas madrasah',
  },
  gallery: {
    title: 'Dokumentasi Juara',
    subtitle: 'Galeri piala kejuaraan, piagam prestasi, dan foto dokumentasi kemenangan santri madrasah',
  },
  extracurricular: {
    title: 'Ekstrakurikuler',
    subtitle: 'Kelola cabang ekstrakurikuler santri, pembina resmi, jadwal latihan, dan foto kegiatan',
  },
  ppdb: {
    title: 'Alur Pendaftaran PPDB',
    subtitle: 'Kelola informasi pendaftaran santri baru, brosur resmi, dan kontak WhatsApp',
  },
  registrations: {
    title: 'Pendaftar PPDB Online',
    subtitle: 'Verifikasi berkas persyaratan (KK, Akta, Ijazah), biodata, dan status seleksi',
  },
  profile: {
    title: 'Identitas & Profil Web',
    subtitle: 'NPSN, NSM, visi misi kelembagaan, alamat resmi, dan profil madrasah',
  },
  messages: {
    title: 'Pesan Masuk (Buku Tamu)',
    subtitle: 'Daftar pertanyaan dan aspirasi publik dari formulir kontak website',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  setIsOpenMobile,
  onRefresh,
  isRefreshing,
  supabaseConnected,
  onLogout,
  userRole = 'admin',
}) => {
  const current = tabTitles[activeTab] || tabTitles.overview;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumb Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={() => setIsOpenMobile(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Buka Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>
                {userRole === 'siswa'
                  ? 'Portal Santri'
                  : userRole === 'guru'
                  ? 'Portal Dewan Guru'
                  : 'Portal Akademik Resmi'}
              </span>
              <span>/</span>
              <span className="text-blue-700 font-bold">{current.title}</span>
            </div>
            <h1 className="font-serif text-[18px] sm:text-[22px] font-bold text-slate-900 tracking-tight leading-snug truncate">
              {current.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] disabled:opacity-50"
            title="Muat ulang sinkronisasi data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
            />
            <span className="hidden sm:inline">Segarkan Data</span>
          </button>

          {/* Outbound public portal */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Buka Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </Link>

          {/* Logout Action */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
              title="Keluar dari Panel Admin"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
