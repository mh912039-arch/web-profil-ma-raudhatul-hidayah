import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'extracurricularsData.json');

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

export async function GET() {
  // 1. Try fetching from Supabase first
  try {
    const { data: supaItems, error } = await supabase
      .from('extracurriculars')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && supaItems && supaItems.length > 0) {
      const mapped: ExtracurricularItem[] = supaItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category || 'belanegara',
        badge: 'Ekstrakurikuler Unggulan',
        level: 'Tingkat MA & MTs',
        schedule: item.schedule || 'Sesuai Jadwal',
        coach: item.coach || 'Pembina Madrasah',
        role: 'Pembina Resmi',
        image: item.image_url || '/hero/slide-1.jpg',
        desc: item.description || '',
      }));
      return NextResponse.json(mapped, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      });
    }
  } catch (err) {
    console.warn('Notice: Supabase extracurriculars fetch:', err);
  }

  // 2. Fallback to local JSON
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const items: ExtracurricularItem[] = JSON.parse(fileContent);
    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (err) {
    console.warn('Could not read extracurricularsData.json:', err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi mengelola ekstrakurikuler
  const auth = requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    if (!body.name || !body.coach) {
      return NextResponse.json(
        { success: false, message: 'Nama ekstrakurikuler dan nama pembina wajib diisi.' },
        { status: 400 }
      );
    }

    let items: ExtracurricularItem[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      items = JSON.parse(fileContent);
    } catch {
      items = [];
    }

    const existingIndex = body.id
      ? items.findIndex((i) => String(i.id) === String(body.id))
      : -1;

    let savedItem: ExtracurricularItem;

    if (existingIndex >= 0) {
      savedItem = {
        ...items[existingIndex],
        ...body,
      };
      items[existingIndex] = savedItem;
    } else {
      const newId = items.length > 0 ? Math.max(...items.map((i) => Number(i.id) || 0)) + 1 : 1;
      savedItem = {
        id: body.id || newId,
        name: body.name,
        category: body.category || 'belanegara',
        badge: body.badge || 'Ekstrakurikuler Pilihan',
        level: body.level || 'Tingkat MA',
        schedule: body.schedule || 'Sesuai Jadwal',
        coach: body.coach,
        role: body.role || 'Pembina Ekstrakurikuler',
        image: body.image || '/hero/slide-1.jpg',
        desc: body.desc || '',
      };
      items.push(savedItem);
    }

    // 1. Primary: Save to Supabase
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(body.id));
      if (isUuid) {
        await supabase
          .from('extracurriculars')
          .update({
            name: savedItem.name,
            category: savedItem.category,
            schedule: savedItem.schedule,
            coach: savedItem.coach,
            description: savedItem.desc,
            image_url: savedItem.image,
            updated_at: new Date().toISOString(),
          })
          .eq('id', body.id);
      } else {
        const { data: inserted } = await supabase
          .from('extracurriculars')
          .insert({
            name: savedItem.name,
            category: savedItem.category,
            schedule: savedItem.schedule,
            coach: savedItem.coach,
            description: savedItem.desc,
            image_url: savedItem.image,
            order_index: items.length,
            is_active: true,
          })
          .select()
          .single();
        if (inserted?.id) {
          savedItem.id = inserted.id;
        }
      }
    } catch (supaErr) {
      console.warn('Notice: Supabase extracurriculars sync:', supaErr);
    }

    // 2. Best-effort local file write (safe on Vercel)
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(items, null, 2), 'utf-8');
    } catch (fsErr) {
      // Safely ignore EROFS in serverless environment
    }

    return NextResponse.json({
      success: true,
      message: 'Ekstrakurikuler berhasil disimpan.',
      item: savedItem,
    });
  } catch (err: any) {
    console.error('Error saving extracurricular:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menyimpan ekstrakurikuler.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi menghapus ekstrakurikuler
  const auth = requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID ekstrakurikuler wajib disertakan.' },
        { status: 400 }
      );
    }

    // 1. Delete from Supabase safely
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      if (isUuid) {
        await supabase.from('extracurriculars').delete().eq('id', id);
      }
    } catch (err) {}

    // 2. Best-effort local file delete
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      const items: ExtracurricularItem[] = JSON.parse(fileContent);
      const filtered = items.filter((i) => String(i.id) !== String(id));
      await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2), 'utf-8');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Ekstrakurikuler berhasil dihapus.',
    });
  } catch (err: any) {
    console.error('Error deleting extracurricular:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Gagal menghapus ekstrakurikuler.' },
      { status: 500 }
    );
  }
}
