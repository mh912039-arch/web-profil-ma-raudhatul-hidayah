'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Save,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  User,
  Megaphone,
  BarChart3,
  Link as LinkIcon,
  Layers,
  ArrowRight,
  AlertCircle,
  Trash2,
  Plus,
  Users,
} from 'lucide-react';
import { uploadImageWithAutoCompression } from '@/lib/imageCompression';

export interface HomepageConfig {
  heroTitle: string;
  heroTagline: string;
  heroBadge?: string;
  heroBackground: string;
  heroBackgrounds?: string[];
  schoolLogo: string;
  marqueeText1: string;
  marqueeCta1: string;
  marqueeLink1: string;
  marqueeText2: string;
  marqueeCta2: string;
  marqueeLink2: string;
  sambutanHeading: string;
  sambutanSubtitle: string;
  sambutanBadge?: string;
  headmasterName: string;
  headmasterRole: string;
  headmasterPhoto: string;
  sambutanText1: string;
  sambutanText2: string;
  ctaText: string;
  ctaLink: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  teachersSectionTitle?: string;
  teachersSectionSubtitle?: string;
}

interface HomepageTabProps {
  homepage: HomepageConfig;
  onSaveHomepage: (data: HomepageConfig) => Promise<void>;
  isSaving: boolean;
}

