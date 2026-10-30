import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { applyBatchSchedules, ScheduleItem } from '@/lib/scheduleStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function POST(req: Request) {
  const auth = await requireAuth(['admin', 'guru']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const newItems: ScheduleItem[] = Array.isArray(body.items) ? body.items : [];
    const replaceRombel = body.replaceRombel as string | undefined;
    const replaceAll = Boolean(body.replaceAll);
    const photoUrl = body.photoUrl as string | undefined;
    const caption = body.caption as string | undefined;

    if (!newItems || newItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Daftar jadwal tidak boleh kosong.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const result = await applyBatchSchedules({
      items: newItems,
      replaceRombel,
      replaceAll,
      photoUrl,
      caption,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Berhasil memperbarui ${result.count} sesi jadwal pelajaran secara otomatis.`,
        count: result.count,
        total: result.total,
        items: result.items,
      },
      { headers: noCacheHeaders }
    );
  } catch (err: any) {
    console.error('Error in batch schedules update:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Gagal memproses pembaruan jadwal massal.' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
