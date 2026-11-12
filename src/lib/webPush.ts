import * as webpush from 'web-push';
import { supabaseAdmin } from '@/lib/supabaseClient';

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BCSSSHsg_sKFRxT2N1laZfoGsWSrx0c0iHmx3ktK6PxYQIHjDIBmLok3ljw_qXH3BIFWK5o6RhQVNVWRpbJIy2c';

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || 'sXDwp7h0vJR6rzh2vMIvAjOazfK4S-GBbDO06jSHiBY';

const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:pkm28979@gmail.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export interface PushSubscriptionRecord {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
  createdAt: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  data?: Record<string, any>;
}

/**
 * Mengambil daftar push subscription dari penyimpanan persisten Supabase (SYS_PUSH)
 */
export async function getPushSubscriptions(): Promise<PushSubscriptionRecord[]> {
  try {
    const { data } = await supabaseAdmin
      .from('teachers_staff')
      .select('education')
      .eq('code', 'SYS_PUSH')
      .maybeSingle();

    if (data?.education) {
      const parsed = JSON.parse(data.education);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read SYS_PUSH:', err);
  }
  return [];
}

/**
 * Menyimpan atau memperbarui subscription
 */
export async function savePushSubscription(
  sub: Omit<PushSubscriptionRecord, 'createdAt'>
): Promise<boolean> {
  try {
    const current = await getPushSubscriptions();
    // Hindari duplikasi endpoint
    const filtered = current.filter((s) => s.endpoint !== sub.endpoint);
    const updated: PushSubscriptionRecord[] = [
      ...filtered,
      {
        ...sub,
        createdAt: new Date().toISOString(),
      },
    ];

    const { data, error } = await supabaseAdmin
      .from('teachers_staff')
      .update({ education: JSON.stringify(updated) })
      .eq('code', 'SYS_PUSH')
      .select('id');

    if (error || !data || data.length === 0) {
      await supabaseAdmin.from('teachers_staff').insert({
        name: 'System Push Subscriptions',
        code: 'SYS_PUSH',
        category_label: 'Sistem',
        subject_name: 'PushNotification',
        education: JSON.stringify(updated),
        order_no: 9993,
        role: 'system',
      });
    }
    return true;
  } catch (err) {
    console.error('Failed to save push subscription:', err);
    return false;
  }
}

/**
 * Menghapus subscription yang tidak valid lagi (misal user uninstal atau ganti browser)
 */
export async function removePushSubscription(endpoint: string): Promise<void> {
  try {
    const current = await getPushSubscriptions();
    const updated = current.filter((s) => s.endpoint !== endpoint);

    await supabaseAdmin
      .from('teachers_staff')
      .update({ education: JSON.stringify(updated) })
      .eq('code', 'SYS_PUSH');
  } catch (err) {
    console.warn('Failed to remove expired subscription:', err);
  }
}

/**
 * Mengirim notifikasi siaran (broadcast) ke seluruh perangkat mobile PWA yang terdaftar
 */
export async function broadcastPushNotification(payload: PushNotificationPayload) {
  const subscriptions = await getPushSubscriptions();
  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, total: 0 };
  }

  const notificationString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || '/school-logo.png',
    badge: payload.badge || '/school-logo.png',
    data: {
      url: payload.url || '/admin',
      ...payload.data,
      timestamp: Date.now(),
    },
  });

  let sent = 0;
  let failed = 0;
  const expiredEndpoints: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          notificationString,
          {
            TTL: 60 * 60 * 24, // 24 jam
            urgency: 'high',
          }
        );
        sent++;
      } catch (err: any) {
        failed++;
        // Status 410 (Gone) atau 404 menunjukkan browser sudah mencabut izin atau uninstall
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          expiredEndpoints.push(sub.endpoint);
        }
      }
    })
  );

  // Bersihkan endpoint kedaluwarsa secara otomatis di latar belakang
  if (expiredEndpoints.length > 0) {
    for (const ep of expiredEndpoints) {
      await removePushSubscription(ep);
    }
  }

  return { sent, failed, total: subscriptions.length };
}

export { VAPID_PUBLIC_KEY };
