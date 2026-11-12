'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
  triggerOnce?: boolean;
}

export function AnimatedCounter({
  value,
  duration = 1200,
  className = '',
  triggerOnce = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);
  const prevNumRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);

  // Parser cerdas untuk memisahkan prefix, nilai numerik murni, dan suffix
  // Contoh: "152" -> prefix: "", targetNum: 152, suffix: ""
  // Contoh: "35+" -> prefix: "", targetNum: 35, suffix: "+"
  // Contoh: "1.250" -> prefix: "", targetNum: 1250, suffix: "", hasDots: true
  const parseValue = (raw: string | number) => {
    const str = String(raw ?? '').trim();
    if (!str) {
      return { prefix: '', targetNum: 0, suffix: '', isNumber: false, original: '' };
    }

    const match = str.match(/^([^\d]*)(\d[\d.,]*)([^\d]*)$/);
    if (!match) {
      return { prefix: '', targetNum: 0, suffix: str, isNumber: false, original: str };
    }

    const prefix = match[1] || '';
    const numPart = match[2] || '';
    const suffix = match[3] || '';

    const hasDots = numPart.includes('.');
    const cleanNumStr = numPart.replace(/[,.]/g, '');
    const targetNum = parseInt(cleanNumStr, 10);

    return {
      prefix,
      targetNum: isNaN(targetNum) ? 0 : targetNum,
      suffix,
      hasDots,
      isNumber: !isNaN(targetNum),
      original: str,
    };
  };

  const { prefix, targetNum, suffix, hasDots, isNumber, original } = parseValue(value);

  useEffect(() => {
    // Jika bukan teks bertipe angka (misal simbol atau akreditasi "A"), tampilkan langsung teks aslinya
    if (!isNumber || targetNum === 0) {
      setDisplayValue(original);
      return;
    }

    // Aksesibilitas: hormati pengguna dengan preferensi prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(original);
      prevNumRef.current = targetNum;
      return;
    }

    const startAnimation = (fromNumber?: number) => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      const startTime = performance.now();
      const startNum = typeof fromNumber === 'number' ? fromNumber : (hasAnimatedRef.current ? prevNumRef.current : 0);

      const formatNumber = (num: number) => {
        if (hasDots) {
          return num.toLocaleString('id-ID');
        }
        return String(num);
      };

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Kurva Deselerasi Halus (Ease-out Cubic: melesat di awal, melambat anggun di akhir)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.round(startNum + (targetNum - startNum) * easeOut);

        setDisplayValue(`${prefix}${formatNumber(currentCount)}${suffix}`);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(original);
          prevNumRef.current = targetNum;
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    // Jika elemen sudah pernah masuk layar dan target nilai berubah (misal dari hasil edit admin),
    // jalankan animasi transisi ke angka baru secara dinamis
    if (hasAnimatedRef.current && prevNumRef.current !== targetNum) {
      startAnimation(prevNumRef.current);
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    // IntersectionObserver untuk memicu animasi saat elemen masuk pandangan layar (Waypoints modern)
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!hasAnimatedRef.current || !triggerOnce) {
            hasAnimatedRef.current = true;
            startAnimation(0);
          }
          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration, triggerOnce, isNumber, targetNum, prefix, suffix, hasDots, original]);

  return (
    <span ref={elementRef} className={`tabular-nums inline-block ${className}`}>
      {displayValue}
    </span>
  );
}
