'use client';

import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  Edit2,
  CheckCircle2,
  Plus,
  BookOpen,
  School,
} from 'lucide-react';
import { TeacherRecord } from './TeachersTab';

export type ClassJenjang = 'sd' | 'smp' | 'sma';

export interface ClassRombel {
  id: string;
  code: string;
  name: string;
  jenjang: ClassJenjang;
  level: string;
  homeroom_teacher: string;
  total_students: number;
  room_location?: string;
  curriculum: string;
}

interface ClassesTabProps {
  teachers: TeacherRecord[];
  onSelectRombelForSchedule?: (rombelName: string) => void;
  readOnly?: boolean;
}

const initialClasses: ClassRombel[] = [
  // 1. Jenjang SD (Kelas 1 - 6 Angka Romawi: I, II, III, IV, V, VI)
  {
    id: 'cls-sd-1',
    code: 'I',
    name: 'SD - Kelas I',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas I • Fase A)',
    homeroom_teacher: 'KUSTYANINGSIH, S.Pd',
    total_students: 26,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-2',
    code: 'II',
    name: 'SD - Kelas II',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas II • Fase A)',
    homeroom_teacher: 'SARNAH, S.Pd.I',
    total_students: 25,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-3',
    code: 'III',
    name: 'SD - Kelas III',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas III • Fase B)',
    homeroom_teacher: 'TAJUDIN, S.Pd.I',
    total_students: 28,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-4',
    code: 'IV',
    name: 'SD - Kelas IV',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas IV • Fase B)',
    homeroom_teacher: 'MADROSYID, S.Pd',
    total_students: 27,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-5',
    code: 'V',
    name: 'SD - Kelas V',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas V • Fase C)',
    homeroom_teacher: 'Drs. MULYADI',
    total_students: 29,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-6',
    code: 'VI',
    name: 'SD - Kelas VI',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas VI • Fase C)',
    homeroom_teacher: 'JAKARIA, S.Pd.I',
    total_students: 30,
    curriculum: 'Kurikulum Merdeka',
  },

  // 2. Jenjang SMP (Kelas VII, VIII, IX)
  {
    id: 'cls-smp-1',
    code: 'VII',
    name: 'SMP - Kelas VII',
    jenjang: 'smp',
    level: 'Jenjang SMP (Kelas VII • Fase D)',
    homeroom_teacher: 'TAJUDIN, S.Pd.I',
    total_students: 32,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-smp-2',
    code: 'VIII',
    name: 'SMP - Kelas VIII',
    jenjang: 'smp',
    level: 'Jenjang SMP (Kelas VIII • Fase D)',
    homeroom_teacher: 'JAKARIA, S.Pd.I',
    total_students: 31,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-smp-3',
    code: 'IX',
    name: 'SMP - Kelas IX',
    jenjang: 'smp',
    level: 'Jenjang SMP (Kelas IX • Fase D)',
    homeroom_teacher: 'MADROSYID, S.Pd',
    total_students: 30,
    curriculum: 'Kurikulum Merdeka',
  },

  // 3. Jenjang SMA / MA (Kelas X, XI, XII)
  {
    id: 'cls-sma-1',
    code: 'X',
    name: 'SMA - Kelas X',
    jenjang: 'sma',
    level: 'Jenjang SMA (Kelas X • Fase E)',
    homeroom_teacher: 'SARNAH, S.Pd.I',
    total_students: 32,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sma-2',
    code: 'XI',
    name: 'SMA - Kelas XI',
    jenjang: 'sma',
    level: 'Jenjang SMA (Kelas XI • Fase F)',
    homeroom_teacher: 'YAHYA HIDAYATULLOH, S.Pd.I',
    total_students: 30,
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sma-3',
    code: 'XII',
    name: 'SMA - Kelas XII',
    jenjang: 'sma',
    level: 'Jenjang SMA (Kelas XII • Fase F)',
    homeroom_teacher: 'TISKA PUSPITA DEWI, S.Pd.I',
    total_students: 28,
    curriculum: 'Kurikulum Merdeka',
  },
];

