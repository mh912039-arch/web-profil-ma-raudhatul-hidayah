'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  GraduationCap,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Info,
} from 'lucide-react';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';

interface SchoolPortalLoginProps {
  onLoginSuccess?: (role: 'admin' | 'guru' | 'siswa', username?: string) => void;
  defaultRole?: 'admin' | 'guru' | 'siswa';
}

export const SchoolPortalLogin: React.FC<SchoolPortalLoginProps> = ({
  onLoginSuccess,
  defaultRole = 'admin',
}) => {
  const router = useRouter();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // --- LOGIN STATES ---
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [warningAttempts, setWarningAttempts] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Hitung mundur live saat perangkat/akun terkunci oleh proteksi brute-force
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setErrorMessage('');
          setWarningAttempts(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const formatCountdown = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // --- REGISTER STATES ---
  const [regRole, setRegRole] = useState<'guru' | 'siswa'>('guru');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regNipNisn, setRegNipNisn] = useState('');
  const [regNote, setRegNote] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);
  const [regErrorMessage, setRegErrorMessage] = useState('');
  const [regSuccess, setRegSuccess] = useState<{
    name: string;
    roleLabel: string;
    email: string;
  } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    setErrorMessage('');
    setWarningAttempts(null);

    if (!identifier.trim()) {
      setErrorMessage('Silakan masukkan Username, NISN, NIP, atau Email Anda.');
      return;
    }

    if (!password) {
      setErrorMessage('Kata sandi tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      // Periksa status 429 atau indikator terkunci
      if (res.status === 429 || data.locked) {
        setLockoutSeconds(data.remainingSeconds || 900);
        setErrorMessage(
          data.message || 'Terlalu banyak percobaan masuk yang keliru. Akses dibatasi sementara.'
        );
        setWarningAttempts(null);
        return;
      }

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || 'Identitas atau kata sandi tidak cocok.');
        if (data.remainingAttempts && data.remainingAttempts <= 2) {
          setWarningAttempts(data.remainingAttempts);
        } else {
          setWarningAttempts(null);
        }
        return;
      }

      // Reset state lockout saat berhasil
      setLockoutSeconds(0);
      setWarningAttempts(null);

      // Simpan role di localStorage untuk sinkronisasi state instan di browser
      if (typeof window !== 'undefined') {
        localStorage.setItem('mrh_admin_auth', 'true');
        localStorage.setItem('mrh_user_role', data.role);
        if (data.username) {
          localStorage.setItem('mrh_username', data.username);
        }
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.role, data.username);
      } else {
        router.push('/admin');
      }
    } catch {
      setErrorMessage('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrorMessage('');

    if (!regName.trim() || regName.trim().length < 3) {
      setRegErrorMessage('Nama lengkap wajib diisi minimal 3 karakter.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegErrorMessage('Format alamat email tidak valid.');
      return;
    }

    if (!regPassword || regPassword.trim().length < 4) {
      setRegErrorMessage('Kata sandi wajib diisi minimal 4 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi di atas.');
      return;
    }

    setIsRegSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword.trim(),
          role: regRole,
          nip_nisn: regNipNisn.trim(),
          note: regNote.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setRegErrorMessage(data.message || 'Gagal mengirim pengajuan akun.');
        return;
      }

      setRegSuccess({
        name: regName.trim(),
        roleLabel: regRole === 'guru' ? 'Dewan Guru' : 'Santri / Siswa',
        email: regEmail.trim(),
      });

      // Reset form fields
      setRegName('');
      setRegEmail('');
      setRegNipNisn('');
      setRegNote('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch {
      setRegErrorMessage('Gagal menghubungi server. Periksa koneksi internet Anda.');
    } finally {
      setIsRegSubmitting(false);
    }
  };

  const isFormFilled = Boolean(identifier.trim() && password);

  return (
    <div className="min-h-[100dvh] bg-[#111214] text-white flex flex-col justify-between items-center px-5 py-6 sm:py-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-[420px] min-h-[100dvh] flex flex-col justify-between mx-auto">
        {/* =========================================================================
            TOP HEADER: MAS RH mobile (Tribute ke desain UNPAM Mobile)
        ========================================================================= */}
        <header className="pt-2 text-center select-none shrink-0">
          <div className="inline-block">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase block leading-none">
              MAS RH
            </h2>
            <span className="text-[11px] font-medium text-neutral-400 tracking-wider lowercase block text-right">
              mobile
            </span>
          </div>
        </header>

        {/* =========================================================================
            CENTER SECTION: LOGIN / REGISTER / SUCCESS VIEW
        ========================================================================= */}
        <main className="my-auto py-4 sm:py-6 w-full">
          {/* VIEW 1: REGISTRASI SUKSES */}
          {regSuccess ? (
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-2xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
                  Menunggu Konfirmasi Admin
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Pendaftaran Terkirim
                </h1>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Permohonan akun untuk{' '}
                  <span className="font-bold text-white">{regSuccess.name}</span> sebagai{' '}
                  <span className="font-bold text-sky-400">{regSuccess.roleLabel}</span> telah masuk ke antrean verifikasi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Email:</span>
                  <span className="font-mono font-bold text-white">{regSuccess.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Status:</span>
                  <span className="font-bold text-amber-300">Menunggu Persetujuan</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIdentifier(regSuccess.email);
                  setRegSuccess(null);
                  setAuthMode('login');
                }}
                className="w-full py-3.5 rounded-xl bg-white text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-100 active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Login</span>
              </button>
            </div>
          ) : authMode === 'login' ? (
            /* VIEW 2: LOGIN FORM (UNPAM Mobile Layout Adaptasi MAS RH) */
            <div className="animate-in fade-in duration-200">
              {/* Heading Sesuai Screenshot */}
              <div className="mb-6 sm:mb-8 text-left">
                <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-tight">
                  Selamat Datang<br />
                  Login ke Akun Anda
                </h1>
                <p className="text-[13px] sm:text-[13.5px] text-neutral-400 mt-2 leading-relaxed">
                  Login untuk memulai perjalanan anda di Madrasah Aliyah Raudlatul Hidayah
                </p>
              </div>

              {/* Alert / Lockout Banner */}
              {lockoutSeconds > 0 ? (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Akses Dibatasi Sementara</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-[12px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatCountdown(lockoutSeconds)}</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-neutral-300 leading-relaxed">
                    Percobaan salah tercapai. Formulir ditangguhkan sementara demi keamanan data madrasah.
                  </p>
                </div>
              ) : errorMessage ? (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="leading-relaxed">{errorMessage}</p>
                    {warningAttempts && warningAttempts <= 2 && (
                      <p className="mt-1 text-[11px] font-semibold text-amber-300">
                        Kesempatan tersisa {warningAttempts} kali sebelum terkunci sementara.
                      </p>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Login Form Inputs */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {/* Field 1: Username */}
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={lockoutSeconds > 0}
                    placeholder="Username"
                    aria-label="Username"
                    className="w-full px-4 py-3.5 rounded-xl border border-neutral-600/90 bg-neutral-900/40 text-white text-[15px] placeholder:text-neutral-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-150 disabled:opacity-50"
                    required
                  />
                </div>

                {/* Field 2: Password */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={lockoutSeconds > 0}
                    placeholder="Password"
                    aria-label="Password"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-neutral-600/90 bg-neutral-900/40 text-white text-[15px] placeholder:text-neutral-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-150 font-mono disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={lockoutSeconds > 0}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer disabled:opacity-40"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-5 h-5 stroke-[1.8]" />
                    )}
                  </button>
                </div>

                {/* Action Button: Login */}
                <button
                  type="submit"
                  disabled={isSubmitting || lockoutSeconds > 0}
                  className={`w-full py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-150 active:scale-[0.98] select-none flex items-center justify-center gap-2 cursor-pointer ${
                    isFormFilled && !isSubmitting && lockoutSeconds === 0
                      ? 'bg-white text-neutral-950 shadow-md hover:bg-neutral-100'
                      : 'bg-[#c5c5c8] text-neutral-600 hover:bg-[#d0d0d4]'
                  } disabled:cursor-not-allowed`}
                >
                  {lockoutSeconds > 0 ? (
                    <>
                      <Lock className="w-4 h-4 text-neutral-600" />
                      <span>Terkunci ({formatCountdown(lockoutSeconds)})</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </form>

              {/* Information Text Under Button Sesuai Screenshot */}
              <div className="mt-3.5 flex items-start gap-2 text-[11.5px] text-neutral-400 leading-relaxed">
                <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5 stroke-[1.8]" />
                <span>
                  Gunakan username dan password yang sama dengan akun Web Portal MAS RH.
                </span>
              </div>

              {/* Prompt Daftar Akun Baru untuk Guru / Santri */}
              <div className="mt-6 text-center pt-2">
                <p className="text-[12px] text-neutral-400">
                  Belum memiliki akun dewan guru atau santri?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setRegErrorMessage('');
                      setAuthMode('register');
                    }}
                    className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Daftar Akun Baru
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* VIEW 3: REGISTER FORM (Dark Theme Adaptif) */
            <div className="animate-in fade-in duration-200">
              <div className="mb-5 text-left">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  Registrasi Akun Baru
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Daftar Akses Portal
                </h1>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Khusus Dewan Guru dan Santri/Siswa. Akun akan ditinjau langsung oleh Administrator Madrasah.
                </p>
              </div>

              {/* Error Alert */}
              {regErrorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{regErrorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {/* Role Toggle */}
                <div>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-900/80 border border-neutral-700/80 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setRegRole('guru')}
                      className={`py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        regRole === 'guru'
                          ? 'bg-white text-neutral-950 shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Dewan Guru</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('siswa')}
                      className={`py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        regRole === 'siswa'
                          ? 'bg-white text-neutral-950 shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Santri / Siswa</span>
                    </button>
                  </div>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={
                      regRole === 'guru'
                        ? 'Nama Lengkap & Gelar (Cth: Jakaria, S.Pd.I)'
                        : 'Nama Lengkap Santri / Siswa'
                    }
                    className="w-full px-3.5 py-3 rounded-xl border border-neutral-600/90 bg-neutral-900/40 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>

                {/* NIP / NISN & Info Tambahan */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={regNipNisn}
                    onChange={(e) => setRegNipNisn(e.target.value)}
                    placeholder={regRole === 'guru' ? 'NIP / NUPTK' : 'NISN / NISM'}
                    className="w-full px-3 py-3 rounded-xl border border-neutral-600/90 bg-neutral-900/40 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
                  />
                  <input
                    type="text"
                    value={regNote}
                    onChange={(e) => setRegNote(e.target.value)}
                    placeholder={regRole === 'guru' ? 'Mata Pelajaran' : 'Kelas (Cth: X)'}
                    className="w-full px-3 py-3 rounded-xl border border-neutral-600/90 bg-neutral-900/40 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>

                {/* Email Resmi */}
                <div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Email aktif (untuk akses login)"
                    className="w-full px-3.5 py-3 rounded-xl border border-neutral-600/90 bg-neutral-900/40 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
                  />
                </div>

                {/* Kata Sandi & Konfirmasi */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Sandi (Min. 4)"
                      className="w-full pl-3 pr-8 py-3 rounded-xl border border-neutral-600/90 bg-neutral-900/40 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi"
                    className="w-full px-3 py-3 rounded-xl border border-neutral-600/90 bg-neutral-900/40 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono"
                  />
                </div>

                {/* Info Approval */}
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    Akun yang diajukan akan berstatus <strong>Menunggu Persetujuan</strong> oleh Administrator sebelum aktif.
                  </span>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={isRegSubmitting}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-100 active:scale-[0.98] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all duration-150 disabled:opacity-60 cursor-pointer"
                >
                  {isRegSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                      <span>Mengirim Permohonan...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Kirim Pengajuan Akun</span>
                    </>
                  )}
                </button>

                {/* Back to Login Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegErrorMessage('');
                      setAuthMode('login');
                    }}
                    className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-neutral-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sudah punya akun? Kembali ke Halaman Login</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>

        {/* =========================================================================
            BOTTOM FOOTER: Jelajahi Madrasah & Logo Resmi MA Raudlatul Hidayah
        ========================================================================= */}
        <footer className="text-center pt-4 pb-2 shrink-0 select-none">
          {/* Jelajahi Madrasah Link Sesuai Screenshot */}
          <p className="text-xs text-neutral-400">
            Ingin mengenal madrasah MAS RH?{' '}
            <Link
              href="/"
              className="text-sky-400 hover:text-sky-300 font-semibold hover:underline transition-colors"
            >
              Jelajahi Madrasah
            </Link>
          </p>

          {/* Logo Lembaga MA Raudlatul Hidayah (Menggantikan Logo Kampus UNPAM) */}
          <div className="mt-3.5 flex items-center justify-center gap-2.5">
            {/* Lencana Logo Sekolah MA */}
            <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 shadow-xs border border-neutral-300">
              <Image
                src="/school-logo.png"
                alt="Logo MA Raudlatul Hidayah"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* Lencana Sistem Digital (Parallel dengan logo LPTI) */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 p-1 flex items-center justify-center shrink-0 border border-blue-400/30 shadow-xs text-white">
              <div className="w-4 h-4 rounded-xs border-2 border-white/90 flex items-center justify-center text-[9px] font-black">
                RH
              </div>
            </div>

            {/* Nama Lembaga Resmi */}
            <div className="text-left leading-tight">
              <div className="text-[9.5px] font-bold tracking-wider text-neutral-200 uppercase">
                LEMBAGA PENDIDIKAN ISLAM
              </div>
              <div className="text-[9.5px] font-semibold tracking-wider text-neutral-400 uppercase">
                MA RAUDLATUL HIDAYAH
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating PWA Install Prompt (Mengambang halus tanpa merusak tata letak login) */}
      <PwaInstallPrompt variant="floating" bottomOffset="default" />
    </div>
  );
};
