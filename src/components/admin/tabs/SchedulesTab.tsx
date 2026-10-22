'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
  Download,
  Users,
  GraduationCap,
  School,
} from 'lucide-react';
import { TeacherRecord } from './TeachersTab';

export interface ScheduleItem {
  id: string;
  class_rombel: string;
  day: string;
  session_no: number;
  time_start: string;
  time_end: string;
  subject_name: string;
  category?: string;
  teacher_name: string;
  room?: string;
}

interface SchedulesTabProps {
  teachers: TeacherRecord[];
  initialRombel?: string;
  readOnly?: boolean;
  userRole?: 'admin' | 'guru' | 'siswa';
}

export type JenjangLevel = 'all' | 'sd' | 'smp' | 'sma';

export interface RombelItem {
  id: string;
  name: string;
  level: 'sd' | 'smp' | 'sma';
  shortName: string;
  badge: string;
}

export const allRombels: RombelItem[] = [
  // 1. Jenjang SD (Kelas 1 - 6 Angka Romawi: I, II, III, IV, V, VI)
  { id: 'SD - Kelas I', name: 'SD - Kelas I', level: 'sd', shortName: 'Kelas I', badge: 'SD' },
  { id: 'SD - Kelas II', name: 'SD - Kelas II', level: 'sd', shortName: 'Kelas II', badge: 'SD' },
  { id: 'SD - Kelas III', name: 'SD - Kelas III', level: 'sd', shortName: 'Kelas III', badge: 'SD' },
  { id: 'SD - Kelas IV', name: 'SD - Kelas IV', level: 'sd', shortName: 'Kelas IV', badge: 'SD' },
  { id: 'SD - Kelas V', name: 'SD - Kelas V', level: 'sd', shortName: 'Kelas V', badge: 'SD' },
  { id: 'SD - Kelas VI', name: 'SD - Kelas VI', level: 'sd', shortName: 'Kelas VI', badge: 'SD' },

  // 2. Jenjang SMP (Kelas 7, 8, 9 Angka Romawi: VII, VIII, IX)
  { id: 'SMP - Kelas VII', name: 'SMP - Kelas VII', level: 'smp', shortName: 'Kelas VII', badge: 'SMP' },
  { id: 'SMP - Kelas VIII', name: 'SMP - Kelas VIII', level: 'smp', shortName: 'Kelas VIII', badge: 'SMP' },
  { id: 'SMP - Kelas IX', name: 'SMP - Kelas IX', level: 'smp', shortName: 'Kelas IX', badge: 'SMP' },

  // 3. Jenjang SMA / MA (Kelas 10, 11, 12 Angka Romawi: X, XI, XII)
  { id: 'SMA - Kelas X', name: 'SMA - Kelas X', level: 'sma', shortName: 'Kelas X', badge: 'SMA' },
  { id: 'SMA - Kelas XI', name: 'SMA - Kelas XI', level: 'sma', shortName: 'Kelas XI', badge: 'SMA' },
  { id: 'SMA - Kelas XII', name: 'SMA - Kelas XII', level: 'sma', shortName: 'Kelas XII', badge: 'SMA' },
];

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const SchedulesTab: React.FC<SchedulesTabProps> = ({
  teachers,
  initialRombel,
  readOnly = false,
  userRole = 'admin',
}) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<JenjangLevel>(() => {
    if (initialRombel?.startsWith('SD')) return 'sd';
    if (initialRombel?.startsWith('SMA')) return 'sma';
    return 'smp';
  });
  const [selectedRombel, setSelectedRombel] = useState<string>(initialRombel || 'SMP - Kelas VIII');
  const [selectedDay, setSelectedDay] = useState<string>('Rabu');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialRombel) {
      setSelectedRombel(initialRombel);
      if (initialRombel.startsWith('SD')) setSelectedLevel('sd');
      else if (initialRombel.startsWith('SMA')) setSelectedLevel('sma');
      else if (initialRombel.startsWith('SMP')) setSelectedLevel('smp');
    }
  }, [initialRombel]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    class_rombel: 'SMP - Kelas VIII',
    day: 'Rabu',
    session_no: 1,
    time_start: '07:30',
    time_end: '08:15',
    subject_name: '',
    teacher_name: teachers[0]?.name || 'Dewan Guru',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Schedules
  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/schedules', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Filter rombels by active jenjang level
  const displayedRombels =
    selectedLevel === 'all'
      ? allRombels
      : allRombels.filter((r) => r.level === selectedLevel);

  // Helper match for rombel (handles with or without level prefix & romawi variants)
  const isRombelMatch = (itemRombel: string, targetRombel: string) => {
    if (!itemRombel || !targetRombel) return false;
    if (itemRombel === targetRombel) return true;
    const cleanItem = itemRombel.replace(/^(SD|SMP|SMA)\s*-\s*/i, '').trim();
    const cleanTarget = targetRombel.replace(/^(SD|SMP|SMA)\s*-\s*/i, '').trim();
    if (cleanItem === cleanTarget) return true;
    if (cleanItem.replace(/-[A-Z0-9]+$/i, '').trim() === cleanTarget.replace(/-[A-Z0-9]+$/i, '').trim()) return true;
    return false;
  };

  // Filter schedules for active rombel and day
  const currentSchedules = schedules
    .filter((s) => isRombelMatch(s.class_rombel, selectedRombel) && s.day === selectedDay)
    .sort((a, b) => a.session_no - b.session_no);

  // Get session counts for each day in current rombel
  const getDayCount = (day: string) => {
    return schedules.filter(
      (s) => isRombelMatch(s.class_rombel, selectedRombel) && s.day === day
    ).length;
  };

  const handleOpenAdd = (presetSession?: number) => {
    setEditingItem(null);
    const nextSession = presetSession ?? (currentSchedules.length + 1);
    setFormData({
      class_rombel: selectedRombel,
      day: selectedDay,
      session_no: nextSession,
      time_start: '07:30',
      time_end: '08:15',
      subject_name: '',
      teacher_name: teachers[0]?.name || 'Dewan Guru',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal mata pelajaran ini?')) return;
    try {
      const res = await fetch(`/api/schedules?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Edit existing
        const res = await fetch('/api/schedules', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingItem.id }),
        });
        if (res.ok) {
          const result = await res.json();
          setSchedules((prev) => prev.map((s) => (s.id === editingItem.id ? result.item : s)));
          setIsModalOpen(false);
          fetchSchedules();
        }
      } else {
        // Create new
        const res = await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const result = await res.json();
          setSchedules((prev) => [...prev, result.item]);
          setIsModalOpen(false);
          fetchSchedules();
        }
      }
    } catch (err) {
      console.error('Failed to save schedule:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Jadwal Pelajaran</h2>
          <p className="text-sm text-slate-600 mt-1">
            {readOnly
              ? 'Informasi jadwal mata pelajaran resmi seluruh rombel kelas (hanya akun Admin yang dapat mengubah jadwal).'
              : 'Susun jadwal mata pelajaran harian untuk setiap rombel kelas jenjang SD, SMP, dan SMA / MA.'}
          </p>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sesi Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* Rombel Selector Pills with SD / SMP / SMA Level Switcher */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Level Switcher (SD, SMP, SMA) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            PILIH JENJANG PENDIDIKAN:
          </div>

          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({allRombels.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('sd');
                setSelectedRombel('SD - Kelas 1');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === 'sd'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenjang SD
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('smp');
                setSelectedRombel('SMP - Kelas VIII');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === 'smp'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenjang SMP
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('sma');
                setSelectedRombel('SMA - Kelas X');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLevel === 'sma'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenjang SMA / MA
            </button>
          </div>
        </div>

        {/* Rombel Pills */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            PILIH ROMBEL KELAS ({displayedRombels.length} Rombel Tersedia):
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {displayedRombels.map((rombel) => {
              const isSelected = isRombelMatch(rombel.name, selectedRombel);
              return (
                <button
                  key={rombel.id}
                  type="button"
                  onClick={() => setSelectedRombel(rombel.name)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span
                    className={`text-[9.5px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : rombel.level === 'sd'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rombel.level === 'smp'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {rombel.badge}
                  </span>
                  <span>{rombel.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="bg-slate-100/90 p-2 rounded-2xl border border-slate-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const count = getDayCount(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-bold'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                <span>{day}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Subheader */}
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Jadwal Pelajaran Hari {selectedDay} • {selectedRombel}
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {currentSchedules.length} Sesi
            </span>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Jam Pelajaran</span>
            </button>
          )}
        </div>

        {/* Schedule Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Deep Navy Table Header Matching Web Profil Topbar */}
            <thead className="bg-[#1e3a8a] text-white uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6 w-44">WAKTU & JAM</th>
                <th className="py-3.5 px-4">MATA PELAJARAN</th>
                <th className="py-3.5 px-4">GURU PENGAMPU</th>
                {!readOnly && <th className="py-3.5 px-4 text-right">AKSI</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={readOnly ? 3 : 4} className="py-12 text-center text-slate-400">
                    Memuat data jadwal pelajaran...
                  </td>
                </tr>
              ) : currentSchedules.length === 0 ? (
                <tr>
                  <td colSpan={readOnly ? 3 : 4} className="py-12 text-center">
                    <p className="text-slate-500 font-medium text-sm">
                      Belum ada sesi pelajaran untuk hari {selectedDay} ({selectedRombel}).
                    </p>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleOpenAdd(1)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Sesi Pertama</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                currentSchedules.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* WAKTU & JAM */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[12.5px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {item.time_start} – {item.time_end}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            SESI KE-{item.session_no}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* MATA PELAJARAN */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.subject_name}
                      </span>
                    </td>

                    {/* GURU PENGAMPU */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span className="font-medium text-slate-800 text-xs truncate max-w-xs">
                          {item.teacher_name}
                        </span>
                      </div>
                    </td>

                    {/* AKSI (Hanya untuk Admin / Guru) */}
                    {!readOnly && (
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Sunting Sesi"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Sesi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Full-Width Add Button (Hanya tampil untuk Admin) */}
        {!readOnly && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-600 hover:text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Sesi Jam Baru ({selectedDay})</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingItem ? 'Sunting Sesi Pelajaran' : 'Tambah Sesi Pelajaran Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formData.class_rombel} • Hari {formData.day}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rombel Kelas (SD, SMP, SMA)
                  </label>
                  <select
                    value={formData.class_rombel}
                    onChange={(e) => setFormData({ ...formData, class_rombel: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <optgroup label="Jenjang SD (Kelas 1 - 6)">
                      {allRombels
                        .filter((r) => r.level === 'sd')
                        .map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Jenjang SMP (Kelas VII - IX)">
                      {allRombels
                        .filter((r) => r.level === 'smp')
                        .map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Jenjang SMA / MA (Kelas X - XII)">
                      {allRombels
                        .filter((r) => r.level === 'sma')
                        .map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hari</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sesi Ke-
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.session_no}
                    onChange={(e) =>
                      setFormData({ ...formData, session_no: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mulai
                  </label>
                  <input
                    type="text"
                    value={formData.time_start}
                    onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                    placeholder="07:30"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selesai
                  </label>
                  <input
                    type="text"
                    value={formData.time_end}
                    onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                    placeholder="08:15"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={formData.subject_name}
                  onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                  placeholder="Contoh: Matematika, Tematik SD, Fiqih, Bahasa Inggris..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Guru Pengampu
                </label>
                <select
                  value={formData.teacher_name}
                  onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {teachers.map((t) => (
                    <option key={t.order_no} value={t.name}>
                      {t.name} ({t.subject_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : editingItem ? 'Perbarui Sesi' : 'Simpan Sesi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
