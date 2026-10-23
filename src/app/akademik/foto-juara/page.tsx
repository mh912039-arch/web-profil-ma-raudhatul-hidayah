'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  ArrowUpRight,
} from 'lucide-react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

import initialChampionships from '@/data/championshipsData.json';

const defaultChampionList = (initialChampionships as any[]).map((item: any) => ({
  id: item.id,
  title: item.title,
  sub: item.sub || '',
  event: item.event_name || item.event || '',
  badge: item.badge || item.category || 'Piala Juara',
  image: item.image_url || item.image || '/foto-juara.jpeg',
  slug: item.slug || '',
  desc: item.caption || item.desc || '',
}));

export default function FotoJuaraPage() {
  const [champions, setChampions] = useState(defaultChampionList);

  useEffect(() => {
    fetch('/api/championships', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            sub: item.sub || '',
            event: item.event_name || item.event || '',
            badge: item.badge || item.category || 'Piala Juara',
            image: item.image_url || item.image || '/foto-juara.jpeg',
            slug: item.slug || '',
            desc: item.caption || item.desc || '',
          }));
          setChampions(mapped);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic champion list:', err));
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-20 bg-background flex-grow">
        <section className="w-full py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-8 border-b border-slate-200/80">
              <div>
                <h1 className="font-serif text-[28px] sm:text-[38px] font-bold text-slate-900 tracking-tight leading-tight">
                  Foto Juara Ekstrakurikuler
                </h1>
                <div className="w-12 h-1 bg-amber-500 rounded-full mt-2 mb-3" />
                <p className="font-sans text-[14.5px] sm:text-[15.5px] text-slate-600 max-w-xl leading-relaxed">
                  Galeri apresiasi piala, medali, dan piagam kemenangan santri MAS Raudhatul Hidayah dalam berbagai ajang kejuaraan ekstrakurikuler.
                </p>
              </div>
            </div>

            {/* Champions Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {champions.map((champ) => (
                <div
                  key={champ.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={champ.image || '/foto-juara.jpeg'}
                      alt={champ.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-blue-950 px-3 py-1 rounded-full text-[11px] font-bold shadow-xs flex items-center gap-1.5">
                      <Trophy className="w-3 h-3 text-blue-950" />
                      <span>{champ.badge}</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <span className="text-[11.5px] text-blue-700 font-bold uppercase tracking-wider block mb-1">
                        {champ.event}
                      </span>
                      <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-2">
                        {champ.title}
                      </h3>
                      {champ.desc && (
                        <p className="font-sans text-[13px] text-slate-500 leading-relaxed">
                          {champ.desc}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] font-medium text-slate-700">
                      <span>{champ.sub}</span>
                      {champ.slug ? (
                        <Link
                          href={`/warta/${champ.slug}`}
                          className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-700 hover:text-blue-900 transition-colors group/link"
                        >
                          <span>Warta</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StitchFooter />
    </div>
  );
}
