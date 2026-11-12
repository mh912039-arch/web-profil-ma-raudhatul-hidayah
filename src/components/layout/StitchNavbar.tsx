'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Info,
  Building2,
  Trophy,
  Newspaper,
  Phone,
  Menu,
  X,
  LogIn,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Instagram,
} from 'lucide-react';
import { fetchPublicProfile } from '@/lib/publicProfileClient';

export function StitchNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProfilOpen, setMobileProfilOpen] = useState(false);
  const [mobileAkademikOpen, setMobileAkademikOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [isAkademikOpen, setIsAkademikOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const akademikDropdownRef = useRef<HTMLDivElement>(null);
  const akademikTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [navProfile, setNavProfile] = useState({
    phone: '0817-6614-723',
    whatsapp: '628176614723',
    email: 'info@maraudlatulhidayah.sch.id',
    hoursWeekdays: '07.00 - 15.30 WIB',
  });

  useEffect(() => {
    fetchPublicProfile().then((data) => {
      if (data?.profile) {
        setNavProfile({
          phone: data.profile.phone || '0817-6614-723',
          whatsapp: data.profile.whatsapp || '628176614723',
          email: data.profile.email || 'info@maraudlatulhidayah.sch.id',
          hoursWeekdays: data.profile.hoursWeekdays || '07.00 - 15.30 WIB',
        });
      }
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfilOpen(false);
      }
      if (akademikDropdownRef.current && !akademikDropdownRef.current.contains(event.target as Node)) {
        setIsAkademikOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfilOpen(false);
        setIsAkademikOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsProfilOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProfilOpen(false);
    }, 180);
  };

  const handleAkademikMouseEnter = () => {
    if (akademikTimeoutRef.current) clearTimeout(akademikTimeoutRef.current);
    setIsAkademikOpen(true);
  };

  const handleAkademikMouseLeave = () => {
    akademikTimeoutRef.current = setTimeout(() => {
      setIsAkademikOpen(false);
    }, 180);
  };

  const handleNavClick = () => {
    setIsProfilOpen(false);
    setIsAkademikOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Profil', href: '/profil' },
    { label: 'Akademik', href: '/akademik' },
    { label: 'Berita', href: '/warta' },
    { label: 'Kontak', href: '/kontak' },
  ];

  const profilSublinks = [
    { label: 'Visi & Misi Sekolah', href: '/profil/visi-misi' },
    { label: 'Sejarah & Perjalanan Yayasan', href: '/profil/sejarah' },
    { label: 'Fasilitas Belajar Siswa', href: '/profil/fasilitas' },
    { label: 'Guru & Staf', href: '/profil/guru-tendik' },
  ];

  const akademikSublinks = [
    { label: 'Ekstrakurikuler', href: '/akademik/ekstrakurikuler' },
    { label: 'Foto Juara Ekstrakurikuler', href: '/akademik/foto-juara' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* =========================================================================
          1. MOBILE TOP HEADER (Persis SS 2: Bersih, Putih, Logo, Teks, Tombol Hamburger)
      ========================================================================= */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs h-16 flex items-center transition-all duration-200">
        <div className="w-full px-4 flex items-center justify-between">
          {/* Logo & Identitas Madrasah */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group active:scale-[0.98] transition-transform"
          >
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
              <Image
                src="/school-logo.png"
                alt="Emblem MAS Raudlatul Hidayah"
                width={38}
                height={38}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[14.5px] text-slate-900 tracking-tight leading-tight uppercase font-sans">
                MAS Raudlatul Hidayah
              </span>
              <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase leading-snug">
                Mauk · Kab. Tangerang
              </span>
            </div>
          </Link>

          {/* Tombol Hamburger (Persis SS 2: Kotak membulat rapi dengan 3 garis horizontal) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="w-11 h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-800 active:scale-95 transition-all shadow-2xs cursor-pointer"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MOBILE MENU DRAWER (Persis SS 1: Beranda, Profil, Fasilitas, Kesiswaan, Berita, Kontak, Portal)
      ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto animate-in fade-in duration-150">
          {/* Header Drawer (Persis SS 1: Logo + Nama Sekolah + Tombol X) */}
          <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10 shadow-2xs">
            <Link
              href="/"
              onClick={handleNavClick}
              className="flex items-center gap-3 active:scale-[0.98] transition-transform"
            >
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <Image
                  src="/school-logo.png"
                  alt="Emblem MAS Raudlatul Hidayah"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[14.5px] text-slate-900 tracking-tight leading-tight uppercase font-sans">
                  MAS Raudlatul Hidayah
                </span>
                <span className="text-[10px] font-bold text-emerald-800 tracking-wider uppercase leading-snug">
                  Mauk · Kab. Tangerang
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-11 h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-800 active:scale-95 transition-all cursor-pointer shadow-2xs"
              aria-label="Tutup Menu Navigasi"
            >
              <X className="w-6 h-6 stroke-[2]" />
            </button>
          </div>

          {/* List Menu Items (Persis SS 1) */}
          <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto font-sans">
            {/* 1. Beranda */}
            <Link
              href="/"
              onClick={handleNavClick}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
                pathname === '/'
                  ? 'bg-[#ecfdf5] text-[#065f46] font-bold border border-emerald-200/70 shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold'
              }`}
            >
              <Home className={`w-5 h-5 shrink-0 ${pathname === '/' ? 'text-[#065f46]' : 'text-slate-400'}`} />
              <span className="text-[14.5px]">Beranda</span>
            </Link>

            {/* 2. Profil (Dropdown) */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setMobileProfilOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                  isActive('/profil')
                    ? 'bg-slate-50 text-slate-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Info className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-[14.5px]">Profil</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    mobileProfilOpen ? 'rotate-180 text-emerald-800' : ''
                  }`}
                />
              </button>
              {mobileProfilOpen && (
                <div className="pl-12 pr-3 py-1 flex flex-col gap-1 border-l-2 border-emerald-200 ml-6 my-1 animate-in fade-in duration-150">
                  {profilSublinks.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={handleNavClick}
                      className="py-2.5 px-3 rounded-xl text-[13.5px] font-medium text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60 transition-colors"
                    >
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Fasilitas */}
            <Link
              href="/profil/fasilitas"
              onClick={handleNavClick}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
                pathname === '/profil/fasilitas'
                  ? 'bg-[#ecfdf5] text-[#065f46] font-bold border border-emerald-200/70 shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold'
              }`}
            >
              <Building2 className={`w-5 h-5 shrink-0 ${pathname === '/profil/fasilitas' ? 'text-[#065f46]' : 'text-slate-400'}`} />
              <span className="text-[14.5px]">Fasilitas</span>
            </Link>

            {/* 4. Kesiswaan / Akademik (Dropdown) */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setMobileAkademikOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                  isActive('/akademik')
                    ? 'bg-slate-50 text-slate-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Trophy className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-[14.5px]">Kesiswaan</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    mobileAkademikOpen ? 'rotate-180 text-emerald-800' : ''
                  }`}
                />
              </button>
              {mobileAkademikOpen && (
                <div className="pl-12 pr-3 py-1 flex flex-col gap-1 border-l-2 border-emerald-200 ml-6 my-1 animate-in fade-in duration-150">
                  {akademikSublinks.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={handleNavClick}
                      className="py-2.5 px-3 rounded-xl text-[13.5px] font-medium text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60 transition-colors"
                    >
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Berita */}
            <Link
              href="/warta"
              onClick={handleNavClick}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
                isActive('/warta')
                  ? 'bg-[#ecfdf5] text-[#065f46] font-bold border border-emerald-200/70 shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold'
              }`}
            >
              <Newspaper className={`w-5 h-5 shrink-0 ${isActive('/warta') ? 'text-[#065f46]' : 'text-slate-400'}`} />
              <span className="text-[14.5px]">Berita</span>
            </Link>

            {/* 6. Kontak */}
            <Link
              href="/kontak"
              onClick={handleNavClick}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all ${
                pathname === '/kontak'
                  ? 'bg-[#ecfdf5] text-[#065f46] font-bold border border-emerald-200/70 shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold'
              }`}
            >
              <Phone className={`w-5 h-5 shrink-0 ${pathname === '/kontak' ? 'text-[#065f46]' : 'text-slate-400'}`} />
              <span className="text-[14.5px]">Kontak</span>
            </Link>
          </div>

          {/* Footer Drawer (Persis SS 1: Portal Akademik di kiri, Hubungi Sekolah di kanan, plus tombol PPDB & WA) */}
          <div className="mt-auto border-t border-slate-100 p-4 space-y-3 bg-slate-50/60 shrink-0 font-sans">
            <div className="flex items-center justify-between px-1">
              <Link
                href="/masuk"
                onClick={handleNavClick}
                className="inline-flex items-center gap-2 text-slate-800 font-bold text-[13px] hover:text-emerald-800 transition-colors"
              >
                <LogIn className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Portal Akademik (Admin)</span>
              </Link>
              <Link
                href="/kontak"
                onClick={handleNavClick}
                className="inline-flex items-center gap-1.5 text-emerald-800 font-bold text-[13px] hover:underline transition-colors"
              >
                <span>Hubungi Sekolah</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Kanal Resmi Medsos (Mobile Drawer Sesuai Contoh SS 2) */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100/90 rounded-2xl border border-slate-200/80">
              <span className="text-[12.5px] font-bold text-slate-800 tracking-wide">
                Kanal Resmi:
              </span>
              <div className="flex items-center gap-2">
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@ma_raudlatulhidayah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-red-50 text-slate-700 hover:text-red-500 border border-slate-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  aria-label="YouTube Resmi"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${navProfile.whatsapp || '628176614723'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 border border-slate-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  aria-label="WhatsApp Resmi"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.784 2.791.784 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.77-5.768-5.77zm3.377 8.215c-.145.408-.838.777-1.157.828-.319.052-.734.075-2.383-.605-1.986-.818-3.256-2.839-3.355-2.971-.099-.133-.805-1.072-.805-2.046 0-.974.509-1.453.69-1.649.182-.196.398-.245.53-.245s.266.005.383.011c.124.006.29-.047.453.346.166.399.566 1.383.616 1.483.05.1.083.217.017.35-.067.133-.1.217-.199.333-.1.117-.209.261-.299.35-.1.1-.205.209-.089.408.117.2 0.518.855 1.11 1.382.763.679 1.405.889 1.605.989.2.1.317.083.433-.05.117-.133.5-.583.633-.783.133-.2.267-.167.45-.1.183.067 1.166.55 1.366.65.2.1.333.15.383.233.05.083.05.483-.095.891z"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.393A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.223-1.167l-.303-.18-3.132.875.836-3.05-.198-.315A8.166 8.166 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ma_raudlatulhidayah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  aria-label="Instagram Resmi"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@ma_raudlatulhidayah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-black border border-slate-200 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  aria-label="TikTok Resmi"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.1a2.89 2.89 0 0 1 2.373-4.537c.314 0 .618.05.903.144V9.414a6.334 6.334 0 0 0-.903-.065A6.334 6.334 0 0 0 3.144 15.68a6.334 6.334 0 0 0 6.334 6.334 6.334 6.334 0 0 0 6.334-6.334V8.583a8.17 8.17 0 0 0 4.777 1.549V6.686h-1Z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (pathname === '/') {
                    window.dispatchEvent(new CustomEvent('open-ppdb-registration'));
                  } else {
                    window.location.href = '/?ppdb=open#ppdb';
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
              >
                <span>Daftar Calon Santri (PPDB Online)</span>
              </button>

              <a
                href={`https://wa.me/${navProfile.whatsapp || '628176614723'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.98] text-white font-bold text-[13.5px] flex items-center justify-center gap-2 shadow-2xs transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Chat WhatsApp Resmi</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. DESKTOP HEADER (Layar Desktop >= lg: 1024px)
      ========================================================================= */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-40 pointer-events-none transition-all duration-300">
        {/* Topbar Desktop: Kanal Resmi di Kiri Sesuai Contoh SS 2 */}
        <div
          className={`w-full pointer-events-auto bg-[#1e3a8a] text-slate-100 text-[11.5px] border-b border-amber-500/40 shrink-0 flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled
              ? 'max-h-0 opacity-0 -translate-y-3 pointer-events-none overflow-hidden h-0 py-0 border-transparent'
              : 'max-h-12 opacity-100 translate-y-0 h-8 min-h-[32px]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full h-full min-h-[32px]">
            {/* Kiri: Kanal Resmi + Icon Medsos Sesuai Identitas MAS */}
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-[#facc15] text-[11.5px] tracking-wide">
                Kanal Resmi:
              </span>
              <div className="flex items-center gap-1.5">
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@ma_raudlatulhidayah"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube Resmi MAS Raudlatul Hidayah"
                  aria-label="Buka YouTube Resmi"
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-100 hover:text-red-400 border border-white/15 transition-all duration-150 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${navProfile.whatsapp || '628176614723'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp Resmi MAS Raudlatul Hidayah"
                  aria-label="Buka Chat WhatsApp"
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-100 hover:text-emerald-300 border border-white/15 transition-all duration-150 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.784 2.791.784 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.77-5.768-5.77zm3.377 8.215c-.145.408-.838.777-1.157.828-.319.052-.734.075-2.383-.605-1.986-.818-3.256-2.839-3.355-2.971-.099-.133-.805-1.072-.805-2.046 0-.974.509-1.453.69-1.649.182-.196.398-.245.53-.245s.266.005.383.011c.124.006.29-.047.453.346.166.399.566 1.383.616 1.483.05.1.083.217.017.35-.067.133-.1.217-.199.333-.1.117-.209.261-.299.35-.1.1-.205.209-.089.408.117.2 0.518.855 1.11 1.382.763.679 1.405.889 1.605.989.2.1.317.083.433-.05.117-.133.5-.583.633-.783.133-.2.267-.167.45-.1.183.067 1.166.55 1.366.65.2.1.333.15.383.233.05.083.05.483-.095.891z"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.393A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.223-1.167l-.303-.18-3.132.875.836-3.05-.198-.315A8.166 8.166 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ma_raudlatulhidayah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram Resmi MAS Raudlatul Hidayah"
                  aria-label="Buka Instagram Resmi"
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-100 hover:text-pink-300 border border-white/15 transition-all duration-150 active:scale-95 flex items-center justify-center"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@ma_raudlatulhidayah"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TikTok Resmi MAS Raudlatul Hidayah"
                  aria-label="Buka TikTok Resmi"
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-100 hover:text-cyan-300 border border-white/15 transition-all duration-150 active:scale-95 flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.1a2.89 2.89 0 0 1 2.373-4.537c.314 0 .618.05.903.144V9.414a6.334 6.334 0 0 0-.903-.065A6.334 6.334 0 0 0 3.144 15.68a6.334 6.334 0 0 0 6.334 6.334 6.334 6.334 0 0 0 6.334-6.334V8.583a8.17 8.17 0 0 0 4.777 1.549V6.686h-1Z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Navbar Utama Desktop: Dynamic Adaptive Pill (Penuh di atas, Kapsul saat scroll) */}
        <div
          className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled
              ? 'max-w-6xl w-[calc(100%-4rem)] mx-auto mt-2.5 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_16px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5'
              : 'w-full bg-[#1e3a8a] border-b-[3px] border-[#facc15] py-3.5 shadow-[0_4px_20px_rgba(15,23,42,0.25)]'
          }`}
        >
          <div
            className={`flex items-center justify-between gap-4 transition-all duration-300 ${
              scrolled ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
            }`}
          >
            {/* Logo & Emblem Brand Identity */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0 transition-transform duration-200 active:scale-[0.98]"
            >
              <div
                className={`relative shrink-0 rounded-xl p-1 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm ${
                  scrolled
                    ? 'w-9 h-9 bg-slate-50 border border-slate-200/80'
                    : 'w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20'
                }`}
              >
                <Image
                  src="/school-logo.png"
                  alt="Emblem MAS Raudlatul Hidayah"
                  width={scrolled ? 28 : 36}
                  height={scrolled ? 28 : 36}
                  className="object-contain drop-shadow-sm transition-all duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-serif font-bold tracking-wide leading-tight transition-all duration-300 ${
                    scrolled
                      ? 'text-[17px] text-slate-900 group-hover:text-emerald-800'
                      : 'text-[19px] text-white group-hover:text-[#facc15]'
                  }`}
                >
                  MAS Raudlatul Hidayah
                </span>
                {!scrolled && (
                  <span className="text-[10.5px] font-sans font-medium text-amber-300/90 tracking-wider uppercase">
                    Mauk · Kab. Tangerang
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav
              className={`flex items-center gap-1 transition-all duration-300 ${
                scrolled
                  ? 'px-1.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 shadow-2xs'
                  : 'px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md'
              }`}
            >
              {navLinks.map((link) => {
                if (link.label === 'Profil') {
                  const active = isActive('/profil');
                  return (
                    <div
                      key={link.label}
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => setIsProfilOpen((prev) => !prev)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-[13px] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                          active || isProfilOpen
                            ? 'bg-[#facc15] text-slate-950 font-bold shadow-xs ring-2 ring-[#facc15]/50'
                            : scrolled
                            ? 'text-slate-700 hover:text-slate-950 hover:bg-white font-semibold'
                            : 'text-white/85 hover:text-white hover:bg-white/15 font-medium'
                        }`}
                        aria-expanded={isProfilOpen}
                        aria-haspopup="true"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isProfilOpen ? 'rotate-180' : ''
                          } ${
                            active || isProfilOpen
                              ? 'text-slate-950'
                              : scrolled
                              ? 'text-slate-500'
                              : 'text-white/70'
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu Container */}
                      {isProfilOpen && (
                        <div className="absolute top-full left-0 pt-2 z-50 min-w-[250px] animate-in fade-in zoom-in-95 duration-150 origin-top-left">
                          <div
                            className={`rounded-2xl shadow-[0_16px_48px_rgba(15,23,42,0.18)] p-2 flex flex-col gap-1 ring-1 ${
                              scrolled
                                ? 'bg-white border border-slate-200/90 ring-slate-900/5'
                                : 'bg-[#1e3a8a] border-2 border-[#facc15]/80 ring-[#facc15]/30'
                            }`}
                          >
                            {profilSublinks.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => handleNavClick()}
                                className={`px-3.5 py-2 rounded-xl text-[13.5px] font-semibold transition-all duration-150 flex items-center justify-between group/link ${
                                  scrolled
                                    ? 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50 active:bg-slate-100'
                                    : 'text-white/90 hover:text-[#facc15] hover:bg-white/10 active:bg-white/15'
                                }`}
                              >
                                <span className="leading-snug">{sub.label}</span>
                                <ChevronRight
                                  className={`w-3.5 h-3.5 transition-colors ${
                                    scrolled
                                      ? 'text-slate-400 group-hover/link:text-emerald-700'
                                      : 'text-white/40 group-hover/link:text-[#facc15]'
                                  }`}
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (link.label === 'Akademik') {
                  const active = isActive('/akademik');
                  return (
                    <div
                      key={link.label}
                      ref={akademikDropdownRef}
                      className="relative"
                      onMouseEnter={handleAkademikMouseEnter}
                      onMouseLeave={handleAkademikMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => setIsAkademikOpen((prev) => !prev)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-[13px] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                          active || isAkademikOpen
                            ? 'bg-[#facc15] text-slate-950 font-bold shadow-xs ring-2 ring-[#facc15]/50'
                            : scrolled
                            ? 'text-slate-700 hover:text-slate-950 hover:bg-white font-semibold'
                            : 'text-white/85 hover:text-white hover:bg-white/15 font-medium'
                        }`}
                        aria-expanded={isAkademikOpen}
                        aria-haspopup="true"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isAkademikOpen ? 'rotate-180' : ''
                          } ${
                            active || isAkademikOpen
                              ? 'text-slate-950'
                              : scrolled
                              ? 'text-slate-500'
                              : 'text-white/70'
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu Container */}
                      {isAkademikOpen && (
                        <div className="absolute top-full left-0 pt-2 z-50 min-w-[250px] animate-in fade-in zoom-in-95 duration-150 origin-top-left">
                          <div
                            className={`rounded-2xl shadow-[0_16px_48px_rgba(15,23,42,0.18)] p-2 flex flex-col gap-1 ring-1 ${
                              scrolled
                                ? 'bg-white border border-slate-200/90 ring-slate-900/5'
                                : 'bg-[#1e3a8a] border-2 border-[#facc15]/80 ring-[#facc15]/30'
                            }`}
                          >
                            {akademikSublinks.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => handleNavClick()}
                                className={`px-3 py-2 rounded-xl text-[13.5px] font-semibold transition-all duration-150 flex items-center justify-between group/link ${
                                  scrolled
                                    ? 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50 active:bg-slate-100'
                                    : 'text-white/90 hover:text-[#facc15] hover:bg-white/10 active:bg-white/15'
                                }`}
                              >
                                <span className="leading-snug">{sub.label}</span>
                                <ChevronRight
                                  className={`w-3.5 h-3.5 transition-colors ${
                                    scrolled
                                      ? 'text-slate-400 group-hover/link:text-emerald-700'
                                      : 'text-white/40 group-hover/link:text-[#facc15]'
                                  }`}
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full font-sans text-[13px] whitespace-nowrap transition-all duration-200 ${
                      active
                        ? 'bg-[#facc15] text-slate-950 font-bold shadow-xs ring-2 ring-[#facc15]/50'
                        : scrolled
                        ? 'text-slate-700 hover:text-slate-950 hover:bg-white font-semibold'
                        : 'text-white/85 hover:text-white hover:bg-white/15 font-medium'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Desktop: Tombol PPDB */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (pathname === '/') {
                    window.dispatchEvent(new CustomEvent('open-ppdb-registration'));
                  } else {
                    window.location.href = '/?ppdb=open#ppdb';
                  }
                }}
                className={`inline-flex items-center gap-1.5 font-bold transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap ${
                  scrolled
                    ? 'px-4 py-1.5 rounded-full bg-[#facc15] hover:bg-amber-400 text-slate-950 text-[12.5px] shadow-sm border border-amber-300'
                    : 'px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-blue-950 text-[12.5px] uppercase tracking-wider'
                }`}
              >
                <span>Daftar PPDB</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
