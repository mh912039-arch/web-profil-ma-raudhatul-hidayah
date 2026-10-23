'use client';

import React, { useState } from 'react';
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
          {/* Card 1: Informasi Utama */}
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
              <div className="relative w-full max-w-sm aspect-[765/1024] rounded-3xl overflow-hidden shadow-xl border-2 border-amber-500/80 bg-slate-50">
                <Image
                  src="/poster-ppdb.jpeg"
                  alt="Poster SPMB PPDB"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* Text Preview */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <span className="text-[12px] font-bold text-amber-600 uppercase tracking-widest">
                {formData.category}
              </span>
              <h3 className="font-serif text-[28px] sm:text-[34px] font-bold text-slate-900 leading-tight">
                {formData.title}
              </h3>
              <div className="w-12 h-1 bg-amber-500 rounded-full" />
              <p className="text-[14.5px] text-slate-600 leading-relaxed">
                {formData.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {formData.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[13px] font-semibold text-slate-800">
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
    </div>
  );
};
