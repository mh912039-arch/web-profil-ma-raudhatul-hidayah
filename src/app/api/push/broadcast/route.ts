import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { broadcastPushNotification } from '@/lib/webPush';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const auth = await requireAuth(['admin']);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { title, body, url, category } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { success: false, message: 'Title and body are required' },
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
    return NextResponse.json(
      { success: false, message: err?.message || 'Error broadcasting push notification' },
      { status: 500 }
    );
  }
}
