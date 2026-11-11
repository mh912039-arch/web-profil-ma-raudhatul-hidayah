'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Building2,
  GraduationCap,
  Newspaper,
  Grid2X2,
  X,
  ChevronRight,
  Phone,
  Compass,
  Trophy,
  LogIn,
  Instagram,
  BookOpen,
  History,
  Users,
  Layers,
} from 'lucide-react';

export function MobileBottomBar() {
  const pathname = usePathname();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);

  // Tutup sheet otomatis setiap kali rute berpindah
  useEffect(() => {
    setProfileSheetOpen(false);
    setMenuSheetOpen(false);
  }, [pathname]);

  // Kunci scroll body saat sheet terbuka
  useEffect(() => {
    if (profileSheetOpen || menuSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [profileSheetOpen, menuSheetOpen]);

  const handleOpenPpdb = () => {
    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent('open-ppdb-registration'));
    } else {
      window.location.href = '/?ppdb=open#ppdb';
    }
  };

  const isHome = pathname === '/';
  const isProfil = pathname.startsWith('/profil');
  const isWarta = pathname.startsWith('/warta');
  const isAkademikOrLainnya =
    pathname.startsWith('/akademik') ||
    pathname.startsWith('/kontak') ||
    pathname.startsWith('/masuk') ||
    pathname.startsWith('/prestasi') ||
    pathname.startsWith('/galeri');

  return (
    <>
      {/* 1. FLOATING BOTTOM TAB BAR (Khusus Mobile < lg) */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto bg-[#0b1329]/95 backdrop-blur-xl border-t border-white/15 shadow-[0_-8px_32px_rgba(0,0,0,0.45)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-1.5 px-2 transition-transform duration-200"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-end justify-items-center">
          {/* TAB 1: Beranda */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 w-full py-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isHome
                ? 'text-amber-400 font-bold'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isHome ? 'bg-amber-400/15' : 'bg-transparent'
              }`}
            >
              <Home className="w-5 h-5" strokeWidth={isHome ? 2.3 : 1.8} />
            </div>
            <span className="text-[10.5px] leading-none tracking-tight">Beranda</span>
          </Link>

          {/* TAB 2: Profil (Membuka Quick Sheet Profil) */}
          <button
            type="button"
            onClick={() => {
              setMenuSheetOpen(false);
              setProfileSheetOpen((prev) => !prev);
            }}
            aria-expanded={profileSheetOpen}
            aria-label="Buka Menu Profil"
            className={`flex flex-col items-center justify-center gap-1 w-full py-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isProfil || profileSheetOpen
                ? 'text-amber-400 font-bold'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isProfil || profileSheetOpen ? 'bg-amber-400/15' : 'bg-transparent'
              }`}
            >
              <Building2 className="w-5 h-5" strokeWidth={isProfil ? 2.3 : 1.8} />
            </div>
            <span className="text-[10.5px] leading-none tracking-tight">Profil</span>
          </button>

          {/* TAB 3: PPDB ONLINE (Center Prominent Action Button) */}
          <div className="relative flex flex-col items-center justify-center -top-2">
            <button
              type="button"
              onClick={handleOpenPpdb}
              aria-label="Buka Pendaftaran PPDB Online"
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-[#0b1329] active:scale-90 transition-all duration-150 group"
            >
              <GraduationCap className="w-6 h-6 stroke-[2.2] transition-transform group-active:rotate-12" />
            </button>
            <span className="text-[10.5px] font-bold text-amber-300 mt-1 leading-none tracking-tight">
              PPDB
            </span>
          </div>

          {/* TAB 4: Warta & Berita */}
          <Link
            href="/warta"
            className={`flex flex-col items-center justify-center gap-1 w-full py-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isWarta
                ? 'text-amber-400 font-bold'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isWarta ? 'bg-amber-400/15' : 'bg-transparent'
              }`}
            >
              <Newspaper className="w-5 h-5" strokeWidth={isWarta ? 2.3 : 1.8} />
            </div>
            <span className="text-[10.5px] leading-none tracking-tight">Warta</span>
          </Link>

          {/* TAB 5: Menu / Layanan Lengkap */}
          <button
            type="button"
            onClick={() => {
              setProfileSheetOpen(false);
              setMenuSheetOpen((prev) => !prev);
            }}
            aria-expanded={menuSheetOpen}
            aria-label="Buka Menu Layanan Lengkap"
            className={`flex flex-col items-center justify-center gap-1 w-full py-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isAkademikOrLainnya || menuSheetOpen
                ? 'text-amber-400 font-bold'
                : 'text-slate-300 hover:text-white font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                menuSheetOpen || isAkademikOrLainnya ? 'bg-amber-400/15' : 'bg-transparent'
              }`}
            >
              <Grid2X2 className="w-5 h-5" strokeWidth={menuSheetOpen ? 2.3 : 1.8} />
            </div>
            <span className="text-[10.5px] leading-none tracking-tight">Layanan</span>
          </button>
        </div>
      </nav>

      {/* 2. BOTTOM SHEET: QUICK MENU PROFIL */}
      {profileSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setProfileSheetOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0b1329] text-white border-t border-white/20 rounded-t-3xl p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/15 text-amber-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[15px] font-bold text-white leading-tight">
                    Profil Madrasah
                  </h3>
                  <p className="text-[11.5px] text-slate-400">Pilih informasi kelembagaan santri</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileSheetOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white active:scale-95 transition-all"
                aria-label="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/profil/visi-misi"
                onClick={() => setProfileSheetOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-white">Visi, Misi & Tujuan</h4>
                    <p className="text-[11.5px] text-slate-400">Arah haluan nilai pendidikan madrasah</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                href="/profil/sejarah"
                onClick={() => setProfileSheetOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-white">Sejarah Madrasah</h4>
                    <p className="text-[11.5px] text-slate-400">Tonggak perjalanan dedikasi di Mauk</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                href="/profil/fasilitas"
                onClick={() => setProfileSheetOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-white">Fasilitas Madrasah</h4>
                    <p className="text-[11.5px] text-slate-400">Ruang kelas, perpus, lab & musholla</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                href="/profil/guru-tendik"
                onClick={() => setProfileSheetOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-white">Dewan Guru & Tendik</h4>
                    <p className="text-[11.5px] text-slate-400">Direktori tenaga pendidik berdedikasi</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOTTOM SHEET: LAYANAN LENGKAP & LAINNYA */}
      {menuSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setMenuSheetOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0b1329] text-white border-t border-white/20 rounded-t-3xl p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/15 text-amber-400">
                  <Grid2X2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[15px] font-bold text-white leading-tight">
                    Layanan & Navigasi
                  </h3>
                  <p className="text-[11.5px] text-slate-400">Akses cepat seluruh fitur madrasah</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuSheetOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white active:scale-95 transition-all"
                aria-label="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Grup: Akademik & Siswa */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 block mb-2">
                  Akademik & Kesiswaan
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/akademik/ekstrakurikuler"
                    onClick={() => setMenuSheetOpen(false)}
                    className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                  >
                    <Compass className="w-5 h-5 text-amber-400 mb-0.5" />
                    <span className="text-[13px] font-bold text-white">Ekstrakurikuler</span>
                    <span className="text-[11px] text-slate-400">Bakat & minat santri</span>
                  </Link>

                  <Link
                    href="/akademik/foto-juara"
                    onClick={() => setMenuSheetOpen(false)}
                    className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                  >
                    <Trophy className="w-5 h-5 text-amber-400 mb-0.5" />
                    <span className="text-[13px] font-bold text-white">Dokumentasi Juara</span>
                    <span className="text-[11px] text-slate-400">Prestasi santri resmi</span>
                  </Link>
                </div>
              </div>

              {/* Grup: Kontak & Komunikasi */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 block mb-2">
                  Hubungi Madrasah
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/kontak"
                    onClick={() => setMenuSheetOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] font-bold text-white truncate">Halaman Kontak</span>
                      <span className="text-[10.5px] text-slate-400 truncate">Peta & info TU</span>
                    </div>
                  </Link>

                  <a
                    href="https://wa.me/628176614723"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.784 2.791.784 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.77-5.768-5.77zm3.377 8.215c-.145.408-.838.777-1.157.828-.319.052-.734.075-2.383-.605-1.986-.818-3.256-2.839-3.355-2.971-.099-.133-.805-1.072-.805-2.046 0-.974.509-1.453.69-1.649.182-.196.398-.245.53-.245s.266.005.383.011c.124.006.29-.047.453.346.166.399.566 1.383.616 1.483.05.1.083.217.017.35-.067.133-.1.217-.199.333-.1.117-.209.261-.299.35-.1.1-.205.209-.089.408.117.2 0.518.855 1.11 1.382.763.679 1.405.889 1.605.989.2.1.317.083.433-.05.117-.133.5-.583.633-.783.133-.2.267-.167.45-.1.183.067 1.166.55 1.366.65.2.1.333.15.383.233.05.083.05.483-.095.891z"/>
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.393A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.223-1.167l-.303-.18-3.132.875.836-3.05-.198-.315A8.166 8.166 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                    </svg>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] font-bold text-white truncate">WhatsApp TU</span>
                      <span className="text-[10.5px] text-emerald-300 truncate">Layanan santri</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Portal Masuk & Media Sosial */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                <Link
                  href="/masuk"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[12.5px] font-bold active:scale-95 transition-all shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Staf / Guru</span>
                </Link>

                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/ma_raudlatulhidayah/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Resmi"
                    className="p-2 rounded-xl bg-white/10 text-white hover:text-pink-300 active:scale-95 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@ma_raudlatulhidayah"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok Resmi"
                    className="p-2 rounded-xl bg-white/10 text-white hover:text-cyan-300 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.1a2.89 2.89 0 0 1 2.373-4.537c.314 0 .618.05.903.144V9.414a6.334 6.334 0 0 0-.903-.065A6.334 6.334 0 0 0 3.144 15.68a6.334 6.334 0 0 0 6.334 6.334 6.334 6.334 0 0 0 6.334-6.334V8.583a8.17 8.17 0 0 0 4.777 1.549V6.686h-1Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
