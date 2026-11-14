// Service Worker untuk Portal MA Raudlatul Hidayah (PWA & Web Push)
const CACHE_NAME = 'mrh-portal-cache-v8';

// Daftar aset branding statis yang dapat dipre-cache
const PRECACHE_ASSETS = [
  '/',
  '/school-logo.png',
  '/badge-96.png',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Strategi fetch yang ramah Google Lighthouse & Web Vitals:
// 1. Aset kompilasi Next.js (_next/*) & API TIDAK dicegat oleh Service Worker agar browser & CDN Vercel melayani langsung secara native dengan HTTP/2 & Brotli.
// 2. CSS/JS tidak dicegat dengan custom respondWith agar Chrome DevTools Protocol (CSSUsage, JsUsage, Trace) dapat berjalan tanpa error.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Jangan sentuh request non-GET, API, Next.js chunk/data/static, atau URL eksternal
  if (
    request.method !== 'GET' ||
    request.url.includes('/api/') ||
    request.url.includes('/_next/')
  ) {
    return;
  }

  // Untuk navigasi halaman (HTML): Network-First, fallback ke cache '/' jika offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/'))
      )
    );
    return;
  }

  // Cache-First hanya untuk gambar ikon & logo statis lokal
  if (
    request.destination === 'image' &&
    (request.url.includes('/school-logo.png') ||
      request.url.includes('/icon-') ||
      request.url.includes('/badge-') ||
      request.url.includes('/favicon.ico'))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache).catch(() => {});
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // PENTING: Untuk seluruh script, css, dan resource lain, BIARKAN BROWSER MENANGANI SECARA NATIVE.
  // Jangan panggil event.respondWith(fetch(request)) karena akan merusak profiling DevTools & PageSpeed Insights.
});

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
    silent: false, // Menjamin suara notifikasi aktif mengikuti nada dering bawaan ponsel
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

