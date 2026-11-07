'use client';

import React from 'react';
import { Clock, ShieldAlert, Check, LogOut } from 'lucide-react';

interface IdleTimeoutModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  onExtend: () => void;
  onLogout: () => void;
}

export const IdleTimeoutModal: React.FC<IdleTimeoutModalProps> = ({
  isOpen,
  remainingSeconds,
  onExtend,
  onLogout,
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="idle-title"
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200/90 text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Security Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
          <Clock className="w-7 h-7 stroke-[1.8] animate-pulse" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-800 text-[11px] font-bold tracking-wide">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Keamanan Akun Madrasah</span>
          </div>
          <h3 id="idle-title" className="text-xl font-bold text-slate-900 tracking-tight">
            Sesi Tidak Aktif
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-sm mx-auto">
            Tidak ada aktivitas terdeteksi. Demi mencegah akses tidak sah jika komputer ditinggalkan, sesi Anda akan otomatis keluar dalam:
          </p>
        </div>

        {/* Countdown Badge */}
        <div className="py-3 px-5 rounded-2xl bg-slate-50 border border-slate-200/90 w-fit mx-auto shadow-inner">
          <span className="font-mono text-3xl font-extrabold text-amber-600 tracking-wider">
            {timeFormatted}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onExtend}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2]" />
            <span>Tetap Masuk</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 active:scale-[0.98] border border-slate-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sekarang</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Gerakkan mouse, ketik, atau tekan sembarang tombol untuk melanjutkan sesi.
        </p>
      </div>
    </div>
  );
};
