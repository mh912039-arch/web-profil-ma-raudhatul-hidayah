'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Globe2,
  CheckCircle2,
  Compass,
  FileText,
  Radio,
} from 'lucide-react';

interface DistributionItem {
  label: string;
  val: number;
  percentage: number;
  color: string;
}

interface TopPageItem {
  path: string;
  views: number;
}

interface Last7DaysItem {
  date: string;
  dayLabel: string;
  views: number;
  uniques: number;
}

interface VisitorMetricsData {
  today: number;
  uniqueToday: number;
  yesterday: number;
  uniqueYesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  totalAccumulated: number;
  distribution: DistributionItem[];
  last7Days: Last7DaysItem[];
  topPages: TopPageItem[];
  lastVisitTime: string | null;
}

export const VisitorAnalyticsSection: React.FC = () => {
  const [data, setData] = useState<VisitorMetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/visitors', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Gagal memuat analitik pengunjung:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh every 30 seconds while on admin overview
    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  // Handler: Test Simulation Hit
  const handleSimulateVisit = async () => {
    setIsSimulating(true);
    try {
      const testPaths = ['/', '/ppdb', '/akademik/foto-juara', '/prestasi', '/profil/identitas'];
      const randomPath = testPaths[Math.floor(Math.random() * testPaths.length)];
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: randomPath,
          referrer: 'https://google.com/search?q=ma+raudlatul+hidayah',
          isSimulation: true,
        }),
      });

      if (res.ok) {
        setFeedback(`Kunjungan uji coba ke "${randomPath}" berhasil dicatat!`);
        await fetchMetrics();
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch {
      setFeedback('Gagal mengirim simulasi kunjungan.');
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setIsSimulating(false);
    }
  };

  const distribution = data?.distribution || [
    { label: 'Hari Ini', val: 0, percentage: 0, color: 'bg-[#06b6d4]' },
    { label: 'Kemarin', val: 0, percentage: 0, color: 'bg-[#93c5fd]' },
    { label: 'Minggu Ini', val: 0, percentage: 0, color: 'bg-[#eab308]' },
    { label: 'Minggu Lalu', val: 0, percentage: 0, color: 'bg-[#3b82f6]' },
    { label: 'Bulan Ini', val: 0, percentage: 0, color: 'bg-[#16a34a]' },
    { label: 'Bulan Lalu', val: 0, percentage: 0, color: 'bg-[#be123c]' },
  ];

  const maxDistributionVal = Math.max(...distribution.map((d) => d.val), 10);
  // Calculate dynamic scale ticks
  const tickStep = Math.max(Math.ceil(maxDistributionVal / 5), 1);
  const scaleTicks = [
    0,
    tickStep,
    tickStep * 2,
    tickStep * 3,
    tickStep * 4,
    tickStep * 5,
  ];

  return (
    <div className="space-y-4">
      {/* Top Section Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-slate-900 tracking-tight">
              Statistik &amp; Distribusi Pengunjung Website
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Pelacak Domain Aktif
            </span>
          </div>
          <p className="text-[12.5px] text-slate-500 mt-0.5">
            Data trafik riil pengunjung halaman profil publik MA Raudlatul Hidayah saat diakses melalui domain resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Simulation button for testing */}
          <button
            type="button"
            onClick={handleSimulateVisit}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-semibold border border-slate-300/80 transition-all active:scale-95 disabled:opacity-60"
            title="Kirim 1 hit kunjungan uji coba untuk memverifikasi pergerakan grafik"
          >
            <Radio className={`w-3.5 h-3.5 text-blue-600 ${isSimulating ? 'animate-pulse' : ''}`} />
            <span>{isSimulating ? 'Mencatat...' : 'Uji Kunjungan (+1)'}</span>
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={fetchMetrics}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-[12px] font-semibold border border-slate-200 shadow-2xs transition-all active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Floating feedback alert */}
      {feedback && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[12.5px] font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Deep Navy Container */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1e3a8a] via-[#1e3a8a] to-[#172554] text-white p-5 sm:p-7 shadow-lg border border-blue-900/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* =========================================================
              Left Card: Grafik Distribusi Kunjungan (7 Cols)
          ========================================================= */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 sm:p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-300" />
                  <h4 className="font-sans font-bold text-[13.5px] sm:text-[14.5px] tracking-wider uppercase text-white/95">
                    GRAFIK DISTRIBUSI KUNJUNGAN
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#eab308] text-slate-950 text-[10.5px] font-extrabold tracking-wide uppercase shadow-xs">
                  Live Data
                </span>
              </div>

              {/* Horizontal Bar Chart Container */}
              <div className="relative mb-5 pt-1">
                {/* Vertical grid lines */}
                <div className="absolute inset-0 pl-28 pointer-events-none flex justify-between">
                  {scaleTicks.map((_, i) => (
                    <div key={i} className="h-full border-r border-white/10" />
                  ))}
                </div>

                <div className="relative z-10 space-y-3">
                  {distribution.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-28 text-right text-[12px] sm:text-[12.5px] font-semibold text-white/90 shrink-0">
                        {row.label}
                      </span>
                      <div className="flex-1 relative h-6 flex items-center bg-black/15 rounded-md p-0.5">
                        <div
                          style={{
                            width: `${row.percentage}%`,
                            minWidth: row.val > 0 ? '18px' : '0px',
                          }}
                          className={`h-full rounded-md ${row.color} shadow-xs transition-all duration-700 ease-out flex items-center justify-end pr-1.5`}
                        />
                        <span className="ml-2 font-mono text-[11.5px] font-bold text-white/90 shrink-0">
                          {row.val.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* X-Axis Dynamic Scale Numbers */}
            <div className="pt-2.5 border-t border-white/15">
              <div className="flex justify-between pl-28 text-[10.5px] sm:text-[11px] font-medium text-white/70 overflow-x-auto scrollbar-none">
                {scaleTicks.map((tick, i) => (
                  <span key={i}>{tick.toLocaleString('id-ID')}</span>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================
              Right Card: Metrik Kunjungan (5 Cols)
          ========================================================= */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 sm:p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/15 mb-4">
                <FileText className="w-5 h-5 text-[#facc15] shrink-0" />
                <h4 className="font-sans font-extrabold text-[18px] sm:text-[20px] text-[#facc15] tracking-tight">
                  Metrik Kunjungan
                </h4>
              </div>

              {/* Rows with real tracked values */}
              <div className="space-y-3.5">
                {/* Hari Ini */}
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#38bdf8] shrink-0" />
                    <span className="text-[13.5px] font-medium text-white">Hari Ini</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[15.5px] font-bold text-white">
                      {data?.today.toLocaleString('id-ID') ?? 0}
                    </span>
                    <span className="text-[10.5px] text-white/60">
                      ({data?.uniqueToday ?? 0} unik)
                    </span>
                  </div>
                </div>

                {/* Kemarin */}
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#93c5fd] shrink-0" />
                    <span className="text-[13.5px] font-medium text-white">Kemarin</span>
                  </div>
                  <span className="text-[15.5px] font-bold text-white">
                    {data?.yesterday.toLocaleString('id-ID') ?? 0}
                  </span>
                </div>

                {/* Minggu Ini */}
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-[#facc15] shrink-0" />
                    <span className="text-[13.5px] font-medium text-white">Minggu Ini</span>
                  </div>
                  <span className="text-[15.5px] font-bold text-white">
                    {data?.thisWeek.toLocaleString('id-ID') ?? 0}
                  </span>
                </div>

                {/* Bulan Ini */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-[#4ade80] shrink-0" />
                    <span className="text-[13.5px] font-medium text-white">Bulan Ini</span>
                  </div>
                  <span className="text-[15.5px] font-bold text-white">
                    {data?.thisMonth.toLocaleString('id-ID') ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Akumulasi Kunjungan + Status Badge */}
            <div className="pt-5 mt-5 border-t border-white/15 flex items-end justify-between">
              <div>
                <span className="text-[12px] font-medium text-white/80 block mb-0.5">
                  Akumulasi Kunjungan
                </span>
                <span className="font-sans font-extrabold text-[28px] sm:text-[34px] text-[#facc15] leading-none">
                  {data?.totalAccumulated.toLocaleString('id-ID') ?? 0}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15803d] text-white text-[11.5px] font-bold border border-[#22c55e]/30 shadow-xs">
                <Globe2 className="w-3.5 h-3.5 shrink-0 text-emerald-200" />
                <span>Pelacak Riil Aktif</span>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================
            Bottom Details: 7-Day Trend & Top Pages Visited
        ========================================================= */}
        <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Last 7 Days mini bar chart */}
          <div className="md:col-span-7 bg-white/5 rounded-xl p-3.5 border border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-2.5">
              Tren Trafik 7 Hari Terakhir
            </span>
            <div className="grid grid-cols-7 gap-2 items-end h-16 pt-2">
              {data?.last7Days.map((day, i) => {
                const maxDayViews = Math.max(...(data.last7Days.map((d) => d.views) || [1]), 1);
                const heightPct = day.views === 0 ? 8 : Math.max(Math.round((day.views / maxDayViews) * 100), 12);
                return (
                  <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-mono text-white/70">
                      {day.views}
                    </span>
                    <div className="w-full bg-white/15 rounded-t-sm h-full flex items-end">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-[#38bdf8] hover:bg-[#7dd3fc] rounded-t-sm transition-all duration-300"
                        title={`${day.date}: ${day.views} kunjungan`}
                      />
                    </div>
                    <span className="text-[10px] text-white/80 font-medium truncate w-full text-center">
                      {day.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Visited Pages */}
          <div className="md:col-span-5 bg-white/5 rounded-xl p-3.5 border border-white/10 flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-2">
              Halaman Paling Sering Dilihat
            </span>
            <div className="space-y-1.5 flex-1">
              {data?.topPages && data.topPages.length > 0 ? (
                data.topPages.map((page, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-[11.5px] py-0.5 border-b border-white/5 last:border-none"
                  >
                    <span className="font-mono text-white/90 truncate max-w-[180px]" title={page.path}>
                      {page.path === '/' ? '/ (Beranda)' : page.path}
                    </span>
                    <span className="font-semibold text-amber-300 shrink-0">
                      {page.views} hit
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-[11.5px] text-white/60 py-2">
                  Belum ada catatan halaman. Data akan tercatat otomatis saat pengunjung mengakses web.
                </div>
              )}
            </div>

            <div className="pt-2 text-[10.5px] text-white/60 flex items-center justify-between border-t border-white/10 mt-1">
              <span>Pembaruan otomatis tiap 30 detik</span>
              <span className="font-mono">WIB (Asia/Jakarta)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
