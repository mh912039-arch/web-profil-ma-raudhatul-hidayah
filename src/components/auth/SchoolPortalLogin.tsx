'use client';

import React, { useState, useEffect } from 'react';
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
  UserPlus,
  CheckCircle2,
  Mail,
  BookOpen,
  Hash,
  ShieldAlert,
  Clock,
  Info,
  X,
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
  const [timeoutNotice, setTimeoutNotice] = useState<string | null>(null);

  // Deteksi jika pengguna dialihkan kembali ke login karena sesi idle berakhir
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reason') === 'timeout') {
        setTimeoutNotice(
          'Sesi Anda telah berakhir otomatis demi keamanan karena tidak ada aktivitas selama 30 menit. Silakan masukkan kredensial kembali.'
        );
      }
    }
  }, []);

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

      // Simpan role & email di localStorage untuk sinkronisasi state instan di browser
      if (typeof window !== 'undefined') {
        localStorage.setItem('mrh_admin_auth', 'true');
        localStorage.setItem('mrh_user_role', data.role);
        if (data.username) {
          localStorage.setItem('mrh_username', data.username);
        }
        if (data.email) {
          localStorage.setItem('mrh_email', data.email);
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
    <>
      {/* =========================================================================
          1. TAMPILAN MOBILE (< 768px / Layar Ponsel & PWA)
          Desain Dark Native MAS RH Mobile (Sesuai Permintaan Mobile)
      ========================================================================= */}
      <div className="flex md:hidden min-h-[100dvh] bg-[#111214] text-white flex-col justify-between items-center px-5 py-6 font-sans selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-[420px] min-h-[100dvh] flex flex-col justify-between mx-auto">
          {/* Header Mobile: MAS RH mobile */}
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

          {/* Konten Utama Mobile */}
          <main className="my-auto py-4 w-full">
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
              <div className="animate-in fade-in duration-200">
                <div className="mb-6 text-left">
                  <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                    Selamat Datang<br />
                    Login ke Akun Anda
                  </h1>
                  <p className="text-[13px] text-neutral-400 mt-2 leading-relaxed">
                    Login untuk memulai perjalanan anda di Madrasah Aliyah Raudlatul Hidayah
                  </p>
                </div>

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

                {timeoutNotice && (
                  <div className="mb-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="leading-relaxed font-medium">{timeoutNotice}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTimeoutNotice(null)}
                      className="text-amber-400/80 hover:text-amber-200 p-0.5 cursor-pointer"
                      aria-label="Tutup pemberitahuan"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
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

                <div className="mt-3.5 flex items-start gap-2 text-[11.5px] text-neutral-400 leading-relaxed">
                  <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5 stroke-[1.8]" />
                  <span>
                    Gunakan username dan password yang sama dengan akun Web Portal MAS RH.
                  </span>
                </div>

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

                {regErrorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{regErrorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
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

                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 flex items-start gap-2 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>
                      Akun yang diajukan akan berstatus <strong>Menunggu Persetujuan</strong> oleh Administrator sebelum aktif.
                    </span>
                  </div>

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

          {/* Footer Mobile */}
          <footer className="text-center pt-4 pb-2 shrink-0 select-none">
            <p className="text-xs text-neutral-400">
              Ingin mengenal madrasah MAS RH?{' '}
              <Link
                href="/"
                className="text-sky-400 hover:text-sky-300 font-semibold hover:underline transition-colors"
              >
                Jelajahi Madrasah
              </Link>
            </p>

            <div className="mt-3.5 flex items-center justify-center gap-2.5">
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

              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 p-1 flex items-center justify-center shrink-0 border border-blue-400/30 shadow-xs text-white">
                <div className="w-4 h-4 rounded-xs border-2 border-white/90 flex items-center justify-center text-[9px] font-black">
                  RH
                </div>
              </div>

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

        {/* Floating PWA Prompt di Mobile */}
        <PwaInstallPrompt variant="floating" bottomOffset="default" />
      </div>

      {/* =========================================================================
          2. TAMPILAN DESKTOP / ADMIN LAMA (>= 768px / Laptop & PC)
          Desain Klasik Terang Portal Admin MA Raudlatul Hidayah
      ========================================================================= */}
      <div className="hidden md:flex min-h-[100dvh] flex-col justify-center items-center bg-[#f8fafc] px-4 py-8 font-sans text-slate-800 selection:bg-blue-900 selection:text-white">
        {/* Top Header: Official School Emblem & Title */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-center mx-auto mb-3.5 transition-transform hover:scale-105 duration-200">
            <Image
              src="/school-logo.png"
              alt="Logo MA Raudlatul Hidayah"
              width={64}
              height={64}
              className="w-auto h-auto max-h-16 object-contain"
              priority
            />
          </div>

          <h1 className="font-serif text-[22px] sm:text-[24px] font-bold text-slate-900 tracking-tight uppercase leading-snug">
            MA RAUDLATUL HIDAYAH
          </h1>
        </div>

        {/* Main Authentication & Registration Card */}
        <div className="w-full max-w-[440px] bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative">
          {regSuccess ? (
            <div className="text-center py-2 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2.5">
                  Menunggu Konfirmasi Administrator
                </span>
                <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                  Pendaftaran Berhasil Dikirim
                </h2>
                <p className="text-[12.5px] text-slate-600 mt-2 leading-relaxed">
                  Permohonan akun untuk{' '}
                  <span className="font-bold text-slate-900">{regSuccess.name}</span> sebagai{' '}
                  <span className="font-bold text-blue-900">{regSuccess.roleLabel}</span> telah masuk
                  ke antrean verifikasi sistem madrasah.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email Terdaftar:</span>
                  <span className="font-mono font-bold text-slate-900">{regSuccess.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status Akun:</span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    Nonaktif (Menunggu Persetujuan)
                  </span>
                </div>
              </div>

              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Administrator Madrasah akan meninjau dan mengaktifkan akun Anda. Setelah disetujui,
                Anda dapat langsung masuk menggunakan email dan kata sandi yang telah didaftarkan.
              </p>

              <button
                type="button"
                onClick={() => {
                  setIdentifier(regSuccess.email);
                  setRegSuccess(null);
                  setAuthMode('login');
                }}
                className="w-full mt-2 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Masuk</span>
              </button>
            </div>
          ) : authMode === 'login' ? (
            <div>
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                  Masuk ke Sistem
                </h2>
                <p className="text-[13px] text-slate-500 mt-1">
                  Silakan masukkan akun terdaftar Anda.
                </p>
              </div>

              {lockoutSeconds > 0 ? (
                <div className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs flex flex-col gap-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-amber-900 text-[13px]">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Akses Dibatasi Sementara</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-[12.5px] bg-amber-100/90 text-amber-950 px-2.5 py-0.5 rounded-lg border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{formatCountdown(lockoutSeconds)}</span>
                    </div>
                  </div>
                  <p className="leading-relaxed text-slate-700 text-[12px]">
                    Batas maksimal percobaan salah tercapai. Demi melindungi sistem dan data madrasah dari akses tidak sah, formulir masuk ditangguhkan sementara. Sistem akan membuka kunci secara otomatis saat hitungan mundur selesai.
                  </p>
                </div>
              ) : errorMessage ? (
                <div
                  className={`mb-5 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150 ${
                    warningAttempts && warningAttempts <= 2
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  {warningAttempts && warningAttempts <= 2 ? (
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="leading-relaxed">{errorMessage}</p>
                    {warningAttempts && warningAttempts <= 2 && (
                      <p className="mt-1 text-[11px] font-semibold text-amber-800">
                        Peringatan: Kesempatan tersisa {warningAttempts} kali sebelum perangkat/akun dibekukan selama 15 menit.
                      </p>
                    )}
                  </div>
                </div>
              ) : null}

              {timeoutNotice && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="leading-relaxed font-semibold">{timeoutNotice}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTimeoutNotice(null)}
                    className="text-amber-700/80 hover:text-amber-950 p-0.5 cursor-pointer"
                    aria-label="Tutup pemberitahuan"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                      disabled={lockoutSeconds > 0}
                      placeholder="Masukkan NISN, NIP, atau Email"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-[13.5px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

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
                      disabled={lockoutSeconds > 0}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-[13.5px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={lockoutSeconds > 0}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5 disabled:opacity-40"
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

                <button
                  type="submit"
                  disabled={isSubmitting || lockoutSeconds > 0}
                  className="w-full mt-2 py-3 sm:py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {lockoutSeconds > 0 ? (
                    <>
                      <Lock className="w-4 h-4 text-slate-300" />
                      <span>Terkunci Sementara ({formatCountdown(lockoutSeconds)})</span>
                    </>
                  ) : isSubmitting ? (
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

              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-[12px] text-slate-600 font-medium">
                  Belum memiliki akses login portal?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setRegErrorMessage('');
                    setAuthMode('register');
                  }}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 transition-all cursor-pointer py-1.5 px-3 rounded-xl hover:bg-blue-50 active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Akun Guru / Siswa Baru</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-200">
              <div className="text-center mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  Registrasi Akun Baru
                </span>
                <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                  Daftar Akses Portal
                </h2>
                <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                  Khusus Dewan Guru dan Santri/Siswa. Akun akan ditinjau dan dikonfirmasi langsung oleh Administrator.
                </p>
              </div>

              {regErrorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span className="leading-relaxed">{regErrorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-[11.5px] font-bold text-slate-700 uppercase tracking-wide">
                    Peran Akun Dimohon
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setRegRole('guru')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        regRole === 'guru'
                          ? 'bg-white text-blue-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Dewan Guru</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('siswa')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        regRole === 'siswa'
                          ? 'bg-white text-blue-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Santri / Siswa</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11.5px] font-bold text-slate-700">
                    Nama Lengkap {regRole === 'guru' ? '& Gelar' : 'Santri/Siswa'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={
                        regRole === 'guru'
                          ? 'Contoh: H. Ahmad Subandi, S.Pd'
                          : 'Contoh: Muhammad Farhan Al-Ghifari'
                      }
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[11.5px] font-bold text-slate-700">
                      {regRole === 'guru' ? 'NIP / NUPTK' : 'NISN / NISM'}
                    </label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={regNipNisn}
                        onChange={(e) => setRegNipNisn(e.target.value)}
                        placeholder={regRole === 'guru' ? 'Nomor NIP' : 'Nomor NISN'}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11.5px] font-bold text-slate-700">
                      {regRole === 'guru' ? 'Mata Pelajaran' : 'Kelas / Rombel'}
                    </label>
                    <div className="relative">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={regNote}
                        onChange={(e) => setRegNote(e.target.value)}
                        placeholder={regRole === 'guru' ? 'Mata Pelajaran' : 'Contoh: Kelas X'}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11.5px] font-bold text-slate-700">
                    Email Akun Resmi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@raudlatulhidayah.sch.id atau email aktif"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[11.5px] font-bold text-slate-700">
                      Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 4 karakter"
                        className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11.5px] font-bold text-slate-700">
                      Ulangi Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Konfirmasi sandi"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-[11.5px] text-blue-900 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>
                    Akun yang diajukan berstatus <strong>Menunggu Konfirmasi</strong> dan akan ditinjau
                    oleh Administrator Madrasah sebelum dapat digunakan untuk login.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isRegSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all duration-200 disabled:opacity-60 cursor-pointer"
                >
                  {isRegSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengirim Permohonan Akun...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Kirim Pengajuan Akun</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegErrorMessage('');
                      setAuthMode('login');
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-blue-900 transition-colors inline-flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sudah punya akun? Kembali ke Halaman Masuk</span>
                  </button>
                </div>
              </form>
            </div>
          )}
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
    </>
  );
};
