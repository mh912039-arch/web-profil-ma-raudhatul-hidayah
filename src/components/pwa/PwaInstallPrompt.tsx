'use client';

import React, { useEffect, useState } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallPrompt({
  variant = 'floating',
  className = '',
}: {
  variant?: 'floating' | 'button' | 'banner';
  className?: string;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Daftarkan Service Worker untuk PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
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
      // Fallback jika browser desktop belum memicu event
      alert('Untuk memasang di perangkat ini, buka menu peramban (titik tiga) lalu pilih "Instal Aplikasi" atau "Tambahkan ke Layar Utama".');
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

  // Jangan tampilkan jika sudah dalam mode standalone aplikasi
  if (isStandalone && !installedSuccess) {
    return null;
  }

  // Variant: Inline Button (untuk header admin atau halaman login)
  if (variant === 'button') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-transform active:scale-[0.98] ${className}`}
          title="Pasang Aplikasi Portal Madrasah di Layar Utama"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Pasang Aplikasi</span>
        </button>

        {showIosGuide && (
          <IosInstallModal onClose={() => setShowIosGuide(false)} />
        )}
      </>
    );
  }

  // Variant: Banner (untuk halaman login)
  if (variant === 'banner') {
    if (isDismissed) return null;

    return (
      <>
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md border border-blue-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <Smartphone className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">
                Pasang Aplikasi Portal Madrasah
              </h4>
              <p className="text-[11px] text-blue-200 mt-0.5 leading-relaxed">
                Akses jadwal pelajaran & data akademik langsung dari layar utama HP tanpa perlu membuka web profil.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-blue-950 text-xs font-bold hover:bg-blue-50 transition-transform active:scale-[0.98] shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              <span>Instal Sekarang</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-2 text-blue-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Tutup pemberitahuan"
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

  // Variant: Floating (Widget mengambang di sudut bawah)
  if (isDismissed && !installedSuccess) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
        {installedSuccess ? (
          <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-emerald-500">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
            <span>Aplikasi Portal berhasil terpasang di perangkat Anda!</span>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl flex items-start gap-3 text-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                Instal Aplikasi Portal
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Buka portal dan jadwal mengajar langsung dari layar HP tanpa repot buka web sekolah.
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-2xs transition-transform active:scale-[0.98]"
                >
                  <Download className="w-3 h-3" />
                  <span>Pasang Sekarang</span>
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-medium"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 p-1 -mt-1 -mr-1"
              aria-label="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900">Pasang di iPhone / iPad</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Browser Safari di iPhone mendukung instalasi mandiri melalui langkah mudah berikut:
        </p>

        <ol className="space-y-2.5 text-xs text-slate-700">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
              1
            </span>
            <span>
              Ketuk ikon <strong className="text-slate-900">Bagikan (Share)</strong> <Share className="inline w-3.5 h-3.5 text-blue-600 mx-0.5" /> di menu bawah Safari.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
              2
            </span>
            <span>
              Gulir ke bawah lalu pilih menu <strong className="text-slate-900">Tambahkan ke Layar Utama</strong> (<em>Add to Home Screen</em>) <PlusSquare className="inline w-3.5 h-3.5 text-blue-600 mx-0.5" />.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
              3
            </span>
            <span>
              Ketuk <strong className="text-slate-900">Tambah</strong> di sudut kanan atas. Ikon portal madrasah siap dibuka kapan saja!
            </span>
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-transform active:scale-[0.98]"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}
