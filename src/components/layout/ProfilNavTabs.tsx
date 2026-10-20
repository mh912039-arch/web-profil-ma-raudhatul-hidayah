'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ProfilNavTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Visi & Misi Sekolah', href: '/profil/visi-misi' },
    { label: 'Sejarah & Perjalanan Yayasan', href: '/profil/sejarah' },
    { label: 'Fasilitas Belajar Siswa', href: '/profil/fasilitas' },
    { label: 'Guru & Staf', href: '/profil/guru-tendik' },
  ];

  return (
    <div className="w-full bg-surface-container-lowest/90 border-b border-surface-container sticky top-[69px] z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none" aria-label="Profil Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`px-4 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs border-b-2 border-amber-400'
                    : 'bg-white/80 text-slate-600 hover:text-amber-700 hover:bg-amber-50/50 border border-slate-200/60'
                }`}
              >
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
