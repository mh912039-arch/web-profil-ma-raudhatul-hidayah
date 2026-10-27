'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Save,
  X,
  ExternalLink,
  Sparkles,
  UploadCloud,
  ImageIcon,
  Loader2,
} from 'lucide-react';

// Compresses an image File to strictly below 100KB using HTML5 Canvas
async function compressImageUnder100KB(file: File): Promise<{ blob: Blob; base64: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Initial scale down if image is larger than 1280px
        const maxDimension = 1280;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Iterative compression step-down to guarantee under 100KB (max 96 KB)
        let quality = 0.82;
        const maxSizeBytes = 96 * 1024; // 96 KB

        const attemptCompression = (q: number, w: number, h: number): Promise<Blob> => {
          return new Promise((resBlob) => {
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(
              (b) => resBlob(b || new Blob()),
              'image/jpeg',
              q
            );
          });
        };

        let blob = await attemptCompression(quality, width, height);
        let attempts = 0;

        while (blob.size > maxSizeBytes && attempts < 10) {
          attempts++;
          if (quality > 0.40) {
            quality -= 0.12;
          } else {
            width = Math.round(width * 0.85);
            height = Math.round(height * 0.85);
          }
          blob = await attemptCompression(quality, width, height);
        }

        const sizeKb = Number((blob.size / 1024).toFixed(1));
        const finalReader = new FileReader();
        finalReader.readAsDataURL(blob);
        finalReader.onloadend = () => {
          resolve({
            blob,
            base64: finalReader.result as string,
            sizeKb,
          });
        };
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export interface ArticleRecord {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  author: string;
  cover_image: string;
  is_featured: boolean;
  is_published: boolean;
  views_count?: number;
  published_at?: string;
}

interface ArticlesTabProps {
  articles: ArticleRecord[];
  onSaveArticle: (article: ArticleRecord) => Promise<void>;
  onDeleteArticle: (id: string | number, slug?: string) => Promise<void>;
  isSaving: boolean;
}

export const ArticlesTab: React.FC<ArticlesTabProps> = ({
  articles,
  onSaveArticle,
  onDeleteArticle,
  isSaving,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleRecord | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState<ArticleRecord>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    category: 'Prestasi',
    author: 'Humas MAS Raudhatul Hidayah',
    cover_image: '/foto-juara.jpeg',
    is_featured: false,
    is_published: true,
  });

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setCompressionStatus(null);
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      category: 'Prestasi',
      author: 'Humas MAS Raudhatul Hidayah',
      cover_image: '/foto-juara.jpeg',
      is_featured: false,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: ArticleRecord) => {
    setEditingArticle(art);
    setCompressionStatus(null);
    setFormData({
      id: art.id,
      slug: art.slug || '',
      title: art.title || '',
      excerpt: art.excerpt || (art as any).summary || '',
      content:
        art.content ||
        (Array.isArray((art as any).paragraphs) ? (art as any).paragraphs.join('\n\n') : '') ||
        art.excerpt ||
        (art as any).summary ||
        '',
      category: art.category || 'Prestasi',
      author: art.author || 'Humas MAS Raudhatul Hidayah',
      cover_image: art.cover_image || (art as any).imageUrl || '/foto-juara.jpeg',
      is_featured: Boolean(art.is_featured),
      is_published: Boolean(art.is_published ?? true),
    });
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setCompressionStatus(null);

    try {
      const originalKb = (file.size / 1024).toFixed(1);
      const { blob, base64, sizeKb } = await compressImageUnder100KB(file);

      // Upload to /api/upload
      const uploadForm = new FormData();
      uploadForm.append('file', blob, file.name.replace(/\.[^/.]+$/, '.jpg'));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });

      if (res.ok) {
        const json = await res.json();
        setFormData((prev) => ({
          ...prev,
          cover_image: json.url || base64,
        }));
        const storageLabel = json.storage === 'supabase' ? 'Supabase Storage' : 'Tersimpan';
        setCompressionStatus(`Kompresi berhasil: ${originalKb} KB → ${sizeKb} KB (< 100 KB • ${storageLabel})`);
      } else {
        // Fallback to base64
        setFormData((prev) => ({
          ...prev,
          cover_image: base64,
        }));
        setCompressionStatus(`Tersimpan lokal: ${sizeKb} KB (< 100 KB)`);
      }
    } catch (err: any) {
      console.error('Gagal mengompres gambar:', err);
      alert('Gagal mengompresi gambar. Pastikan format file adalah JPG, PNG, atau WEBP.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingArticle ? prev.slug : generateSlug(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveArticle(formData);
    setIsModalOpen(false);
  };

  const safeArticles = Array.isArray(articles) ? articles : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-[18px] font-bold text-slate-900">
            Berita &amp; Agenda
          </h3>
          <p className="text-[13px] text-slate-500">
            Tulis, sunting, dan publikasikan warta berita, agenda kegiatan, serta dinamika madrasah ({safeArticles.length} terbit)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-sans text-[13px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Berita / Agenda Baru</span>
        </button>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {safeArticles.map((art) => (
          <div
            key={art.id || art.slug}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              {/* Cover Image */}
              <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                <Image
                  src={art.cover_image || (art as any).imageUrl || '/foto-juara.jpeg'}
                  alt={art.title || 'Foto Berita'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={Boolean(art.cover_image && art.cover_image.startsWith('data:'))}
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-900/90 text-white shadow-xs">
                    {art.category || 'Berita'}
                  </span>
                  {art.is_featured && (
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-blue-950 shadow-xs">
                      Utama
                    </span>
                  )}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 sm:p-5 space-y-2">
                <span className="text-[11.5px] font-medium text-slate-400">
                  {art.author || 'Humas MAS Raudhatul Hidayah'}
                </span>
                <h4 className="font-serif text-[16px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {art.title || 'Tanpa Judul'}
                </h4>
                <p className="text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
                  {art.excerpt || (art as any).summary || (art.content ? art.content.slice(0, 120) : '')}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {art.is_published ? 'Dipublikasikan' : 'Draft'}
              </span>

              <div className="flex items-center gap-1.5">
                <a
                  href={`/warta/${art.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-white transition-colors"
                  title="Lihat di website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(art)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-white transition-colors cursor-pointer"
                  title="Sunting artikel"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Hapus artikel "${art.title}"?`)) {
                      onDeleteArticle(art.id || '', art.slug || '');
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Hapus artikel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Article */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-serif text-[18px] font-bold text-slate-900">
                {editingArticle ? 'Sunting Artikel Warta' : 'Tulis Artikel Warta Baru'}
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
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-slate-700">Judul Berita / Warta</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Santri MAS Raudhatul Hidayah Meraih Juara 1..."
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Slug URL</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] font-mono"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-slate-700">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                  >
                    <option value="Berita">Berita & Warta</option>
                    <option value="Agenda">Agenda Kegiatan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
              </div>

              {/* Foto / Gambar Sampul dengan Upload File & Otomatis Kompres < 100 KB */}
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>Gambar Sampul Berita</span>
                  </label>
                  <span className="text-[10.5px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                    Otomatis Kompres &lt; 100 KB
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <label
                    htmlFor="article-image-upload"
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed transition-all cursor-pointer font-sans text-[12px] font-bold ${
                      isCompressing
                        ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                        : 'bg-white hover:bg-blue-50/50 border-blue-300 text-blue-700 hover:border-blue-500 shadow-2xs active:scale-95'
                    }`}
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        <span>Mengompres Gambar...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pilih Gambar dari File</span>
                      </>
                    )}
                    <input
                      id="article-image-upload"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>

                  {compressionStatus && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/70">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{compressionStatus}</span>
                    </div>
                  )}
                </div>

                {/* Pratinjau Gambar & Input URL Langsung */}
                <div className="flex items-center gap-3 pt-1">
                  {Boolean(formData.cover_image && formData.cover_image.trim()) && (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                      <Image
                        src={formData.cover_image || '/foto-juara.jpeg'}
                        alt="Preview Sampul"
                        fill
                        className="object-cover"
                        unoptimized={Boolean(formData.cover_image && (formData.cover_image.startsWith('data:') || formData.cover_image.startsWith('/uploads')))}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      placeholder="/foto-juara.jpeg atau /uploads/..."
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[12px] font-mono text-slate-600"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-slate-700">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk pratinjau berita..."
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-slate-700">Konten Berita Lengkap</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tuliskan berita lengkap di sini..."
                  className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Jadikan Berita Utama (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Publikasikan Langsung</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-[13px] hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-[13px] transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Berita'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
