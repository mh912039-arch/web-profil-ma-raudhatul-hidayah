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
  BookOpen,
  School,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';
import { AdminTab } from '../AdminSidebar';
import { TeacherRecord } from './TeachersTab';
import { ScheduleItem } from './SchedulesTab';

interface PortalOverviewTabProps {
  userRole: 'guru' | 'siswa';
  currentUserName: string;
  teachers: TeacherRecord[];
  articlesCount: number;
  achievementsCount: number;
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

  return (
    <div className="space-y-5 pb-6">
      {/* 1. Header Ringkas Sesuai Rancangan Mobile Figma */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-800 text-[10px] font-bold tracking-wider uppercase">
              <School className="w-3.5 h-3.5 text-blue-700" />
              <span>
                {userRole === 'guru' ? 'PORTAL TERPADU / GURU' : 'PORTAL TERPADU / SANTRI'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight">
              {userRole === 'guru'
                ? `Selamat Bertugas, ${effectiveGuruName}`
                : "Assalamu'alaikum, Santri & Siswa"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {userRole === 'guru'
                ? 'Kelola kegiatan belajar mengajar dan akses agenda akademik madrasah.'
                : 'Ruang informasi akademik dan kesiswaan Madrasah Raudlatul Hidayah.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{todayDayName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Card Guru: Agenda Mengajar Pribadi (Figma Match) */}
      {userRole === 'guru' && (
        <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 text-white p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold uppercase tracking-wider border border-white/15">
                <CalendarClock className="w-3 h-3 text-blue-300" />
                AGENDA MENGAJAR PRIBADI
              </span>
              <span className="text-[11px] font-medium text-blue-200">
                Guru: <strong className="text-white">{effectiveGuruName}</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
              Agenda tatap muka harian di kelas santri Madrasah Aliyah Raudlatul Hidayah.
            </p>

            {/* Statistik Dua Kolom */}
            <div className="grid grid-cols-2 gap-3 pt-1">
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
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-blue-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {todaySessions.length > 0
                  ? `Terdapat ${todaySessions.length} sesi mengajar hari ini. Ketuk tombol untuk melihat urutan jam pelajaran.`
                  : 'Seluruh sesi tatap muka kelas untuk hari ini telah selesai atau sedang tidak ada jadwal mengajar.'}
              </span>
            </div>

            {/* CTA ke Jadwal Mengajar */}
            <button
              type="button"
              onClick={() => setActiveTab('schedules')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm shadow-sm hover:bg-blue-50 transition-all duration-150 active:scale-[0.98]"
            >
              <span>Buka Jadwal Mengajar Saya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Hero Card Santri / Siswa (Figma Match) */}
      {userRole === 'siswa' && (
        <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 text-white p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-blue-100 text-[10px] font-bold uppercase tracking-wider border border-white/15">
              <GraduationCap className="w-3 h-3 text-blue-300" />
              PORTAL AKADEMIK SANTRI
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              Madrasah Aliyah Raudlatul Hidayah
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
              Lihat jadwal pelajaran mingguan, informasi ruang kelas dan wali kelas, serta agenda kegiatan penting madrasah.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('schedules')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-sm hover:bg-blue-50 transition-all duration-150 active:scale-[0.98]"
              >
                <CalendarClock className="w-3.5 h-3.5" />
                <span>Lihat Jadwal Pelajaran</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('classes')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-md text-white font-bold text-xs border border-white/20 hover:bg-white/25 transition-all duration-150 active:scale-[0.98]"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Informasi Kelas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Akses Cepat Menu Sesuai Rancangan Figma */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {userRole === 'guru' ? 'AKSES CEPAT' : 'MENU SANTRI / SISWA'}
          </h3>
          <span className="text-[11px] text-slate-500">Pilih menu untuk melanjutkan</span>
        </div>

        {/* Grup 1: Akademik & Kurikulum */}
        <div>
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2.5">
            Akademik & Kurikulum
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('schedules')}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-2xs transition-all duration-150 active:scale-[0.98] text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <CalendarClock className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  Jadwal Pelajaran
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {userRole === 'guru' ? 'Agenda mengajar & seluruh kelas' : 'Jadwal belajar harian santri'}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('classes')}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-2xs transition-all duration-150 active:scale-[0.98] text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <GraduationCap className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  Kelas & Wali Kelas
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Daftar rombel dan wali kelas
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-2xs transition-all duration-150 active:scale-[0.98] text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <CalendarDays className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  Kalender Akademik
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Agenda penting tahun pelajaran
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>
        </div>

        {/* Grup 2: Warta & Kesiswaan */}
        <div className="pt-2">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2.5">
            Warta & Kesiswaan
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('articles')}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-2xs transition-all duration-150 active:scale-[0.98] text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <Newspaper className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  Berita & Agenda
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {articlesCount > 0 ? `${articlesCount} publikasi aktif` : 'Kabar terbaru madrasah'}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('achievements')}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-2xs transition-all duration-150 active:scale-[0.98] text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Trophy className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  Dokumentasi Juara
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {achievementsCount > 0 ? `${achievementsCount} galeri juara` : 'Jejak prestasi santri'}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('extracurricular')}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-2xs transition-all duration-150 active:scale-[0.98] text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Activity className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  Ekstrakurikuler
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Temukan minat dan kembangkan bakat
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Motto Lembaga (Sesuai Figma Note: "Berilmu, berakhlak, berprestasi.") */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 text-center text-xs font-semibold text-slate-600">
        <span className="text-blue-700 font-bold">Madrasah Aliyah Raudlatul Hidayah</span> &mdash; Berilmu, berakhlak, berprestasi.
      </div>
    </div>
  );
}
