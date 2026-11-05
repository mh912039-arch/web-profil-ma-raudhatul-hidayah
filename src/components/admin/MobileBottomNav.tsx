'use client';

import React from 'react';
import {
  LayoutDashboard,
  CalendarClock,
  GraduationCap,
  CalendarDays,
  Newspaper,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface MobileBottomNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  userRole?: 'admin' | 'guru' | 'siswa';
  unreadCount?: number;
}

export function MobileBottomNav({
  activeTab,
  setActiveTab,
  userRole = 'admin',
  unreadCount = 0,
}: MobileBottomNavProps) {
  // 5 Tab Utama Navigasi Bawah sesuai rancangan Figma Mobile MAS RH
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    matchTabs: AdminTab[];
  }[] = [
    {
      id: 'overview',
      label: 'Beranda',
      icon: LayoutDashboard,
      matchTabs: ['overview', 'homepage', 'profile'],
    },
    {
      id: 'schedules',
      label: 'Jadwal',
      icon: CalendarClock,
      matchTabs: ['schedules'],
    },
    {
      id: 'classes',
      label: 'Kelas',
      icon: GraduationCap,
      matchTabs: ['classes', 'teachers', 'website-teachers', 'users', 'activation'],
    },
    {
      id: 'calendar',
      label: 'Kalender',
      icon: CalendarDays,
      matchTabs: ['calendar', 'agenda'],
    },
    {
      id: 'articles',
      label: 'Warta',
      icon: Newspaper,
      badge: unreadCount > 0 ? unreadCount : undefined,
      matchTabs: ['articles', 'achievements', 'extracurricular', 'facilities', 'gallery', 'messages'],
    },
  ];

  return (
    <nav
      aria-label="Navigasi Aplikasi Mobile"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-bottom"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matchTabs.includes(activeTab);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-150 active:scale-[0.95] select-none ${
                isActive
                  ? 'text-blue-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-150 ${
                  isActive ? 'bg-blue-50 text-blue-700 shadow-2xs' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-150 ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>

              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-blue-700' : 'text-slate-500'}`}>
                {item.label}
              </span>

              {/* Titik indikator aktif halus khas aplikasi native */}
              {isActive && (
                <span className="absolute bottom-0 w-1.5 h-1 bg-blue-700 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
