import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseServer } from '@/lib/supabaseServer';
import { requireAuth } from '@/lib/auth';
import { deleteStorageFile } from '@/lib/storageHelper';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'championshipsData.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export interface ChampionshipPhotoItem {
  id?: string | number;
  title: string;
  event_name: string;
  sub?: string;
  badge?: string;
  category?: string;
  date_label?: string;
  image_url: string;
  slug?: string;
  caption?: string;
  order_index?: number;
}

export async function GET() {
  let localPhotos: ChampionshipPhotoItem[] = [];

  // 1. Read local JSON fallback
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localPhotos = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read championshipsData.json:', err);
  }

  // 2. Fetch from Supabase (primary persistent store)
  try {
    const { data: supaPhotos, error } = await supabaseServer
      .from('championship_photos')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && supaPhotos && supaPhotos.length > 0) {
      const supaMapped: ChampionshipPhotoItem[] = supaPhotos.map((p: any) => ({
        id: p.id,
        title: p.title || 'Foto Kejuaraan',
        event_name: p.event_name || p.event || '',
        sub: p.sub || '',
        badge: p.badge || p.category || 'Piala Juara',
        category: p.category || 'Pramuka Penegak',
        date_label: p.date_label || '',
        image_url: p.image_url || p.image || '/foto-juara.jpeg',
        slug: p.slug || '',
        caption: p.caption || p.desc || '',
        order_index: p.order_index || 0,
      }));

      // Synchronize local JSON file in background (safe on Vercel)
      try {
        await fs.writeFile(dataFilePath, JSON.stringify(supaMapped, null, 2), 'utf-8');
      } catch (_) {}

      // Supabase is the single source of truth when records exist
      return NextResponse.json(supaMapped, { headers: noCacheHeaders });
    }
  } catch (err) {
    console.warn('Supabase fetch failed for championship_photos:', err);
  }

  return NextResponse.json(localPhotos, { headers: noCacheHeaders });
}

export async function POST(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi menambah/mengedit prestasi
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Judul dan foto wajib diisi.' },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const eventName = (body.event_name || body.event || '').trim();
    const sub = (body.sub || '').trim();
    const badge = (body.badge || body.category || 'Piala Juara').trim();
    const category = (body.category || 'Pramuka Penegak').trim();
    const dateLabel = (body.date_label || '').trim();
    const imageUrl = (body.image_url || body.image || '/foto-juara.jpeg').trim();
    const slug = (body.slug || '').trim();
    const caption = (body.caption || body.desc || '').trim();
    const orderIndex = body.order_index !== undefined ? Number(body.order_index) : 1;

    let savedItem: ChampionshipPhotoItem = {
      id: body.id,
      title,
      event_name: eventName,
      sub,
      badge,
      category,
      date_label: dateLabel,
      image_url: imageUrl,
      slug,
      caption,
      order_index: orderIndex,
    };

    // 1. Save or Update in Supabase using service role
    try {
      const isUuid = body.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(body.id));
      if (isUuid) {
        const { data: updatedRows, error: upErr } = await supabaseServer
          .from('championship_photos')
          .update({
            title,
            event_name: eventName,
            category,
            date_label: dateLabel,
            image_url: imageUrl,
            caption,
            order_index: orderIndex,
          })
          .eq('id', body.id)
          .select();

        if (!upErr && updatedRows && updatedRows.length > 0) {
          savedItem = { ...savedItem, ...updatedRows[0] };
        } else {
          const { data: insRows } = await supabaseServer
            .from('championship_photos')
            .insert({
              title,
              event_name: eventName,
              category,
              date_label: dateLabel,
              image_url: imageUrl,
              caption,
              order_index: orderIndex,
            })
            .select();
          if (insRows && insRows[0]) savedItem = { ...savedItem, ...insRows[0] };
        }
      } else {
        const { data: insRows } = await supabaseServer
          .from('championship_photos')
          .insert({
            title,
            event_name: eventName,
            category,
            date_label: dateLabel,
            image_url: imageUrl,
            caption,
            order_index: orderIndex,
          })
          .select();
        if (insRows && insRows[0]) {
          savedItem = { ...savedItem, ...insRows[0] };
        }
      }
    } catch (supaErr) {
      console.warn('Supabase championship_photos notice:', supaErr);
    }

    // 2. Best-effort write to local JSON
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      let photos: ChampionshipPhotoItem[] = JSON.parse(fileContent);
      const existingIdx = photos.findIndex(
        (p) => String(p.id) === String(savedItem.id) || (body.id && String(p.id) === String(body.id))
      );
      if (existingIdx >= 0) {
        photos[existingIdx] = savedItem;
      } else {
        photos.unshift(savedItem);
      }
      await fs.writeFile(dataFilePath, JSON.stringify(photos, null, 2), 'utf-8');
    } catch (fsErr) {
      // Safely ignore EROFS on Vercel
    }

    return NextResponse.json({
      success: true,
      message: 'Foto juara berhasil disimpan dan langsung diterapkan ke web profil.',
      data: savedItem,
    }, { headers: noCacheHeaders });
  } catch (error: any) {
    console.error('Error in championships POST:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan foto juara.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}

export async function DELETE(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi menghapus dokumentasi prestasi
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400, headers: noCacheHeaders });
    }

    // 1. Delete image file from storage if applicable
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      let imageUrlToClean: string | undefined;

      if (isUuid) {
        const { data: supaRow } = await supabaseServer
          .from('championship_photos')
          .select('image_url')
          .eq('id', id)
          .maybeSingle();
        imageUrlToClean = supaRow?.image_url;
      }
      if (imageUrlToClean) {
        await deleteStorageFile(imageUrlToClean);
      }
    } catch (cleanErr) {}

    // 2. Delete from Supabase safely
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      if (isUuid) {
        await supabaseServer.from('championship_photos').delete().eq('id', id);
      } else {
        await supabaseServer.from('championship_photos').delete().eq('title', id);
      }
    } catch (err) {
      console.warn('Supabase delete championship photo error:', err);
    }

    // 3. Delete from local JSON (in sync)
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      let photos: ChampionshipPhotoItem[] = JSON.parse(fileContent);
      photos = photos.filter((p) => String(p.id) !== String(id) && p.title !== id);
      await fs.writeFile(dataFilePath, JSON.stringify(photos, null, 2), 'utf-8');
    } catch (err) {}

    return NextResponse.json({
      success: true,
      message: 'Dokumentasi juara berhasil dihapus.',
      id,
    }, { headers: noCacheHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus foto.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