export const HomepageTab: React.FC<HomepageTabProps> = ({
  homepage,
  onSaveHomepage,
  isSaving,
}) => {
  const [formData, setFormData] = useState<HomepageConfig>(() => {
    const bgs = Array.isArray(homepage?.heroBackgrounds) && homepage.heroBackgrounds.length > 0
      ? homepage.heroBackgrounds
      : (homepage?.heroBackground ? [homepage.heroBackground] : ['/foto-semua.jpeg', '/halaman-sekolah.jpeg', '/paskibra.jpeg']);
    return {
      ...homepage,
      heroBackgrounds: bgs,
      heroBackground: bgs[0] || homepage?.heroBackground || '/foto-semua.jpeg',
    };
  });

  const [uploadStatus, setUploadStatus] = useState<{ field: string; status: 'idle' | 'uploading' | 'success' | 'error'; message?: string }>({
    field: '',
    status: 'idle',
  });

  // Keep form data synchronized when homepage loads from API
  useEffect(() => {
    if (homepage) {
      const bgs = Array.isArray(homepage.heroBackgrounds) && homepage.heroBackgrounds.length > 0
        ? homepage.heroBackgrounds
        : (homepage.heroBackground ? [homepage.heroBackground] : ['/foto-semua.jpeg', '/halaman-sekolah.jpeg', '/paskibra.jpeg']);
      setFormData({
        ...homepage,
        heroBackgrounds: bgs,
        heroBackground: bgs[0] || homepage.heroBackground || '/foto-semua.jpeg',
      });
    }
  }, [homepage]);

  const heroBgInputRef0 = useRef<HTMLInputElement>(null);
  const heroBgInputRef1 = useRef<HTMLInputElement>(null);
  const heroBgInputRef2 = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const headmasterPhotoInputRef = useRef<HTMLInputElement>(null);

  const heroInputRefs = [heroBgInputRef0, heroBgInputRef1, heroBgInputRef2];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fieldKey = `heroBackground_${slotIndex}`;
    setUploadStatus({ field: fieldKey, status: 'uploading' });

    try {
      const result = await uploadImageWithAutoCompression(file);
      setFormData((prev) => {
        const currentList = Array.isArray(prev.heroBackgrounds) ? [...prev.heroBackgrounds] : [prev.heroBackground || '/foto-semua.jpeg'];
        currentList[slotIndex] = result.url;
        const trimmed = currentList.slice(0, 3);
        return {
          ...prev,
          heroBackgrounds: trimmed,
          heroBackground: trimmed[0] || result.url,
        };
      });
      setUploadStatus({
        field: fieldKey,
        status: 'success',
        message: `Slide ${slotIndex + 1} berhasil diunggah (${result.sizeKb} KB)`,
      });
      setTimeout(() => {
        setUploadStatus({ field: '', status: 'idle' });
      }, 4000);
    } catch (err: any) {
      setUploadStatus({
        field: fieldKey,
        status: 'error',
        message: err.message || `Gagal mengunggah slide ${slotIndex + 1}`,
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleHeroBgUrlChange = (url: string, slotIndex: number) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.heroBackgrounds) ? [...prev.heroBackgrounds] : [prev.heroBackground || '/foto-semua.jpeg'];
      currentList[slotIndex] = url;
      const trimmed = currentList.slice(0, 3);
      return {
        ...prev,
        heroBackgrounds: trimmed,
        heroBackground: trimmed[0] || url,
      };
    });
  };

  const handleRemoveHeroBg = (slotIndex: number) => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.heroBackgrounds) ? [...prev.heroBackgrounds] : [prev.heroBackground || '/foto-semua.jpeg'];
      const updated = currentList.filter((_, idx) => idx !== slotIndex);
      const finalList = updated.length > 0 ? updated : ['/foto-semua.jpeg'];
      return {
        ...prev,
        heroBackgrounds: finalList,
        heroBackground: finalList[0],
      };
    });
  };

  const handleAddHeroBgSlot = () => {
    setFormData((prev) => {
      const currentList = Array.isArray(prev.heroBackgrounds) ? [...prev.heroBackgrounds] : [prev.heroBackground || '/foto-semua.jpeg'];
      if (currentList.length >= 3) return prev;
      const fallbackOptions = ['/foto-semua.jpeg', '/halaman-sekolah.jpeg', '/paskibra.jpeg'];
      const nextBg = fallbackOptions[currentList.length] || '/foto-semua.jpeg';
      const updated = [...currentList, nextBg];
      return {
        ...prev,
        heroBackgrounds: updated,
        heroBackground: updated[0],
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof HomepageConfig) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus({ field: String(fieldName), status: 'uploading' });

    try {
      const result = await uploadImageWithAutoCompression(file);
      setFormData((prev) => ({
        ...prev,
        [fieldName]: result.url,
      }));
      setUploadStatus({
        field: String(fieldName),
        status: 'success',
        message: `Foto terunggah & terkompresi (${result.sizeKb} KB)`,
      });
      setTimeout(() => {
        setUploadStatus({ field: '', status: 'idle' });
      }, 4000);
    } catch (err: any) {
      setUploadStatus({
        field: String(fieldName),
        status: 'error',
        message: err.message || 'Gagal mengunggah foto',
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBackgrounds = (formData.heroBackgrounds || [])
      .filter((s) => typeof s === 'string' && s.trim().length > 0)
      .slice(0, 3);
    const finalBackgrounds = cleanBackgrounds.length > 0 ? cleanBackgrounds : [formData.heroBackground || '/foto-semua.jpeg'];

    const payload: HomepageConfig = {
      ...formData,
      heroBackgrounds: finalBackgrounds,
      heroBackground: finalBackgrounds[0] || '/foto-semua.jpeg',
    };
    await onSaveHomepage(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-slate-900">
            Pengaturan &amp; Slider Hero
          </h3>
          <p className="text-[13px] text-slate-500">
            Kustomisasi judul hero, foto latar, running marquee PPDB, sambutan, dan metrik statistik
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Hero'}</span>
        </button>
      </div>

      {/* Quick Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-100/90 border border-slate-200 text-[12px] font-semibold text-slate-700">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
          Pintas Navigasi:
        </span>
        <a
          href="#hero-section"
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 transition-all text-slate-700 active:scale-95 shadow-2xs"
        >
          1. Hero Teratas
        </a>
        <a
          href="#marquee-section"
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 transition-all text-slate-700 active:scale-95 shadow-2xs"
        >
          2. Pita Berjalan (Marquee)
        </a>
        <a
          href="#sambutan-section"
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 transition-all text-slate-700 active:scale-95 shadow-2xs"
        >
          3. Sambutan Pimpinan
        </a>
        <a
          href="#statistik-kunci"
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all active:scale-95 shadow-2xs flex items-center gap-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>4. Tiga Angka Statistik (Siswa, Guru, Prestasi)</span>
        </a>
      </div>

      {/* 1. HERO SECTION SETTINGS */}
      <div id="hero-section" className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
        <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>1. Hero Section (Layar Utama Teratas)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-bold text-slate-700">Nama Utama Madrasah (Judul Besar)</label>
            <input
              type="text"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[14px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-bold text-slate-700">Tagline / Motto Madrasah</label>
            <input
              type="text"
              name="heroTagline"
              value={formData.heroTagline}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
        </div>

        {/* Hero Backgrounds Slideshow (Max 3 Photos) */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-bold text-slate-800">
                  Slider Foto Latar Hero (Maksimal 3 Foto)
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1e3a8a]">
                  {(formData.heroBackgrounds || []).length} / 3 Foto Aktif
                </span>
              </div>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Latar belakang layar depan akan berganti secara otomatis (crossfade halus setiap 6 detik). Foto pertama menjadi tampilan awal saat pertama kali dibuka.
              </p>
            </div>

            {(formData.heroBackgrounds || []).length < 3 && (
              <button
                type="button"
                onClick={handleAddHeroBgSlot}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-[12px] font-bold text-slate-700 transition-all active:scale-95 shadow-2xs self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span>Tambah Slot Foto</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((slotIndex) => {
              const bgList = formData.heroBackgrounds || [];
              const photoUrl = bgList[slotIndex];
              const isOccupied = typeof photoUrl === 'string' && photoUrl.trim().length > 0;
              const inputRef = heroInputRefs[slotIndex];
              const uploadKey = `heroBackground_${slotIndex}`;
              const isUploadingThis = uploadStatus.field === uploadKey && uploadStatus.status === 'uploading';
              const isSuccessThis = uploadStatus.field === uploadKey && uploadStatus.status === 'success';
              const isErrorThis = uploadStatus.field === uploadKey && uploadStatus.status === 'error';

              if (!isOccupied && slotIndex >= bgList.length) {
                return (
                  <div
                    key={slotIndex}
                    className="p-4 rounded-xl border-2 border-dashed border-slate-300/80 bg-white/60 flex flex-col items-center justify-center text-center gap-2 min-h-[220px] transition-all hover:border-blue-400 hover:bg-blue-50/20"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[12.5px] font-bold text-slate-700">
                        Slide {slotIndex + 1} (Kosong)
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Slot opsional untuk menambah variasi foto berganti otomatis
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddHeroBgSlot}
                      className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11.5px] font-bold text-slate-700 transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Aktifkan Slide {slotIndex + 1}</span>
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={slotIndex}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                          Slide {slotIndex + 1}
                        </span>
                        {slotIndex === 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                            Utama
                          </span>
                        )}
                      </div>
                      {bgList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHeroBg(slotIndex)}
                          title={`Hapus Slide ${slotIndex + 1}`}
                          className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-950 border border-slate-200">
                      <Image
                        src={photoUrl || '/foto-semua.jpeg'}
                        alt={`Slide ${slotIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10.5px] text-white/90 font-medium truncate max-w-full font-mono">
                          {photoUrl.startsWith('http')
                            ? photoUrl.split('/').pop()?.split('?')[0] || 'Foto Cloud'
                            : photoUrl}
                        </span>
                      </div>
                    </div>

                    {/* Upload button and hidden file input */}
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroBgUpload(e, slotIndex)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      disabled={isUploadingThis}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white text-[11.5px] font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {isUploadingThis
                          ? 'Mengompres & Mengunggah...'
                          : `Unggah Foto Slide ${slotIndex + 1}`}
                      </span>
                    </button>

                    {/* Status feedback */}
                    {isSuccessThis && (
                      <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>{uploadStatus.message}</span>
                      </p>
                    )}
                    {isErrorThis && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{uploadStatus.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Direct URL / Path field */}
                  <div className="flex flex-col gap-1 pt-1 border-t border-slate-100">
                    <span className="text-[10.5px] text-slate-500 font-medium">URL / Path Foto:</span>
                    <input
                      type="text"
                      value={photoUrl || ''}
                      onChange={(e) => handleHeroBgUrlChange(e.target.value, slotIndex)}
                      placeholder="/halaman-sekolah.jpeg atau https://..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* School Logo */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <label className="text-[12.5px] font-bold text-slate-800 flex items-center justify-between">
            <span>Logo / Emblem Madrasah</span>
            <span className="text-[11px] text-slate-500 font-normal">Format: PNG transparan</span>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-28 h-28 rounded-lg overflow-hidden bg-slate-900/90 border border-slate-300 flex items-center justify-center p-3 shrink-0">
              <div className="relative w-20 h-20">
                <Image
                  src={formData.schoolLogo || '/school-logo.png'}
                  alt="Preview Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center gap-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'schoolLogo')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadStatus.field === 'schoolLogo' && uploadStatus.status === 'uploading'}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white text-[12px] font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadStatus.field === 'schoolLogo' && uploadStatus.status === 'uploading'
                      ? 'Mengunggah...'
                      : 'Unggah Logo Baru'}
                  </span>
                </button>
              </div>

              {uploadStatus.field === 'schoolLogo' && uploadStatus.status === 'success' && (
                <p className="text-[11.5px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{uploadStatus.message}</span>
                </p>
              )}

              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-slate-500">Atau masukkan URL / path file logo:</span>
                <input
                  type="text"
                  name="schoolLogo"
                  value={formData.schoolLogo}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12px] font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RUNNING TICKER / MARQUEE SETTINGS */}
      <div id="marquee-section" className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
        <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-amber-600" />
          <span>2. Pita Teks Berjalan (Running Marquee PPDB)</span>
        </h4>

        {/* Marquee Item 1 */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
          <span className="text-[12px] font-bold text-amber-900 uppercase tracking-wider block">
            Pengumuman Bagian 1
          </span>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-slate-700">Teks Berjalan Utama</label>
            <input
              type="text"
              name="marqueeText1"
              value={formData.marqueeText1}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-[13px]"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-slate-700">Teks Tombol Aksi 1</label>
              <input
                type="text"
                name="marqueeCta1"
                value={formData.marqueeCta1}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px] font-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-slate-700">Tautan Tujuan 1</label>
              <input
                type="text"
                name="marqueeLink1"
                value={formData.marqueeLink1}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Marquee Item 2 */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
          <span className="text-[12px] font-bold text-amber-900 uppercase tracking-wider block">
            Pengumuman Bagian 2
          </span>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-slate-700">Teks Berjalan Kedua</label>
            <input
              type="text"
              name="marqueeText2"
              value={formData.marqueeText2}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-[13px]"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-slate-700">Teks Tombol Aksi 2</label>
              <input
                type="text"
                name="marqueeCta2"
                value={formData.marqueeCta2}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px] font-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-slate-700">Tautan Tujuan 2</label>
              <input
                type="text"
                name="marqueeLink2"
                value={formData.marqueeLink2}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12.5px] font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SAMBUTAN KEPALA MADRASAH */}
      <div id="sambutan-section" className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
        <h4 className="font-serif text-[16px] font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-amber-600" />
          <span>3. Sambutan &amp; Profil Kepala Madrasah</span>
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Photo & Upload (4 Cols) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-3">
            <span className="text-[12.5px] font-bold text-slate-800 self-start">Foto Resmi Kepala Madrasah</span>
            <div className="relative w-40 h-52 rounded-2xl overflow-hidden bg-slate-100 border-2 border-amber-500 shadow-md">
              <Image
                src={formData.headmasterPhoto || '/kepala-madrasah.jpg'}
                alt="Foto Kepala Madrasah"
                fill
                className="object-cover object-top"
              />
            </div>

            <input
              ref={headmasterPhotoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'headmasterPhoto')}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => headmasterPhotoInputRef.current?.click()}
              disabled={uploadStatus.field === 'headmasterPhoto' && uploadStatus.status === 'uploading'}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[12px] font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>
                {uploadStatus.field === 'headmasterPhoto' && uploadStatus.status === 'uploading'
                  ? 'Mengompres...'
                  : 'Ganti Foto Pimpinan (< 100 KB)'}
              </span>
            </button>

            {uploadStatus.field === 'headmasterPhoto' && uploadStatus.status === 'success' && (
              <p className="text-[11.5px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{uploadStatus.message}</span>
              </p>
            )}

            <div className="w-full flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">Atau URL Foto:</span>
              <input
                type="text"
                name="headmasterPhoto"
                value={formData.headmasterPhoto}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11.5px] font-mono"
              />
            </div>
          </div>

          {/* Form Fields (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Nama Kepala Madrasah &amp; Gelar</label>
                <input
                  type="text"
                  name="headmasterName"
                  value={formData.headmasterName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-bold text-slate-900"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Jabatan Satuan Pendidikan</label>
                <input
                  type="text"
                  name="headmasterRole"
                  value={formData.headmasterRole}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Judul Bagian Sambutan</label>
                <input
                  type="text"
                  name="sambutanHeading"
                  value={formData.sambutanHeading}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-bold text-slate-700">Keterangan Subtitle di Bawah Nama</label>
                <input
                  type="text"
                  name="sambutanSubtitle"
                  value={formData.sambutanSubtitle}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">Paragraf Sambutan 1</label>
              <textarea
                rows={3}
                name="sambutanText1"
                value={formData.sambutanText1}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-bold text-slate-700">Paragraf Sambutan 2</label>
              <textarea
                rows={3}
                name="sambutanText2"
                value={formData.sambutanText2}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-700">Teks Tombol Aksi Sambutan</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px] font-bold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-700">Tautan Tombol Aksi</label>
                <input
                  type="text"
                  name="ctaLink"
                  value={formData.ctaLink}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px] font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. KEY FACT METRIC COUNTERS */}
      <div id="statistik-kunci" className="bg-white p-6 rounded-2xl border-2 border-amber-400/80 shadow-sm space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-[17px] sm:text-[18px] font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                <span>4. Tiga Angka Statistik Kunci (Siswa, Guru &amp; Prestasi)</span>
              </h4>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                Live di Beranda
              </span>
            </div>
            <p className="text-[12.5px] text-slate-500 mt-1">
              Tiga data metrik ini tampil di bawah sambutan Kepala Madrasah pada halaman depan web profil. Anda dapat mengubah angka dan keterangannya secara bebas.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white text-[12.5px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 shrink-0 self-start sm:self-center cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Statistik'}</span>
          </button>
        </div>

        {/* Live Preview Bar matching the user's screenshot */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs max-w-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pratinjau Tampilan di Web Profil (Live Preview)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              / (Halaman Depan)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 divide-x divide-slate-200 pt-1">
            <div>
              <span className="font-serif text-[28px] sm:text-[34px] font-bold text-slate-900 block leading-tight">
                {formData.stat1Value || '152'}
              </span>
              <span className="font-sans text-[12px] sm:text-[13px] text-slate-500 font-medium block mt-1">
                {formData.stat1Label || 'Santri Aktif MA'}
              </span>
            </div>
            <div className="pl-4 sm:pl-6">
              <span className="font-serif text-[28px] sm:text-[34px] font-bold text-slate-900 block leading-tight">
                {formData.stat2Value || '22'}
              </span>
              <span className="font-sans text-[12px] sm:text-[13px] text-slate-500 font-medium block mt-1">
                {formData.stat2Label || 'Guru & Staf'}
              </span>
            </div>
            <div className="pl-4 sm:pl-6">
              <span className="font-serif text-[28px] sm:text-[34px] font-bold text-amber-600 block leading-tight">
                {formData.stat3Value || '35+'}
              </span>
              <span className="font-sans text-[12px] sm:text-[13px] text-slate-500 font-medium block mt-1">
                {formData.stat3Label || 'Prestasi'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Metric 1: Siswa */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Metrik 1: Siswa / Santri
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                Kesiswaan
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Jumlah Siswa / Nilai</label>
              <input
                type="text"
                name="stat1Value"
                value={formData.stat1Value}
                onChange={handleChange}
                placeholder="Contoh: 152"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[15px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Label Keterangan</label>
              <input
                type="text"
                name="stat1Label"
                value={formData.stat1Label}
                onChange={handleChange}
                placeholder="Contoh: Santri Aktif MA"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12.5px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Metric 2: Guru */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Metrik 2: Guru &amp; Staf
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                Pendidik
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Jumlah Guru / Nilai</label>
              <input
                type="text"
                name="stat2Value"
                value={formData.stat2Value}
                onChange={handleChange}
                placeholder="Contoh: 22"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[15px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Label Keterangan</label>
              <input
                type="text"
                name="stat2Label"
                value={formData.stat2Label}
                onChange={handleChange}
                placeholder="Contoh: Guru &amp; Staf"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12.5px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Metric 3: Prestasi */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Metrik 3: Prestasi
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                Prestasi
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Jumlah Prestasi / Nilai</label>
              <input
                type="text"
                name="stat3Value"
                value={formData.stat3Value}
                onChange={handleChange}
                placeholder="Contoh: 35+ atau 45+"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[15px] font-bold text-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-slate-700">Label Keterangan</label>
              <input
                type="text"
                name="stat3Label"
                value={formData.stat3Label}
                onChange={handleChange}
                placeholder="Contoh: Prestasi"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[12.5px] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action for Mobile & Desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Perubahan tampilan beranda akan langsung aktif di web dan tersimpan ke Supabase.
          </span>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-sans text-xs sm:text-[13px] font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 w-full sm:w-auto cursor-pointer"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Tampilan Depan'}</span>
          </button>
        </div>
      </div>

      {/* 5. SLIDER GURU & PENDIDIK DI BERANDA */}
      <div id="slider-guru" className="bg-white p-6 rounded-2xl border-2 border-blue-500/80 shadow-sm space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-[17px] sm:text-[18px] font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>5. Bagian Slider Guru &amp; Pendidik di Beranda</span>
              </h4>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                Live di Beranda
              </span>
            </div>
            <p className="text-[12.5px] text-slate-500 mt-1">
              Atur judul dan subjudul untuk slider guru yang bergeser otomatis 4 detik sekali di halaman depan. Untuk menambah guru baru, mengunggah foto, atau menyunting 11 atribut biodata lengkap, silakan buka tab <strong>Dewan Guru &amp; Pendidik</strong>.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white text-[12.5px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 shrink-0 self-start sm:self-center cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Slider Guru'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-bold text-slate-700">Judul Bagian Slider</label>
            <input
              type="text"
              name="teachersSectionTitle"
              value={formData.teachersSectionTitle || ''}
              onChange={handleChange}
              placeholder="Guru"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-bold text-slate-700">Subjudul Keterangan</label>
            <input
              type="text"
              name="teachersSectionSubtitle"
              value={formData.teachersSectionSubtitle || ''}
              onChange={handleChange}
              placeholder="Menyambut Anda ke Dunia Pembelajaran yang Dipandu Guru-guru Terbaik"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-[12.5px] text-blue-900 flex items-center gap-3">
          <Users className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Seluruh data nama, NIP, status, jabatan, mata pelajaran, serta foto profil guru dikelola langsung pada tab <strong>Dewan Guru &amp; Pendidik</strong>.
          </span>
        </div>
      </div>
    </form>
  );
};
