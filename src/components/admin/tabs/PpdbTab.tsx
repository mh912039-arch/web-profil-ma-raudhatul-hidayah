'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  PhoneCall,
  Check,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  UploadCloud,
  RefreshCw,
  Eye,
  ZoomIn,
  X,
} from 'lucide-react';
import { PpdbData } from '@/components/sections/PpdbSection';

interface PpdbTabProps {
  formData: PpdbData;
  setFormData: React.Dispatch<React.SetStateAction<PpdbData>>;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export const PpdbTab: React.FC<PpdbTabProps> = ({
  formData,
  setFormData,
  onSave,
  isSaving,
}) => {
  const [newFeature, setNewFeature] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'preview'>('form');
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [posterUploadStatus, setPosterUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showPosterZoom, setShowPosterZoom] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPosterUploadStatus({
        type: 'error',
        message: 'Format berkas tidak didukung. Harap pilih gambar JPG, PNG, atau WEBP.',
      });
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setPosterUploadStatus({
        type: 'error',
        message: 'Ukuran berkas melebihi 4 MB. Silakan pilih poster dengan ukuran lebih kecil.',
      });
      return;
    }

    setIsUploadingPoster(true);
    setPosterUploadStatus(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file, file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.url) {
        const newPosterUrl = json.url;
        setFormData((prev) => {
          const updated = {
            ...prev,
            posterUrl: newPosterUrl,
          };

          // Auto-save immediately to Supabase database so the new poster is locked in without delay
          fetch('/api/ppdb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          })
            .then((saveRes) => {
              if (saveRes.ok) {
                try {
                  localStorage.setItem('cached_ppdb_data', JSON.stringify(updated));
                  localStorage.setItem('ppdb_updated', Date.now().toString());
                } catch (_) {}
              }
            })
            .catch((err) => console.warn('Auto-save PPDB poster failed:', err));

          return updated;
        });

        setPosterUploadStatus({
          type: 'success',
          message: `Poster terbaru berhasil diunggah dan otomatis tersimpan ke sistem (${json.sizeKb ? `${json.sizeKb} KB` : 'Tersimpan'}).`,
        });
      } else {
        setPosterUploadStatus({
          type: 'error',
          message: json.message || 'Gagal mengunggah poster.',
        });
      }
    } catch (err: any) {
      setPosterUploadStatus({
        type: 'error',
        message: err.message || 'Terjadi kesalahan jaringan saat mengunggah poster.',
      });
    } finally {
      setIsUploadingPoster(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetDefaultPoster = () => {
    const defaultUrl = 'https://zzgobrlhnnqvspuwugkz.supabase.co/storage/v1/object/public/articles/img-1793069689752-1bguos.jpeg';
    setFormData((prev) => ({
      ...prev,
      posterUrl: defaultUrl,
    }));
    setPosterUploadStatus({
      type: 'success',
      message: 'Poster dikembalikan ke poster resmi. Klik "Simpan Pembaruan PPDB" untuk menyimpan.',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[index] = val;
      return { ...prev, features: updated };
    });
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-slate-900">
            Alur Pendaftaran PPDB
          </h3>
          <p className="text-[13px] text-slate-500">
            Kelola informasi pendaftaran santri baru, brosur resmi, dan kontak WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-[13px] font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pembaruan PPDB'}</span>
          </button>
        </div>
      </div>

      {/* Sub-header Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab('form')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeSubTab === 'form'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Formulir Pengaturan
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('preview')}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
            activeSubTab === 'preview'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pratinjau Live Website
        </button>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'form' ? (
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-6">
          {/* Card 1: Poster & Brosur Resmi PPDB */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-serif text-[17px] font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <span>Poster &amp; Brosur Resmi PPDB</span>
              </h3>
              <span className="text-[11.5px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit">
                Rasio Poster 765 : 1024 (Vertikal)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Visual Thumbnail Card */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative w-full max-w-[220px] aspect-[765/1024] rounded-2xl overflow-hidden border-2 border-amber-500/80 shadow-md bg-slate-100 group">
                  <Image
                    src={formData.posterUrl || '/poster-ppdb.png'}
                    alt="Pratinjau Poster PPDB"
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                    <button
                      type="button"
                      onClick={() => setShowPosterZoom(true)}
                      className="px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-blue-700" />
                      <span>Perbesar</span>
                    </button>
                  </div>
                </div>
                <span className="text-[11.5px] text-slate-500 mt-2 text-center">
                  Pratinjau poster aktif di landing page
                </span>
              </div>

              {/* Upload & Controls */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div>
                    <label className="text-[12.5px] font-bold text-slate-800 block">
                      Unggah File Poster Baru
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Pilih berkas poster resolusi tinggi (format PNG, JPG, atau WEBP). Berkas akan otomatis diunggah ke storage cloud dan langsung terhubung ke tampilan web.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePosterUpload}
                      className="hidden"
                      id="ppdb-poster-file-input"
                    />
                    <label
                      htmlFor="ppdb-poster-file-input"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 ${
                        isUploadingPoster ? 'opacity-60 pointer-events-none' : ''
                      }`}
                    >
                      <UploadCloud className={`w-4 h-4 ${isUploadingPoster ? 'animate-bounce' : ''}`} />
                      <span>{isUploadingPoster ? 'Mengunggah Poster...' : 'Pilih & Unggah File Poster'}</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleResetDefaultPoster}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors active:scale-95 cursor-pointer"
                      title="Kembalikan ke poster bawaan"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset Bawaan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPosterZoom(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors active:scale-95 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Resolusi Penuh</span>
                    </button>
                  </div>

                  {posterUploadStatus && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
                        posterUploadStatus.type === 'success'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border border-rose-200 text-rose-800'
                      }`}
                    >
                      {posterUploadStatus.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <span className="leading-relaxed">{posterUploadStatus.message}</span>
                    </div>
                  )}
                </div>

                {/* Direct URL Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12.5px] font-bold text-slate-700">
                      Tautan / URL Berkas Poster
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Bisa path lokal atau URL eksternal
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="posterUrl"
                      value={formData.posterUrl || ''}
                      onChange={handleChange}
                      placeholder="/poster-ppdb.png atau https://..."
                      className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    {formData.posterUrl && formData.posterUrl.startsWith('http') && (
                      <a
                        href={formData.posterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 top-2 p-1 text-slate-400 hover:text-blue-600"
                        title="Buka tautan poster di tab baru"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Poster aktif saat ini: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-blue-900">{formData.posterUrl || '/poster-ppdb.png'}</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Informasi Utama */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <h3 className="font-serif text-[17px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-500" />
              <span>Identitas &amp; Headline PPDB</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">
                  Kategori Subtitle
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">
                  Tahun Ajaran Aktif
                </label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
                  placeholder="Contoh: 2027/2028"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">
                  Judul Utama (Headline Besar)
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">
                  Badge Status PPDB
                </label>
                <input
                  type="text"
                  name="badgeText"
                  value={formData.badgeText}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
                  placeholder="TELAH DIBUKA!"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">
                Deskripsi Narasi PPDB
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Card 2: Keunggulan & Poin Fitur */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-serif text-[17px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Fitur &amp; Keunggulan PPDB ({formData.features.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 bg-transparent text-[13px] font-medium text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus poin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Tambah fitur baru */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Tambah poin keunggulan baru..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature(e);
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[13px] flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Card 3: Saluran Kontak & Pendaftaran */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
            <h3 className="font-serif text-[17px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-600" />
              <span>Saluran Kontak &amp; Tautan Registrasi</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">
                  Nomor WhatsApp Panitia (Format Angka Internasional)
                </label>
                <input
                  type="text"
                  name="contactWa"
                  value={formData.contactWa}
                  onChange={handleChange}
                  placeholder="Contoh: 628176614723"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">
                  Nomor Telepon Tampilan
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Contoh: 0817-6614-723"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">
                Tautan Pendaftaran Online WhatsApp
              </label>
              <input
                type="text"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>

            {/* Bottom Actions for Mobile & Desktop */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Pembaruan akan langsung tersimpan ke Supabase & aktif di website.
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-[13px] font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 w-full sm:w-auto"
              >
                <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Pembaruan PPDB'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Preview Render */
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
              Pratinjau Live Bagian PPDB Pada Tampilan Website
            </span>
            <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Rasio Poster 765:1024
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Poster Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => setShowPosterZoom(true)}
                className="relative w-full max-w-sm aspect-[765/1024] rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-50 cursor-pointer group"
                title="Klik untuk melihat poster penuh"
              >
                <Image
                  src={formData.posterUrl || '/poster-ppdb.png'}
                  alt="Poster SPMB PPDB"
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-blue-700" />
                    <span>Perbesar</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Text Preview */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="font-sans text-[17px] sm:text-[20px] font-bold text-amber-500 uppercase tracking-wide">
                {formData.category}
              </span>
              <h3 className="font-sans text-[26px] sm:text-[34px] font-extrabold text-slate-900 leading-tight">
                {formData.title}
              </h3>
              <p className="text-[14.5px] text-slate-600 leading-relaxed">
                {formData.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
                {formData.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 py-0.5"
                  >
                    <div className="w-4.5 h-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.8]" />
                    </div>
                    <span className="text-[13.5px] font-semibold text-slate-800 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={formData.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-sans text-[13px] font-bold uppercase tracking-wider"
                >
                  <span>Daftar PPDB Online Sekarang</span>
                </a>
                <span className="text-[13px] text-slate-500 font-medium">
                  Hotline: {formData.contactPhone}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          POSTER RESOLUTION ZOOM MODAL (ADMIN)
      ========================================================= */}
      {showPosterZoom && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setShowPosterZoom(false)}
        >
          <div
            className="relative max-w-xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Pratinjau Poster Resolusi Penuh
              </span>
              <button
                type="button"
                onClick={() => setShowPosterZoom(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full aspect-[765/1024] max-h-[80vh] rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-slate-900">
              <Image
                src={formData.posterUrl || '/poster-ppdb.png'}
                alt="Poster PPDB Full"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
