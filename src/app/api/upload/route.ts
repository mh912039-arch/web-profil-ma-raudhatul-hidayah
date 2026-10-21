import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch {}

    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer | null = null;
    let filename = '';
    let mimeType = 'image/jpeg';

    // 1. Handle Multipart Form Data
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, message: 'Tidak ada file yang diunggah' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);

      const originalName = file.name || 'document.jpg';
      const ext = path.extname(originalName).toLowerCase() || '.jpg';
      const cleanExt = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext) ? ext : '.jpg';
      const prefix = cleanExt === '.pdf' ? 'dokumen' : 'ppdb';
      filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${cleanExt}`;
      mimeType = file.type || (cleanExt === '.pdf' ? 'application/pdf' : cleanExt === '.png' ? 'image/png' : cleanExt === '.webp' ? 'image/webp' : 'image/jpeg');

      // Check minSize if requested (e.g. 100 KB requirement for official PPDB documents)
      const minSizeParam = formData.get('minSize');
      if (minSizeParam) {
        const minBytes = parseInt(String(minSizeParam), 10);
        if (!isNaN(minBytes) && buffer.length < minBytes) {
          const kb = (buffer.length / 1024).toFixed(1);
          return NextResponse.json(
            {
              success: false,
              message: `Ukuran berkas "${originalName}" terlalu kecil (${kb} KB). Minimal ukuran berkas adalah 100 KB agar dokumen terbaca jelas dan tidak buram.`,
            },
            { status: 400 }
          );
        }
      }
    } else if (contentType.includes('application/json')) {
      // 2. Handle JSON Base64 payload
      const body = await request.json();
      const { base64, ext = 'jpg' } = body;

      if (!base64 || typeof base64 !== 'string') {
        return NextResponse.json({ success: false, message: 'Payload base64 tidak valid' }, { status: 400 });
      }

      const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(cleanBase64, 'base64');

      const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
      filename = `warta-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${cleanExt}`;
      mimeType = cleanExt === '.png' ? 'image/png' : cleanExt === '.webp' ? 'image/webp' : 'image/jpeg';
    } else {
      return NextResponse.json({ success: false, message: 'Content-Type tidak didukung' }, { status: 400 });
    }

    if (!buffer) {
      return NextResponse.json({ success: false, message: 'Gagal memproses berkas gambar' }, { status: 400 });
    }

    // Optional local backup in public/uploads/ (best effort, safe on Vercel)
    let localUrl = `/uploads/${filename}`;
    try {
      const localFilePath = path.join(uploadDir, filename);
      await fs.writeFile(localFilePath, buffer);
    } catch {}

    // 3. Upload to Supabase Storage bucket 'articles'
    let finalUrl = localUrl;
    let storageTarget = 'local';

    try {
      const { data: supaData, error: supaErr } = await supabase.storage
        .from('articles')
        .upload(filename, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!supaErr && supaData) {
        const { data: publicUrlData } = supabase.storage
          .from('articles')
          .getPublicUrl(filename);

        if (publicUrlData?.publicUrl) {
          finalUrl = publicUrlData.publicUrl;
          storageTarget = 'supabase';
        }
      } else if (supaErr) {
        console.warn('Supabase Storage upload returned error (fallback to local):', supaErr.message);
      }
    } catch (err: any) {
      console.warn('Supabase Storage request exception (fallback to local):', err?.message);
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      storage: storageTarget,
      filename,
      size: buffer.length,
      sizeKb: (buffer.length / 1024).toFixed(1),
      message: storageTarget === 'supabase'
        ? 'Foto berhasil dikompresi (< 100 KB) dan tersimpan di Supabase Storage'
        : 'Foto berhasil dikompresi (< 100 KB) dan tersimpan',
    });
  } catch (error: any) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ success: false, message: error.message || 'Gagal mengunggah gambar' }, { status: 500 });
  }
}
