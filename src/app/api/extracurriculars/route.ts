import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireAuth } from '@/lib/auth';
import { deleteStorageFile } from '@/lib/storageHelper';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'extracurricularsData.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export interface ExtracurricularItem {
  id: number | string;
  name: string;
  category: string;
  badge: string;
  level: string;
  schedule: string;
  coach: string;
  role: string;
  image: string;
  desc: string;
}

function unpackExtracurricular(item: any): ExtracurricularItem {
  let desc = item.description || '';
  let badge = 'Ekstrakurikuler Pilihan';
  let level = 'Tingkat MA';
  let role = 'Pembina Ekstrakurikuler';

  if (item.category === 'belanegara') {
    badge = 'Bela Negara & Kedisiplinan';
    role = 'Instruktur & Pembina';
  } else if (item.category === 'olahraga') {
    badge = 'Olahraga Prestasi';
    role = 'Pelatih Olahraga';
  } else if (item.category === 'seni') {
    badge = 'Kesenian & Budaya';
    role = 'Instruktur Seni';
  } else if (item.category === 'literasi') {
    badge = 'Bahasa & Literasi';
    role = 'Pembina Redaksi';
  }

  if (typeof desc === 'string' && desc.trim().startsWith('{') && desc.trim().endsWith('}')) {
    try {
      const parsed = JSON.parse(desc.trim());
      if (parsed.desc !== undefined || parsed.text !== undefined) {
        desc = parsed.desc ?? parsed.text ?? '';
        if (parsed.badge) badge = parsed.badge;
        if (parsed.level) level = parsed.level;
        if (parsed.role) role = parsed.role;
      }
    } catch (_) {}
  }

  return {
    id: item.id,
    name: item.name || 'Cabang Ekstrakurikuler',
    category: item.category || 'belanegara',
    badge,
    level,
    schedule: item.schedule || 'Sesuai Jadwal',
    coach: item.coach || 'Pembina Madrasah',
    role,
    image: item.image_url || '/hero/slide-1.jpg',
    desc,
  };
}

function packDescription(desc: string, badge?: string, level?: string, role?: string): string {
  return JSON.stringify({
    desc: desc || '',
    badge: badge || 'Ekstrakurikuler Pilihan',
    level: level || 'Tingkat MA',
    role: role || 'Pembina Ekstrakurikuler',
  });
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 35);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${base || 'ekskul'}-${randomSuffix}`;
}

export async function GET() {
  let localItems: ExtracurricularItem[] = [];

  // 1. Read fallback local JSON
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localItems = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read extracurricularsData.json:', err);
  }

  // 2. Fetch from Supabase primary persistent store
  try {
    const { data: supaItems, error } = await supabaseServer
      .from('extracurriculars')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && supaItems && supaItems.length > 0) {
      const mapped = supaItems.map(unpackExtracurricular);

      // Best effort local cache update
      try {
        await fs.writeFile(dataFilePath, JSON.stringify(mapped, null, 2), 'utf-8');
      } catch (_) {}

      return NextResponse.json(mapped, { headers: noCacheHeaders });
    }
  } catch (err) {
    console.warn('Supabase extracurriculars fetch error:', err);
  }

  return NextResponse.json(localItems, { headers: noCacheHeaders });
}

export async function POST(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi mengelola ekstrakurikuler
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    if (!body.name || !body.name.trim() || !body.coach || !body.coach.trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama ekstrakurikuler dan nama pembina wajib diisi.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const name = body.name.trim();
    const coach = body.coach.trim();
    const category = body.category || 'belanegara';
    const badge = body.badge || 'Ekstrakurikuler Pilihan';
    const level = body.level || 'Tingkat MA';
    const schedule = body.schedule || 'Sesuai Jadwal';
    const role = body.role || 'Pembina Ekstrakurikuler';
    const image = body.image || '/hero/slide-1.jpg';
    const desc = body.desc || '';

    const packedDesc = packDescription(desc, badge, level, role);

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(body.id || ''));

    let savedItem: ExtracurricularItem;

    if (isUuid && body.id) {
      // Update existing row
      const { data: updated, error: updateErr } = await supabaseServer
        .from('extracurriculars')
        .update({
          name,
          category,
          schedule,
          coach,
          description: packedDesc,
          image_url: image,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.id)
        .select()
        .single();

      if (updateErr) {
        console.error('Supabase update extracurricular error:', updateErr);
        throw new Error(updateErr.message);
      }

      savedItem = unpackExtracurricular(updated);
    } else {
      // Insert new row
      const slug = generateSlug(name);
      const { data: inserted, error: insertErr } = await supabaseServer
        .from('extracurriculars')
        .insert({
          slug,
          name,
          category,
          schedule,
          coach,
          description: packedDesc,
          image_url: image,
          order_index: 99,
          is_active: true,
        })
        .select()
        .single();

      if (insertErr) {
        console.error('Supabase insert extracurricular error:', insertErr);
        throw new Error(insertErr.message);
      }

      savedItem = unpackExtracurricular(inserted);
    }

    // Best-effort local file update
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      const items: ExtracurricularItem[] = JSON.parse(fileContent);
      const idx = items.findIndex((i) => String(i.id) === String(savedItem.id));
      if (idx >= 0) {
        items[idx] = savedItem;
      } else {
        items.push(savedItem);
      }
      await fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), 'utf-8');
    } catch (_) {}

    return NextResponse.json(
      {
        success: true,
        message: 'Ekstrakurikuler berhasil disimpan ke database.',
        item: savedItem,
      },
      { headers: noCacheHeaders }
    );
  } catch (err: any) {
    console.error('Error saving extracurricular:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menyimpan ekstrakurikuler.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi menghapus ekstrakurikuler
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID ekstrakurikuler wajib disertakan.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    // 1. Fetch item from Supabase to clean up storage image if applicable
    if (isUuid) {
      const { data: itemData } = await supabaseServer
        .from('extracurriculars')
        .select('image_url')
        .eq('id', id)
        .single();

      if (itemData?.image_url) {
        await deleteStorageFile(itemData.image_url);
      }

      // Delete from Supabase
      const { error: delErr } = await supabaseServer
        .from('extracurriculars')
        .delete()
        .eq('id', id);

      if (delErr) {
        console.error('Supabase delete extracurricular error:', delErr);
        return NextResponse.json(
          { success: false, message: delErr.message || 'Gagal menghapus ekstrakurikuler di database.' },
          { status: 500, headers: noCacheHeaders }
        );
      }
    }

    // 2. Best-effort local file sync
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      const items: ExtracurricularItem[] = JSON.parse(fileContent);
      const filtered = items.filter((i) => String(i.id) !== String(id));
      await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), 'utf-8');
    } catch (_) {}

    return NextResponse.json(
      {
        success: true,
        message: 'Ekstrakurikuler berhasil dihapus dari database.',
      },
      { headers: noCacheHeaders }
    );
  } catch (err: any) {
    console.error('Error deleting extracurricular:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menghapus ekstrakurikuler.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
