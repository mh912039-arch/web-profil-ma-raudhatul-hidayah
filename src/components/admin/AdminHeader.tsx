'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, LogOut } from 'lucide-react';
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
    subtitle: 'Susun jadwal mata pelajaran harian untuk setiap ruang kelas',
  },
  teachers: {
    title: 'Guru Mata Pelajaran',
    subtitle: 'Kelola daftar pendidik resmi, penugasan mata pelajaran, dan beban jam mengajar',
  },
  classes: {
    title: 'Kelas & Wali Kelas',
    subtitle: 'Manajemen ruang kelas, penetapan wali kelas, dan kuota santri',
  },
  calendar: {
    title: 'Kalender Akademik',
    subtitle: 'Agenda tahun ajaran aktif, jadwal ujian CBT/PAS, libur semester, dan agenda PPDB',
  },
  users: {
    title: 'Direktori Pengguna',
    subtitle: 'Daftar akun terdaftar dewan guru, staf TU, santri, dan pimpinan madrasah',
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
    title: 'Guru Mata Pelajaran',
    subtitle: 'Kelola daftar pendidik resmi, penugasan mata pelajaran, dan beban jam mengajar jenjang SD, SMP, & SMA',
  },
  achievements: {
    title: 'Dokumentasi Juara',
    subtitle: 'Galeri piala kejuaraan, piagam prestasi, dan foto dokumentasi kemenangan santri madrasah',
  },
  facilities: {
    title: 'Fasilitas Madrasah',
    subtitle: 'Sarana, gedung, laboratorium, dan fasilitas madrasah',
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
  contact: {
    title: 'Pengaturan Halaman Kontak',
    subtitle: 'Kelola judul, alamat, telepon/WhatsApp resmi, jam operasional TU, dan peta lokasi Google Maps',
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all">
      <div className="flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Mobile Toggle & Brand Header */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsOpenMobile(true)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors shrink-0"
            aria-label="Buka Menu Lengkap"
            title="Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center p-1 shrink-0 shadow-2xs">
            <Image
              src="/school-logo.png"
              width={28}
              height={28}
              alt="Logo MA RH"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] font-bold text-blue-700 tracking-wider uppercase truncate">
              <span>
                {userRole === 'siswa'
                  ? 'PORTAL TERPADU  /  SANTRI'
                  : userRole === 'guru'
                  ? 'PORTAL TERPADU  /  GURU'
                  : 'PORTAL TERPADU  /  ADMIN'}
              </span>
            </div>
            <h1 className="font-serif text-[15px] sm:text-[20px] font-bold text-slate-900 tracking-tight leading-snug truncate">
              {current.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions (Mobile logout only; Desktop actions are already available in the sidebar) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="sm:hidden p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Keluar dari Akun"
              aria-label="Keluar dari Akun"
            >
              <LogOut className="w-5 h-5 text-slate-500 hover:text-rose-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
