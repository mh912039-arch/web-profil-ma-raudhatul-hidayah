'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Application Runtime Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200/70">
          <AlertCircle className="w-6 h-6 stroke-[1.75]" />
        </div>

        <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          Terjadi Kendala Memuat Halaman
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Sistem mendeteksi kendala saat merender komponen. Halaman dapat dimuat ulang secara otomatis.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 text-white font-medium text-sm hover:bg-blue-800 active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-4 h-4 stroke-[2]" />
            <span>Muat Ulang Halaman</span>
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
