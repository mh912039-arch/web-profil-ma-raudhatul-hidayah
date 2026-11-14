'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarClock,
  GraduationCap,
  CalendarDays,
  Newspaper,
  Trophy,
  Activity,
  ArrowRight,
  Clock,
  School,
  CheckCircle2,
  Users,
  ChevronRight,
  Mail,
  SlidersHorizontal,
  Key,
  UserCheck,
  Building2,
  Compass,
  Bell,
  BookOpen,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AdminTab } from '../AdminSidebar';
import { TeacherRecord } from './TeachersTab';
import { ScheduleItem } from './SchedulesTab';

interface PortalOverviewTabProps {
  userRole: 'admin' | 'guru' | 'siswa';
  currentUserName: string;
  teachers: TeacherRecord[];
  articlesCount: number;
  achievementsCount: number;
  unreadMessagesCount?: number;
  registrationsCount?: number;
  academicYear?: string;
  isPpdbOpen?: boolean;
  setActiveTab: (tab: AdminTab) => void;
}

const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function isTeacherMatch(scheduleTeacher: string, currentTeacher: string): boolean {
  if (!scheduleTeacher || !currentTeacher) return false;
  const sNorm = normalizeText(scheduleTeacher);
  const cNorm = normalizeText(currentTeacher);
  if (sNorm === cNorm) return true;
  if (sNorm.includes(cNorm) || cNorm.includes(sNorm)) return true;
  const sParts = scheduleTeacher.toLowerCase().split(/[\s,.]+/).filter((p) => p.length > 2);
  const cParts = currentTeacher.toLowerCase().split(/[\s,.]+/).filter((p) => p.length > 2);
  return sParts.some((sp) => cParts.includes(sp));
}

