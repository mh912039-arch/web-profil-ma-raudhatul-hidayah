import React from 'react';
import { Award, Clock, Phone, Mail } from 'lucide-react';
import { schoolData } from '@/data/mockSchoolData';

export const TopBar: React.FC = () => {
  return (
    <aside aria-label="Informasi Resmi Lembaga" className="bg-madrasah-950 text-stone-300 text-xs py-2 border-b border-madrasah-800/60 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Official Identification Badges */}
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 text-gold-400 font-medium">
            <Award className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{schoolData.profile.accreditation}</span>
          </div>
          <span className="text-madrasah-800">|</span>
          <span className="text-stone-400">
            NPSN: <span className="text-stone-200 font-mono">{schoolData.profile.npsn}</span>
          </span>
          <span className="text-madrasah-800">|</span>
          <span className="text-stone-400">
            NSM: <span className="text-stone-200 font-mono">{schoolData.profile.nsm}</span>
          </span>
        </div>

        {/* Right: Operating Hours & Direct Contacts */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Clock className="w-3.5 h-3.5 text-madrasah-400" strokeWidth={1.75} />
            <span>{schoolData.profile.operatingHours}</span>
          </div>
          <a
            href={`tel:${schoolData.profile.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold-400" strokeWidth={1.75} />
            <span>{schoolData.profile.phone}</span>
          </a>
          <a
            href={`mailto:${schoolData.profile.email}`}
            className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-madrasah-400" strokeWidth={1.75} />
            <span>{schoolData.profile.email}</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
