'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // 1. Do not track admin panels or backend APIs
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // 2. Prevent duplicate hits on identical path during quick re-renders
    if (lastPath.current === pathname) {
      return;
    }
    lastPath.current = pathname;

    // 3. Dispatch hit to /api/visitors in background
    try {
      fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
        }),
      }).catch(() => {
        // Silent catch: visitor experience must never be disrupted
      });
    } catch {
      // Ignore client fetch errors
    }
  }, [pathname]);

  return null;
}
