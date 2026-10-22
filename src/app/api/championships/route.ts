import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabaseClient';
import { requireAuth } from '@/lib/auth';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'championshipsData.json');

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

  // 1. Read local JSON (authoritative store for admin edits)
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localPhotos = JSON.parse(fileContent);
  } catch (err) {
    console.warn('Could not read championshipsData.json:', err);
  }

  // 2. Fetch from Supabase as fallback or for external records
  try {
    const { data: supaPhotos, error } = await supabase
      .from('championship_photos')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && supaPhotos && supaPhotos.length > 0) {
      const supaMapped: ChampionshipPhotoItem[] = supaPhotos.map((p: any) => ({
        id: p.id,
        title: p.title,
        event_name: p.event_name || p.event || '',
        sub: p.sub || '',
        badge: p.badge || 'Piala Kejuaraan',
        category: p.category || 'Ekstrakurikuler',
        date_label: p.date_label || '',
        image_url: p.image_url || p.image || '/foto-juara.jpeg',
        slug: p.slug || '',
        caption: p.caption || p.desc || '',
        order_index: p.order_index || 0,
      }));

      // If local photos is empty, seed from Supabase
      if (localPhotos.length === 0) {
        await fs.writeFile(dataFilePath, JSON.stringify(supaMapped, null, 2), 'utf-8').catch(() => {});
        return NextResponse.json(supaMapped);
      }

      // Local photos ALWAYS take precedence over stale Supabase records!
      const localMap = new Map<string, ChampionshipPhotoItem>();
      localPhotos.forEach((lp) => {
        if (lp.id) localMap.set(String(lp.id), lp);
      });

      // Keep all local photos (which contain admin's edits)
      const merged: ChampionshipPhotoItem[] = [...localPhotos];

      // Append any truly new Supabase records that do not exist locally
      supaMapped.forEach((sp) => {
        if (sp.id && !localMap.has(String(sp.id))) {
          merged.push(sp);
        }
      });

      return NextResponse.json(merged);
    }
  } catch (err) {
    console.warn('Supabase fetch failed for championship_photos:', err);
  }

  return NextResponse.json(localPhotos);
}

export async function POST(request: Request) {
  // Hanya Admin dan Dewan Guru yang memiliki otorisasi menambah/mengedit prestasi
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();

    if (!body.title || !body.image_url) {
      return NextResponse.json(
        { success: false, message: 'Judul dan foto wajib diisi.' },
        { status: 400 }
      );
    }

    let photos: ChampionshipPhotoItem[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      photos = JSON.parse(fileContent);
    } catch (err) {}

    const id = body.id || `champ-${Date.now()}`;
    const newOrUpdatedItem: ChampionshipPhotoItem = {
      id,
      title: body.title.trim(),
      event_name: (body.event_name || body.event || '').trim(),
      sub: (body.sub || '').trim(),
      badge: (body.badge || 'Piala Juara').trim(),
      category: (body.category || 'Ekstrakurikuler').trim(),
      date_label: (body.date_label || '').trim(),
      image_url: body.image_url.trim(),
      slug: (body.slug || '').trim(),
      caption: (body.caption || body.desc || '').trim(),
      order_index: body.order_index !== undefined ? Number(body.order_index) : photos.length + 1,
    };

    const existingIdx = photos.findIndex((p) => String(p.id) === String(id));
    if (existingIdx >= 0) {
      photos[existingIdx] = newOrUpdatedItem;
    } else {
      photos.unshift(newOrUpdatedItem);
    }

    // Save locally (best effort)
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(photos, null, 2), 'utf-8');
    } catch (fsErr) {
      // Safely ignore EROFS on Vercel
    }

    // Also attempt to sync to Supabase safely if valid UUID or new row
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      if (isUuid) {
        await supabase.from('championship_photos').update({
          title: newOrUpdatedItem.title,
          event_name: newOrUpdatedItem.event_name,
          category: newOrUpdatedItem.category,
          date_label: newOrUpdatedItem.date_label,
          image_url: newOrUpdatedItem.image_url,
          caption: newOrUpdatedItem.caption,
          order_index: newOrUpdatedItem.order_index,
        }).eq('id', String(id));
      } else {
        const { data: existing } = await supabase
          .from('championship_photos')
          .select('id')
          .eq('title', newOrUpdatedItem.title)
          .limit(1);

        if (existing && existing.length > 0) {
          const matchedId = existing[0].id;
          newOrUpdatedItem.id = matchedId;
          await supabase.from('championship_photos').update({
            title: newOrUpdatedItem.title,
            event_name: newOrUpdatedItem.event_name,
            category: newOrUpdatedItem.category,
            date_label: newOrUpdatedItem.date_label,
            image_url: newOrUpdatedItem.image_url,
            caption: newOrUpdatedItem.caption,
            order_index: newOrUpdatedItem.order_index,
          }).eq('id', matchedId);
        } else {
          const { data: inserted } = await supabase.from('championship_photos').insert({
            title: newOrUpdatedItem.title,
            event_name: newOrUpdatedItem.event_name,
            category: newOrUpdatedItem.category,
            date_label: newOrUpdatedItem.date_label,
            image_url: newOrUpdatedItem.image_url,
            caption: newOrUpdatedItem.caption,
            order_index: newOrUpdatedItem.order_index,
          }).select().single();
          if (inserted?.id) {
            newOrUpdatedItem.id = inserted.id;
          }
        }
      }
    } catch (supaErr) {
      console.warn('Supabase championship_photos notice:', supaErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Foto juara berhasil disimpan dan langsung diterapkan ke web profil.',
      data: newOrUpdatedItem,
    });
  } catch (error: any) {
    console.error('Error in championships POST:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menyimpan foto juara.' },
      { status: 500 }
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
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 });
    }

    let photos: ChampionshipPhotoItem[] = [];
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      photos = JSON.parse(fileContent);
      photos = photos.filter((p) => String(p.id) !== String(id));
      await fs.writeFile(dataFilePath, JSON.stringify(photos, null, 2), 'utf-8');
    } catch (err) {}

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
      if (isUuid) {
        await supabase.from('championship_photos').delete().eq('id', id);
      }
    } catch (err) {}

    return NextResponse.json({
      success: true,
      message: 'Dokumentasi juara berhasil dihapus.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal menghapus foto.' },
      { status: 500 }
    );
  }
}
