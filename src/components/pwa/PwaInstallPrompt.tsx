'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { syncPushSubscription } from '@/lib/pushClient';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaInstallPromptProps {
  variant?: 'floating' | 'button' | 'banner';
  bottomOffset?: 'default' | 'nav';
  className?: string;
}

export function PwaInstallPrompt({
  variant = 'floating',
  bottomOffset = 'default',
  className = '',
}: PwaInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Daftarkan Service Worker untuk PWA & sinkronkan push token otomatis
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            syncPushSubscription().catch(() => {});
          }
        })
        .catch((err) => console.warn('Service Worker registration note:', err));
    }

    // 2. Cek apakah sudah berjalan dalam mode standalone (aplikasi terinstal)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();

    // 3. Deteksi perangkat iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 4. Cek apakah pernah ditutup oleh pengguna dalam 7 hari terakhir
    const dismissedTime = localStorage.getItem('mrh_pwa_dismissed');
    if (dismissedTime) {
      const elapsed = Date.now() - parseInt(dismissedTime, 10);
      if (elapsed < 7 * 24 * 3600 * 1000) {
        setIsDismissed(true);
      }
    }

    // 5. Tangkap event install prompt native dari browser (Android/Chrome/Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      setIsStandalone(true);
      setTimeout(() => setInstalledSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback ramah jika browser belum memicu event bawaan
      alert('Untuk memasang di perangkat ini, buka menu peramban (ikon titik tiga di kanan atas) lalu pilih "Instal Aplikasi" atau "Tambahkan ke Layar Utama".');
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      setTimeout(() => setInstalledSuccess(false), 4000);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('mrh_pwa_dismissed', String(Date.now()));
  };

  // Jangan tampilkan jika sudah dalam mode standalone aplikasi terpasang
  if (isStandalone && !installedSuccess) {
    return null;
  }

  // Variant: Inline Button (untuk header desktop)
  if (variant === 'button') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-transform active:scale-[0.98] ${className}`}
          title="Pasang Aplikasi MAS RH Mobile di Layar Utama"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="hidden sm:inline">Pasang MAS RH Mobile</span>
          <span className="sm:hidden text-[11px]">Pasang App</span>
        </button>

        {showIosGuide && (
          <IosInstallModal onClose={() => setShowIosGuide(false)} />
        )}
      </>
    );
  }

  // Variant: Banner (Compact Dark Card)
  if (variant === 'banner') {
    if (isDismissed) return null;

    return (
      <>
        <div
          className={`p-3 rounded-2xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 text-white shadow-lg flex items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-neutral-300 shadow-2xs">
              <Image
                src="/school-logo.png"
                alt="Logo MAS RH"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                MAS RH Mobile
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                Akses cepat di layar utama HP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all active:scale-[0.96] shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-neutral-950" />
              <span>Instal</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup pemberitahuan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showIosGuide && (
          <IosInstallModal onClose={() => setShowIosGuide(false)} />
        )}
      </>
    );
  }

  // Variant: Floating (Widget mengambang halus di bagian bawah)
  if (isDismissed && !installedSuccess) {
    return null;
  }

  const bottomPositionClass =
    bottomOffset === 'nav'
      ? 'bottom-20 lg:bottom-6'
      : 'bottom-4 sm:bottom-6';

  return (
    <>
      <div
        className={`fixed ${bottomPositionClass} left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200`}
      >
        {installedSuccess ? (
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-emerald-500">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            <span>Aplikasi MAS RH Mobile berhasil terpasang di perangkat Anda!</span>
          </div>
        ) : (
          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/80 shadow-[0_12px_36px_rgba(0,0,0,0.5)] rounded-2xl p-3 flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-neutral-300 shadow-2xs">
                <Image
                  src="/school-logo.png"
                  alt="Logo MAS RH"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h5 className="text-[13px] font-bold text-white leading-tight truncate">
                  MAS RH Mobile
                </h5>
                <p className="text-[11px] text-neutral-400 leading-snug truncate mt-0.5">
                  Pasang di layar utama HP Anda
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-200 transition-all active:scale-[0.96] shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-neutral-950" />
                <span>Instal</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showIosGuide && (
        <IosInstallModal onClose={() => setShowIosGuide(false)} />
      )}
    </>
  );
}

function IosInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-neutral-900 text-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-neutral-700 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
              <Image
                src="/school-logo.png"
                alt="Logo MAS RH"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="text-xs font-bold text-white">Pasang MAS RH Mobile di iOS</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Browser Safari di iPhone mendukung instalasi mandiri melalui 3 langkah mudah:
        </p>

        <ol className="space-y-2.5 text-xs text-neutral-300">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center shrink-0 text-[10px] border border-white/20">
              1
            </span>
            <span>
              Ketuk ikon <strong className="text-white">Bagikan (Share)</strong> <Share className="inline w-3.5 h-3.5 text-sky-400 mx-0.5" /> di menu bawah Safari.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center shrink-0 text-[10px] border border-white/20">
              2
            </span>
            <span>
              Gulir dan pilih <strong className="text-white">Tambahkan ke Layar Utama</strong> (<em>Add to Home Screen</em>) <PlusSquare className="inline w-3.5 h-3.5 text-sky-400 mx-0.5" />.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-white/10 text-white font-bold flex items-center justify-center shrink-0 text-[10px] border border-white/20">
              3
            </span>
            <span>
              Ketuk <strong className="text-white">Tambah</strong> di pojok kanan atas. Ikon aplikasi langsung siap di layar utama!
            </span>
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold transition-all active:scale-[0.98]"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}
