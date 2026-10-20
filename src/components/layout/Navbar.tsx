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
  Microscope,
  Clock,
  Newspaper,
  Camera,
  History,
  Target,
  Quote,
} from 'lucide-react';

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
        title: 'Sambutan Kepala Madrasah',
        description: 'Visi pendidikan A. Khutbi. AR, S.Pd',
        href: '/profil#sambutan',
        icon: <Quote className="w-4 h-4 text-emerald-600" />,
      },
      {
        title: 'Sejarah & Profil',
        description: 'Awal mula pendidikan dasar hingga pendirian madrasah',
        href: '/profil#sejarah',
        icon: <History className="w-4 h-4 text-emerald-600" />,
      },
      {
        title: 'Visi, Misi & Tujuan',
        description: 'Pondasi membina akidah dan akhlakul karimah',
        href: '/profil#visi-misi',
        icon: <Target className="w-4 h-4 text-emerald-600" />,
      },
      {
        title: 'Guru & Staf',
        description: 'Tenaga pendidik berkompeten dan berdedikasi',
        href: '/profil#guru',
        icon: <Users className="w-4 h-4 text-emerald-600" />,
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
        description: 'Pembelajaran intrakurikuler dan penguatan karakter',
        href: '/akademik#program-smp',
        icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      },
      {
        title: 'Projek Penguatan Pelajar (P5)',
        description: 'Pengembangan karakter dan kemandirian siswa SMP',
        href: '/akademik#program-smp',
        icon: <Target className="w-4 h-4 text-emerald-600" />,
      },
      {
        title: 'Perpustakaan & Khazanah Turots',
        description: 'Koleksi literatur keilmuan, buku bacaan, dan kitab keagamaan',
        href: '/akademik#fasilitas',
        icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
      },
      {
        title: 'Bimbingan Lanjut SMA/SMK/MA',
        description: 'Pendampingan persiapan menuju jenjang sekolah lanjutan favorit',
        href: '/akademik#program-smp',
        icon: <Compass className="w-4 h-4 text-emerald-600" />,
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
        description: 'Tahfidz, Pramuka, Marawis, Olahraga & Sains Dasar',
        href: '/kesiswaan#ekskul',
        icon: <Award className="w-4 h-4 text-emerald-600" />,
      },
      {
        title: 'Prestasi Siswa',
        description: 'Capaian medali kejuaraan dan lulusan berprestasi',
        href: '/prestasi',
        icon: <Award className="w-4 h-4 text-emerald-600" />,
      },
      {
        title: 'Galeri Foto Kegiatan',
        description: 'Dokumentasi visual dinamika kehidupan santri',
        href: '/galeri',
        icon: <Camera className="w-4 h-4 text-emerald-600" />,
      },
    ],
  },
  {
    label: 'Warta & Berita',
    href: '/warta',
  },
  {
    label: 'Kontak',
    href: '/kontak',
  },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 bg-white ${
        isScrolled ? 'shadow-md border-b border-stone-200 py-3' : 'border-b border-stone-200/80 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-stone-100 p-1.5 border border-stone-200 flex items-center justify-center flex-shrink-0">
              <img
                src="/school-logo.png"
                alt="Logo MA Raudhatul Hidayah"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-lg text-stone-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                MA Raudhatul Hidayah
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                Mauk, Tangerang
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const isDropdownOpen = openDropdown === item.label;

              if (item.hasDropdown && item.dropdownItems) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                          : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180 text-emerald-700' : 'text-stone-400'
                        }`}
                      />
                    </Link>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-stone-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-3 py-1.5 mb-1 border-b border-stone-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                            {item.label}
                          </span>
                        </div>
                        {item.dropdownItems.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-stone-50 transition-colors group/item"
                          >
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors flex-shrink-0 mt-0.5">
                              {sub.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-stone-900 group-hover/item:text-emerald-800 transition-colors">
                                {sub.title}
                              </p>
                              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                                {sub.description}
                              </p>
                            </div>
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
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Contact Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-stone-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {item.label}
              </Link>
            </div>
          ))}
          <div className="pt-3 border-t border-stone-100">
            <Link
              href="/kontak"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
