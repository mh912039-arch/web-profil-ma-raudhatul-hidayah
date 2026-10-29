'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  X,
  Upload,
  School,
  GraduationCap,
  Building2,
  BookOpen,
} from 'lucide-react';
import { uploadImageWithAutoCompression } from '@/lib/imageCompression';

export interface TeacherRecord {
  id?: string;
  order_no: number;
  code: string;
  name: string;
  nip?: string;
  certification_year?: string;
  status?: string;
  education?: string;
  subject_name: string;
  class_level: string;
  gender?: string;
  religion?: string;
  rank_group?: string;
  birth_date?: string;
  position?: string;
  jenjang?: 'sd' | 'smp' | 'sma';
  category_label: string;
  image_url: string;
  is_active: boolean;
  role?: string;
}

export type JenjangFilter = 'all' | 'sd' | 'smp' | 'sma';

export function detectJenjang(classLevel: string = '', code: string = ''): 'sd' | 'smp' | 'sma' {
  const cl = classLevel.toLowerCase();
  const cd = code.toLowerCase();
  if (cd.startsWith('sd') || cl.includes('sd') || /kelas (i|ii|iii|iv|v|vi|[1-6])\b/i.test(cl)) return 'sd';
  if (cd.startsWith('smp') || cl.includes('smp') || cl.includes('vii') || cl.includes('viii') || cl.includes('ix') || /kelas [7-9]\b/.test(cl)) return 'smp';
  return 'sma';
}

interface TeachersTabProps {
  teachers: TeacherRecord[];
  onSaveTeacher: (teacher: TeacherRecord) => Promise<void>;
  onDeleteTeacher: (id: string | number) => Promise<void>;
  isSaving: boolean;
  mode?: 'teachers' | 'website-teachers';
}

