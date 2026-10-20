'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';

export interface AcademicEvent {
  id: string;
  title: string;
  date_range: string;
  semester: string;
  category: 'ujian' | 'libur' | 'ppdb' | 'kegiatan';
  description: string;
}

const defaultEvents: AcademicEvent[] = [
  {
    id: 'ev-1',
    title: 'Awal Tahun Ajaran Baru 2026/2027 & MATSAMA',
    date_range: '14 – 16 Juli 2026',
    semester: 'Semester Ganjil',
    category: 'kegiatan',
    description: 'Masa Ta’aruf Santri Madrasah (MATSAMA) bagi peserta didik baru kelas VII & X.',
  },
  {
    id: 'ev-2',
    title: 'Penilaian Tengah Semester (PTS) Ganjil',
    date_range: '21 – 26 September 2026',
    semester: 'Semester Ganjil',
    category: 'ujian',
    description: 'Evaluasi capaian pembelajaran triwulan pertama berbasis komputer (CBT).',
  },
  {
    id: 'ev-3',
    title: 'Asesmen Akhir Semester (AAS) Ganjil',
    date_range: '30 November – 10 Desember 2026',
    semester: 'Semester Ganjil',
    category: 'ujian',
    description: 'Ujian komprehensif seluruh mata pelajaran semester ganjil.',
  },
  {
    id: 'ev-4',
    title: 'Pembagian Rapor & Libur Semester Ganjil',
    date_range: '19 Desember 2026 – 2 Januari 2027',
    semester: 'Semester Ganjil',
    category: 'libur',
    description: 'Penyerahan laporan hasil belajar santri kepada wali murid dilanjutkan libur semester.',
  },
  {
    id: 'ev-5',
    title: 'Awal Masuk Semester Genap 2026/2027',
    date_range: '4 Januari 2027',
    semester: 'Semester Genap',
    category: 'kegiatan',
    description: 'Hari pertama kegiatan belajar mengajar semester genap.',
  },
  {
    id: 'ev-6',
    title: 'Pembukaan PPDB Gelombang I TA 2027/2028',
    date_range: '15 Januari – 31 Maret 2027',
    semester: 'Semester Genap',
    category: 'ppdb',
    description: 'Pendaftaran peserta didik baru jalur prestasi dan afirmasi kuota khusus.',
  },
  {
    id: 'ev-7',
    title: 'Ujian Madrasah (UM) Kelas Akhir IX & XII',
    date_range: '12 – 19 April 2027',
    semester: 'Semester Genap',
    category: 'ujian',
    description: 'Penentu kelulusan santri jenjang madrasah aliyah dan sanawiyah.',
  },
  {
    id: 'ev-8',
    title: 'Sidang Pleno Kenaikan Kelas & Kelulusan',
    date_range: '18 Juni 2027',
    semester: 'Semester Genap',
    category: 'kegiatan',
    description: 'Rapat dewan guru penentuan kelulusan dan kenaikan kelas peserta didik.',
  },
];

