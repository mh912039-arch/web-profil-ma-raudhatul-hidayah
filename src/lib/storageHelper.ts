import { supabaseAdmin } from '@/lib/supabaseClient';
import path from 'path';
import fs from 'fs/promises';

/**
 * Utility helper to manage Supabase storage files and perform garbage collection.
 * Prevents orphan files from accumulating and consuming the 1 GB storage quota.
 */

export function extractStorageFilename(urlOrPath: string | null | undefined): string | null {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;

  // Hapus query parameters jika ada
  const cleanUrl = urlOrPath.split('?')[0].trim();
  if (!cleanUrl) return null;

  // Jangan sentuh aset statis bawaan sekolah
  if (
    cleanUrl.startsWith('/foto-') ||
    cleanUrl.startsWith('/kepala-') ||
    cleanUrl.startsWith('/school-') ||
    cleanUrl.startsWith('/logo') ||
    cleanUrl.endsWith('.svg')
  ) {
    return null;
  }

  // Jika URL Supabase Storage: .../storage/v1/object/public/articles/filename.jpg
  if (cleanUrl.includes('/articles/')) {
    const parts = cleanUrl.split('/articles/');
    return parts[parts.length - 1];
  }

  // Jika URL lokal: /uploads/filename.jpg
  if (cleanUrl.includes('/uploads/')) {
    const parts = cleanUrl.split('/uploads/');
    return parts[parts.length - 1];
  }

  // Fallback nama berkas biasa
  const segments = cleanUrl.split('/');
  const lastSegment = segments[segments.length - 1];
  return lastSegment && lastSegment.length > 3 ? lastSegment : null;
}

export async function deleteStorageFile(urlOrPath: string | null | undefined): Promise<boolean> {
  const rawFilename = extractStorageFilename(urlOrPath);
  if (!rawFilename) return false;

  // Sanitasi ketat: pastikan nama berkas hanya basename murni (mencegah Directory Traversal ../)
  const filename = path.basename(rawFilename);
  if (!filename || filename === '.' || filename === '..') return false;

  let supaDeleted = false;
  let localDeleted = false;

  // 1. Hapus dari Supabase Storage Bucket 'articles'
  try {
    const { error } = await supabaseAdmin.storage.from('articles').remove([filename]);
    if (!error) {
      supaDeleted = true;
    } else {
      console.warn(`Pemberitahuan: Berkas ${filename} tidak ditemukan di Supabase storage:`, error.message);
    }
  } catch (err: any) {
    console.warn(`Pengecualian saat menghapus dari Supabase storage (${filename}):`, err?.message);
  }

  // 2. Hapus salinan lokal di public/uploads/ (jika ada)
  try {
    const localFilePath = path.join(process.cwd(), 'public', 'uploads', filename);
    await fs.unlink(localFilePath);
    localDeleted = true;
  } catch {
    // Normal jika berkas tidak berada di disk lokal
  }

  return supaDeleted || localDeleted;
}

/**
 * Hapus beberapa berkas sekaligus dari Supabase Storage dan penyimpanan lokal.
 * Sangat efisien untuk operasi batch 'Hapus Semua' tanpa melakukan request satu per satu.
 */
export async function deleteMultipleStorageFiles(urls: (string | null | undefined)[]): Promise<number> {
  const fileSet = new Set<string>();
  for (const u of urls) {
    const raw = extractStorageFilename(u);
    if (raw) {
      const base = path.basename(raw);
      if (base && base !== '.' && base !== '..') {
        fileSet.add(base);
      }
    }
  }

  const filenames = Array.from(fileSet);
  if (filenames.length === 0) return 0;

  // 1. Hapus massal dari Supabase Storage Bucket 'articles'
  try {
    const { error } = await supabaseAdmin.storage.from('articles').remove(filenames);
    if (error) {
      console.warn('Pemberitahuan batch remove Supabase storage:', error.message);
    }
  } catch (err: any) {
    console.warn('Pengecualian batch delete Supabase storage:', err?.message);
  }

  // 2. Hapus salinan lokal di public/uploads/ (jika ada)
  for (const fn of filenames) {
    try {
      const localFilePath = path.join(process.cwd(), 'public', 'uploads', fn);
      await fs.unlink(localFilePath);
    } catch {
      // Normal jika berkas tidak berada di disk lokal
    }
  }

  return filenames.length;
}
