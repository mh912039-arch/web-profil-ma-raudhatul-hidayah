'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { RefreshCw } from 'lucide-react';

function LoginRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      router.replace(`/masuk?role=${role}`);
    } else {
      router.replace('/masuk');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex items-center gap-3 text-slate-600 font-sans text-[14px]">
        <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
        <span>Mengalihkan ke Portal Masuk...</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="flex items-center gap-3 text-slate-600 font-sans text-[14px]">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span>Memuat...</span>
          </div>
        </div>
      }
    >
      <LoginRedirectContent />
    </Suspense>
  );
}
