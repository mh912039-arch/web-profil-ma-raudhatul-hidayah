'use client';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function isPushNotificationSupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export async function getPushSubscriptionState(): Promise<{
  supported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}> {
  if (typeof window === 'undefined' || !(await isPushNotificationSupported())) {
    return {
      supported: false,
      permission: 'default',
      isSubscribed: false,
    };
  }

  const permission = Notification.permission;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return {
      supported: true,
      permission,
      isSubscribed: !!sub,
    };
  } catch (err) {
    return {
      supported: true,
      permission,
      isSubscribed: false,
    };
  }
}

export async function subscribeToPushNotifications(): Promise<{
  success: boolean;
  message: string;
}> {
  if (!(await isPushNotificationSupported())) {
    return {
      success: false,
      message: 'Perangkat atau peramban ini belum mendukung Web Push Notifications.',
    };
  }

  try {
    // 1. Minta izin notifikasi jika belum diberikan
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        message: 'Izin notifikasi tidak diberikan oleh pengguna.',
      };
    }

    // 2. Ambil VAPID Public Key dari server
    const res = await fetch('/api/push/subscribe');
    const { publicKey } = await res.json();
    if (!publicKey) {
      throw new Error('Public VAPID key tidak ditemukan di server.');
    }

    // 3. Daftarkan Push Subscription melalui Service Worker
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as unknown as BufferSource,
      });
    }

    // 4. Kirim endpoint & keys ke API server untuk disimpan di Supabase
    const subJson = sub.toJSON();
    const saveRes = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subJson),
    });

    if (!saveRes.ok) {
      throw new Error('Gagal menyimpan pendaftaran notifikasi ke server.');
    }

    localStorage.setItem('mrh_push_subscribed', 'true');
    return {
      success: true,
      message: 'Notifikasi berhasil diaktifkan. Anda akan menerima pemberitahuan setiap ada agenda baru.',
    };
  } catch (err: any) {
    console.error('Push subscription failed:', err);
    return {
      success: false,
      message: err?.message || 'Terjadi kesalahan saat mengaktifkan notifikasi.',
    };
  }
}

export async function unsubscribeFromPushNotifications(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();

      await fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      });
    }
    localStorage.removeItem('mrh_push_subscribed');
    return { success: true, message: 'Notifikasi push dinonaktifkan.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal menonaktifkan notifikasi.' };
  }
}

/**
 * Sinkronisasi otomatis token push subscription ke server (Supabase SYS_PUSH).
 * Memastikan endpoint ponsel selalu terdaftar aktif di database jika izin 'granted'.
 */
export async function syncPushSubscription(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    // Jika belum ada subscription lokal padahal izin sudah diberikan, buat baru
    if (!sub) {
      const res = await fetch('/api/push/subscribe');
      if (!res.ok) return false;
      const { publicKey } = await res.json();
      if (!publicKey) return false;

      const convertedVapidKey = urlBase64ToUint8Array(publicKey);
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as unknown as BufferSource,
      });
    }

    if (sub) {
      const subJson = sub.toJSON();
      const saveRes = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subJson),
      });
      if (saveRes.ok) {
        localStorage.setItem('mrh_push_subscribed', 'true');
        return true;
      }
    }
  } catch (err) {
    console.warn('Auto-sync push subscription note:', err);
  }
  return false;
}
