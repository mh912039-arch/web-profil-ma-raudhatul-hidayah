'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Compass,
  Calendar,
  User,
  Plus,
  Edit2,
  Trash2,
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import { TeacherRecord } from './TeachersTab';
import { ExtracurricularItem } from '@/app/api/extracurriculars/route';

interface ExtracurricularTabProps {
  teachers?: TeacherRecord[];
  readOnly?: boolean;
  showToast?: (type: 'success' | 'error', message: string) => void;
}

export const ExtracurricularTab: React.FC<ExtracurricularTabProps> = ({
  teachers = [],
  readOnly = false,
  showToast: parentShowToast,
}) => {
  const [items, setItems] = useState<ExtracurricularItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExtracurricularItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);

  // Local Toast Notification
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (type: 'success' | 'error', text: string) => {
    if (parentShowToast) {
      parentShowToast(type, text);
    }
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [formData, setFormData] = useState<Partial<ExtracurricularItem>>({
    name: '',
    category: 'belanegara',
    badge: 'Gugus Depan MA',
    level: 'Tingkat MA',
    schedule: 'Jumat 14.00 WIB',
    coach: teachers[0]?.name || 'A. Khutbi. AR, S.Pd',
    role: 'Kamabigus & Pembina',
    image: '/foto-juara-pramuka.jpeg',
    desc: '',
  });

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/extracurriculars', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
        }
      }
    } catch (err) {
      console.error('Failed to load extracurriculars:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setCompressionStatus(null);
    setFormData({
      name: '',
      category: 'belanegara',
      badge: 'Bela Negara & Kedisiplinan',
      level: 'Tingkat MA',
      schedule: 'Jumat 14.00 WIB',
      coach: teachers[0]?.name || 'Pembina Madrasah',
      role: 'Pembina Resmi',
      image: '/hero/slide-1.jpg',
      desc: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExtracurricularItem) => {
    setEditingItem(item);
    setCompressionStatus(null);
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      badge: item.badge,
      level: item.level,
      schedule: item.schedule,
      coach: item.coach,
      role: item.role,
      image: item.image,
      desc: item.desc,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string, name: string) => {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ekstrakurikuler "${name}"? Tindakan ini akan menghapus data secara permanen dari database.`
    );
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/extracurriculars?id=${encodeURIComponent(String(id))}`, {
        method: 'DELETE',
      });
      const resJson = await res.json().catch(() => null);

      if (res.ok && (resJson?.success ?? true)) {
        setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
        triggerToast('success', `Ekstrakurikuler "${name}" berhasil dihapus.`);
      } else {
        triggerToast('error', resJson?.message || 'Gagal menghapus ekstrakurikuler.');
      }
    } catch (err) {
      console.error('Failed to delete extracurricular:', err);
      triggerToast('error', 'Gagal menghubungi server untuk menghapus.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setCompressionStatus('Mengompres gambar agar efisien (< 100 KB)...');

      // Client-side canvas compression
      const img = document.createElement('img');
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target?.result as string;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            async (blob) => {
              if (!blob) return;
              const sizeKb = Math.round(blob.size / 1024);

              // Upload to /api/upload
              const uploadForm = new FormData();
              uploadForm.append('file', blob, file.name.replace(/\.[^/.]+$/, '.jpg'));

              try {
                const res = await fetch('/api/upload', {
                  method: 'POST',
                  body: uploadForm,
                });
                if (res.ok) {
                  const json = await res.json();
                  setFormData((prev) => ({ ...prev, image: json.url }));
                  setCompressionStatus(`Kompresi sukses: ${sizeKb} KB`);
                } else {
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
                  setFormData((prev) => ({ ...prev, image: dataUrl }));
                  setCompressionStatus(`Tersimpan lokal: ${sizeKb} KB`);
                }
              } catch {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
                setFormData((prev) => ({ ...prev, image: dataUrl }));
                setCompressionStatus(`Tersimpan lokal: ${sizeKb} KB`);
              } finally {
                setIsCompressing(false);
              }
            },
            'image/jpeg',
            0.82
          );
        };
      };

      reader.readAsDataURL(file);
    } catch {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      triggerToast('error', 'Nama ekstrakurikuler wajib diisi.');
      return;
    }
    if (!formData.coach?.trim()) {
      triggerToast('error', 'Nama pembina / pelatih wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/extracurriculars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resJson = await res.json().catch(() => null);

      if (res.ok && resJson?.success && resJson?.item) {
        const savedItem: ExtracurricularItem = resJson.item;
        if (editingItem) {
          setItems((prev) =>
            prev.map((i) =>
              String(i.id) === String(editingItem.id) || String(i.id) === String(savedItem.id)
                ? savedItem
                : i
            )
          );
          triggerToast('success', `Ekstrakurikuler "${savedItem.name}" berhasil diperbarui.`);
        } else {
          setItems((prev) => [...prev, savedItem]);
          triggerToast('success', `Ekstrakurikuler "${savedItem.name}" berhasil ditambahkan.`);
        }
        setIsModalOpen(false);
      } else {
        triggerToast('error', resJson?.message || 'Gagal menyimpan ekstrakurikuler.');
      }
    } catch (err) {
      console.error('Failed to save extracurricular:', err);
      triggerToast('error', 'Terjadi kesalahan saat menyimpan ekstrakurikuler.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems =
    activeFilter === 'all'
      ? items
      : items.filter((item) => item.category === activeFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
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

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a] animate-pulse" />
            <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-slate-900 tracking-tight">
              Ekstrakurikuler
            </h3>
          </div>
          <p className="text-[13px] text-slate-500 mt-1">
            Kelola cabang ekstrakurikuler santri, pembina resmi, jadwal latihan, dan foto kegiatan
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!readOnly && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Ekstrakurikuler Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: `Semua (${items.length})` },
          { id: 'belanegara', label: 'Wajib & Bela Negara' },
          { id: 'olahraga', label: 'Olahraga' },
          { id: 'seni', label: 'Kesenian & Budaya' },
          { id: 'literasi', label: 'Literasi & Jurnalistik' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-[12.5px] font-semibold transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-[#1e3a8a] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Extracurricular Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1e3a8a]" />
          <p className="text-xs">Memuat data ekstrakurikuler...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-base">Belum Ada Ekstrakurikuler</h4>
          <p className="text-xs text-slate-500 mt-1">
            Klik tombol Tambah Ekstrakurikuler Baru untuk menambahkan kegiatan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((ekskul) => (
            <div
              key={ekskul.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col border border-slate-200/90 hover:-translate-y-1"
            >
              {/* Image & Badge */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src={ekskul.image || '/hero/slide-1.jpg'}
                  alt={ekskul.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={Boolean(
                    ekskul.image &&
                      (ekskul.image.startsWith('data:') || ekskul.image.startsWith('/uploads'))
                  )}
                />
                <div className="absolute top-3 left-3 bg-[#1e3a8a]/90 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-semibold border border-white/20 shadow-xs">
                  {ekskul.badge}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11.5px] text-amber-700 font-bold uppercase tracking-wider">
                      {ekskul.level || 'Tingkat MA'}
                    </span>
                    <span className="flex items-center text-slate-500 text-[12px] gap-1.5 font-sans">
                      <Calendar className="w-3.5 h-3.5 text-[#1e3a8a] shrink-0" />
                      <span>{ekskul.schedule}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-slate-900 mb-2 group-hover:text-blue-800 transition-colors">
                    {ekskul.name}
                  </h3>

                  <p className="font-sans text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed line-clamp-3">
                    {ekskul.desc}
                  </p>
                </div>

                {/* Pembina Info Bar */}
                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-200/70">
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="w-4 h-4 text-[#1e3a8a] shrink-0" />
                    <span className="font-sans text-[12.5px] font-semibold text-slate-800 truncate">
                      {ekskul.coach}
                    </span>
                  </div>
                  <span className="font-sans text-[11px] font-medium text-slate-500 shrink-0 ml-2">
                    {ekskul.role}
                  </span>
                </div>

                {/* Admin Actions Bar */}
                {!readOnly && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ekskul)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sunting</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(ekskul.id, ekskul.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Extracurricular */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingItem ? 'Sunting Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi data cabang, pembina, jadwal, dan dokumentasi visual kegiatan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">
                  Nama Ekstrakurikuler
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Pramuka Penegak, PMR Wira, Paskibra..."
                  className="px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Kategori</label>
                  <select
                    value={formData.category || 'belanegara'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  >
                    <option value="belanegara">Wajib & Bela Negara</option>
                    <option value="olahraga">Olahraga & Kebugaran</option>
                    <option value="seni">Kesenian & Budaya</option>
                    <option value="literasi">Literasi & Bahasa</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Badge Label</label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Gugus Depan MA, Kemanusiaan..."
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Tingkat Jenjang</label>
                  <input
                    type="text"
                    value={formData.level || ''}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="Tingkat MA, Semua Tingkat..."
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Jadwal Latihan</label>
                  <input
                    type="text"
                    value={formData.schedule || ''}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="Contoh: Jumat 14.00 WIB"
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Nama Pembina / Pelatih
                  </label>
                  <input
                    type="text"
                    list="teachers-datalist"
                    value={formData.coach || ''}
                    onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                    placeholder="Pilih atau ketik nama pembina..."
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                  <datalist id="teachers-datalist">
                    {teachers.map((t) => (
                      <option key={t.order_no} value={t.name} />
                    ))}
                  </datalist>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Peran / Jabatan Pembina
                  </label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Kamabigus & Pembina, Instruktur..."
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Deskripsi Kegiatan</label>
                <textarea
                  rows={3}
                  value={formData.desc || ''}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Jelaskan fokus pembinaan, materi kegiatan, dan manfaat bagi santri..."
                  className="px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] leading-relaxed"
                  required
                />
              </div>

              {/* Upload Foto Kegiatan with Compression */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#1e3a8a]" />
                    <span>Foto Kegiatan Ekstrakurikuler</span>
                  </label>
                  <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    Otomatis Kompres &lt; 100 KB
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <label
                    htmlFor="ekskul-image-upload"
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed text-xs font-bold transition-all cursor-pointer ${
                      isCompressing
                        ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                        : 'bg-white hover:bg-blue-50/50 border-blue-300 text-[#1e3a8a] hover:border-blue-500'
                    }`}
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1e3a8a]" />
                        <span>Mengompres Foto...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5 text-[#1e3a8a]" />
                        <span>Pilih Foto dari Komputer</span>
                      </>
                    )}
                    <input
                      id="ekskul-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>

                  {compressionStatus && (
                    <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {compressionStatus}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  {Boolean(formData.image) && (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                      <Image
                        src={formData.image || '/hero/slide-1.jpg'}
                        alt="Preview Foto"
                        fill
                        className="object-cover"
                        unoptimized={Boolean(
                          formData.image &&
                            (formData.image.startsWith('data:') || formData.image.startsWith('/uploads'))
                        )}
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/foto-juara-pramuka.jpeg atau /uploads/..."
                    className="flex-1 px-3 py-1.5 text-[11px] font-mono rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1e3a8a] text-white hover:bg-[#172554] transition-all shadow-xs disabled:opacity-50 active:scale-95 cursor-pointer"
                >
                  {isSubmitting
                    ? 'Menyimpan...'
                    : editingItem
                    ? 'Simpan Perubahan'
                    : 'Simpan Ekstrakurikuler'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
