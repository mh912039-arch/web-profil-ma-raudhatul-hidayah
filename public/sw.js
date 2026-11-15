// Service Worker untuk Portal MAS Raudlatul Hidayah (PWA & Web Push)
const CACHE_NAME = 'mrh-portal-cache-v9';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => caches.delete(cache))
        )
      )
      .then(() => self.clients.claim())
  );
});

// PENTING UNTUK LIGHTHOUSE, CORE WEB VITALS & DEVTOOLS:
// Jangan mengintersepsi fetch. Biarkan seluruh dokumen HTML, Next.js chunks, dan file CSS
// dilayani 100% secara native oleh CDN Vercel & HTTP/2 browser.
// Ini menjamin Chrome DevTools Protocol (CSSUsage, ScriptElements, Trace) tidak pernah gagal atau memicu Error!

// ============================================================================
// WEB PUSH NOTIFICATION HANDLERS (MAS RH Mobile PWA)
// ============================================================================
self.addEventListener('push', (event) => {
  let data = {
    title: 'Portal MAS Raudlatul Hidayah',
    body: 'Ada pembaruan informasi akademik terbaru.',
    icon: '/school-logo.png',
    badge: '/badge-96.png',
    url: '/admin',
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch (err) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon || '/school-logo.png',
    badge: data.badge || '/badge-96.png',
    vibrate: data.vibrate || [300, 100, 300, 100, 300],
    silent: false,
    tag: data.tag || `mrh-push-${Date.now()}`,
    renotify: true,
    timestamp: Date.now(),
    data: data.data || { url: data.url || '/admin' },
    actions: [
      { action: 'open_url', title: 'Buka Portal' },
    ],
  };

  // Siarkan ke seluruh window/tab yang terbuka agar memutar nada notifikasi secara langsung
  const notifyClientsPromise = self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then((windowClients) => {
      windowClients.forEach((client) => {
        client.postMessage({
          type: 'PUSH_NOTIFICATION_RECEIVED',
          title: data.title,
          body: data.body,
          url: data.url,
        });
      });
    })
    .catch(() => {});

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, notificationOptions),
      notifyClientsPromise,
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/admin';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Jika ada window/tab terbuka, arahkan ke target URL dan fokuskan
      for (let client of windowClients) {
        if ('focus' in client) {
          if ('navigate' in client && targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Jika belum ada window yang terbuka, buka tab baru
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
