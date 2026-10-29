'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

const defaultHistory = {
  title: 'Dedikasi Membangun Generasi di Mauk',
  subtitle: 'Tonggak Sejarah',
  lead: 'Bermula dari kepedulian tulus para tokoh masyarakat terhadap masa depan pendidikan generasi muda di pesisir utara Kabupaten Tangerang, yayasan telah melangkah konsisten menghadirkan akses pendidikan Islam yang berkualitas, beradab, dan terjangkau.',
  milestones: [
    {
      title: 'Awal Mula Pendidikan Dasar (MIS Raudlatul Hidayah 01)',
      badge: 'Pondasi Awal',
      desc: 'Perjalanan dimulai dengan pendirian MIS Raudlatul Hidayah 01 di Kampung Tanjung Anom, Kecamatan Mauk, guna memberikan pondasi akhlak yang kokoh, adab pergaulan, serta kemampuan baca tulis Al-Qur\'an bagi putra-putri daerah sekitar.',
    },
    {
      title: 'Pendirian Resmi MAS Raudhatul Hidayah',
      badge: '17 September 2015',
      desc: 'Guna menampung antusiasme para santri untuk melanjutkan pendidikan menengah yang kokoh dalam syariat dan adaptif dalam sains, MAS Raudlatul Hidayah resmi berdiri pada 17 September 2015 dengan izin operasional lengkap Kementerian Agama dan NPSN 6994888.',
    },
  ],
};

export default function SejarahPage() {
  const [history, setHistory] = useState(defaultHistory);

  useEffect(() => {
    fetch('/api/profile', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.history) {
          setHistory((prev) => ({
            ...prev,
            title: data.history.title || prev.title,
            subtitle: data.history.subtitle || prev.subtitle,
            lead: data.history.lead || prev.lead,
            milestones: data.history.milestones && data.history.milestones.length > 0
              ? data.history.milestones
              : prev.milestones,
          }));
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic history:', err));
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-12 sm:py-20 bg-[#fbfbfa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div>
                  <h2 className="font-display text-[26px] sm:text-[34px] font-bold text-primary tracking-tight">
                    {history.title}
                  </h2>
                </div>
                <p className="font-sans text-[15px] text-on-surface-variant leading-relaxed">
                  {history.lead}
                </p>

                <div className="space-y-4 pt-2">
                  {history.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col gap-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-secondary shrink-0" />
                          <h3 className="font-display text-[17px] font-bold text-primary">
                            {m.title}
                          </h3>
                        </div>
                        {m.badge && (
                          <span className="px-3 py-1 rounded-full text-[11.5px] font-bold bg-primary text-white">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[14px] text-on-surface-variant leading-relaxed pl-5">
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-surface-container aspect-[4/3]">
                  <Image
                    src="/hero/slide-2.jpg"
                    alt="Kompleks Sekolah MAS Raudhatul Hidayah di Mauk Tangerang"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex items-end p-5">
                    <div className="text-white text-[12.5px] font-medium leading-snug">
                      <p className="font-bold text-[14px]">Kampus Terpadu Tanjung Anom</p>
                      <span className="opacity-90">Kecamatan Mauk, Kabupaten Tangerang, Banten</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  );
}
