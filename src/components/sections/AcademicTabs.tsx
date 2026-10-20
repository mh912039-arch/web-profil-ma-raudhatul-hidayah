'use client';

import React, { useState } from 'react';
import { Microscope, Globe2, BookOpen, Check, Building, GraduationCap } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const AcademicTabs: React.FC = () => {
  const [selectedMajorId, setSelectedMajorId] = useState<string>('kurikulum-ma');
  const activeMajor = schoolData.majors.find((m) => m.id === selectedMajorId) || schoolData.majors[0];

  const getMajorIcon = (id: string) => {
    switch (id) {
      case 'kurikulum-ma':
        return <GraduationCap className="w-5 h-5" strokeWidth={1.75} />;
      case 'p5-karakter':
        return <BookOpen className="w-5 h-5" strokeWidth={1.75} />;
      case 'bimbingan-lanjut':
        return <Building className="w-5 h-5" strokeWidth={1.75} />;
      default:
        return <BookOpen className="w-5 h-5" strokeWidth={1.75} />;
    }
  };

  return (
    <section id="akademik" className="py-16 lg:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kurikulum Merdeka MA</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight leading-tight mb-3">
            Program Pembelajaran Madrasah Aliyah
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Menyiapkan santri meraih keunggulan akademik, berkarakter qurani, dan siap melangkah ke perguruan tinggi favorit.
          </p>
        </div>

        {/* Major Selector Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-8 p-1.5 bg-stone-100 rounded-xl max-w-2xl border border-stone-200/70">
          {schoolData.majors.map((major) => {
            const isSelected = major.id === selectedMajorId;
            return (
              <button
                key={major.id}
                onClick={() => setSelectedMajorId(major.id)}
                type="button"
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-madrasah-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-madrasah-900 hover:bg-stone-200/60'
                }`}
              >
                {getMajorIcon(major.id)}
                <span>{major.name.split('(')[0].replace('Peminatan ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Major Card Detail */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Description & Tagline (7 cols) */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs font-bold text-madrasah-800 bg-madrasah-100 px-2.5 py-1 rounded">
                  KODE: {activeMajor.code}
                </span>
                <span className="text-xs text-stone-500 font-medium">Jenjang MA (Kelas X - XII)</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-madrasah-950 tracking-tight mb-2">
                {activeMajor.name}
              </h3>

              <p className="text-sm font-medium text-madrasah-700 italic mb-4">
                "{activeMajor.tagline}"
              </p>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6">
                {activeMajor.description}
              </p>

              {/* Core Subjects List */}
              <div className="pt-4 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                  Mata Pelajaran Khas / Pilihan Unggulan:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeMajor.coreSubjects.map((subject, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                      <Check className="w-4 h-4 text-madrasah-600 flex-shrink-0" strokeWidth={2} />
                      <span>{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Career Prospects & Facilities (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Career / University Targets */}
              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-madrasah-900 uppercase tracking-wider mb-3">
                  <GraduationCap className="w-4 h-4 text-madrasah-700" strokeWidth={1.75} />
                  <span>Arah Studi Lanjut & Karier</span>
                </div>
                <ul className="space-y-2">
                  {activeMajor.careerProspects.map((career, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                      <span>{career}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Facilities */}
              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-madrasah-900 uppercase tracking-wider mb-3">
                  <Building className="w-4 h-4 text-madrasah-700" strokeWidth={1.75} />
                  <span>Fasilitas Penunjang Laboratorium</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeMajor.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200/80 font-medium"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
