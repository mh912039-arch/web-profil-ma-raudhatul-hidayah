'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  Edit2,
  CheckCircle2,
  Plus,
  BookOpen,
  School,
  Trash2,
  X,
  Save,
  AlertCircle,
  Building,
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
  // 1. Jenjang SD (Kelas 1 - 6)
  {
    id: 'cls-sd-1',
    code: 'I',
    name: 'SD - Kelas I',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas I · Fase A)',
    homeroom_teacher: 'KUSTYANINGSIH, S.Pd',
    total_students: 26,
    room_location: 'Gedung A - R.101',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-2',
    code: 'II',
    name: 'SD - Kelas II',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas II · Fase A)',
    homeroom_teacher: 'SARNAH, S.Pd.I',
    total_students: 25,
    room_location: 'Gedung A - R.102',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-3',
    code: 'III',
    name: 'SD - Kelas III',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas III · Fase B)',
    homeroom_teacher: 'TAJUDIN, S.Pd.I',
    total_students: 28,
    room_location: 'Gedung A - R.103',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-4',
    code: 'IV',
    name: 'SD - Kelas IV',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas IV · Fase B)',
    homeroom_teacher: 'MADROSYID, S.Pd',
    total_students: 27,
    room_location: 'Gedung A - R.104',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-5',
    code: 'V',
    name: 'SD - Kelas V',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas V · Fase C)',
    homeroom_teacher: 'Drs. MULYADI',
    total_students: 29,
    room_location: 'Gedung A - R.105',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sd-6',
    code: 'VI',
    name: 'SD - Kelas VI',
    jenjang: 'sd',
    level: 'Jenjang SD (Kelas VI · Fase C)',
    homeroom_teacher: 'JAKARIA, S.Pd.I',
    total_students: 30,
    room_location: 'Gedung A - R.106',
    curriculum: 'Kurikulum Merdeka',
  },

  // 2. Jenjang SMP (Kelas VII, VIII, IX)
  {
    id: 'cls-smp-1',
    code: 'VII',
    name: 'SMP - Kelas VII',
    jenjang: 'smp',
    level: 'Jenjang SMP (Kelas VII · Fase D)',
    homeroom_teacher: 'TAJUDIN, S.Pd.I',
    total_students: 32,
    room_location: 'Gedung B - R.201',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-smp-2',
    code: 'VIII',
    name: 'SMP - Kelas VIII',
    jenjang: 'smp',
    level: 'Jenjang SMP (Kelas VIII · Fase D)',
    homeroom_teacher: 'SITI KHAERUNNISA, S.Pd.I',
    total_students: 31,
    room_location: 'Gedung B - R.202',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-smp-3',
    code: 'IX',
    name: 'SMP - Kelas IX',
    jenjang: 'smp',
    level: 'Jenjang SMP (Kelas IX · Fase D)',
    homeroom_teacher: 'MADROSYID, S.Pd',
    total_students: 30,
    room_location: 'Gedung B - R.203',
    curriculum: 'Kurikulum Merdeka',
  },

  // 3. Jenjang SMA / MA (Kelas X, XI, XII)
  {
    id: 'cls-sma-1',
    code: 'X',
    name: 'SMA - Kelas X',
    jenjang: 'sma',
    level: 'Jenjang SMA (Kelas X · Fase E)',
    homeroom_teacher: 'SARNAH, S.Pd.I',
    total_students: 32,
    room_location: 'Gedung C - R.301',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sma-2',
    code: 'XI',
    name: 'SMA - Kelas XI',
    jenjang: 'sma',
    level: 'Jenjang SMA (Kelas XI · Fase F)',
    homeroom_teacher: 'YAHYA HIDAYATULLOH, S.Pd.I',
    total_students: 30,
    room_location: 'Gedung C - R.302',
    curriculum: 'Kurikulum Merdeka',
  },
  {
    id: 'cls-sma-3',
    code: 'XII',
    name: 'SMA - Kelas XII',
    jenjang: 'sma',
    level: 'Jenjang SMA (Kelas XII · Fase F)',
    homeroom_teacher: 'TISKA PUSPITA DEWI, S.Pd.I',
    total_students: 28,
    room_location: 'Gedung C - R.303',
    curriculum: 'Kurikulum Merdeka',
  },
];

