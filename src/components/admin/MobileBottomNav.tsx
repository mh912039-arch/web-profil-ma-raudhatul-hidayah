'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarClock,
  GraduationCap,
  CalendarDays,
  Newspaper,
  Users,
  Trophy,
  Menu,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface MobileBottomNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  userRole?: 'admin' | 'guru' | 'siswa';
  unreadCount?: number;
  onOpenMenu?: () => void;
}

interface NavItem {
  id: string;
  targetTab?: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  matchTabs: AdminTab[];
  isMenuAction?: boolean;
}

export function MobileBottomNav({
  activeTab,
  setActiveTab,
  userRole = 'admin',
  unreadCount = 0,
  onOpenMenu,
}: MobileBottomNavProps) {
  // Navigasi Bawah Terpersonalisasi per Peran (Admin, Guru, Siswa)
  const getNavItems = (): NavItem[] => {
    if (userRole === 'siswa') {
      return [
        {
          id: 'overview',
          targetTab: 'overview',
          label: 'Beranda',
          icon: LayoutDashboard,
          matchTabs: ['overview'],
        },
        {
          id: 'schedules',
          targetTab: 'schedules',
          label: 'Jadwal',
          icon: CalendarClock,
          matchTabs: ['schedules'],
        },
        {
          id: 'calendar',
          targetTab: 'calendar',
          label: 'Kalender',
          icon: CalendarDays,
          matchTabs: ['calendar', 'agenda'],
        },
        {
          id: 'achievements',
          targetTab: 'achievements',
          label: 'Prestasi',
          icon: Trophy,
          matchTabs: ['achievements', 'gallery', 'articles'],
        },
        {
          id: 'menu',
          label: 'Menu',
          icon: Menu,
          isMenuAction: true,
          matchTabs: ['facilities', 'contact', 'profile', 'messages'],
        },
      ];
    }

    if (userRole === 'guru') {
      return [
        {
          id: 'overview',
          targetTab: 'overview',
          label: 'Beranda',
          icon: LayoutDashboard,
          matchTabs: ['overview'],
        },
        {
          id: 'schedules',
          targetTab: 'schedules',
          label: 'Jadwal',
          icon: CalendarClock,
          matchTabs: ['schedules'],
        },
        {
          id: 'classes',
          targetTab: 'classes',
          label: 'Kelas',
          icon: GraduationCap,
          matchTabs: ['classes', 'teachers'],
        },
        {
          id: 'calendar',
          targetTab: 'calendar',
          label: 'Agenda',
          icon: CalendarDays,
          matchTabs: ['calendar', 'agenda'],
        },
        {
          id: 'menu',
          label: 'Menu',
          icon: Menu,
          isMenuAction: true,
          matchTabs: ['articles', 'achievements', 'facilities', 'gallery', 'users'],
        },
      ];
    }

    // Default: Admin
    return [
      {
        id: 'overview',
        targetTab: 'overview',
        label: 'Beranda',
        icon: LayoutDashboard,
        matchTabs: ['overview', 'homepage', 'profile', 'contact'],
      },
      {
        id: 'schedules',
        targetTab: 'schedules',
        label: 'Jadwal',
        icon: CalendarClock,
        matchTabs: ['schedules', 'classes', 'teachers'],
      },
      {
        id: 'users',
        targetTab: 'users',
        label: 'Pengguna',
        icon: Users,
        matchTabs: ['users', 'activation'],
      },
      {
        id: 'articles',
        targetTab: 'articles',
        label: 'Warta',
        icon: Newspaper,
        badge: unreadCount > 0 ? unreadCount : undefined,
        matchTabs: ['articles', 'achievements', 'extracurricular', 'facilities', 'gallery', 'messages', 'ppdb', 'registrations'],
      },
      {
        id: 'menu',
        label: 'Menu',
        icon: Menu,
        isMenuAction: true,
        matchTabs: [],
      },
    ];
  };

  const navItems = getNavItems();

  const handleItemClick = (item: NavItem) => {
    if (item.isMenuAction) {
      if (onOpenMenu) {
        onOpenMenu();
      }
    } else if (item.targetTab) {
      setActiveTab(item.targetTab);
    }
  };

  return (
    <nav
      aria-label="Navigasi Aplikasi Mobile"
      className="fixed bottom-3 inset-x-0 z-40 lg:hidden px-3 pointer-events-none safe-bottom"
    >
      <div className="max-w-[420px] mx-auto pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.14),0_2px_8px_rgba(15,23,42,0.06)] rounded-3xl p-1.5 flex items-center justify-between gap-1 ring-1 ring-black/[0.03]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matchTabs.includes(activeTab);

          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.12 }}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl select-none transition-colors duration-200 cursor-pointer ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label={item.label}
            >
              {/* Sliding Spring Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="floatingActiveTabPill"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 32,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 bg-[#1e3a8a] rounded-2xl shadow-sm"
                />
              )}

              {/* Content Layer */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                    }`}
                  />
                  {item.badge && item.badge > 0 ? (
                    <span
                      className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-3.5 px-1 rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-xs transition-colors ${
                        isActive ? 'bg-[#facc15] text-slate-950' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  ) : null}
                </div>

                <span
                  className={`text-[10px] mt-1 font-semibold tracking-tight transition-colors duration-200 ${
                    isActive ? 'font-bold text-white' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
