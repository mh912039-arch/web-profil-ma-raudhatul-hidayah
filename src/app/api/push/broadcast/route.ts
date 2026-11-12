import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { broadcastPushNotification } from '@/lib/webPush';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Izinkan seluruh civitas terotentikasi (admin, guru, siswa) melakukan uji notifikasi atau broadcast
  const auth = await requireAuth(['admin', 'guru', 'siswa'], request);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { title, body, url, category } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { success: false, message: 'Judul dan isi pesan notifikasi wajib diisi.' },
        { status: 400 }
      );
    }

    const result = await broadcastPushNotification({
      title,
      body,
      url: url || '/admin',
      data: { category: category || 'umum' },
    });

    return NextResponse.json({
      success: true,
      message: `Notifikasi berhasil disiarkan ke ${result.sent} perangkat.`,
      result,
    });
  } catch (err: any) {
    console.error('Error broadcasting push notification:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Gagal mengirim sinyal push notification ke server FCM.' },
      { status: 500 }
    );
  }
}
