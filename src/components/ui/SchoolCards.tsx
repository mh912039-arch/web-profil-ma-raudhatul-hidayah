'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Users,
  Compass,
  Sparkle,
} from 'lucide-react';

/* =========================================================================
   1. HERO SUMMARY CARD (Light Frosted Minimalist Glass)
   ========================================================================= */
export interface SummaryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string;
}

export function SummaryCard({ title, description, icon, href, onClick, badge }: SummaryCardProps) {
  const innerContent = (
    <>
      <div className="w-12 h-12 rounded-xl bg-white/10 text-white group-hover:bg-amber-500 group-hover:text-blue-950 flex items-center justify-center shrink-0 border border-white/20 group-hover:border-amber-400 transition-all duration-200 shadow-sm backdrop-blur-md">
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors drop-shadow-xs">
              {title}
            </h3>
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-white/20">
                {badge}
              </span>
            )}
          </div>
          <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-amber-500 flex items-center justify-center text-white/80 group-hover:text-blue-950 transition-all shrink-0 border border-white/15 group-hover:border-amber-400">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="font-sans text-[12.5px] text-slate-200/90 leading-relaxed line-clamp-2 drop-shadow-2xs">
          {description}
        </p>
      </div>
    </>
  );

  const containerClasses = "group relative w-full text-left bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/20 hover:border-amber-400/50 shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(245,158,11,0.2)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex items-start gap-4 cursor-pointer";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={containerClasses}
      >
        {innerContent}
      </button>
    );
  }

  return (
    <Link
      href={href || '#'}
      className={containerClasses}
    >
      {innerContent}
    </Link>
  );
}

/* =========================================================================
   2. NEWS & ACTIVITY CARD (Masonry Bento Element)
   ========================================================================= */
export interface NewsMasonryCardProps {
  title: string;
  category: string;
  date?: string;
  image: string;
  excerpt: string;
  href: string;
  badgeType?: 'primary' | 'amber' | 'cyan' | 'emerald';
  isLarge?: boolean;
}

