'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Clock,
  Phone,
  Mail,
  Instagram,
  LogIn,
} from 'lucide-react';

export function StitchNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [mobileProfilOpen, setMobileProfilOpen] = useState(true);
  const [isAkademikOpen, setIsAkademikOpen] = useState(false);
  const [mobileAkademikOpen, setMobileAkademikOpen] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const akademikDropdownRef = useRef<HTMLDivElement>(null);
  const akademikTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [navProfile, setNavProfile] = useState({
    phone: '0817-6614-723',
    whatsapp: '628176614723',
    email: 'info@maraudhatulhidayah.sch.id',
    hoursWeekdays: '07.00 - 15.30 WIB',
  });

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) {
          setNavProfile({
            phone: data.profile.phone || '0817-6614-723',
            whatsapp: data.profile.whatsapp || '628176614723',
            email: data.profile.email || 'info@maraudhatulhidayah.sch.id',
            hoursWeekdays: data.profile.hoursWeekdays || '07.00 - 15.30 WIB',
          });
        }
      })
      .catch((err) => console.warn('Could not fetch nav profile:', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleNavClick = (_href?: string) => {
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
    { label: 'Kurikulum & Mata Pelajaran', href: '/akademik/kurikulum' },
    { label: 'Ekstrakurikuler', href: '/akademik/ekstrakurikuler' },
    { label: 'Foto Juara Ekstrakurikuler', href: '/akademik/foto-juara' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('#')) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Topbar: SMP Xaverius 2 inspired Deep Navy (#1E3A8A) with Amber Gold (#F59E0B) highlights */}
      <div
        className={`w-full bg-[#1e3a8a] text-slate-100 text-[11.5px] border-b border-amber-500/40 transition-all duration-300 ${
          scrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'py-1.5 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{navProfile.hoursWeekdays}</span>
            </span>
            <a
              href={`https://wa.me/${navProfile.whatsapp || '628176614723'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{navProfile.phone}</span>
            </a>
            <a
              href={`mailto:${navProfile.email}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{navProfile.email}</span>
            </a>
          </div>

          <div className="md:hidden flex items-center gap-1.5 text-[11px] text-slate-200">
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{navProfile.hoursWeekdays}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Social Media Icons (IG, TikTok, WhatsApp) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Instagram */}
              <a
                href="https://instagram.com/maraudhatulhidayah"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Resmi"
                aria-label="Buka Instagram Resmi"
                className="p-1 rounded-full text-slate-200 hover:text-pink-300 hover:bg-white/15 transition-all duration-150 active:scale-95 flex items-center justify-center"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@maraudhatulhidayah"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok Resmi"
                aria-label="Buka TikTok Resmi"
                className="p-1 rounded-full text-slate-200 hover:text-cyan-300 hover:bg-white/15 transition-all duration-150 active:scale-95 flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.1a2.89 2.89 0 0 1 2.373-4.537c.314 0 .618.05.903.144V9.414a6.334 6.334 0 0 0-.903-.065A6.334 6.334 0 0 0 3.144 15.68a6.334 6.334 0 0 0 6.334 6.334 6.334 6.334 0 0 0 6.334-6.334V8.583a8.17 8.17 0 0 0 4.777 1.549V6.686h-1Z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/628176614723"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Resmi"
                aria-label="Buka Chat WhatsApp"
                className="p-1 rounded-full text-slate-200 hover:text-emerald-300 hover:bg-white/15 transition-all duration-150 active:scale-95 flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.784 2.791.784 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.77-5.768-5.77zm3.377 8.215c-.145.408-.838.777-1.157.828-.319.052-.734.075-2.383-.605-1.986-.818-3.256-2.839-3.355-2.971-.099-.133-.805-1.072-.805-2.046 0-.974.509-1.453.69-1.649.182-.196.398-.245.53-.245s.266.005.383.011c.124.006.29-.047.453.346.166.399.566 1.383.616 1.483.05.1.083.217.017.35-.067.133-.1.217-.199.333-.1.117-.209.261-.299.35-.1.1-.205.209-.089.408.117.2 0.518.855 1.11 1.382.763.679 1.405.889 1.605.989.2.1.317.083.433-.05.117-.133.5-.583.633-.783.133-.2.267-.167.45-.1.183.067 1.166.55 1.366.65.2.1.333.15.383.233.05.083.05.483-.095.891z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.393A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.223-1.167l-.303-.18-3.132.875.836-3.05-.198-.315A8.166 8.166 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                </svg>
              </a>
            </div>

            {/* Subtle Divider */}
            <span className="w-px h-3.5 bg-blue-400/40" aria-hidden="true" />

            <button
              type="button"
              onClick={() => {
                if (pathname === '/') {
                  window.dispatchEvent(new CustomEvent('open-ppdb-registration'));
                } else {
                  window.location.href = '/?ppdb=open#ppdb';
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-[11px] uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <span>PPDB 2027/2028</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`w-full transition-all duration-300 border-b-[3px] border-[#facc15] bg-[#1e3a8a] ${
          scrolled
            ? 'shadow-[0_8px_30px_rgba(15,23,42,0.35)] py-2.5'
            : 'shadow-[0_4px_20px_rgba(15,23,42,0.25)] py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Emblem Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group shrink-0 transition-transform duration-200 active:scale-[0.98]"
          >
            <div className="relative w-10 h-10 shrink-0 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-sm">
              <Image
                src="/school-logo.png"
                alt="Emblem MAS Raudhatul Hidayah"
                width={36}
                height={36}
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-[17px] sm:text-[19px] font-bold text-white tracking-wide leading-tight group-hover:text-[#facc15] transition-colors">
                MAS Raudhatul Hidayah
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Deep Navy & Amber Gold theme with Frosted Glassmorphism) */}
          <nav
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md"
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
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-[13px] whitespace-nowrap transition-all duration-200 ${
                        active || isProfilOpen
                          ? 'bg-[#facc15] text-slate-950 font-bold shadow-xs ring-2 ring-[#facc15]/50'
                          : 'text-white/85 hover:text-white hover:bg-white/15 font-medium'
                      }`}
                      aria-expanded={isProfilOpen}
                      aria-haspopup="true"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isProfilOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu Container */}
                    {isProfilOpen && (
                      <div className="absolute top-full left-0 pt-2 z-50 min-w-[250px] animate-in fade-in zoom-in-95 duration-150 origin-top-left">
                        <div
                          className="rounded-2xl border-2 border-[#facc15]/80 shadow-[0_16px_48px_rgba(15,23,42,0.45)] p-2 flex flex-col gap-1 ring-1 ring-[#facc15]/30 bg-[#1e3a8a]"
                        >
                          {profilSublinks.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              onClick={() => handleNavClick(sub.href)}
                              className="px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-white/90 hover:text-[#facc15] hover:bg-white/10 active:bg-white/15 transition-all duration-150 flex items-center justify-between group/link"
                            >
                              <span className="leading-snug">{sub.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover/link:text-[#facc15] transition-colors" />
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
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans text-[13px] whitespace-nowrap transition-all duration-200 ${
                        active || isAkademikOpen
                          ? 'bg-[#facc15] text-slate-950 font-bold shadow-xs ring-2 ring-[#facc15]/50'
                          : 'text-white/85 hover:text-white hover:bg-white/15 font-medium'
                      }`}
                      aria-expanded={isAkademikOpen}
                      aria-haspopup="true"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isAkademikOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu Container */}
                    {isAkademikOpen && (
                      <div className="absolute top-full left-0 pt-2 z-50 min-w-[250px] animate-in fade-in zoom-in-95 duration-150 origin-top-left">
                        <div
                          className="rounded-2xl border-2 border-[#facc15]/80 shadow-[0_16px_48px_rgba(15,23,42,0.45)] p-2 flex flex-col gap-1 ring-1 ring-[#facc15]/30 bg-[#1e3a8a]"
                        >
                          {akademikSublinks.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              onClick={() => handleNavClick(sub.href)}
                              className="px-3 py-2 rounded-xl text-[13.5px] font-semibold text-white/90 hover:text-[#facc15] hover:bg-white/10 active:bg-white/15 transition-all duration-150 flex items-center justify-between group/link"
                            >
                              <span className="leading-snug">{sub.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover/link:text-[#facc15] transition-colors" />
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
                      : 'text-white/85 hover:text-white hover:bg-white/15 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-[0.95] transition-all border border-white/20 shadow-xs"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Animated Dropdown */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t border-white/15 mt-2.5 px-4 py-5 shadow-2xl flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-3 duration-200 max-h-[calc(100vh-80px)] overflow-y-auto bg-[#1e3a8a] text-white"
          >
            {navLinks.map((link) => {
              if (link.label === 'Profil') {
                const active = isActive('/profil');
                return (
                  <div key={link.label} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileProfilOpen((prev) => !prev)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                        active
                          ? 'bg-[#facc15] text-slate-950 font-bold border-l-4 border-amber-300'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileProfilOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileProfilOpen && (
                      <div className="pl-3 pr-2 py-2 flex flex-col gap-1 bg-white/5 rounded-xl mt-1.5 border border-white/10 animate-in fade-in duration-150">
                        {profilSublinks.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => handleNavClick(sub.href)}
                            className="px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium text-white/80 hover:text-[#facc15] hover:bg-white/10 transition-colors"
                          >
                            <span>{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (link.label === 'Akademik') {
                const active = isActive('/akademik');
                return (
                  <div key={link.label} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileAkademikOpen((prev) => !prev)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                        active
                          ? 'bg-[#facc15] text-slate-950 font-bold border-l-4 border-amber-300'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mobileAkademikOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileAkademikOpen && (
                      <div className="pl-3 pr-2 py-2 flex flex-col gap-1 bg-white/5 rounded-xl mt-1.5 border border-white/10 animate-in fade-in duration-150">
                        {akademikSublinks.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => handleNavClick(sub.href)}
                            className="px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium text-white/80 hover:text-[#facc15] hover:bg-white/10 transition-colors"
                          >
                            <span>{sub.label}</span>
                          </Link>
                        ))}
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                    active
                      ? 'bg-[#facc15] text-slate-950 font-bold border-l-4 border-amber-300'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      active ? 'text-slate-950' : 'text-white/50'
                    }`}
                  />
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/15 flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[12px] font-semibold text-white/80">Media Sosial Sekolah:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com/maraudhatulhidayah"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram Resmi"
                    aria-label="Instagram"
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:text-pink-300 hover:bg-white/20 border border-white/15 shadow-2xs transition-colors flex items-center justify-center"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://tiktok.com/@maraudhatulhidayah"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="TikTok Resmi"
                    aria-label="TikTok"
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:text-cyan-300 hover:bg-white/20 border border-white/15 shadow-2xs transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.1a2.89 2.89 0 0 1 2.373-4.537c.314 0 .618.05.903.144V9.414a6.334 6.334 0 0 0-.903-.065A6.334 6.334 0 0 0 3.144 15.68a6.334 6.334 0 0 0 6.334 6.334 6.334 6.334 0 0 0 6.334-6.334V8.583a8.17 8.17 0 0 0 4.777 1.549V6.686h-1Z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/628176614723"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp Resmi"
                    aria-label="WhatsApp"
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:text-emerald-300 hover:bg-white/20 border border-white/15 shadow-2xs transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.784 2.791.784 3.181 0 5.767-2.587 5.768-5.766.001-3.181-2.585-5.77-5.768-5.77zm3.377 8.215c-.145.408-.838.777-1.157.828-.319.052-.734.075-2.383-.605-1.986-.818-3.256-2.839-3.355-2.971-.099-.133-.805-1.072-.805-2.046 0-.974.509-1.453.69-1.649.182-.196.398-.245.53-.245s.266.005.383.011c.124.006.29-.047.453.346.166.399.566 1.383.616 1.483.05.1.083.217.017.35-.067.133-.1.217-.199.333-.1.117-.209.261-.299.35-.1.1-.205.209-.089.408.117.2 0.518.855 1.11 1.382.763.679 1.405.889 1.605.989.2.1.317.083.433-.05.117-.133.5-.583.633-.783.133-.2.267-.167.45-.1.183.067 1.166.55 1.366.65.2.1.333.15.383.233.05.083.05.483-.095.891z"/>
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.393A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.167 8.167 0 0 1-4.223-1.167l-.303-.18-3.132.875.836-3.05-.198-.315A8.166 8.166 0 0 1 3.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                    </svg>
                  </a>
                </div>
              </div>

              <Link
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-semibold text-[13.5px] border border-white/10 active:scale-[0.98] transition-transform shadow-xs"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Portal Masuk (Admin, Guru, Siswa)</span>
              </Link>

              <Link
                href="/kontak"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-bold text-[13.5px] border-b-2 border-amber-600 active:scale-[0.98] transition-transform shadow-sm"
              >
                <span>Hubungi Sekretariat Sekolah</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
