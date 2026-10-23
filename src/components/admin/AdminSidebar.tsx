'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  School,
  GraduationCap,
  Calendar,
  Users,
  Key,
  Globe,
  SlidersHorizontal,
  Newspaper,
  Trophy,
  Building2,
  Image as ImageIcon,
  Compass,
  FileText,
  UserCheck,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  LogOut,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'schedules'
  | 'teachers'
  | 'classes'
  | 'calendar'
  | 'users'
  | 'activation'
  | 'homepage'
  | 'articles'
  | 'agenda'
  | 'website-teachers'
  | 'achievements'
  | 'facilities'
  | 'gallery'
  | 'extracurricular'
  | 'ppdb'
  | 'registrations'
  | 'profile'
  | 'messages';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  unreadCount?: number;
  teachersCount?: number;
  usersCount?: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  supabaseConnected: boolean;
  userRole?: 'admin' | 'guru' | 'siswa';
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount = 0,
  teachersCount = 23,
  usersCount,
  isOpenMobile,
  setIsOpenMobile,
  supabaseConnected,
  userRole = 'admin',
  onLogout,
}) => {
  // Accordion open/close states
  const [openAkademik, setOpenAkademik] = useState(true);
  const [openPengguna, setOpenPengguna] = useState(
    activeTab === 'users' || activeTab === 'activation'
  );
  const [openWebsite, setOpenWebsite] = useState(true);

  // Dynamic user counts from real data
  const [internalUsersCount, setInternalUsersCount] = useState<number | null>(null);
  const [internalPendingCount, setInternalPendingCount] = useState<number>(0);

  useEffect(() => {
    if (userRole === 'admin') {
      fetch('/api/users', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.users)) {
            setInternalUsersCount(data.users.length);
            const pending = data.users.filter((u: any) => u.status === 'Nonaktif').length;
            setInternalPendingCount(pending);
          }
        })
        .catch(() => {});
    }
  }, [userRole, activeTab]);

  const displayUsersCount = usersCount ?? internalUsersCount ?? 8;

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  const getItemClass = (id: AdminTab) => {
    const isActive = activeTab === id;
    if (isActive) {
      return 'bg-blue-600 text-white font-semibold shadow-xs';
    }
    return 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 font-medium';
  };

  const getIconClass = (id: AdminTab) => {
    const isActive = activeTab === id;
    if (isActive) return 'text-white';
    return 'text-slate-500';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white text-slate-800 border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand & Identity Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <Link
            href="/admin"
            className="flex items-center gap-3 group transition-transform active:scale-[0.98]"
          >
            <div className="relative w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-blue-200 shadow-xs">
              <Image
                src="/school-logo.png"
                alt="Emblem MAS Raudhatul Hidayah"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[14px] font-bold text-slate-900 tracking-tight truncate group-hover:text-blue-700 transition-colors">
                MAS RAUDHATUL HIDAYAH
              </span>
              <span className="text-[11px] font-semibold text-blue-700 tracking-wide">
                {userRole === 'siswa'
                  ? 'Portal Santri / Siswa'
                  : userRole === 'guru'
                  ? 'Portal Dewan Guru'
                  : 'Portal Akademik Resmi'}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpenMobile(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 scrollbar-thin">
          {userRole === 'siswa' ? (
            <div className="space-y-4">
              <div>
                <div className="px-3 pb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  MENU SANTRI / SISWA
                </div>

                <div className="space-y-1">
                  {/* 1. Jadwal Pelajaran */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('schedules')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] transition-all ${getItemClass(
                      'schedules'
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays className={`w-4 h-4 shrink-0 ${getIconClass('schedules')}`} />
                      <span>Jadwal Pelajaran</span>
                    </div>
                  </button>

                  {/* 2. Kelas & Wali Kelas */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('classes')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] transition-all ${getItemClass(
                      'classes'
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      <School className={`w-4 h-4 shrink-0 ${getIconClass('classes')}`} />
                      <span>Kelas & Wali Kelas</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        activeTab === 'classes'
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      12
                    </span>
                  </button>

                  {/* 3. Kalender Akademik */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('calendar')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] transition-all ${getItemClass(
                      'calendar'
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-4 h-4 shrink-0 ${getIconClass('calendar')}`} />
                      <span>Kalender Akademik</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : userRole === 'guru' ? (
            <div className="space-y-4">
              {/* Group 1: Akademik & Jadwal */}
              <div>
                <div className="px-3 pb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  AKADEMIK & PENGAJARAN
                </div>
                <div className="space-y-1">
                  {/* 1. Jadwal Pelajaran */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('schedules')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                      'schedules'
                    )}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CalendarDays className={`w-4 h-4 shrink-0 ${getIconClass('schedules')}`} />
                      <span className="truncate">Jadwal Pelajaran</span>
                    </div>
                  </button>

                  {/* 2. Kelas & Wali Kelas */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('classes')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                      'classes'
                    )}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <School className={`w-4 h-4 shrink-0 ${getIconClass('classes')}`} />
                      <span className="truncate">Kelas & Wali Kelas</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        activeTab === 'classes'
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      12
                    </span>
                  </button>

                  {/* 3. Kalender Akademik */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('calendar')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                      'calendar'
                    )}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Calendar className={`w-4 h-4 shrink-0 ${getIconClass('calendar')}`} />
                      <span className="truncate">Kalender Akademik</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Group 2: Warta & Kesiswaan */}
              <div>
                <div className="px-3 pb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  WARTA & KESISWAAN
                </div>
                <div className="space-y-1">
                  {/* 4. Berita & Agenda */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('articles')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                      'articles'
                    )}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Newspaper className={`w-4 h-4 shrink-0 ${getIconClass('articles')}`} />
                      <span className="truncate">Berita & Agenda</span>
                    </div>
                  </button>

                  {/* 5. Dokumentasi Juara */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('achievements')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                      'achievements'
                    )}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Trophy className={`w-4 h-4 shrink-0 ${getIconClass('achievements')}`} />
                      <span className="truncate">Dokumentasi Juara</span>
                    </div>
                  </button>

                  {/* 6. Ekstrakurikuler */}
                  <button
                    type="button"
                    onClick={() => handleSelectTab('extracurricular')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                      'extracurricular'
                    )}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Compass className={`w-4 h-4 shrink-0 ${getIconClass('extracurricular')}`} />
                      <span className="truncate">Ekstrakurikuler</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Section: MENU NAVIGASI */}
              <div>
                <div className="px-3 pb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  MENU NAVIGASI
                </div>

                {/* Beranda (Dashboard / Overview) */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard
                      className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-500'}`}
                    />
                    <span>Beranda</span>
                  </div>
                </button>
              </div>

          {/* Group 1: Akademik & Kurikulum */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setOpenAkademik(!openAkademik)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <School className="w-4.5 h-4.5 text-blue-700" />
                <span>Akademik & Kurikulum</span>
              </div>
              {openAkademik ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {openAkademik && (
              <div className="relative pl-3.5 ml-4 border-l-2 border-blue-400 space-y-1 my-1">
                {/* Jadwal Pelajaran */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('schedules')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'schedules'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CalendarDays className={`w-4 h-4 shrink-0 ${getIconClass('schedules')}`} />
                    <span className="truncate">Jadwal Pelajaran</span>
                  </div>
                </button>

                {/* Guru Mata Pelajaran */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('teachers')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'teachers'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BookOpen className={`w-4 h-4 shrink-0 ${getIconClass('teachers')}`} />
                    <span className="truncate">Guru Mata Pelajaran</span>
                  </div>
                </button>

                {/* Kelas & Wali Kelas */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('classes')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'classes'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <School className={`w-4 h-4 shrink-0 ${getIconClass('classes')}`} />
                    <span className="truncate">Kelas & Wali Kelas</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      activeTab === 'classes'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    12
                  </span>
                </button>

                {/* Kalender Akademik */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('calendar')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'calendar'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Calendar className={`w-4 h-4 shrink-0 ${getIconClass('calendar')}`} />
                    <span className="truncate">Kalender Akademik</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Group 2: Kelola Pengguna */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setOpenPengguna(!openPengguna)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4.5 h-4.5 text-blue-700" />
                <span>Kelola Pengguna</span>
              </div>
              {openPengguna ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {openPengguna && (
              <div className="relative pl-3.5 ml-4 border-l-2 border-blue-400 space-y-1 my-1">
                {/* Direktori Pengguna (real count badge) */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('users')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'users'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Users className={`w-4 h-4 shrink-0 ${getIconClass('users')}`} />
                    <span className="truncate">Direktori Pengguna</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      activeTab === 'users'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {displayUsersCount}
                  </span>
                </button>

                {/* Aktivasi Akun */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('activation')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'activation'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Key className={`w-4 h-4 shrink-0 ${getIconClass('activation')}`} />
                    <span className="truncate">Aktivasi Akun Pengguna</span>
                  </div>
                  {internalPendingCount > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeTab === 'activation'
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {internalPendingCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Group 3: Kelola Website */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setOpenWebsite(!openWebsite)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4.5 h-4.5 text-blue-700" />
                <span>Kelola Website</span>
              </div>
              {openWebsite ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {openWebsite && (
              <div className="relative pl-3.5 ml-4 border-l-2 border-blue-400 space-y-1 my-1">
                {/* 1. Pengaturan & Slider Hero */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('homepage')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'homepage'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SlidersHorizontal className={`w-4 h-4 shrink-0 ${getIconClass('homepage')}`} />
                    <span className="truncate">Pengaturan & Slider Hero</span>
                  </div>
                </button>

                {/* 2. Berita & Agenda */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('articles')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'articles'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Newspaper className={`w-4 h-4 shrink-0 ${getIconClass('articles')}`} />
                    <span className="truncate">Berita & Agenda</span>
                  </div>
                </button>

                {/* 3. Dewan Guru & Pendidik */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('website-teachers')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'website-teachers'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GraduationCap className={`w-4 h-4 shrink-0 ${getIconClass('website-teachers')}`} />
                    <span className="truncate">Dewan Guru & Pendidik</span>
                  </div>
                </button>

                {/* 4. Fasilitas & Sarpras */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('facilities')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'facilities'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Building2 className={`w-4 h-4 shrink-0 ${getIconClass('facilities')}`} />
                    <span className="truncate">Fasilitas & Sarpras</span>
                  </div>
                </button>

                {/* 5. Dokumentasi Juara */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('achievements')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'achievements'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Trophy className={`w-4 h-4 shrink-0 ${getIconClass('achievements')}`} />
                    <span className="truncate">Dokumentasi Juara</span>
                  </div>
                </button>

                {/* 6. Ekstrakurikuler */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('extracurricular')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'extracurricular'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Compass className={`w-4 h-4 shrink-0 ${getIconClass('extracurricular')}`} />
                    <span className="truncate">Ekstrakurikuler</span>
                  </div>
                </button>

                {/* 9. Alur Pendaftaran PPDB */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('ppdb')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'ppdb'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className={`w-4 h-4 shrink-0 ${getIconClass('ppdb')}`} />
                    <span className="truncate">Alur Pendaftaran PPDB</span>
                  </div>
                </button>

                {/* 10. Pendaftar PPDB Online */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('registrations')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'registrations'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserCheck className={`w-4 h-4 shrink-0 ${getIconClass('registrations')}`} />
                    <span className="truncate">Pendaftar PPDB Online</span>
                  </div>
                </button>

                {/* 11. Pesan Masuk (Buku Tamu) */}
                <button
                  type="button"
                  onClick={() => handleSelectTab('messages')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-all ${getItemClass(
                    'messages'
                  )}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className={`w-4 h-4 shrink-0 ${getIconClass('messages')}`} />
                    <span className="truncate">Pesan Masuk (Buku Tamu)</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500 text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
            </>
          )}
        </nav>

        {/* Clean Footer Matching Web Profil (Navy CTA & Amber Gold highlights) */}
        <div className="p-4 border-t border-slate-200/90 bg-slate-50/80 flex flex-col gap-2.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Buka Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </Link>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Keluar dari Akun</span>
            </button>
          )}

          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online Cloud Aktif</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">v2.5.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
