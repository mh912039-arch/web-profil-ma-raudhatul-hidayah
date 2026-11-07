'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home, LogIn } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for telemetry / diagnosis
    console.error('[Admin Runtime Error]', error);
  }, [error]);

  const handleClearAndLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mrh_admin_auth');
      localStorage.removeItem('mrh_user_role');
      localStorage.removeItem('mrh_username');
      localStorage.removeItem('mrh_email');
      localStorage.removeItem('mrh_last_active_time');
      window.location.href = '/masuk';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/70">
          <AlertCircle className="w-6 h-6 stroke-[1.75]" />
        </div>

        <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          Gagal Memuat Panel Admin
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Terjadi kendala pada komponen antarmuka admin. Silakan coba muat ulang atau masuk kembali ke akun Anda.
        </p>

        {error?.message && (
          <div className="mb-6 p-3 bg-slate-50 rounded-lg text-left border border-slate-200">
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
              Detail Diagnostik
            </p>
            <p className="text-xs font-mono text-rose-600 break-words line-clamp-3">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 text-white font-medium text-sm hover:bg-blue-800 active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-4 h-4 stroke-[2]" />
            <span>Muat Ulang Halaman</span>
          </button>

          <button
            type="button"
            onClick={handleClearAndLogin}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 active:scale-[0.98] transition-all"
          >
            <LogIn className="w-4 h-4 stroke-[2]" />
            <span>Login Ulang Akun</span>
          </button>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-slate-500 font-medium text-xs hover:text-slate-800 transition-colors pt-1"
          >
            <Home className="w-3.5 h-3.5 stroke-[2]" />
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