export function PortalOverviewTab({
  userRole,
  currentUserName,
  teachers,
  articlesCount,
  achievementsCount,
  unreadMessagesCount = 0,
  registrationsCount = 0,
  academicYear = '2027/2028',
  isPpdbOpen = true,
  setActiveTab,
}: PortalOverviewTabProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [currentTime] = useState<Date>(new Date());

  // Ambil data jadwal dari API untuk ringkasan agenda
  useEffect(() => {
    let isMounted = true;
    const fetchSchedules = async () => {
      try {
        const res = await fetch('/api/schedules', { cache: 'no-store' });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSchedules(data);
          }
        }
      } catch (err) {
        console.warn('Gagal memuat ringkasan jadwal:', err);
      }
    };
    fetchSchedules();
    return () => {
      isMounted = false;
    };
  }, []);

  const todayDayName = useMemo(() => {
    return INDONESIAN_DAYS[currentTime.getDay()] || 'Senin';
  }, [currentTime]);

  const effectiveGuruName = useMemo(() => {
    if (currentUserName && currentUserName.toLowerCase() !== 'guru' && currentUserName.toLowerCase() !== 'admin') {
      return currentUserName;
    }
    return 'JAKARIA, S.Pd.I';
  }, [currentUserName]);

  // Statistik mengajar guru
  const guruTeachingSessions = useMemo(() => {
    if (userRole !== 'guru') return [];
    return schedules.filter((s) => isTeacherMatch(s.teacher_name, effectiveGuruName));
  }, [schedules, userRole, effectiveGuruName]);

  const todaySessions = useMemo(() => {
    return guruTeachingSessions.filter(
      (s) => s.day.toLowerCase() === todayDayName.toLowerCase()
    );
  }, [guruTeachingSessions, todayDayName]);

  const totalWeeklySessions = guruTeachingSessions.length;

  // Hitung jumlah rombel unik dari jadwal
  const activeRombelsCount = useMemo(() => {
    const rombels = new Set(schedules.map((s) => s.class_rombel).filter(Boolean));
    return rombels.size > 0 ? rombels.size : 12;
  }, [schedules]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      {/* =========================================================================
          1. HEADER RINGKAS & STATUS SISTEM (Disembunyikan di Mobile)
      ========================================================================= */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-800 text-[10px] font-bold tracking-wider uppercase">
              <School className="w-3.5 h-3.5 text-blue-700" />
              <span>
                {userRole === 'admin'
                  ? 'PORTAL TERPADU / ADMIN'
                  : userRole === 'guru'
                  ? 'PORTAL TERPADU / GURU'
                  : 'PORTAL TERPADU / SANTRI'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
              {userRole === 'admin'
                ? `Selamat Datang, ${currentUserName || 'Administrator'}`
                : userRole === 'guru'
                ? `Selamat Bertugas, ${effectiveGuruName}`
                : "Assalamu'alaikum, Santri & Siswa"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {userRole === 'admin'
                ? 'Pusat kendali dan administrasi madrasah dalam satu genggaman.'
                : userRole === 'guru'
                ? 'Kelola kegiatan belajar mengajar dan akses agenda akademik madrasah.'
                : 'Ruang informasi akademik dan kesiswaan Madrasah Raudlatul Hidayah.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{todayDayName}</span>
            </span>
            {userRole === 'admin' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Cloud Aktif</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. METRIK / HERO UTAMA SESUAI PERAN
      ========================================================================= */}

      {/* A. ADMIN: BENTO GRID 2x2 KOMPAK (Full-Touch Target) */}
      {userRole === 'admin' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ringkasan Utama
            </h3>
            <span className="text-[11px] text-slate-400">Sentuh kartu untuk buka</span>
          </div>

          {/* Grid 2x2 Bento Ringkas */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {/* Kotak 1: Jadwal */}
            <div
              onClick={() => setActiveTab('schedules')}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.97] cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CalendarClock className="w-4 h-4 stroke-[2]" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Jadwal Pelajaran
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 group-hover:text-blue-700 transition-colors">
                  {activeRombelsCount} Ruang Kelas
                </div>
                <div className="text-[10.5px] text-slate-500 truncate mt-0.5">
                  SD, SMP &amp; SMA Aktif
                </div>
              </div>
            </div>

            {/* Kotak 2: PPDB */}
            <div
              onClick={() => setActiveTab('registrations')}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.97] cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-4 h-4 stroke-[2]" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Pendaftar PPDB
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 group-hover:text-amber-700 transition-colors">
                  {registrationsCount > 0 ? `${registrationsCount} Santri` : isPpdbOpen ? 'Buka' : 'Tutup'}
                </div>
                <div className="text-[10.5px] text-slate-500 truncate mt-0.5">
                  Tahun Ajaran {academicYear}
                </div>
              </div>
            </div>

            {/* Kotak 3: Dewan Guru */}
            <div
              onClick={() => setActiveTab('teachers')}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.97] cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/70 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Users className="w-4 h-4 stroke-[2]" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Dewan Guru
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 group-hover:text-indigo-700 transition-colors">
                  {teachers.length} Pendidik
                </div>
                <div className="text-[10.5px] text-slate-500 truncate mt-0.5">
                  Terverifikasi sistem
                </div>
              </div>
            </div>

            {/* Kotak 4: Warta / Berita */}
            <div
              onClick={() => setActiveTab('articles')}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.97] cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Newspaper className="w-4 h-4 stroke-[2]" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Warta Madrasah
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 group-hover:text-emerald-700 transition-colors">
                  {articlesCount} Publikasi
                </div>
                <div className="text-[10.5px] text-slate-500 truncate mt-0.5">
                  Kabar &amp; agenda madrasah
                </div>
              </div>
            </div>
          </div>

          {/* Notifikasi Tindakan Prioritas (Jika ada pesan atau pendaftar) */}
          {(unreadMessagesCount > 0 || registrationsCount > 0) && (
            <div className="space-y-2 pt-1">
              {unreadMessagesCount > 0 && (
                <div
                  onClick={() => setActiveTab('messages')}
                  className="p-3 rounded-xl bg-blue-50/90 border border-blue-200/80 flex items-center justify-between gap-2.5 text-xs text-blue-900 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail className="w-4 h-4 text-blue-700 shrink-0" />
                    <span className="font-semibold truncate">
                      Ada {unreadMessagesCount} pesan baru dari tamu/wali santri
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 shrink-0 inline-flex items-center gap-0.5">
                    Buka <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}

              {registrationsCount > 0 && (
                <div
                  onClick={() => setActiveTab('registrations')}
                  className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-2.5 text-xs text-amber-900 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GraduationCap className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="font-semibold truncate">
                      {registrationsCount} berkas calon santri PPDB perlu verifikasi
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 shrink-0 inline-flex items-center gap-0.5">
                    Tinjau <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* B. GURU: AGENDA MENGAJAR PRIBADI (Hero Bento) */}
      {userRole === 'guru' && (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white p-4 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold uppercase tracking-wider border border-white/15">
                <CalendarClock className="w-3 h-3 text-blue-300" />
                AGENDA MENGAJAR PRIBADI
              </span>
              <span className="text-[11px] font-medium text-blue-200">
                Guru: <strong className="text-white">{effectiveGuruName}</strong>
              </span>
            </div>

            {/* Statistik 2 Kolom Guru */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                  HARI INI:
                </div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {todayDayName} ({todaySessions.length} Sesi)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                  TOTAL MENGAJAR:
                </div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {totalWeeklySessions > 0 ? `${totalWeeklySessions} Sesi / Minggu` : '10 Sesi / Minggu'}
                </div>
              </div>
            </div>

            {/* Status Sesi Tatap Muka */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2 text-xs text-blue-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {todaySessions.length > 0
                  ? `Ada ${todaySessions.length} sesi mengajar kelas hari ini. Ketuk tombol untuk melihat urutan jam pelajaran.`
                  : 'Seluruh sesi tatap muka kelas untuk hari ini telah selesai dilaksanakan atau libur.'}
              </span>
            </div>

            {/* CTA ke Jadwal Mengajar */}
            <button
              type="button"
              onClick={() => setActiveTab('schedules')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm shadow-sm hover:bg-blue-50 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <span>Buka Jadwal Mengajar Saya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}



      {/* =========================================================================
          3. GRID MENU CEPAT (QUICK ACTION HUB - SIMPLE, RAPIH & MUDAH DIKLIK)
      ========================================================================= */}
      <div className="space-y-4 pt-1">
        {/* --- KELOMPOK 1: AKADEMIK & KURIKULUM --- */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-800">
            Akademik &amp; Kurikulum
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Jadwal Pelajaran */}
            <div
              onClick={() => setActiveTab('schedules')}
              className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CalendarClock className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                    Jadwal Pelajaran
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {userRole === 'guru'
                      ? 'Agenda mengajar & seluruh kelas'
                      : userRole === 'admin'
                      ? 'Kelola matriks jadwal seluruh kelas'
                      : 'Jadwal belajar harian santri'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Dewan Guru (Admin) / Jadwal Mengajar (Guru) */}
            {userRole === 'admin' ? (
              <div
                onClick={() => setActiveTab('teachers')}
                className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/70 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Users className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                      Guru &amp; Tenaga Pendidik
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {teachers.length} guru &amp; staf madrasah
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ) : null}

            {/* Kelas & Wali Kelas */}
            <div
              onClick={() => setActiveTab('classes')}
              className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                    Kelas &amp; Wali Kelas
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {userRole === 'admin'
                      ? 'Daftar ruang kelas dan penugasan wali'
                      : 'Informasi ruang kelas & pembimbing kelas'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Kalender Akademik */}
            <div
              onClick={() => setActiveTab('calendar')}
              className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CalendarDays className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                    Kalender Akademik
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Agenda penting &amp; kalender semester
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </div>

        {/* --- KELOMPOK 2: KESISWAAN & PPDB --- */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-slate-800">
            {userRole === 'admin' ? 'Kesiswaan & PPDB Online' : 'Warta & Kesiswaan'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Pendaftar PPDB Online (Khusus Admin) */}
            {userRole === 'admin' && (
              <>
                <div
                  onClick={() => setActiveTab('registrations')}
                  className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <GraduationCap className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                        Pendaftar PPDB Online
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {registrationsCount > 0 ? `${registrationsCount} calon santri masuk` : 'Daftar calon santri baru'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                <div
                  onClick={() => setActiveTab('ppdb')}
                  className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                        Alur &amp; Konfigurasi PPDB
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Status buka/tutup &amp; syarat
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </>
            )}

            {/* Berita & Agenda */}
            <div
              onClick={() => setActiveTab('articles')}
              className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200/70 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Newspaper className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                    Berita &amp; Agenda
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {articlesCount > 0 ? `${articlesCount} publikasi aktif` : 'Kabar terkini madrasah'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Dokumentasi Juara */}
            <div
              onClick={() => setActiveTab('achievements')}
              className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Trophy className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                    Dokumentasi Juara
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {achievementsCount > 0 ? `${achievementsCount} arsip prestasi` : 'Jejak prestasi santri'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

            {/* Ekstrakurikuler */}
            <div
              onClick={() => setActiveTab('extracurricular')}
              className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Activity className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    Ekstrakurikuler
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Kegiatan minat &amp; bakat santri
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </div>

        {/* --- KELOMPOK 3: KELOLA WEBSITE & PENGGUNA (KHUSUS ADMIN) --- */}
        {userRole === 'admin' && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-slate-800">
              Website &amp; Akun Pengguna
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Pesan Masuk Buku Tamu */}
              <div
                onClick={() => setActiveTab('messages')}
                className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                      Pesan Masuk (Buku Tamu)
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {unreadMessagesCount > 0 ? `${unreadMessagesCount} pesan baru` : 'Kotak aspirasi & kontak'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Aktivasi Akun Pengguna */}
              <div
                onClick={() => setActiveTab('activation')}
                className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <UserCheck className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      Aktivasi Akun Pengguna
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Verifikasi pendaftaran login
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Direktori Pengguna */}
              <div
                onClick={() => setActiveTab('users')}
                className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-purple-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/70 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Key className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                      Direktori Pengguna
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Kelola hak akses &amp; akun
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Pengaturan Slider & Hero Web */}
              <div
                onClick={() => setActiveTab('homepage')}
                className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all duration-150 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                    <SlidersHorizontal className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-slate-800 transition-colors truncate">
                      Slider &amp; Hero Website
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Foto &amp; banner halaman depan
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