export const ClassesTab: React.FC<ClassesTabProps> = ({
  teachers,
  onSelectRombelForSchedule,
  readOnly = false,
}) => {
  const [classesList, setClassesList] = useState<ClassRombel[]>(initialClasses);
  const [editingClass, setEditingClass] = useState<ClassRombel | null>(null);
  const [selectedJenjang, setSelectedJenjang] = useState<'all' | ClassJenjang>('all');

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setClassesList(data);
        }
      }
    } catch {}
  };

  React.useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classesList.filter((c) => {
    if (selectedJenjang === 'all') return true;
    return c.jenjang === selectedJenjang;
  });

  const totalSantri = filteredClasses.reduce((acc, c) => acc + c.total_students, 0);

  const handleUpdateHomeroom = async (classId: string, newTeacher: string) => {
    if (readOnly) return;
    setClassesList((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, homeroom_teacher: newTeacher } : c))
    );
    setEditingClass(null);

    try {
      await fetch('/api/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: classId, homeroom_teacher: newTeacher }),
      });
      fetchClasses();
    } catch {}
  };

  const getJenjangBadge = (jenjang: ClassJenjang) => {
    switch (jenjang) {
      case 'sd':
        return { label: 'SD', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'smp':
        return { label: 'SMP', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'sma':
        return { label: 'SMA', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      default:
        return { label: 'Rombel', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kelas & Wali Kelas</h2>
          <p className="text-sm text-slate-600 mt-1">
            {readOnly
              ? 'Daftar rombongan belajar (rombel) terintegrasi jenjang SD, SMP, dan SMA beserta informasi wali kelas.'
              : 'Daftar rombongan belajar (rombel) terintegrasi jenjang SD, SMP, dan SMA dengan penetapan wali kelas resmi.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold">
            {filteredClasses.length} Rombel Terpilih • {totalSantri} Santri
          </div>
        </div>
      </div>

      {/* Segmented Jenjang Filter */}
      <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedJenjang('all')}
          className={`flex-1 min-w-[130px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            selectedJenjang === 'all'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span>Semua Jenjang ({classesList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedJenjang('sd')}
          className={`flex-1 min-w-[130px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            selectedJenjang === 'sd'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Jenjang SD (6 Kelas)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedJenjang('smp')}
          className={`flex-1 min-w-[130px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            selectedJenjang === 'smp'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>Jenjang SMP (3 Kelas)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedJenjang('sma')}
          className={`flex-1 min-w-[130px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            selectedJenjang === 'sma'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Jenjang SMA (3 Kelas)</span>
        </button>
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => {
          const badgeInfo = getJenjangBadge(cls.jenjang);
          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${badgeInfo.bg}`}>
                        {badgeInfo.label}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {cls.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{cls.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                    {cls.total_students} Santri
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Wali Kelas:</span>
                    <span className="font-medium truncate">{cls.homeroom_teacher}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500">
                    <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{cls.curriculum}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {editingClass?.id === cls.id ? (
                  <div className="w-full flex items-center gap-2">
                    <select
                      defaultValue={cls.homeroom_teacher}
                      onChange={(e) => handleUpdateHomeroom(cls.id, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-blue-400 focus:outline-none"
                    >
                      {teachers.map((t) => (
                        <option key={t.order_no} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setEditingClass(null)}
                      className="p-1.5 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => setEditingClass(cls)}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Ganti Wali</span>
                      </button>
                    )}

                    {onSelectRombelForSchedule && (
                      <button
                        type="button"
                        onClick={() => onSelectRombelForSchedule(cls.name)}
                        className={`text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors ${
                          readOnly ? 'w-full text-center py-1.5' : ''
                        }`}
                      >
                        Jadwal Pelajaran →
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
