'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseIdleTimeoutOptions {
  /**
   * Batas waktu tidak aktif (idle timeout) dalam milidetik.
   * Default: 30 menit (30 * 60 * 1000 = 1.800.000 ms)
   */
  timeoutMs?: number;

  /**
   * Durasi sebelum timeout ketika modal peringatan mulai ditampilkan (dalam milidetik).
   * Default: 2 menit (2 * 60 * 1000 = 120.000 ms)
   */
  warningMs?: number;

  /**
   * Callback yang dieksekusi saat sesi habis karena tidak ada aktivitas.
   */
  onTimeout: () => void;

  /**
   * Callback opsional saat periode peringatan dimulai.
   */
  onWarning?: () => void;

  /**
   * Apakah pengawasan idle aktif (misalnya hanya aktif saat user terotentikasi).
   * Default: true
   */
  enabled?: boolean;
}

export const STORAGE_KEY_LAST_ACTIVE = 'mrh_last_active_time';
export const STORAGE_KEY_LOGGED_OUT = 'mrh_session_terminated';

/**
 * Hook untuk memantau aktivitas pengguna dan memicu auto-logout jika idle.
 * Mendukung sinkronisasi multi-tab lewat localStorage dan wake-up detection saat laptop/layar dibuka kembali.
 */
export function useIdleTimeout({
  timeoutMs = 30 * 60 * 1000, // 30 Menit
  warningMs = 2 * 60 * 1000,  // 2 Menit peringatan sebelum logout
  onTimeout,
  onWarning,
  enabled = true,
}: UseIdleTimeoutOptions) {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(Math.ceil(timeoutMs / 1000));

  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const onWarningRef = useRef(onWarning);
  onWarningRef.current = onWarning;

  const lastUpdateRef = useRef<number>(Date.now());
  const isLoggedOutRef = useRef<boolean>(false);

  // Perbarui timestamp aktivitas secara aman dengan throttling (maksimal 1x per 3 detik)
  const recordActivity = useCallback(() => {
    if (!enabled || isLoggedOutRef.current) return;
    const now = Date.now();
    if (now - lastUpdateRef.current > 3000) {
      lastUpdateRef.current = now;
      try {
        localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, String(now));
      } catch {}
      // Jika peringatan sedang muncul dan user aktif kembali, tutup peringatan
      setIsWarningOpen(false);
    }
  }, [enabled]);

  // Fungsi untuk memperpanjang sesi secara eksplisit (tombol 'Tetap Masuk')
  const extendSession = useCallback(() => {
    const now = Date.now();
    lastUpdateRef.current = now;
    try {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, String(now));
    } catch {}
    setIsWarningOpen(false);
    setRemainingSeconds(Math.ceil(timeoutMs / 1000));
  }, [timeoutMs]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    isLoggedOutRef.current = false;
    const initialTime = Date.now();
    lastUpdateRef.current = initialTime;
    try {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, String(initialTime));
    } catch {}

    // Event listener interaksi pengguna
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click', 'wheel'];
    const handleUserInteraction = () => {
      recordActivity();
    };

    events.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });

    // Sinkronisasi antar-tab via StorageEvent
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_LAST_ACTIVE && e.newValue) {
        const remoteTime = parseInt(e.newValue, 10);
        if (!isNaN(remoteTime) && remoteTime > lastUpdateRef.current) {
          lastUpdateRef.current = remoteTime;
          setIsWarningOpen(false);
        }
      } else if (e.key === STORAGE_KEY_LOGGED_OUT && e.newValue) {
        // Tab lain telah logout karena timeout
        isLoggedOutRef.current = true;
        onTimeoutRef.current();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Evaluasi timer idle secara berkala
    const checkIdle = () => {
      if (isLoggedOutRef.current) return;

      // Sinkronkan dengan data terbaru dari localStorage (jika user aktif di tab lain)
      try {
        const stored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVE);
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed) && parsed > lastUpdateRef.current) {
            lastUpdateRef.current = parsed;
          }
        }
      } catch {}

      const now = Date.now();
      const elapsed = now - lastUpdateRef.current;
      const remainingSec = Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000));

      // Jika waktu idle melebihi batas (30 menit)
      if (elapsed >= timeoutMs) {
        isLoggedOutRef.current = true;
        setIsWarningOpen(false);
        try {
          localStorage.setItem(STORAGE_KEY_LOGGED_OUT, String(now));
        } catch {}
        onTimeoutRef.current();
        return;
      }

      // Jika memasuki rentang peringatan (2 menit terakhir)
      const warningThreshold = timeoutMs - warningMs;
      if (elapsed >= warningThreshold) {
        setRemainingSeconds(remainingSec);
        setIsWarningOpen(true);
        if (onWarningRef.current) {
          onWarningRef.current();
        }
      } else {
        setIsWarningOpen(false);
        setRemainingSeconds(remainingSec);
      }
    };

    // Jalankan pengecekan setiap 1 detik
    const timerInterval = setInterval(checkIdle, 1000);

    // Tangani saat layar/laptop dibuka kembali (wake-up detection)
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        checkIdle();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
      });
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      clearInterval(timerInterval);
    };
  }, [enabled, timeoutMs, warningMs, recordActivity]);

  return {
    isWarningOpen,
    remainingSeconds,
    extendSession,
  };
}