export const TeachersTab: React.FC<TeachersTabProps> = ({
  teachers,
  onSaveTeacher,
  onDeleteTeacher,
  isSaving,
  mode = 'teachers',
}) => {
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [formData, setFormData] = useState<TeacherRecord>({
    order_no: teachers.length + 1,
    code: String(teachers.length + 1),
    name: '',
    nip: '-',
    certification_year: '0000',
    status: 'Guru',
    education: 'S1',
    subject_name: '',
    class_level: 'Semua Kelas',
    gender: 'L',
    religion: 'Islam',
    rank_group: '-',
    birth_date: '0000-00-00',
    position: 'Guru Mata Pelajaran',
    jenjang: 'sma',
    category_label: 'Umum',
    image_url: '/hero/slide-1.jpg',
    is_active: true,
  });

  const counts = {
    all: teachers.length,
    sd: teachers.filter((t) => (t.jenjang || detectJenjang(t.class_level, t.code)) === 'sd').length,
    smp: teachers.filter((t) => (t.jenjang || detectJenjang(t.class_level, t.code)) === 'smp').length,
    sma: teachers.filter((t) => (t.jenjang || detectJenjang(t.class_level, t.code)) === 'sma').length,
  };

  const filteredTeachers = teachers.filter((t) => {
    const tJenjang = t.jenjang || detectJenjang(t.class_level, t.code);
    const matchesJenjang = selectedJenjang === 'all' || tJenjang === selectedJenjang;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.nip || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.position || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.class_level.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJenjang && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setUploadMessage(null);
    const targetJenjang = selectedJenjang !== 'all' ? selectedJenjang : 'sma';
    const nextOrder = teachers.length + 1;
    const defaultClass = targetJenjang === 'sd'
      ? 'Kelas I'
      : targetJenjang === 'smp'
      ? 'Kelas VII'
      : 'Kelas X';

    setFormData({
      order_no: nextOrder,
      code: String(nextOrder),
      name: '',
      nip: '-',
      certification_year: '0000',
      status: 'Guru',
      education: 'S1',
      subject_name: '',
      class_level: defaultClass,
      gender: 'L',
      religion: 'Islam',
      rank_group: '-',
      birth_date: '0000-00-00',
      position: 'Guru Mata Pelajaran',
      jenjang: targetJenjang,
      category_label: 'Pendidikan Agama Islam',
      image_url: '/hero/slide-1.jpg',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TeacherRecord) => {
    setEditingTeacher(t);
    setUploadMessage(null);
    setFormData({
      ...t,
      nip: t.nip || '-',
      certification_year: t.certification_year || '0000',
      status: t.status || 'Guru',
      education: t.education || 'S1',
      gender: t.gender || 'L',
      religion: t.religion || 'Islam',
      rank_group: t.rank_group || '-',
      birth_date: t.birth_date || '0000-00-00',
      position: t.position || t.role || 'Guru Mata Pelajaran',
      jenjang: t.jenjang || detectJenjang(t.class_level, t.code),
    });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);
    try {
      const result = await uploadImageWithAutoCompression(file);
      setFormData((prev) => ({
        ...prev,
        image_url: result.url,
      }));
      setUploadMessage(`Foto berhasil dikompresi (${result.sizeKb} KB) & diunggah`);
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah foto pendidik');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalJenjang = formData.jenjang || detectJenjang(formData.class_level, formData.code);
    await onSaveTeacher({
      ...formData,
      jenjang: finalJenjang,
    });
    setIsModalOpen(false);
  };

  // Jenjang Class Presets
  const classPresets = {
    sd: [
      'Kelas I',
      'Kelas II',
      'Kelas III',
      'Kelas IV',
      'Kelas V',
      'Kelas VI',
      'Kelas I - VI SD',
      'Semua Kelas SD',
    ],
    smp: [
      'Kelas VII',
      'Kelas VIII',
      'Kelas IX',
      'Kelas VII - IX',
      'Semua Kelas SMP',
    ],
    sma: [
      'Kelas X',
      'Kelas XI',
      'Kelas XII',
      'Kelas X & XI',
      'Kelas XI & XII',
      'Kelas X & XII',
      'Peminatan MIPA',
      'Peminatan IPS',
      'Semua Kelas SMA',
    ],
  };

  const activeFormJenjang = formData.jenjang || detectJenjang(formData.class_level, formData.code);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-hidden animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-slate-900">
            {mode === 'website-teachers' ? 'Dewan Guru & Pendidik' : 'Guru Mata Pelajaran'}
          </h3>
          <p className="text-[12.5px] sm:text-[13px] text-slate-500">
            {mode === 'website-teachers'
              ? `Profil tenaga pendidik yang ditampilkan pada direktori website publik (${teachers.length} guru aktif)`
              : `Kelola daftar pendidik resmi, penugasan mata pelajaran, dan beban jam mengajar jenjang SD, SMP, & SMA (${teachers.length} guru terdaftar)`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs sm:text-[13px] font-bold transition-all shadow-xs active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{mode === 'website-teachers' ? 'Tambah Pendidik' : 'Tambah Guru'}</span>
        </button>
      </div>

      {/* Jenjang Filter Navbar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setSelectedJenjang('all')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
            selectedJenjang === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Semua Jenjang</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              selectedJenjang === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedJenjang('sd')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
            selectedJenjang === 'sd'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Jenjang SD</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              selectedJenjang === 'sd' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {counts.sd}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedJenjang('smp')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
            selectedJenjang === 'smp'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Jenjang SMP</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              selectedJenjang === 'smp' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {counts.smp}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedJenjang('sma')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] ${
            selectedJenjang === 'sma'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Jenjang SMA / MA</span>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              selectedJenjang === 'sma' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {counts.sma}
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari guru, nama mata pelajaran, atau tingkat kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Table Data (Desktop) & Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11.5px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Lengkap &amp; Gelar</th>
                <th className="py-3.5 px-4">Mata Pelajaran</th>
                <th className="py-3.5 px-4">Tingkat Kelas</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {filteredTeachers.map((t, idx) => {
                const rowJenjang = t.jenjang || detectJenjang(t.class_level, t.code);
                return (
                  <tr key={t.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                      {t.order_no || idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <Image
                            src={t.image_url || '/hero/slide-1.jpg'}
                            alt={t.name}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{t.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>NIP: <strong className="font-mono text-slate-700">{t.nip || '-'}</strong></span>
                            <span>•</span>
                            <span className="text-slate-600 truncate">{t.position || 'Guru'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.subject_name}</div>
                      <div className="text-[11px] text-blue-700 font-medium">
                        {t.status || 'Guru'} {t.education ? `(${t.education})` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            rowJenjang === 'sd'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : rowJenjang === 'smp'
                              ? 'bg-sky-50 text-sky-800 border border-sky-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {rowJenjang.toUpperCase()}
                        </span>
                        <span className="text-slate-700 font-medium">
                          {t.class_level}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          t.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t.is_active ? 'Aktif' : 'Nonaktif'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Data Pendidik & Mapel"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus guru ${t.name} (${t.subject_name})?`)) {
                              onDeleteTeacher(t.id || t.order_no);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Touch-Friendly Responsive Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredTeachers.map((t, idx) => (
            <div key={t.id || idx} className="p-4 space-y-3 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={t.image_url || '/hero/slide-1.jpg'}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{t.order_no || idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm truncate">{t.name}</h4>
                    </div>
                    <p className="text-xs font-bold text-blue-700 truncate">{t.subject_name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      NIP: {t.nip || '-'} • {t.position || 'Guru'}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    t.is_active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t.is_active ? 'Aktif' : 'Nonaktif'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                    {t.class_level}
                  </span>
                  <span className="text-slate-400 text-[11px] truncate">({t.category_label})</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(t)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors inline-flex items-center gap-1"
                    title="Edit Data Pendidik & Mapel"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus guru ${t.name} (${t.subject_name})?`)) {
                        onDeleteTeacher(t.id || t.order_no);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Guru"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12 px-4 text-slate-500 text-[13px]">
            Tidak ada data pendidik atau mata pelajaran yang cocok dengan filter yang dipilih.
          </div>
        )}
      </div>

      {/* Modal Add / Edit Teacher */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-serif text-[18px] font-bold text-slate-900">
                  {editingTeacher ? 'Sunting Data Guru & Tenaga Kependidikan' : 'Tambah Guru / Tendik Baru'}
                </h4>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Lengkapi 11 atribut profil resmi pendidik yang tampil pada detail website publik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Jenjang Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Pilih Jenjang Pendidikan</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        jenjang: 'sd',
                        class_level: formData.class_level.includes('SD') || /kelas (i|ii|iii|iv|v|vi|[1-6])\b/i.test(formData.class_level) ? formData.class_level : 'Kelas I',
                      });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeFormJenjang === 'sd'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>Jenjang SD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        jenjang: 'smp',
                        class_level: formData.class_level.includes('SMP') || /vii|viii|ix/i.test(formData.class_level) ? formData.class_level : 'Kelas VII',
                      });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeFormJenjang === 'smp'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Jenjang SMP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        jenjang: 'sma',
                        class_level: formData.class_level.includes('SMA') || /x|xi|xii/i.test(formData.class_level) ? formData.class_level : 'Kelas X',
                      });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeFormJenjang === 'sma'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Jenjang SMA</span>
                  </button>
                </div>
              </div>

              {/* Grid 2 Kolom untuk Profil Lengkap (Sesuai Screenshot 1 & 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* 1. Nama */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[12px] font-bold text-slate-700">Nama Lengkap &amp; Gelar</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: H. WAWAN HERMAWAN, S.Pd., M.Pd."
                    className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>

                {/* 2. Nip */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Nip</label>
                  <input
                    type="text"
                    value={formData.nip || ''}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Contoh: 19700331 200501 1 00 atau -"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* 3. Jabatan */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Contoh: Wakil Kepala Sekolah Bidang Kurikulum"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* 4. Mata Pelajaran */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={formData.subject_name}
                    onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                    placeholder="Contoh: Kimia, Matematika, Fiqih"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>

                {/* 5. Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Status</label>
                  <input
                    type="text"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    placeholder="Contoh: Guru, Guru Tetap, Staf TU"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* 6. Tahun Sertifikasi */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Tahun Sertifikasi</label>
                  <input
                    type="text"
                    value={formData.certification_year || ''}
                    onChange={(e) => setFormData({ ...formData, certification_year: e.target.value })}
                    placeholder="Contoh: 2020 atau 0000"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* 7. Pendidikan */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Pendidikan</label>
                  <input
                    type="text"
                    value={formData.education || ''}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Contoh: S1, S2, S1 Pend. Agama Islam"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* 8. Kelamin Jenis */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Kelamin Jenis</label>
                  <select
                    value={formData.gender || 'L'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="L">L (Laki-Laki)</option>
                    <option value="P">P (Perempuan)</option>
                  </select>
                </div>

                {/* 9. Agama */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Agama</label>
                  <input
                    type="text"
                    value={formData.religion || ''}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    placeholder="Contoh: Islam"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* 10. Pangkat Golongan */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Pangkat Golongan</label>
                  <input
                    type="text"
                    value={formData.rank_group || ''}
                    onChange={(e) => setFormData({ ...formData, rank_group: e.target.value })}
                    placeholder="Contoh: Pembina - IV/a atau -"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* 11. Tanggal Lahir */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={formData.birth_date || ''}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    placeholder="Contoh: 1970-03-31 atau 0000-00-00"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* Tingkat Kelas (Dropdown Quick Choice + Input) */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-slate-700">Alokasi Tingkat Kelas</label>
                  <span className="text-[11px] text-slate-500">Klik pilihan di bawah atau ketik manual</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap p-2 bg-slate-100/80 rounded-xl border border-slate-200/80">
                  {(classPresets[activeFormJenjang] || classPresets.sma).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, class_level: option })}
                      className={`text-[11.5px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        formData.class_level === option
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={formData.class_level}
                  onChange={(e) => setFormData({ ...formData, class_level: e.target.value })}
                  placeholder="Contoh: Kelas 1, Kelas VII, Kelas X"
                  className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>

              {/* Kategori Mapel & Nomor Urut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Kategori Mata Pelajaran</label>
                  <input
                    type="text"
                    value={formData.category_label || ''}
                    onChange={(e) => setFormData({ ...formData, category_label: e.target.value })}
                    placeholder="Contoh: MIPA, Pendidikan Agama Islam, IPS"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Nomor Urut Tampil</label>
                  <input
                    type="number"
                    value={formData.order_no}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({ ...formData, order_no: val, code: String(val) });
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    required
                  />
                </div>
              </div>

              {/* Foto Pendidik */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-[12px] font-bold text-slate-700">Foto Guru / Pendidik</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={formData.image_url || '/hero/slide-1.jpg'}
                      alt="Preview Foto"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[12px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Mengompresi...' : 'Unggah Foto Baru'}</span>
                      </button>
                    </div>
                    {uploadMessage && (
                      <span className="text-[11px] text-emerald-600 font-medium">
                        {uploadMessage}
                      </span>
                    )}
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="/hero/slide-1.jpg atau URL foto"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11.5px] font-mono text-slate-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status Aktif */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="teacher_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="teacher_active" className="text-[13px] font-semibold text-slate-700 cursor-pointer">
                  Status Aktif Mengajar &amp; Tampil di Direktori Website
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-[13px] hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] transition-all disabled:opacity-50 shadow-xs cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Data'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
