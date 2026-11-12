'use client';

import React, { useState, useEffect } from 'react';
import { StitchNavbar } from '@/components/layout/StitchNavbar';
import { StitchFooter } from '@/components/layout/StitchFooter';

interface VisionIndicator {
  number: string;
  title: string;
  desc: string;
}

interface StructuredMission {
  number: string;
  title: string;
  desc: string;
}

interface SchoolGoal {
  number: string;
  text: string;
}

const defaultVisionBadge = 'RUMUSAN VISI SATUAN PENDIDIKAN';
const defaultVision =
  'Terwujudnya insan pembelajar yang berakhlak mulia, unggul dalam prestasi, terampil dalam teknologi, dan peduli kelestarian lingkungan hidup.';

const defaultVisionIndicators: VisionIndicator[] = [
  {
    number: '01',
    title: 'Berakhlak Mulia',
    desc: 'Pembiasaan ibadah, kejujuran, sopan santun, dan sikap saling menghormati dalam keseharian di sekolah.',
  },
  {
    number: '02',
    title: 'Unggul dalam Prestasi',
    desc: 'Peningkatan capaian belajar akademik serta partisipasi aktif dalam kompetisi olahraga, sains, dan seni.',
  },
  {
    number: '03',
    title: 'Terampil dalam Teknologi',
    desc: 'Penguasaan perangkat komputer dasar dan pemanfaatan media digital untuk mendukung pembelajaran.',
  },
  {
    number: '04',
    title: 'Peduli Lingkungan Hidup',
    desc: 'Penataan lingkungan sekolah yang bersih, hijau, sehat, dan bebas dari perundungan.',
  },
];

const defaultMissionTitle = 'Misi Satuan Pendidikan';
const defaultMissionSubtitle =
  'Langkah penyelenggaraan pendidikan untuk mewujudkan visi sekolah.';

const defaultStructuredMissions: StructuredMission[] = [
  {
    number: '01',
    title: 'Pembinaan Keimanan & Budi Pekerti',
    desc: 'Menanamkan keimanan, ketakwaan, dan akhlak mulia melalui pembiasaan ibadah rutin serta keteladanan sikap warga sekolah.',
  },
  {
    number: '02',
    title: 'Pelaksanaan Pembelajaran Kurikulum Merdeka',
    desc: 'Menyelenggarakan kegiatan belajar mengajar yang aktif, terstruktur, dan memperhatikan perkembangan kompetensi setiap peserta didik.',
  },
  {
    number: '03',
    title: 'Pengembangan Minat & Bakat Siswa',
    desc: 'Memfasilitasi latihan rutin ekstrakurikuler kepanduan Pramuka, olahraga, kesenian tradisional, dan kegiatan kesiswaan.',
  },
];

const defaultGoalsTitle = 'Tujuan Sekolah';
const defaultGoalsSubtitle =
  'Capaian nyata yang ditargetkan dalam penyelenggaraan kurikulum.';

const defaultGoals: SchoolGoal[] = [
  {
    number: '01',
    text: 'Meningkatnya disiplin kehadiran, ketertiban belajar, dan perilaku santun peserta didik di dalam maupun di luar lingkungan sekolah.',
  },
  {
    number: '02',
    text: 'Tercapainya ketuntasan belajar seluruh mata pelajaran sesuai standar kompetensi lulusan jenjang Sekolah Menengah Pertama.',
  },
  {
    number: '03',
    text: 'Terlaksananya Asesmen Nasional Berbasis Komputer (ANBK) dan pembelajaran berbasis TIK secara mandiri di laboratorium sekolah.',
  },
  {
    number: '04',
    text: 'Terwujudnya prestasi siswa pada ajang perlombaan tingkat Kecamatan Cibeber maupun tingkat Kabupaten Lebak.',
  },
];

