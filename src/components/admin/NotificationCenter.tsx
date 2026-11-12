'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCheck,
  Calendar,
  Smartphone,
  ShieldCheck,
  X,
  ExternalLink,
  Loader2,
  ChevronRight,
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
  ujian: { label: 'Ujian', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  kegiatan: { label: 'Kegiatan Belajar', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  libur: { label: 'Libur Semester', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  ppdb: { label: 'Agenda PPDB', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onSelectCalendarTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

    if (!savedTime) {
      setUnreadCount(Math.min(items.length, 3));
    } else {
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
      if (isSubscribed) {
        const res = await unsubscribeFromPushNotifications();
        if (res.success) {
          setIsSubscribed(false);
          setPushStatusMessage('Notifikasi layar HP dimatikan.');
        } else {
          setPushStatusMessage(res.message);
        }
      } else {
        const res = await subscribeToPushNotifications();
        if (res.success) {
          setIsSubscribed(true);
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

  // 5. Tandai semua sudah dibaca
  const handleMarkAllRead = () => {
    const now = Date.now();
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
            fetchEvents();
            checkPushState();
          }
        }}
        className="relative p-2 rounded-xl text-slate-700 hover:text-[#1e3a8a] bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 transition-all active:scale-95 cursor-pointer shadow-2xs"
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
              className="fixed inset-x-3 top-16 sm:inset-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-[400px] max-h-[82vh] sm:max-h-[580px] rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 flex flex-col text-slate-800 overflow-hidden"
              style={{ transformOrigin: 'top right' }}
            >
              {/* Header Panel */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-[13px] font-bold text-slate-900 tracking-tight truncate">
                    Pemberitahuan & Agenda
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

              {/* Ajakan Aktifkan Notifikasi Layar HP (Otomatis hilang jika sudah diaktifkan) */}
              {!isSubscribed && pushSupported && (
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
                          Muncul di bilah atas layar saat ada agenda baru
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

                  {pushStatusMessage && (
                    <p className="text-[10.5px] font-semibold text-blue-700 mt-1.5 animate-in fade-in">
                      {pushStatusMessage}
                    </p>
                  )}
                </div>
              )}

              {/* Feedback toast singkat saat baru saja mengaktifkan */}
              {isSubscribed && pushStatusMessage && (
                <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-[11px] font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{pushStatusMessage}</span>
                </div>
              )}

              {/* Daftar Agenda Kegiatan (Scrollable dengan scrollbar halus) */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {loading && events.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Memuat agenda madrasah...</span>
                  </div>
                ) : events.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Belum ada agenda kegiatan dalam kalender akademik.
                  </div>
                ) : (
                  events.slice(0, 8).map((ev) => {
                    const cat = CATEGORY_STYLES[ev.category] || {
                      label: ev.category,
                      badge: 'bg-slate-50 text-slate-700 border-slate-200',
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
                        className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${cat.badge}`}
                          >
                            {cat.label}
                          </span>
                          <span className="text-[10.5px] font-medium text-slate-400">
                            {ev.semester}
                          </span>
                        </div>

                        <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors leading-snug">
                          {ev.title}
                        </h4>

                        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{ev.date_range}</span>
                        </div>

                        {ev.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
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
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCalendarTab();
                      setIsOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-[#1e3a8a] hover:bg-blue-100/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <span>Buka Kalender Akademik Lengkap</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
