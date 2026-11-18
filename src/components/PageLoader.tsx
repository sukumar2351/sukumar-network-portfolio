import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PageLoaderProps {
  onComplete?: () => void;
}

function getStageLabel(percent: number): string {
  if (percent < 35) return 'ESTABLISHING ROUTE';
  if (percent < 70) return 'SYNCING TOPOLOGY';
  if (percent < 100) return 'LOADING INTERFACE';
  return 'CONNECTION READY';
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [percent, setPercent] = useState<number>(1);
  const [exiting, setExiting] = useState<boolean>(false);
  const [unmounted, setUnmounted] = useState<boolean>(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const durationMs = reducedMotion ? 850 : 2400;
    const startTime = performance.now();
    let rafId = 0;
    let holdTimer = 0;
    let unmountTimer = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // Balanced cinematic ease curve from 1% to 100%
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const nextPercent = Math.max(1, Math.min(100, Math.round(1 + eased * 99)));
      setPercent(nextPercent);

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setPercent(100);
        holdTimer = window.setTimeout(() => {
          setExiting(true);
          onComplete?.();
          unmountTimer = window.setTimeout(() => {
            document.body.style.overflow = previousOverflow;
            setUnmounted(true);
          }, reducedMotion ? 260 : 780);
        }, reducedMotion ? 150 : 420);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(holdTimer);
      window.clearTimeout(unmountTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete, reducedMotion]);

  if (unmounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio ${percent} percent`}
      className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#080808] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        exiting
          ? reducedMotion
            ? 'pointer-events-none opacity-0'
            : 'pointer-events-none -translate-y-full opacity-95'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Subtle architectural grid & diagonal crimson background slice */}
      <div className="cr-tech-grid pointer-events-none absolute inset-0 opacity-65" aria-hidden="true" />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <polygon points="1040,0 1440,0 1440,900 840,900" fill="#120707" />
        <polygon points="1180,0 1320,0 1120,900 980,900" fill="#650000" fillOpacity="0.45" />
        <line x1="1040" y1="0" x2="840" y2="900" stroke="#FF101A" strokeOpacity="0.4" strokeWidth="1.5" />
      </svg>

      {/* Top Bar */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-8 sm:px-8">
        <div className="font-condensed text-lg font-bold tracking-[0.14em] uppercase">
          <span className="text-white">SK</span>
          <span className="text-[#FF101A]">.</span>
          <span className="ml-1 text-xs font-semibold tracking-[0.22em] text-[#B8B8B8]">
            PORTFOLIO
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#B8B8B8] uppercase">
          <span className="h-1.5 w-1.5 bg-[#FF101A]" aria-hidden="true" />
          <span>SUKUMAR KARNAM</span>
        </div>
      </div>

      {/* Center Percentage Counter & Progress Bar */}
      <div className="relative z-10 mx-auto w-full max-w-xl px-6 text-center">
        <div className="mb-3 font-mono text-xs tracking-[0.26em] text-[#FF101A] uppercase">
          {getStageLabel(percent)}
        </div>

        <div className="font-condensed text-7xl font-bold leading-none tracking-[0.02em] text-white tabular-nums sm:text-9xl">
          <span>{percent}</span>
          <span className="text-[#FF101A]">%</span>
        </div>

        {/* Sleek Crimson Progress Bar */}
        <div className="mt-8 h-[3px] w-full overflow-hidden bg-[#351010]">
          <div
            className="h-full bg-gradient-to-r from-[#650000] via-[#E60012] to-[#FF101A] shadow-[0_0_18px_rgba(255,16,26,0.9)]"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#B8B8B8] uppercase">
          <span>01%</span>
          <span>NETWORK ENGINEER</span>
          <span>100%</span>
        </div>
      </div>

      {/* Bottom Crimson Accent Rule */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pb-8 font-mono text-[10px] tracking-[0.2em] text-[#B8B8B8] uppercase sm:px-8">
        <span>ROUTING · SWITCHING · MONITORING</span>
        <span className="text-[#FF101A]">{percent.toString().padStart(3, '0')} / 100</span>
      </div>
    </div>
  );
};
