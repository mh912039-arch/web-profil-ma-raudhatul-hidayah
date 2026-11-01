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

    try {
      const payload = JSON.stringify({
        path: pathname,
        referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
      });

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/visitors', blob);
      } else {
        fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore client fetch errors
    }
  }, [pathname]);

  return null;
}
