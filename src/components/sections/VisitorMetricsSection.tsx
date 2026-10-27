'use client';

import React, { useState, useEffect } from 'react';

interface DistributionItem {
  label: string;
  val: number;
  percentage: number;
  color: string;
}

interface VisitorData {
  today: number;
  yesterday: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
  lastMonth: number;
  totalAccumulated: number;
  distribution: DistributionItem[];
}

export function VisitorMetricsSection() {
  const [data, setData] = useState<VisitorData | null>(null);

  useEffect(() => {
    fetch('/api/visitors', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData(json);
      })
      .catch((err) => console.warn('Could not load public visitor metrics:', err));
  }, []);

  const distribution = data?.distribution || [
    { label: 'Hari Ini', val: 0, percentage: 0, color: 'bg-[#06b6d4]' },
    { label: 'Kemarin', val: 0, percentage: 0, color: 'bg-[#93c5fd]' },
    { label: 'Minggu Ini', val: 0, percentage: 0, color: 'bg-[#eab308]' },
    { label: 'Minggu Lalu', val: 0, percentage: 0, color: 'bg-[#3b82f6]' },
    { label: 'Bulan Ini', val: 0, percentage: 0, color: 'bg-[#16a34a]' },
    { label: 'Bulan Lalu', val: 0, percentage: 0, color: 'bg-[#be123c]' },
  ];

  const maxVal = Math.max(...distribution.map((d) => d.val), 10);
  const step = Math.max(Math.ceil(maxVal / 5), 1);
  const scaleNumbers = [0, step, step * 2, step * 3, step * 4, step * 5];

  return (
    <section className="w-full bg-[#1e3a8a] text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* =========================================================
              Left Card: Grafik Distribusi Kunjungan (7 Cols)
          ========================================================= */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-7 flex flex-col justify-between shadow-lg">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="font-sans font-bold text-[14px] sm:text-[15px] tracking-wider uppercase text-white/95">
                  GRAFIK DISTRIBUSI KUNJUNGAN
                </h3>
                <span className="px-3 py-1 rounded-md bg-[#eab308] text-slate-950 text-[11px] font-extrabold tracking-wide uppercase shadow-xs">
                  Live Data
                </span>
              </div>

              {/* Horizontal Bar Chart Container with vertical grid lines */}
              <div className="relative mb-6">
                {/* Vertical grid lines */}
                <div className="absolute inset-0 pl-24 pointer-events-none flex justify-between">
                  {scaleNumbers.map((_, i) => (
                    <div key={i} className="h-full border-r border-white/10" />
                  ))}
                </div>

                <div className="relative z-10 space-y-3.5">
                  {distribution.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-24 text-right text-[12px] sm:text-[12.5px] font-semibold text-white/90 shrink-0">
                        {row.label}
                      </span>
                      <div className="flex-1 relative h-6 flex items-center bg-black/15 rounded-md p-0.5">
                        <div
                          style={{
                            width: `${row.percentage}%`,
                            minWidth: row.val > 0 ? '16px' : '0px',
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

            {/* X-Axis Numbers & Grid Lines */}
            <div className="pt-2 border-t border-white/15">
              <div className="flex justify-between pl-24 text-[10.5px] sm:text-[11px] font-medium text-white/70 overflow-x-auto scrollbar-none">
                {scaleNumbers.map((num, i) => (
                  <span key={i}>{num.toLocaleString('id-ID')}</span>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================
              Right Card: Metrik Kunjungan (5 Cols)
          ========================================================= */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 sm:p-7 flex flex-col justify-between shadow-lg">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-4 border-b border-white/15 mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h3 className="font-sans font-extrabold text-[20px] sm:text-[22px] text-[#facc15] tracking-tight">
                  Metrik Kunjungan
                </h3>
              </div>

              {/* Rows with live dynamic values */}
              <div className="space-y-4">
                {/* Hari Ini */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-[14.5px] font-medium text-white">Hari Ini</span>
                  </div>
                  <span className="text-[16px] font-bold text-white">
                    {data?.today.toLocaleString('id-ID') ?? 0}
                  </span>
                </div>

                {/* Kemarin */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-[14.5px] font-medium text-white">Kemarin</span>
                  </div>
                  <span className="text-[16px] font-bold text-white">
                    {data?.yesterday.toLocaleString('id-ID') ?? 0}
                  </span>
                </div>

                {/* Minggu Ini */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-[14.5px] font-medium text-white">Minggu Ini</span>
                  </div>
                  <span className="text-[16px] font-bold text-white">
                    {data?.thisWeek.toLocaleString('id-ID') ?? 0}
                  </span>
                </div>

                {/* Bulan Ini */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ade80"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-[14.5px] font-medium text-white">Bulan Ini</span>
                  </div>
                  <span className="text-[16px] font-bold text-white">
                    {data?.thisMonth.toLocaleString('id-ID') ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Akumulasi Kunjungan + Status Badge */}
            <div className="pt-6 mt-6 border-t border-white/15 flex items-end justify-between">
              <div>
                <span className="text-[12.5px] font-medium text-white/80 block mb-0.5">
                  Akumulasi Kunjungan
                </span>
                <span className="font-sans font-extrabold text-[32px] sm:text-[36px] text-[#facc15] leading-none">
                  {data?.totalAccumulated.toLocaleString('id-ID') ?? 0}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#15803d] text-white text-[12px] font-bold border border-[#22c55e]/30 shadow-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span>Pelacak Riil Aktif</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
