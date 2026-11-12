'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCheck,
  Calendar,
  Sparkles,
  Smartphone,
  ShieldCheck,
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
} from '@/lib/pushClient';

interface CalendarEvent {
  id: string;
  title: string;
  date_range: string;
  semester: string;
  category: 'ujian' | 'libur' | 'ppdb' | 'kegiatan';
  description?: string;
}

interface NotificationCenterProps {
  onSelectCalendarTab?: () => void;
}

const CATEGORY_STYLES: Record<string, { label: string; badge: string }> = {
  ujian: { label: 'Ujian', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  kegiatan: { label: 'Kegiatan Belajar', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  libur: { label: 'Libur Semester', badge: 'bg-rose-100 text-rose-800 border-rose-200' },
  ppdb: { label: 'Agenda PPDB', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onSelectCalendarTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(0);

  // Push notification states
  const [pushSupported, setPushSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Ambil data agenda kalender
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/calendar', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setEvents(data);
          calculateUnread(data);
        }
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Hitung jumlah item belum dibaca
  const calculateUnread = (items: CalendarEvent[]) => {
    const savedTime = localStorage.getItem('mrh_last_read_calendar_time');
    const lastRead = savedTime ? parseInt(savedTime, 10) : 0;
    setLastReadTimestamp(lastRead);

    // Hitung item yang id atau urutannya lebih baru dari timestamp terakhir
    if (!savedTime) {
      setUnreadCount(Math.min(items.length, 3));
    } else {
      // Jika sudah pernah baca, hitung event dengan id timestamp baru (jika format id: ev-timestamp)
      const unread = items.filter((ev) => {
        const idMatch = ev.id.match(/^ev-(\d+)$/);
        if (idMatch && idMatch[1]) {
          const itemTime = parseInt(idMatch[1], 10);
          return itemTime > lastRead;
        }
        return false;
      }).length;
      setUnreadCount(unread);
    }
  };

  // 3. Cek status Web Push
  const checkPushState = async () => {
    const supported = await isPushNotificationSupported();
    setPushSupported(supported);
    if (supported) {
      const state = await getPushSubscriptionState();
      setIsSubscribed(state.isSubscribed);
    }
  };

  useEffect(() => {
    fetchEvents();
    checkPushState();

    // Tutup panel jika klik di luar
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4. Handle Aktifkan Notifikasi Layar HP
  const handleTogglePush = async () => {
    setIsSubscribing(true);
    setPushStatusMessage(null);
    try {
      if (isSubscribed) {
        const res = await unsubscribeFromPushNotifications();
        if (res.success) {
          setIsSubscribed(false);
          setPushStatusMessage('Notifikasi layar HP dinonaktifkan.');
        } else {
          setPushStatusMessage(res.message);
        }
      } else {
        const res = await subscribeToPushNotifications();
        if (res.success) {
          setIsSubscribed(true);
          setPushStatusMessage('Notifikasi layar HP aktif.');
        } else {
          setPushStatusMessage(res.message);
        }
      }
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setPushStatusMessage(null), 4000);
    }
  };

  // 5. Tandai semua sudah dibaca
  const handleMarkAllRead = () => {
    const now = Date.now();
    localStorage.setItem('mrh_last_read_calendar_time', now.toString());
    setLastReadTimestamp(now);
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
            fetchEvents();
            checkPushState();
          }
        }}
        className="relative p-2 rounded-xl text-slate-600 hover:text-[#1e3a8a] bg-slate-50 hover:bg-blue-50/70 border border-slate-200/60 transition-all active:scale-95 cursor-pointer shadow-2xs"
        title="Pemberitahuan & Agenda Madrasah"
        aria-label="Pemberitahuan & Agenda Madrasah"
      >
        <Bell className="w-4 h-4 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[9.5px] font-extrabold text-white ring-2 ring-white animate-in zoom-in-50 duration-150">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel Dropdown Notifikasi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-2xl z-50 overflow-hidden text-slate-800"
            style={{ transformOrigin: 'top right' }}
          >
            {/* Header Panel */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  Pemberitahuan & Agenda
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {unreadCount} Baru
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Tandai semua sudah dibaca"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Tandai Dibaca</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
                  aria-label="Tutup Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Banner Fitur Opsi A: Web Push Notification HP */}
            <div className="p-3 bg-gradient-to-r from-blue-50/80 to-slate-50 border-b border-slate-100">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-[#1e3a8a] text-white shrink-0 mt-0.5 shadow-2xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[12px] font-bold text-slate-900 leading-tight">
                        Notifikasi Layar HP
                      </h4>
                      {isSubscribed && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      {isSubscribed
                        ? 'Ponsel Anda akan menerima pesan setiap kali ada agenda kalender terbaru.'
                        : 'Dapatkan pemberitahuan di bilah layar HP setiap ada agenda akademik baru.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button Push */}
              {pushSupported ? (
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSubscribing}
                    onClick={handleTogglePush}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                      isSubscribed
                        ? 'bg-slate-200/70 hover:bg-rose-50 hover:text-rose-700 text-slate-700'
                        : 'bg-[#1e3a8a] hover:bg-[#172554] text-white active:scale-98'
                    }`}
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menghubungkan...</span>
                      </>
                    ) : isSubscribed ? (
                      <span>Nonaktifkan Notifikasi HP</span>
                    ) : (
                      <span>Aktifkan Notifikasi Layar HP</span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="mt-2 text-[10.5px] text-slate-400 italic">
                  Pasang aplikasi ke layar utama (PWA) untuk mendukung notifikasi layar HP.
                </div>
              )}

              {pushStatusMessage && (
                <p className="text-[10.5px] font-semibold text-blue-700 mt-1.5 animate-in fade-in">
                  {pushStatusMessage}
                </p>
              )}
            </div>

            {/* List Agenda & Notifikasi */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100">
              {loading && events.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Memuat agenda...</span>
                </div>
              ) : events.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  Belum ada agenda kegiatan dalam kalender akademik.
                </div>
              ) : (
                events.slice(0, 6).map((ev) => {
                  const cat = CATEGORY_STYLES[ev.category] || {
                    label: ev.category,
                    badge: 'bg-slate-100 text-slate-800 border-slate-200',
                  };

                  return (
                    <div
                      key={ev.id}
                      onClick={() => {
                        if (onSelectCalendarTab) {
                          onSelectCalendarTab();
                          setIsOpen(false);
                        }
                      }}
                      className="p-3.5 hover:bg-slate-50/90 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border uppercase ${cat.badge}`}
                        >
                          {cat.label}
                        </span>
                        <span className="text-[10.5px] font-medium text-slate-400">
                          {ev.semester}
                        </span>
                      </div>

                      <h5 className="text-[12.5px] font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors leading-snug">
                        {ev.title}
                      </h5>

                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-slate-600">
                        <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>{ev.date_range}</span>
                      </div>

                      {ev.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {ev.description}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Panel */}
            {onSelectCalendarTab && (
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCalendarTab();
                    setIsOpen(false);
                  }}
                  className="w-full py-1.5 px-3 rounded-xl text-xs font-bold text-[#1e3a8a] hover:bg-blue-100/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buka Kalender Akademik Lengkap</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
