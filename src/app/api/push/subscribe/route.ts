import { NextResponse } from 'next/server';
import {
  savePushSubscription,
  removePushSubscription,
  getPushSubscriptions,
  VAPID_PUBLIC_KEY,
} from '@/lib/webPush';

export const dynamic = 'force-dynamic';

export async function GET() {
  const subs = await getPushSubscriptions();
  return NextResponse.json({
    publicKey: VAPID_PUBLIC_KEY,
    totalSubscribers: subs.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return NextResponse.json(
        { success: false, message: 'Invalid subscription object' },
        { status: 400 }
      );
    }

    const success = await savePushSubscription({
      endpoint: body.endpoint,
      expirationTime: body.expirationTime || null,
      keys: {
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error saving subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json(
        { success: false, message: 'Endpoint required' },
        { status: 400 }
      );
    }

    await removePushSubscription(endpoint);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error removing subscription' },
      { status: 500 }
    );
  }
}