export const ClassesTab: React.FC<ClassesTabProps> = ({
  teachers,
  onSelectRombelForSchedule,
  readOnly = false,
}) => {
  const [classesList, setClassesList] = useState<ClassRombel[]>(initialClasses);
  const [selectedJenjang, setSelectedJenjang] = useState<'all' | ClassJenjang>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<ClassRombel>({
    id: '',
    code: '',
    name: '',
    jenjang: 'sma',
    level: 'Jenjang SMA (Kelas X · Fase E)',
    homeroom_teacher: teachers[0]?.name || 'Belum Ditentukan',
    total_students: 30,
    room_location: '',
    curriculum: 'Kurikulum Merdeka',
  });

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classesList.filter((c) => {
    if (selectedJenjang === 'all') return true;
    return c.jenjang === selectedJenjang;
  });

  const totalSantri = filteredClasses.reduce((acc, c) => acc + (Number(c.total_students) || 0), 0);

  // Open modal for Create
  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({
      id: `cls-${selectedJenjang !== 'all' ? selectedJenjang : 'sma'}-${Date.now()}`,
      code: '',
      name: '',
      jenjang: selectedJenjang !== 'all' ? selectedJenjang : 'sma',
      level: 'Jenjang SMA (Fase E/F)',
      homeroom_teacher: teachers[0]?.name || 'Belum Ditentukan',
      total_students: 30,
      room_location: '',
      curriculum: 'Kurikulum Merdeka',
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (cls: ClassRombel) => {
    setModalMode('edit');
    setFormData({ ...cls });
    setIsModalOpen(true);
  };

  // Save (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('error', 'Nama rombel/kelas wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        const res = await fetch('/api/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const resJson = await res.json();
        if (res.ok && resJson.success) {
          setClassesList((prev) => [resJson.item, ...prev]);
          showToast('success', `Rombel "${formData.name}" berhasil ditambahkan.`);
          setIsModalOpen(false);
        } else {
          showToast('error', resJson.message || 'Gagal menambahkan rombel.');
        }
      } else {
        const res = await fetch('/api/classes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const resJson = await res.json();
        if (res.ok && resJson.success) {
          setClassesList((prev) =>
            prev.map((c) => (c.id === formData.id ? resJson.item : c))
          );
          showToast('success', `Rombel "${formData.name}" berhasil diperbarui.`);
          setIsModalOpen(false);
        } else {
          showToast('error', resJson.message || 'Gagal memperbarui rombel.');
        }
      }
    } catch {
      showToast('error', 'Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleDeleteClass = async (cls: ClassRombel) => {
    if (readOnly) return;
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus rombel "${cls.name}"? Data jadwal dan santri terkait mungkin perlu disesuaikan.`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/classes?id=${encodeURIComponent(cls.id)}`, {
        method: 'DELETE',
      });
      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setClassesList((prev) => prev.filter((c) => c.id !== cls.id));
        showToast('success', `Rombel "${cls.name}" berhasil dihapus.`);
      } else {
        showToast('error', resJson.message || 'Gagal menghapus rombel.');
      }
    } catch {
      showToast('error', 'Gagal menghubungi server untuk menghapus rombel.');
    }
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
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-[13px] font-semibold border ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-rose-900 text-white border-rose-800'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kelas &amp; Wali Kelas</h2>
          <p className="text-sm text-slate-600 mt-1">
            {readOnly
              ? 'Daftar rombongan belajar (rombel) terintegrasi jenjang SD, SMP, dan SMA beserta informasi wali kelas.'
              : 'Kelola rombongan belajar: tambah rombel baru, edit data & wali kelas, atau hapus kelas.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
            {filteredClasses.length} Rombel · {totalSantri} Santri
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rombel Baru</span>
            </button>
          )}
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
          <span>Jenjang SD ({classesList.filter((c) => c.jenjang === 'sd').length} Kelas)</span>
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
          <span>Jenjang SMP ({classesList.filter((c) => c.jenjang === 'smp').length} Kelas)</span>
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
          <span>Jenjang SMA ({classesList.filter((c) => c.jenjang === 'sma').length} Kelas)</span>
        </button>
      </div>

      {/* Grid of Class Cards */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3">
          <School className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-[16px]">Belum Ada Rombongan Belajar</h4>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Belum ada data rombel untuk kategori ini. Klik &quot;Tambah Rombel Baru&quot; untuk menambahkan kelas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => {
            const badgeInfo = getJenjangBadge(cls.jenjang);
            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${badgeInfo.bg}`}>
                          {badgeInfo.label}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {cls.level}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{cls.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0 border border-slate-200/60">
                      {cls.total_students} Santri
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Wali:</span>
                      <span className="font-medium truncate text-slate-700">{cls.homeroom_teacher}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{cls.curriculum}</span>
                    </div>

                    {cls.room_location && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Building className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{cls.room_location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {!readOnly && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cls)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 border border-blue-200 transition-colors active:scale-95"
                          title="Edit Lengkap Rombel & Wali Kelas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClass(cls)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Rombel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {onSelectRombelForSchedule && (
                    <button
                      type="button"
                      onClick={() => onSelectRombelForSchedule(cls.name)}
                      className={`text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors ${
                        readOnly ? 'w-full text-center' : ''
                      }`}
                    >
                      Jadwal Pelajaran &rarr;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[17px]">
                    {modalMode === 'add' ? 'Tambah Rombel / Kelas Baru' : 'Edit Rombel & Wali Kelas'}
                  </h3>
                  <p className="text-[12px] text-slate-500">
                    {modalMode === 'add'
                      ? 'Daftarkan rombongan belajar baru beserta wali kelas resminya'
                      : `Perbarui informasi kelas ${formData.name}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Jenjang Pendidikan</label>
                  <select
                    value={formData.jenjang}
                    onChange={(e) => {
                      const j = e.target.value as ClassJenjang;
                      setFormData({
                        ...formData,
                        jenjang: j,
                        level:
                          j === 'sd'
                            ? 'Jenjang SD (Fase A/B/C)'
                            : j === 'smp'
                            ? 'Jenjang SMP (Fase D)'
                            : 'Jenjang SMA (Fase E/F)',
                      });
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="sd">SD (Madrasah Ibtidaiyah)</option>
                    <option value="smp">SMP (Madrasah Tsanawiyah)</option>
                    <option value="sma">SMA (Madrasah Aliyah)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Kode / Tingkat</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Contoh: X, XI, VII, 1"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-slate-700">Nama Lengkap Rombel *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: SMA - Kelas X atau SMP - Kelas VII A"
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-slate-700">Keterangan Level / Fase</label>
                <input
                  type="text"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="Contoh: Jenjang SMA (Kelas X · Fase E)"
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-slate-700">Wali Kelas Resmi *</label>
                <select
                  value={formData.homeroom_teacher}
                  onChange={(e) => setFormData({ ...formData, homeroom_teacher: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="Belum Ditentukan">Belum Ditentukan</option>
                  {teachers.map((t) => (
                    <option key={t.order_no} value={t.name}>
                      {t.name} ({t.subject_name || 'Guru'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Jumlah Santri</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.total_students}
                    onChange={(e) => setFormData({ ...formData, total_students: Number(e.target.value) || 0 })}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Ruangan / Gedung</label>
                  <input
                    type="text"
                    value={formData.room_location || ''}
                    onChange={(e) => setFormData({ ...formData, room_location: e.target.value })}
                    placeholder="Contoh: Gedung C - R.301"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-slate-700">Kurikulum Pembelajaran</label>
                <input
                  type="text"
                  value={formData.curriculum}
                  onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                  placeholder="Contoh: Kurikulum Merdeka"
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Menyimpan...' : modalMode === 'add' ? 'Simpan Rombel' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
