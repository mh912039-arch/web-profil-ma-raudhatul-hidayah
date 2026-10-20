'use client';

import React, { Suspense } from 'react';
import { SchoolPortalLogin } from '@/components/auth/SchoolPortalLogin';
import { RefreshCw } from 'lucide-react';

function MasukPageContent() {
  return <SchoolPortalLogin />;
}

export default function MasukPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="flex items-center gap-3 text-slate-600 font-sans text-[14px]">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-900" />
            <span>Memuat Portal Layanan...</span>
          </div>
        </div>
      }
    >
      <MasukPageContent />
    </Suspense>
  );
}
