'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Phone,
  Mail,
  Instagram,
} from 'lucide-react';
import { fetchPublicProfile } from '@/lib/publicProfileClient';
import { MobileBottomBar } from './MobileBottomBar';

export function StitchNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none transition-all duration-300">
      {/* Topbar: SMP Xaverius 2 inspired Deep Navy (#1E3A8A) with Amber Gold (#F59E0B) highlights (Khusus Desktop & Tablet) */}
      <div
        className={`w-full pointer-events-auto bg-[#1e3a8a] text-slate-100 text-[11.5px] border-b border-amber-500/40 shrink-0 hidden md:flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'max-h-0 opacity-0 -translate-y-3 pointer-events-none overflow-hidden h-0 py-0 border-transparent'
            : 'max-h-12 opacity-100 translate-y-0 h-8 min-h-[32px]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full h-full min-h-[32px]">
          <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0 h-full">
            <span className="inline-flex items-center gap-1.5 text-slate-200 whitespace-nowrap shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{navProfile.hoursWeekdays}</span>
            </span>
            <a
              href={`https://wa.me/${navProfile.whatsapp || '628176614723'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{navProfile.phone}</span>
            </a>
            <a
              href={`mailto:${navProfile.email}`}
              className="inline-flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 max-w-[260px] sm:max-w-none"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{navProfile.email}</span>
            </a>
          </div>

          <div className="md:hidden flex items-center gap-1.5 text-[11px] text-slate-200 whitespace-nowrap shrink-0">
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{navProfile.hoursWeekdays}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Social Media Icons (IG, TikTok, WhatsApp) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/ma_raudlatulhidayah/"
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
                href="https://www.tiktok.com/@ma_raudlatulhidayah"
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

      {/* Main Navbar Container: Dynamic Adaptive Pill (Full-width at top, Floating Pill on scroll) */}
      <div
        className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'max-w-6xl w-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)] lg:w-[calc(100%-4rem)] mx-auto mt-2 sm:mt-2.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0b1329]/92 backdrop-blur-xl border border-white/20 shadow-[0_16px_40px_rgba(15,23,42,0.45)] ring-1 ring-amber-400/25'
            : 'w-full bg-[#1e3a8a] border-b-[3px] border-[#facc15] py-3.5 shadow-[0_4px_20px_rgba(15,23,42,0.25)]'
        }`}
      >
        <div
          className={`flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 ${
            scrolled ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
          }`}
        >
          {/* Logo & Emblem Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 transition-transform duration-200 active:scale-[0.98]"
          >
            <div
              className={`relative shrink-0 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm ${
                scrolled ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-10 h-10'
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
                className={`font-serif font-bold text-white tracking-wide leading-tight group-hover:text-[#facc15] transition-all duration-300 ${
                  scrolled ? 'text-[15px] sm:text-[17px]' : 'text-[17px] sm:text-[19px]'
                }`}
              >
                MAS Raudlatul Hidayah
              </span>
              {!scrolled && (
                <span className="text-[10.5px] font-sans font-medium text-amber-300/90 tracking-wider uppercase hidden sm:block">
                  Mauk · Kab. Tangerang
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 transition-all duration-300 ${
              scrolled
                ? 'px-2 py-1 rounded-full bg-white/5 border border-white/10 shadow-xs'
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
                          className={`rounded-2xl border-2 border-[#facc15]/80 shadow-[0_16px_48px_rgba(15,23,42,0.45)] p-2 flex flex-col gap-1 ring-1 ring-[#facc15]/30 ${
                            scrolled ? 'bg-[#0b1329]/95 backdrop-blur-xl' : 'bg-[#1e3a8a]'
                          }`}
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
                          className={`rounded-2xl border-2 border-[#facc15]/80 shadow-[0_16px_48px_rgba(15,23,42,0.45)] p-2 flex flex-col gap-1 ring-1 ring-[#facc15]/30 ${
                            scrolled ? 'bg-[#0b1329]/95 backdrop-blur-xl' : 'bg-[#1e3a8a]'
                          }`}
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
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Desktop PPDB Button */}
            <button
              type="button"
              onClick={() => {
                if (pathname === '/') {
                  window.dispatchEvent(new CustomEvent('open-ppdb-registration'));
                } else {
                  window.location.href = '/?ppdb=open#ppdb';
                }
              }}
              className={`hidden md:inline-flex items-center gap-1.5 font-bold transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap ${
                scrolled
                  ? 'px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[12px] shadow-amber-500/20'
                  : 'px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-blue-950 text-[12.5px] uppercase tracking-wider'
              }`}
            >
              <span>Daftar PPDB</span>
            </button>

            {/* Mobile Quick Action Pill */}
            <a
              href={`https://wa.me/${navProfile.whatsapp || '628176614723'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/30 text-[11.5px] font-bold active:scale-95 transition-all shadow-xs"
              title="Chat WhatsApp Resmi"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Kontak WA</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Bottom Tab Bar Component */}
    <MobileBottomBar />
  </>
);
}