export function NewsMasonryCard({
  title,
  category,
  date,
  image,
  excerpt,
  href,
  badgeType = 'primary',
  isLarge = false,
}: NewsMasonryCardProps) {
  const badgeClasses = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200/60',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/60',
    cyan: 'bg-cyan-50 text-cyan-800 border-cyan-200/60',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
  }[badgeType];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_34px_rgba(37,99,235,0.07)] transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full">
      <div className={`relative overflow-hidden bg-slate-100 ${isLarge ? 'h-56 sm:h-64' : 'h-48'}`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full backdrop-blur-md text-[10.5px] font-bold tracking-wider uppercase border ${badgeClasses}`}>
            {category}
          </span>
          {date && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-medium border border-slate-200/80">
              {date}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          <h3 className={`font-serif font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug ${isLarge ? 'text-[18px] sm:text-[20px]' : 'text-[16px]'}`}>
            {title}
          </h3>
          <p className="font-sans text-[13px] text-slate-600 mt-2 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-sans text-[11.5px] font-bold uppercase tracking-wider transition-colors duration-200 active:scale-[0.98] w-fit shadow-xs"
          >
            <span>BACA WARTA</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. ACADEMIC ANNOUNCEMENT CARD (Solid Royal Blue Accent Card)
   ========================================================================= */
export interface AcademicAnnouncementCardProps {
  title: string;
  description: string;
  badge: string;
  href: string;
  ctaText?: string;
}

export function AcademicAnnouncementCard({
  title,
  description,
  badge,
  href,
  ctaText = 'LIHAT JADWAL EVALUASI',
}: AcademicAnnouncementCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e3a8a] to-[#172554] text-white rounded-2xl p-6 sm:p-7 shadow-[0_12px_32px_rgba(30,58,138,0.25)] hover:shadow-[0_18px_40px_rgba(30,58,138,0.35)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[260px] border border-white/20">
      <div>
        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10.5px] font-bold uppercase tracking-wider inline-block mb-3 border border-white/20">
          {badge}
        </span>
        <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-white leading-snug">
          {title}
        </h3>
        <p className="font-sans text-[13px] text-blue-100 mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-5 mt-4 border-t border-white/20">
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#1e3a8a] font-sans text-[12px] font-bold uppercase tracking-wider shadow-md hover:bg-amber-50 transition-all duration-200 active:scale-[0.98]"
        >
          <span>{ctaText}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/* =========================================================================
   4. ACADEMIC CALENDAR & EVENTS WIDGET (Interactive Clean Light Component)
   ========================================================================= */
export function AcademicCalendarWidget() {
  const [selectedDay, setSelectedDay] = useState<number>(18);

  const academicEvents: Record<number, { title: string; type: string; desc: string }> = {
    5: {
      title: 'Pemberdayaan Perpustakaan & Gerakan Literasi',
      type: 'Literasi Santri',
      desc: 'Pelatihan pencarian referensi ilmiah dan resensi buku Kurikulum Merdeka Fase D.',
    },
    14: {
      title: 'Simulasi Penilaian Tengah Semester (PTS)',
      type: 'Akademik',
      desc: 'Uji coba platform asesmen mandiri bagi jenjang kelas VII, VIII, dan IX.',
    },
    18: {
      title: 'Pekan Gelar Karya Projek Pelajar Pancasila (P5)',
      type: 'Projek & Seni',
      desc: 'Pameran karya inovasi kolaboratif santri bertema kearifan lokal & lingkungan hidup.',
    },
    27: {
      title: 'Evaluasi Pembelajaran & Silaturahmi Wali Santri',
      type: 'Layanan Siswa',
      desc: 'Konsultasi berkala perkembangan adab dan capaian akademik bersama wali kelas.',
    },
  };

  const calendarDays = [
    null, null, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, null, null,
  ];

  return (
    <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-200/80">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-[15px] font-bold text-slate-900">
            Kalender Akademik
          </h4>
        </div>
        <span className="font-sans text-[11.5px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
          Oktober 2026
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-sans text-[11.5px] mb-3">
        <span className="font-bold text-slate-400 py-1">Min</span>
        <span className="font-bold text-slate-400 py-1">Sen</span>
        <span className="font-bold text-slate-400 py-1">Sel</span>
        <span className="font-bold text-slate-400 py-1">Rab</span>
        <span className="font-bold text-slate-400 py-1">Kam</span>
        <span className="font-bold text-slate-400 py-1">Jum</span>
        <span className="font-bold text-slate-400 py-1">Sab</span>

        {calendarDays.map((day, idx) => {
          if (!day) {
            return <span key={`empty-${idx}`} className="py-1.5" />;
          }
          const hasEvent = !!academicEvents[day];
          const isSelected = selectedDay === day;

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`py-1.5 rounded-lg font-medium transition-all duration-150 relative ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : hasEvent
                  ? 'bg-blue-50 text-blue-700 font-bold hover:bg-blue-100'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{day}</span>
              {hasEvent && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Selected Event Info */}
      <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
        {academicEvents[selectedDay] ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                {academicEvents[selectedDay].type}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {selectedDay} Oktober 2026
              </span>
            </div>
            <h5 className="font-serif text-[13.5px] font-bold text-slate-900 leading-tight">
              {academicEvents[selectedDay].title}
            </h5>
            <p className="font-sans text-[12px] text-slate-600 mt-1 leading-normal">
              {academicEvents[selectedDay].desc}
            </p>
          </div>
        ) : (
          <p className="font-sans text-[11.5px] text-slate-500 italic text-center py-1">
            Klik tanggal bertitik biru untuk melihat detail agenda akademik.
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   5. REUSABLE EXTRACURRICULAR CARD
   ========================================================================= */
export interface ExtracurricularCardProps {
  name: string;
  category: string;
  badge: string;
  schedule: string;
  coach: string;
  role: string;
  image: string;
  desc: string;
}

export function ExtracurricularCard({
  name,
  category,
  badge,
  schedule,
  coach,
  role,
  image,
  desc,
}: ExtracurricularCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)] transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-50" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-blue-700 text-[10.5px] font-bold uppercase tracking-wider border border-blue-200/50 shadow-2xs">
            {badge}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11.5px] font-medium drop-shadow-sm">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-blue-300" />
            <span>{schedule}</span>
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          <h3 className="font-serif text-[17px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
            {name}
          </h3>
          <p className="font-sans text-[12.5px] text-slate-600 mt-2 leading-relaxed line-clamp-3">
            {desc}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {role}
            </span>
            <span className="text-[12px] font-semibold text-slate-800">
              {coach}
            </span>
          </div>
          <Link
            href="/akademik/ekstrakurikuler"
            className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center text-slate-600 group-hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
