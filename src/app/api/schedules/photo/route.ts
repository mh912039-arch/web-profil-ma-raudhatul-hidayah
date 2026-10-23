import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { deleteStorageFile } from '@/lib/storageHelper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET() {
  try {
    const { data: row } = await supabase
      .from('teachers_staff')
      .select('education, updated_at')
      .eq('code', 'SYS_SCHIMG')
      .maybeSingle();

    if (row?.education) {
      const parsed = JSON.parse(row.education);
      return NextResponse.json({
        photo_url: parsed.photo_url || null,
        updated_at: row.updated_at || parsed.updated_at || null,
        caption: parsed.caption || 'Jadwal Pelajaran Resmi',
      }, { headers: noCacheHeaders });
    }
  } catch (err) {
    console.warn('Notice: Read SYS_SCHIMG:', err);
  }

  return NextResponse.json({ photo_url: null, updated_at: null }, { headers: noCacheHeaders });
}

export async function POST(request: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await request.json();
    const photoUrl = body.photo_url;
    const caption = body.caption || 'Jadwal Pelajaran Resmi MA Raudhatul Hidayah';

    if (!photoUrl) {
      return NextResponse.json({ success: false, message: 'URL foto jadwal diperlukan.' }, { status: 400, headers: noCacheHeaders });
    }

    // 1. Ambil foto lama jika ada untuk dibersihkan dari Supabase Storage (Garbage Collection)
    try {
      const { data: oldRow } = await supabase
        .from('teachers_staff')
        .select('education')
        .eq('code', 'SYS_SCHIMG')
        .maybeSingle();

      if (oldRow?.education) {
        const parsedOld = JSON.parse(oldRow.education);
        const oldUrl = parsedOld?.photo_url;
        if (oldUrl && oldUrl !== photoUrl) {
          await deleteStorageFile(oldUrl);
        }
      }
    } catch (cleanupErr) {
      console.warn('Notice: Old schedule photo cleanup skipped:', cleanupErr);
    }

    const payload = {
      photo_url: photoUrl,
      caption,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
      .from('teachers_staff')
      .update({
        education: JSON.stringify(payload),
        updated_at: new Date().toISOString(),
      })
      .eq('code', 'SYS_SCHIMG')
      .select('id');

    if (error || !updated || updated.length === 0) {
      await supabase.from('teachers_staff').insert({
        name: 'System Schedule Image Store',
        code: 'SYS_SCHIMG',
        category_label: 'Sistem',
        subject_name: 'Schedule Photo',
        education: JSON.stringify(payload),
        order_no: 9993,
        role: 'system',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Foto jadwal resmi berhasil disimpan.',
      data: payload,
    }, { headers: noCacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: noCacheHeaders });
  }
}

export async function DELETE() {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    // 1. Ambil foto yang sedang aktif untuk dihapus dari Storage
    try {
      const { data: oldRow } = await supabase
        .from('teachers_staff')
        .select('education')
        .eq('code', 'SYS_SCHIMG')
        .maybeSingle();

      if (oldRow?.education) {
        const parsedOld = JSON.parse(oldRow.education);
        if (parsedOld?.photo_url) {
          await deleteStorageFile(parsedOld.photo_url);
        }
      }
    } catch {}

    const payload = { photo_url: null, updated_at: new Date().toISOString() };
    await supabase
      .from('teachers_staff')
      .update({
        education: JSON.stringify(payload),
        updated_at: new Date().toISOString(),
      })
      .eq('code', 'SYS_SCHIMG');

    return NextResponse.json({
      success: true,
      message: 'Foto jadwal resmi berhasil dihapus dari sistem dan storage.',
    }, { headers: noCacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: noCacheHeaders });
  }
}
