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
} from 'lucide-react';
import { uploadImageWithAutoCompression } from '@/lib/imageCompression';

export interface HomepageConfig {
  heroTitle: string;
  heroTagline: string;
  heroBadge?: string;
  heroBackground: string;
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
  const [formData, setFormData] = useState<HomepageConfig>({ ...homepage });
  const [uploadStatus, setUploadStatus] = useState<{ field: string; status: 'idle' | 'uploading' | 'success' | 'error'; message?: string }>({
    field: '',
    status: 'idle',
  });

  // Keep form data synchronized when homepage loads from API
  useEffect(() => {
    if (homepage) {
      setFormData({ ...homepage });
    }
  }, [homepage]);

  const heroBgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const headmasterPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveHomepage(formData);
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
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

        {/* Hero Background & Logo Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Hero Background Image */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <label className="text-[12.5px] font-bold text-slate-800 flex items-center justify-between">
              <span>Foto Latar Belakang Hero</span>
              <span className="text-[11px] text-slate-500 font-normal">Format: JPG/PNG/WebP</span>
            </label>

            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-300">
              <Image
                src={formData.heroBackground || '/foto-semua.jpeg'}
                alt="Preview Hero Background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <span className="text-[11px] text-white/90 bg-slate-900/80 px-2.5 py-1 rounded-md font-semibold">
                  Tinjauan Gambar Latar
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={heroBgInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'heroBackground')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => heroBgInputRef.current?.click()}
                disabled={uploadStatus.field === 'heroBackground' && uploadStatus.status === 'uploading'}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-all active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {uploadStatus.field === 'heroBackground' && uploadStatus.status === 'uploading'
                    ? 'Mengompres & Mengunggah...'
                    : 'Unggah Foto Baru (< 100 KB)'}
                </span>
              </button>
            </div>

            {uploadStatus.field === 'heroBackground' && uploadStatus.status === 'success' && (
              <p className="text-[11.5px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{uploadStatus.message}</span>
              </p>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">Atau masukkan URL / path lokal:</span>
              <input
                type="text"
                name="heroBackground"
                value={formData.heroBackground}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[12px] font-mono"
              />
            </div>
          </div>

          {/* School Logo */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <label className="text-[12.5px] font-bold text-slate-800 flex items-center justify-between">
              <span>Logo / Emblem Madrasah</span>
              <span className="text-[11px] text-slate-500 font-normal">Format: PNG transparan</span>
            </label>

            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-900/90 border border-slate-300 flex items-center justify-center p-3">
              <div className="relative w-20 h-20">
                <Image
                  src={formData.schoolLogo || '/school-logo.png'}
                  alt="Preview Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

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
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-all active:scale-95 disabled:opacity-50"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12.5px] font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 shrink-0 self-start sm:self-center"
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
      </div>
    </form>
  );
};
