'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Save,
  X,
  Upload,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { uploadImageWithAutoCompression } from '@/lib/imageCompression';

export interface ChampionshipPhoto {
  id?: string | number;
  title: string;
  event_name: string;
  sub?: string;
  badge?: string;
  date_label?: string;
  category?: string;
  image_url: string;
  slug?: string;
  caption?: string;
  order_index?: number;
}

interface AchievementsTabProps {
  photos: ChampionshipPhoto[];
  onSavePhoto: (photo: ChampionshipPhoto) => Promise<void>;
  onDeletePhoto: (id: string | number) => Promise<void>;
  isSaving: boolean;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  photos,
  onSavePhoto,
  onDeletePhoto,
  isSaving,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<ChampionshipPhoto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ChampionshipPhoto>({
    title: '',
    event_name: '',
    sub: '',
    badge: 'Piala Juara',
    date_label: '14 April 2026',
    category: 'Pramuka Penegak',
    image_url: '/foto-semua-juara.jpeg',
    slug: '',
    caption: '',
    order_index: photos.length + 1,
  });

  const handleOpenAdd = () => {
    setEditingPhoto(null);
    setUploadMessage(null);
    setFormData({
      title: '',
      event_name: '',
      sub: '',
      badge: 'Piala Juara',
      date_label: '14 April 2026',
      category: 'Pramuka Penegak',
      image_url: '/foto-semua-juara.jpeg',
      slug: '',
      caption: '',
      order_index: photos.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ChampionshipPhoto) => {
    setEditingPhoto(p);
    setUploadMessage(null);
    setFormData({
      id: p.id,
      title: p.title || '',
      event_name: p.event_name || '',
      sub: p.sub || '',
      badge: p.badge || p.category || 'Piala Juara',
      date_label: p.date_label || '14 April 2026',
      category: p.category || 'Pramuka Penegak',
      image_url: p.image_url || '/foto-juara.jpeg',
      slug: p.slug || '',
      caption: p.caption || '',
      order_index: p.order_index !== undefined ? p.order_index : 1,
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
      alert(err.message || 'Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSavePhoto(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-slate-900">
            Dokumentasi Juara
          </h3>
          <p className="text-[13px] text-slate-500">
            Galeri piala kejuaraan, piagam prestasi, dan foto dokumentasi kemenangan santri madrasah
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto Juara Baru</span>
        </button>
      </div>

      {/* Grid Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image
                  src={photo.image_url || '/foto-juara.jpeg'}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-blue-950 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-blue-950" />
                  <span>{photo.badge || photo.category || 'Piala Juara'}</span>
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <span className="text-[11.5px] font-bold text-blue-700 block line-clamp-1 uppercase tracking-wide">
                  {photo.event_name}
                </span>
                <h4 className="font-serif text-[15.5px] font-bold text-slate-900 line-clamp-2 leading-snug">
                  {photo.title}
                </h4>
                {photo.sub && (
                  <p className="text-[12px] text-slate-600 font-medium">
                    {photo.sub}
                  </p>
                )}
                {photo.caption && (
                  <p className="text-[12px] text-slate-500 line-clamp-2 pt-1 leading-relaxed">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {photo.date_label || 'Aktif'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(photo)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Sunting foto juara"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus dokumentasi juara "${photo.title}"?`)) {
                      onDeletePhoto(photo.id || idx);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Hapus foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Photo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-serif text-[18px] font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>{editingPhoto ? 'Sunting Foto Juara & Ekstrakurikuler' : 'Tambah Foto Juara Baru'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Preview & Upload with Auto-compress */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-[12.5px] font-bold text-slate-800 block">
                  Foto Dokumentasi Kejuaraan
                </label>

                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                  <Image
                    src={formData.image_url || '/foto-juara.jpeg'}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-bold transition-all disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Mengompres & Mengunggah...' : 'Pilih Foto dari File (< 100 KB)'}</span>
                  </button>

                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="/foto-juara.jpeg atau URL"
                    className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-[12px] font-mono text-slate-600"
                    required
                  />
                </div>

                {uploadMessage && (
                  <p className="text-[12px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{uploadMessage}</span>
                  </p>
                )}
              </div>

              {/* Title & Sub */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Judul Dokumentasi Kejuaraan</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Juara Umum & Sapu Bersih Trofi Gebyar Ramadhan..."
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-700">Penerima / Kontingen Santri</label>
                  <input
                    type="text"
                    value={formData.sub}
                    onChange={(e) => setFormData({ ...formData, sub: e.target.value })}
                    placeholder="Contoh: Santri Putra & Putri MAS Raudhatul Hidayah"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-700">Badge Piala / Predikat Juara</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Sapu Bersih Trofi / Medali Emas"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Nama Ajang / Event Penyelenggara</label>
                <input
                  type="text"
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  placeholder="Contoh: Gebyar Ramadhan 1447 H Kwarran Mauk 2026"
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-700">Kategori Ekstrakurikuler / Lomba</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Pramuka Penegak / Olahraga / Seni"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-slate-700">Label Tanggal / Tahun</label>
                  <input
                    type="text"
                    value={formData.date_label}
                    onChange={(e) => setFormData({ ...formData, date_label: e.target.value })}
                    placeholder="14 April 2026 atau 2024"
                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Slug Tautan Warta Berita (Opsional)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="kontingen-pramuka-ma-raudhatul-hidayah-sapu-bersih-juara..."
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-mono"
                />
                <span className="text-[11px] text-slate-500">
                  Jika diisi, pengunjung dapat mengklik tombol "Warta" untuk membaca artikel liputan lengkapnya.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-slate-700">Deskripsi Lengkap Kejuaraan</label>
                <textarea
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Uraian prestasi yang berhasil diraih santri..."
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-[13px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-[13px] disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Foto Juara'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
