'use client';

import React, { useEffect, useRef, useState, useId } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: (error?: any) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          action?: string;
          cData?: string;
          appearance?: 'always' | 'execute' | 'interaction-only';
          execution?: 'render' | 'execute';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      execute: (container?: string | HTMLElement, options?: any) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
    onloadTurnstileCallback?: () => void;
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (err?: any) => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  action?: string;
  appearance?: 'always' | 'execute' | 'interaction-only';
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  onExpire,
  onError,
  className = '',
  theme = 'light',
  action,
  appearance = 'interaction-only',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const uniqueId = useId().replace(/:/g, '-');

  const siteKey =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    '0x4AAAAAAF3MWNHEzNkdoekl';

  // Lazy Initialization via IntersectionObserver:
  // Hindari pembuatan token Turnstile yang sia-sia jika pengunjung hanya membuka halaman
  // dan belum menggulir/mencapai area formulir. Ini menjaga rasio validasi Cloudflare tetap seimbang.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      // Clean existing widget if present
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (_) {}
        widgetIdRef.current = null;
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size: 'normal',
          appearance,
          action,
          callback: (token: string) => {
            if (isMounted) {
              setHasError(false);
              onVerify(token);
            }
          },
          'expired-callback': () => {
            if (isMounted) {
              onExpire?.();
            }
          },
          'error-callback': (err: any) => {
            console.warn('[Turnstile Widget] Verification error:', err);
            if (isMounted) {
              setHasError(true);
              onError?.(err);
            }
          },
        });
        widgetIdRef.current = id;
        setIsLoaded(true);
      } catch (err) {
        console.error('[Turnstile Widget] Render failed:', err);
        if (isMounted) setHasError(true);
      }
    };

    // If script is already in document
    if (typeof window !== 'undefined' && window.turnstile) {
      renderWidget();
    } else {
      // Check if script element already exists
      const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) renderWidget();
        };
        script.onerror = () => {
          if (isMounted) setHasError(true);
        };
        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(checkInterval);
            if (isMounted) renderWidget();
          }
        }, 100);

        return () => clearInterval(checkInterval);
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (_) {}
      }
    };
  }, [siteKey, theme, action, appearance, isVisible]);

  const handleManualRetry = () => {
    setHasError(false);
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  return (
    <div className={`relative ${appearance === 'always' ? 'min-h-[65px]' : ''} ${className}`}>
      {/* Container where Cloudflare mounts iframe */}
      <div ref={containerRef} id={`turnstile-${uniqueId}`} />

      {/* Loading Placeholder (hanya tampil jika mode 'always') */}
      {appearance === 'always' && !isLoaded && !hasError && (
        <div className="w-full max-w-[300px] h-[65px] bg-slate-50 border border-slate-200 rounded-lg flex items-center px-4 gap-3 text-slate-500 animate-pulse">
          <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[12px] font-medium text-slate-700">
              Memuat proteksi keamanan...
            </span>
            <span className="font-sans text-[10px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-slate-500" /> Cloudflare Turnstile
            </span>
          </div>
        </div>
      )}

      {/* Error / Offline Fallback */}
      {hasError && (
        <div className="w-full max-w-[300px] p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-rose-800 text-[12px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Gagal memuat proteksi CAPTCHA.</span>
          </div>
          <button
            type="button"
            onClick={handleManualRetry}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-100/70 hover:bg-rose-100 px-2 py-1 rounded transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
};