interface CalendarTabProps {
  readOnly?: boolean;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ readOnly = false }) => {
  const [events, setEvents] = useState<AcademicEvent[]>(defaultEvents);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AcademicEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<AcademicEvent>>({
    title: '',
    date_range: '',
    semester: 'Semester Ganjil',
    category: 'kegiatan',
    description: '',
  });

  // Fetch from API
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date_range: '',
      semester: 'Semester Ganjil',
      category: 'kegiatan',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: AcademicEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date_range: event.date_range,
      semester: event.semester,
      category: event.category,
      description: event.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (readOnly) return;
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus agenda akademik ini?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/calendar?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;

    if (!formData.title?.trim()) {
      alert('Judul agenda wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingEvent) {
        // Update existing
        const res = await fetch('/api/calendar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingEvent.id }),
        });
        if (res.ok) {
          const result = await res.json();
          setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? result.item : e)));
          setIsModalOpen(false);
        }
      } else {
        // Create new
        const res = await fetch('/api/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const result = await res.json();
          setEvents((prev) => [result.item, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to save calendar event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents =
    filter === 'all' ? events : events.filter((e) => e.category === filter);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kalender Akademik</h2>
          <p className="text-sm text-slate-600 mt-1">
            {readOnly
              ? 'Agenda penting tahun ajaran aktif dan jadwal kegiatan akademik madrasah.'
              : 'Kelola agenda tahun ajaran aktif, jadwal ujian CBT/PAS, libur semester, dan agenda PPDB.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {!readOnly && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          FILTER KATEGORI AGENDA:
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'Semua Agenda' },
            { id: 'ujian', label: 'Ujian / Asesmen' },
            { id: 'kegiatan', label: 'Kegiatan Belajar' },
            { id: 'libur', label: 'Libur Semester' },
            { id: 'ppdb', label: 'Agenda PPDB' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm">
            Memuat kalender akademik...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <p className="text-slate-500 text-sm font-medium">
              Tidak ada agenda akademik dalam kategori ini.
            </p>
            {!readOnly && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Agenda Pertama</span>
              </button>
            )}
          </div>
        ) : (
          filteredEvents.map((event) => {
            const badgeColors = {
              ujian: 'bg-blue-50 text-blue-700 border-blue-200',
              kegiatan: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              libur: 'bg-rose-50 text-rose-700 border-rose-200',
              ppdb: 'bg-amber-50 text-amber-800 border-amber-200',
            }[event.category] || 'bg-slate-50 text-slate-700 border-slate-200';

            const categoryLabels = {
              ujian: 'Ujian / Asesmen',
              kegiatan: 'Kegiatan Belajar',
              libur: 'Libur Semester',
              ppdb: 'Agenda PPDB',
            }[event.category] || event.category;

            return (
              <div
                key={event.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-all group"
              >
                {/* Event Details */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${badgeColors}`}
                    >
                      {categoryLabels}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{event.semester}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-900 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                </div>

                {/* Right Side: Date Range & Action Buttons */}
                <div className="shrink-0 flex items-center gap-2.5 sm:self-center">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                    <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{event.date_range}</span>
                  </div>

                  {!readOnly && (
                    <div className="flex items-center gap-1 pl-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(event)}
                        className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Sunting Agenda"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add / Edit Agenda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {editingEvent ? 'Sunting Agenda Akademik' : 'Tambah Agenda Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingEvent
                    ? 'Perbarui rincian tanggal, kategori, dan deskripsi kegiatan.'
                    : 'Tambahkan agenda kegiatan ke dalam kalender akademik madrasah.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Field 1: Judul Agenda */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Judul Agenda Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Penilaian Tengah Semester (PTS) Ganjil"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              {/* Field 2: Rentang Tanggal / Waktu */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Rentang Tanggal Pelaksanaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.date_range || ''}
                  onChange={(e) => setFormData({ ...formData, date_range: e.target.value })}
                  placeholder="Contoh: 21 – 26 September 2026 atau 15 Januari 2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              {/* Field 3 & 4: Semester & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Semester</label>
                  <select
                    value={formData.semester || 'Semester Ganjil'}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-800 bg-white"
                  >
                    <option value="Semester Ganjil">Semester Ganjil</option>
                    <option value="Semester Genap">Semester Genap</option>
                    <option value="Tahunan / Sepanjang Tahun">Tahunan / Sepanjang Tahun</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Kategori Kegiatan</label>
                  <select
                    value={formData.category || 'kegiatan'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as AcademicEvent['category'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-slate-800 bg-white"
                  >
                    <option value="ujian">Ujian / Asesmen</option>
                    <option value="kegiatan">Kegiatan Belajar / Matsama</option>
                    <option value="libur">Libur Semester</option>
                    <option value="ppdb">Agenda PPDB</option>
                  </select>
                </div>
              </div>

              {/* Field 5: Deskripsi */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Deskripsi / Keterangan</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan singkat mengenai teknis atau sasaran kegiatan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : editingEvent ? 'Simpan Perubahan' : 'Tambahkan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
