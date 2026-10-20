'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Phone,
  BookOpen,
  Award,
  Users,
  Compass,
  GraduationCap,
  Target,
  History,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

interface SubMenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: SubMenuItem[];
}

const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Tentang Kami',
    href: '/profil',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Sejarah & Profil Yayasan',
        description: 'Awal mula pendidikan dasar hingga pendirian madrasah',
        href: '/profil#sejarah',
        icon: <History className="w-4 h-4 text-amber-600" />,
      },
      {
        title: 'Visi, Misi & Tujuan',
        description: 'Pondasi membina akidah dan akhlakul karimah',
        href: '/profil#visi-misi',
        icon: <Target className="w-4 h-4 text-amber-600" />,
      },
      {
        title: 'Kepala Sekolah & Dewan Guru',
        description: 'Tenaga pendidik berkompeten dan berdedikasi',
        href: '/profil#guru',
        icon: <Users className="w-4 h-4 text-amber-600" />,
      },
    ],
  },
  {
    label: 'Akademik',
    href: '/akademik',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Kurikulum Merdeka SMP',
        description: 'Pembelajaran Fase D dan penguatan nalar kritis',
        href: '/akademik#program-smp',
        icon: <GraduationCap className="w-4 h-4 text-amber-600" />,
      },
      {
        title: 'Projek Profil Pelajar (P5)',
        description: 'Pengembangan karakter dan kemandirian siswa SMP',
        href: '/akademik#program-smp',
        icon: <Target className="w-4 h-4 text-amber-600" />,
      },
      {
        title: 'Perpustakaan & Khazanah Turots',
        description: 'Koleksi literatur pengetahuan umum dan kitab keagamaan',
        href: '/akademik#fasilitas',
        icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      },
      {
        title: 'Bimbingan Lanjut SMA/SMK/MA',
        description: 'Pendampingan persiapan menuju jenjang sekolah favorit',
        href: '/akademik#program-smp',
        icon: <Compass className="w-4 h-4 text-amber-600" />,
      },
    ],
  },
  {
    label: 'Kesiswaan',
    href: '/kesiswaan',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Ekstrakurikuler Siswa',
        description: 'Pramuka, Tahfidz, Olahraga, dan Seni Islami',
        href: '/kesiswaan#ekskul',
        icon: <Award className="w-4 h-4 text-amber-600" />,
      },
      {
        title: 'Prestasi & Capaian',
        description: 'Prestasi kejuaraan dan distribusi lulusan berprestasi',
        href: '/prestasi',
        icon: <Award className="w-4 h-4 text-amber-600" />,
      },
    ],
  },
  { label: 'Warta', href: '/warta' },
  { label: 'Kontak', href: '/kontak' },
];

export const EditorialNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-200">
      {/* Top Academic Info Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>NPSN: {schoolData.profile.npsn}</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Kec. Mauk, Kab. Tangerang</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${schoolData.profile.phone.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{schoolData.profile.phone}</span>
            </a>
            <span className="hidden sm:inline-block text-slate-600">·</span>
            <span className="hidden sm:inline-block text-amber-300/90 font-mono text-[10px] tracking-wider uppercase">
              Jenjang SMP
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`border-b transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-slate-200/90 shadow-sm'
            : 'bg-white border-slate-200/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Identity & Crest */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-xl bg-slate-900 p-2 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-slate-800 transition-colors">
                <img
                  src="/school-logo.png"
                  alt="Logo MA Raudhatul Hidayah"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base sm:text-lg text-slate-950 tracking-tight leading-tight group-hover:text-amber-700 transition-colors">
                  MA RAUDHATUL HIDAYAH
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Sekolah Menengah Pertama (SMP) · Terakreditasi A
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isOpen = activeDropdown === item.label;

                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(isOpen ? null : item.label)
                        }
                        className={`px-3.5 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-1.5 transition-colors ${
                          isActive || isOpen
                            ? 'text-slate-950 bg-slate-100/80'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                        }`}
                        aria-expanded={isOpen}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-amber-600' : 'text-slate-400'
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu Box */}
                      {isOpen && (
                        <div className="absolute left-0 top-full pt-2 w-80 z-50">
                          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 overflow-hidden ring-1 ring-black/5">
                            <div className="px-3 py-2 border-b border-slate-100 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Menu {item.label}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              {item.dropdownItems?.map((sub) => (
                                <Link
                                  key={sub.title}
                                  href={sub.href}
                                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors group/item"
                                >
                                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover/item:bg-amber-100 group-hover/item:text-amber-800 transition-colors mt-0.5 flex-shrink-0">
                                    {sub.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-xs sm:text-sm text-slate-900 group-hover/item:text-amber-800 transition-colors">
                                      {sub.title}
                                    </div>
                                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                      {sub.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-slate-950 bg-slate-100/80 font-bold'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <span>Hubungi Sekolah</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                aria-label="Buka Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isOpen = activeDropdown === item.label;

              if (item.hasDropdown) {
                return (
                  <div key={item.label} className="py-1">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown(isOpen ? null : item.label)
                      }
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? 'rotate-180 text-amber-600' : 'text-slate-400'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="pl-4 pr-2 pt-1 pb-2 space-y-1">
                        {item.dropdownItems?.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                          >
                            <span className="font-semibold block text-slate-900">
                              {sub.title}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {sub.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200">
            <Link
              href="/kontak"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              <span>Hubungi Sekolah</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