export default function VisiMisiPage() {
  const [visionBadge, setVisionBadge] = useState(defaultVisionBadge);
  const [vision, setVision] = useState(defaultVision);
  const [visionIndicators, setVisionIndicators] = useState<VisionIndicator[]>(defaultVisionIndicators);

  const [missionTitle, setMissionTitle] = useState(defaultMissionTitle);
  const [missionSubtitle, setMissionSubtitle] = useState(defaultMissionSubtitle);
  const [structuredMissions, setStructuredMissions] = useState<StructuredMission[]>(defaultStructuredMissions);

  const [goalsTitle, setGoalsTitle] = useState(defaultGoalsTitle);
  const [goalsSubtitle, setGoalsSubtitle] = useState(defaultGoalsSubtitle);
  const [goals, setGoals] = useState<SchoolGoal[]>(defaultGoals);

  useEffect(() => {
    fetch('/api/profile?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const vm = data?.visionMission;
        if (!vm) return;

        if (vm.visionBadge) setVisionBadge(vm.visionBadge);
        if (vm.vision) setVision(vm.vision);

        if (Array.isArray(vm.visionIndicators) && vm.visionIndicators.length > 0) {
          setVisionIndicators(vm.visionIndicators);
        }

        if (vm.missionTitle) setMissionTitle(vm.missionTitle);
        if (vm.missionSubtitle) setMissionSubtitle(vm.missionSubtitle);

        if (Array.isArray(vm.structuredMissions) && vm.structuredMissions.length > 0) {
          setStructuredMissions(vm.structuredMissions);
        } else if (Array.isArray(vm.missions) && vm.missions.length > 0) {
          setStructuredMissions(
            vm.missions.map((m: string, idx: number) => {
              const parts = m.split(': ');
              if (parts.length > 1) {
                return {
                  number: String(idx + 1).padStart(2, '0'),
                  title: parts[0],
                  desc: parts.slice(1).join(': '),
                };
              }
              return {
                number: String(idx + 1).padStart(2, '0'),
                title: m,
                desc: '',
              };
            })
          );
        }

        if (vm.goalsTitle) setGoalsTitle(vm.goalsTitle);
        if (vm.goalsSubtitle) setGoalsSubtitle(vm.goalsSubtitle);

        if (Array.isArray(vm.goals) && vm.goals.length > 0) {
          setGoals(vm.goals);
        }
      })
      .catch((err) => console.warn('Could not fetch dynamic profile data:', err));
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fbfbfa] font-sans text-on-surface">
      <StitchNavbar />

      <main className="w-full pt-24 sm:pt-28 pb-16 sm:pb-24 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* BAGIAN ATAS: RUMUSAN VISI SATUAN PENDIDIKAN & 4 INDIKATOR (SESUAI SS 2) */}
          <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 lg:p-12 transition-all">
            <span className="font-sans font-bold text-[13px] sm:text-[14px] text-[#1e3a8a] tracking-[0.16em] uppercase mb-3 sm:mb-4 inline-block">
              {visionBadge}
            </span>

            <blockquote className="font-serif text-[22px] sm:text-[30px] md:text-[36px] font-bold text-slate-900 leading-snug sm:leading-tight tracking-tight mb-8 sm:mb-10">
              &ldquo;{vision}&rdquo;
            </blockquote>

            <div className="border-t border-slate-100 pt-8 sm:pt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
                {visionIndicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className={`${idx > 0 ? 'lg:pl-8' : ''} ${
                      idx > 0 && idx % 2 === 1 ? 'sm:pl-6 lg:pl-8' : ''
                    } pt-5 sm:pt-0 flex flex-col`}
                  >
                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-sans mb-1.5">
                      INDIKATOR {ind.number || String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-900 font-sans mb-2 leading-snug">
                      {ind.title}
                    </h3>
                    <p className="text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed font-sans">
                      {ind.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BAGIAN BAWAH: MISI SATUAN PENDIDIKAN & TUJUAN SEKOLAH (SESUAI SS 1) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8 sm:mt-12">
            {/* KOLOM KIRI: MISI SATUAN PENDIDIKAN */}
            <div className="flex flex-col">
              <h2 className="font-serif text-[24px] sm:text-[28px] font-bold text-slate-900 mb-1.5 leading-tight">
                {missionTitle}
              </h2>
              <p className="text-[13.5px] sm:text-[14px] text-slate-500 font-sans mb-5 leading-relaxed">
                {missionSubtitle}
              </p>

              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                {structuredMissions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 flex items-start gap-3.5 sm:gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <span className="font-sans font-bold text-[13px] text-slate-900 pt-0.5 shrink-0 w-6">
                      {item.number || String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col">
                      <h3 className="font-sans font-bold text-[14.5px] sm:text-[15px] text-slate-900 mb-1 leading-snug">
                        {item.title}
                      </h3>
                      {item.desc && (
                        <p className="font-sans text-[13px] sm:text-[13.5px] text-slate-600 leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KOLOM KANAN: TUJUAN SEKOLAH */}
            <div className="flex flex-col">
              <h2 className="font-serif text-[24px] sm:text-[28px] font-bold text-slate-900 mb-1.5 leading-tight">
                {goalsTitle}
              </h2>
              <p className="text-[13.5px] sm:text-[14px] text-slate-500 font-sans mb-5 leading-relaxed">
                {goalsSubtitle}
              </p>

              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                {goals.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 flex items-start gap-3.5 hover:bg-slate-50/60 transition-colors"
                  >
                    <span className="font-sans font-medium text-[13px] text-slate-400 pt-0.5 shrink-0 w-7">
                      {item.number
                        ? item.number.endsWith('.')
                          ? item.number
                          : `${item.number}.`
                        : `${String(idx + 1).padStart(2, '0')}.`}
                    </span>
                    <p className="font-sans text-[13.5px] sm:text-[14px] text-slate-700 leading-relaxed font-normal">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <StitchFooter />
    </div>
  );
}
