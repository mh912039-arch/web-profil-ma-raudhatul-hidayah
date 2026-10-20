'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface SchoolPortalLoginProps {
  onLoginSuccess?: (role: 'admin' | 'guru' | 'siswa') => void;
  defaultRole?: 'admin' | 'guru' | 'siswa';
}

export const SchoolPortalLogin: React.FC<SchoolPortalLoginProps> = ({
  onLoginSuccess,
  defaultRole = 'admin',
}) => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('admin@raudhatulhidayah.sch.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeDemo, setActiveDemo] = useState<'admin' | 'guru' | 'siswa'>('admin');

  const fillDemo = (role: 'admin' | 'guru' | 'siswa') => {
    setActiveDemo(role);
    setErrorMessage('');
    if (role === 'admin') {
      setIdentifier('admin@raudhatulhidayah.sch.id');
      setPassword('admin123');
    } else if (role === 'guru') {
      setIdentifier('198507122010011002');
      setPassword('guru2026');
    } else {
      setIdentifier('0084729105');
      setPassword('siswa2026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Silakan masukkan NISN, NIP, atau Email Anda.');
      return;
    }

    if (!password) {
      setErrorMessage('Kata sandi tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);

    // Simulate authenticating and redirecting
    setTimeout(() => {
      setIsSubmitting(false);

      const idLower = identifier.toLowerCase().trim();
      const isAdmin =
        idLower.includes('admin') ||
        idLower === 'tu' ||
        idLower === 'admin@raudhatulhidayah.sch.id' ||
        password === 'admin123' ||
        password === 'admin';

      const isGuru =
        idLower.startsWith('19') ||
        idLower.includes('guru') ||
        password === 'guru2026';

      if (isAdmin) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('mrh_admin_auth', 'true');
          localStorage.setItem('mrh_user_role', 'admin');
        }
        if (onLoginSuccess) {
          onLoginSuccess('admin');
        } else {
          router.push('/admin');
        }
      } else if (isGuru) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('mrh_admin_auth', 'true');
          localStorage.setItem('mrh_user_role', 'guru');
        }
        if (onLoginSuccess) {
          onLoginSuccess('guru');
        } else {
          router.push('/admin?tab=schedules');
        }
      } else {
        // Siswa: hanya bisa cek jadwal pelajaran
        if (typeof window !== 'undefined') {
          localStorage.setItem('mrh_admin_auth', 'true');
          localStorage.setItem('mrh_user_role', 'siswa');
        }
        if (onLoginSuccess) {
          onLoginSuccess('siswa');
        } else {
          router.push('/admin?tab=schedules');
        }
      }
    }, 350);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-[#f8fafc] px-4 py-10 font-sans text-slate-800 selection:bg-blue-900 selection:text-white">
      {/* Top Header: Official School Emblem & Title */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-center mx-auto mb-3.5 transition-transform hover:scale-105 duration-200">
          <Image
            src="/school-logo.png"
            alt="Logo MA Raudhatul Hidayah"
            width={64}
            height={64}
            className="w-auto h-auto max-h-16 object-contain"
            priority
          />
        </div>

        <h1 className="font-serif text-[22px] sm:text-[24px] font-bold text-slate-900 tracking-tight uppercase leading-snug">
          MA RAUDHATUL HIDAYAH
        </h1>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-[420px] bg-white rounded-3xl border border-slate-200/90 shadow-sm p-7 sm:p-8 relative">
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
            Masuk ke Sistem
          </h2>
          <p className="text-[13px] text-slate-500 mt-1">
            Silakan masukkan akun terdaftar Anda.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Identifier */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-bold text-slate-700">
              Email / Username / NISN / NIP
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan NISN, NIP, atau Email"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-[13.5px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all"
                required
              />
            </div>
          </div>

          {/* Field 2: Password */}
          <div className="space-y-1.5">
            <label className="block text-[12px] font-bold text-slate-700">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-[13.5px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button (MA Raudhatul Hidayah Navy Blue) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 sm:py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <span>Masuk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts Section ("Uji Coba Akun Demo") */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11.5px] mb-2.5">
            <span className="font-bold text-slate-700">Uji Coba Akun Demo:</span>
            <span className="text-slate-400 font-medium text-[11px]">Klik untuk isi</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Admin */}
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className={`p-2.5 rounded-xl border text-slate-700 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                activeDemo === 'admin'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600/30'
                  : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span className="text-[11.5px] font-bold">Admin</span>
            </button>

            {/* Guru */}
            <button
              type="button"
              onClick={() => fillDemo('guru')}
              className={`p-2.5 rounded-xl border text-slate-700 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                activeDemo === 'guru'
                  ? 'border-sky-600 bg-sky-50/70 text-sky-900 ring-1 ring-sky-600/30'
                  : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4 text-sky-700" />
              <span className="text-[11.5px] font-bold">Guru</span>
            </button>

            {/* Siswa */}
            <button
              type="button"
              onClick={() => fillDemo('siswa')}
              className={`p-2.5 rounded-xl border text-slate-700 transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                activeDemo === 'siswa'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-600/30'
                  : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span className="text-[11.5px] font-bold">Siswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Outbound Link back to website */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Website Profil</span>
        </Link>
      </div>
    </div>
  );
};
