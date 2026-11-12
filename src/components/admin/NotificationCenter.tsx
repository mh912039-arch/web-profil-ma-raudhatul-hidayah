'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCheck,
  Calendar,
  Newspaper,
  Smartphone,
  X,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getPushSubscriptionState,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isPushNotificationSupported,
  syncPushSubscription,
} from '@/lib/pushClient';

export interface FeedNotificationItem {
  id: string;
  type: 'calendar' | 'article';
  title: string;
  subtitle: string;
  dateStr: string;
  categoryLabel: string;
  categoryBadge: string;
  url?: string;
  timestamp: number;
}

interface NotificationCenterProps {
  onSelectCalendarTab?: () => void;
  onSelectArticlesTab?: () => void;
}

const CATEGORY_STYLES: Record<string, { label: string; badge: string }> = {
  ujian: { label: 'Ujian', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  kegiatan: { label: 'Kegiatan Belajar', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  libur: { label: 'Libur Sekolah', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  ppdb: { label: 'Agenda PPDB', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onSelectCalendarTab,
  onSelectArticlesTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<FeedNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Push notification states (persisten per browser HP untuk semua akun)
  const [pushSupported, setPushSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [devicePushActive, setDevicePushActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isGranted = 'Notification' in window && Notification.permission === 'granted';
    const isStored = localStorage.getItem('mrh_push_subscribed') === 'true';
    return isGranted || isStored;
  });
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Ambil data gabungan Kalender Akademik & Warta Berita
  const fetchFeed = async () => {
    try {
      setLoading(true);
      const [calRes, artRes] = await Promise.allSettled([
        fetch('/api/calendar', { cache: 'no-store' }),
        fetch('/api/articles', { cache: 'no-store' }),
      ]);

      const items: FeedNotificationItem[] = [];

      // Parse Agenda Kalender
      if (calRes.status === 'fulfilled' && calRes.value.ok) {
        const calData = await calRes.value.json();
        if (Array.isArray(calData)) {
          calData.forEach((ev: any) => {
            const cat = CATEGORY_STYLES[ev.category] || {
              label: 'Agenda',
              badge: 'bg-slate-50 text-slate-700 border-slate-200',
            };
            const idMatch = String(ev.id).match(/^ev-(\d+)$/);
            const ts = idMatch ? parseInt(idMatch[1], 10) : Date.now();
            items.push({
              id: ev.id || `ev-${ts}`,
              type: 'calendar',
              title: ev.title,
              subtitle: ev.description || ev.date_range,
              dateStr: `${ev.date_range} (${ev.semester})`,
              categoryLabel: cat.label,
              categoryBadge: cat.badge,
              timestamp: ts,
            });
          });
        }
      }

      // Parse Warta Berita Terbaru
      if (artRes.status === 'fulfilled' && artRes.value.ok) {
        const artData = await artRes.value.json();
        if (Array.isArray(artData)) {
          // Ambil maksimal 5 warta berita terbaru
          artData.slice(0, 5).forEach((art: any) => {
            const ts = art.created_at ? new Date(art.created_at).getTime() : Date.now();
            items.push({
              id: art.id || `art-${art.slug}`,
              type: 'article',
              title: art.title,
              subtitle: art.summary || art.content?.slice(0, 120) || 'Warta berita madrasah.',
              dateStr: art.date || 'Warta Terbaru',
              categoryLabel: `Warta: ${art.category || 'Madrasah'}`,
              categoryBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              url: `/warta/${art.slug}`,
              timestamp: ts,
            });
          });
        }
      }

      // Urutkan item dari yang paling baru
      items.sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(items);
      calculateUnread(items);
    } catch (err) {
      console.warn('Failed to load notifications feed:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Hitung jumlah item belum dibaca
  const calculateUnread = (items: FeedNotificationItem[]) => {
    const savedTime =
      localStorage.getItem('mrh_last_read_feed_time') ||
      localStorage.getItem('mrh_last_read_calendar_time');
    const lastRead = savedTime ? parseInt(savedTime, 10) : 0;

    if (!savedTime) {
      setUnreadCount(Math.min(items.length, 3));
    } else {
      const unread = items.filter((item) => item.timestamp > lastRead).length;
      setUnreadCount(unread);
    }
  };

  // 3. Cek status Web Push & sinkronisasi otomatis token ponsel (berlaku untuk semua akun di browser/HP yang sama)
  const checkPushStateAndSync = async () => {
    const supported = await isPushNotificationSupported();
    setPushSupported(supported);
    if (supported) {
      const state = await getPushSubscriptionState();
      const isGranted =
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted';
      const isStoredActive =
        typeof window !== 'undefined' &&
        localStorage.getItem('mrh_push_subscribed') === 'true';

      const isDeviceActive = state.isSubscribed || isGranted || isStoredActive;
      setIsSubscribed(isDeviceActive);
      setDevicePushActive(isDeviceActive);

      if (isDeviceActive && typeof window !== 'undefined') {
        localStorage.setItem('mrh_push_subscribed', 'true');
      }

      // Jika izin browser sudah diberikan, sinkronkan token subscription ke Supabase di latar belakang
      if (isGranted) {
        syncPushSubscription().then((synced) => {
          if (synced) {
            setIsSubscribed(true);
            setDevicePushActive(true);
            if (typeof window !== 'undefined') {
              localStorage.setItem('mrh_push_subscribed', 'true');
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    fetchFeed();
    checkPushStateAndSync();

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4. Handle Aktifkan/Nonaktifkan Notifikasi Layar HP
  const handleTogglePush = async () => {
    setIsSubscribing(true);
    setPushStatusMessage(null);
    try {
      if (isSubscribed || devicePushActive) {
        const res = await unsubscribeFromPushNotifications();
        if (res.success) {
          setIsSubscribed(false);
          setDevicePushActive(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('mrh_push_subscribed');
          }
          setPushStatusMessage('Notifikasi layar HP dinonaktifkan.');
        } else {
          setPushStatusMessage(res.message);
        }
      } else {
        const res = await subscribeToPushNotifications();
        if (res.success) {
          setIsSubscribed(true);
          setDevicePushActive(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mrh_push_subscribed', 'true');
          }
          setPushStatusMessage('Notifikasi layar HP berhasil diaktifkan.');
        } else {
          setPushStatusMessage(res.message);
        }
      }
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setPushStatusMessage(null), 3500);
    }
  };

  // 6. Tandai semua sudah dibaca
  const handleMarkAllRead = () => {
    const now = Date.now();
    localStorage.setItem('mrh_last_read_feed_time', now.toString());
    localStorage.setItem('mrh_last_read_calendar_time', now.toString());
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Tombol Lonceng Notifikasi */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchFeed();
            checkPushStateAndSync();
          }
        }}
        className="relative p-2 rounded-xl text-slate-700 hover:text-[#1e3a8a] bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
        title="Pemberitahuan, Warta & Agenda Madrasah"
        aria-label="Pemberitahuan, Warta & Agenda Madrasah"
      >
        <Bell className="w-4 h-4 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[9.5px] font-extrabold text-white ring-2 ring-white animate-in zoom-in-50 duration-150">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop Gelap Khusus Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-2xs z-40 sm:hidden"
            />

            {/* Panel Notifikasi (Mobile: Rata Tengah dengan Margin Presisi, Desktop: Dropdown Kanan) */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-3 top-16 sm:inset-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-[420px] max-h-[82vh] sm:max-h-[580px] rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 flex flex-col text-slate-800 overflow-hidden"
              style={{ transformOrigin: 'top right' }}
            >
              {/* Header Panel */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-900 tracking-tight truncate">
                    Pemberitahuan & Warta
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Tandai semua sudah dibaca"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Tandai Dibaca</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Tutup Panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pesan Feedback Singkat (Muncul sesaat setelah pengguna klik Izinkan, lalu hilang otomatis) */}
              {pushStatusMessage && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 text-[11px] font-semibold text-blue-900 flex items-center justify-between animate-in fade-in">
                  <span>{pushStatusMessage}</span>
                  <button
                    type="button"
                    onClick={() => setPushStatusMessage(null)}
                    className="text-blue-500 hover:text-blue-800 p-0.5"
                    aria-label="Tutup pesan"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Ajakan Aktifkan Notifikasi Layar HP:
                  HANYA muncul jika perangkat/HP ini BELUM PERNAH mengaktifkan notifikasi sama sekali.
                  Begitu diaktifkan oleh salah satu akun (Admin/Guru/Siswa), ajakan ini HILANG SELAMANYA di HP ini
                  dan TIDAK AKAN menampilkan bar status yang mengganggu. */}
              {!devicePushActive && !isSubscribed && pushSupported && (
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 shrink-0">
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Smartphone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-bold text-slate-900 leading-tight">
                          Aktifkan Notifikasi HP
                        </p>
                        <p className="text-[10px] text-slate-500 leading-tight truncate">
                          Muncul di bilah status layar saat ada warta &amp; agenda baru
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isSubscribing}
                      onClick={handleTogglePush}
                      className="px-2.5 py-1.5 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white text-[11px] font-bold transition-all shrink-0 active:scale-95 shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      {isSubscribing ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span>Izinkan</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Feed Notifikasi Gabungan (Scrollable) */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading && notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Memuat informasi madrasah...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Belum ada pemberitahuan atau warta terbaru.
                  </div>
                ) : (
                  notifications.map((item) => {
                    const isArticle = item.type === 'article';
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (isArticle && onSelectArticlesTab) {
                            onSelectArticlesTab();
                            setIsOpen(false);
                          } else if (!isArticle && onSelectCalendarTab) {
                            onSelectCalendarTab();
                            setIsOpen(false);
                          } else if (item.url) {
                            window.open(item.url, '_blank');
                          }
                        }}
                        className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${item.categoryBadge}`}
                          >
                            {item.categoryLabel}
                          </span>
                          <span className="text-[10.5px] font-medium text-slate-400">
                            {item.dateStr}
                          </span>
                        </div>

                        <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-slate-500">
                          {isArticle ? (
                            <Newspaper className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                          <span className="line-clamp-2 leading-relaxed">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Panel Navigasi Cepat */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
                {onSelectCalendarTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCalendarTab();
                      setIsOpen(false);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-[#1e3a8a] hover:bg-blue-100/60 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                  >
                    <span>Kalender Akademik</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
                {onSelectArticlesTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectArticlesTab();
                      setIsOpen(false);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-200/70 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                  >
                    <span>Kelola Warta</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
