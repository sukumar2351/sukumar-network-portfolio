import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroSectionProps {
  ready?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ ready = true }) => {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [imgSrc, setImgSrc] = useState<string>(profile.portraitCutoutUrl);

  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      if (!ready) {
        gsap.set('.hero-shard', { x: 80, opacity: 0 });
        gsap.set('.hero-portrait', { y: 36, scale: 0.96, opacity: 0 });
        gsap.set('.hero-copy', { y: 26, opacity: 0 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.28, defaults: { ease: 'power3.out' } });

      // 1. Angular crimson panels glide in smoothly
      tl.fromTo(
        '.hero-shard',
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.15, stagger: 0.11, clearProps: 'transform,opacity' },
        0
      )
        // 2. Left editorial heading & CTAs reveal with calm, deliberate rhythm
        .fromTo(
          '.hero-copy',
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.14, clearProps: 'transform,opacity' },
          0.25
        )
        // 3. Portrait rises smoothly into the angular crimson framing
        .fromTo(
          '.hero-portrait',
          { y: 36, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 1.25, clearProps: 'transform,opacity' },
          0.42
        );
    }, heroRef);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#080808] pt-24 pb-16 lg:pt-20 lg:pb-0"
    >
      {/* Dramatic Black & Red Geometric Background + Subtle World/Network Line Patterns */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Fine technical grid */}
        <div className="cr-tech-grid absolute inset-0 opacity-75" />

        {/* Subtle red studio backlight behind right portrait */}
        <div
          className={`absolute -right-24 top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full blur-[125px] ${
            reducedMotion ? '' : 'animate-red-drift'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(255, 16, 26, 0.44) 0%, rgba(101, 0, 0, 0.28) 46%, rgba(8, 8, 8, 0) 76%)',
          }}
        />

        {/* Secondary red light sweep */}
        <div
          className={`absolute right-[10%] top-[8%] h-[480px] w-[360px] blur-[90px] ${
            reducedMotion ? '' : 'animate-red-sweep'
          }`}
          style={{
            background:
              'linear-gradient(135deg, rgba(230, 0, 18, 0.34) 0%, rgba(101, 0, 0, 0.1) 70%, transparent 100%)',
          }}
        />

        {/* Subtle World Network Connection Map & Angular Crimson Panels SVG */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="redPrimaryPanel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF101A" stopOpacity="0.92" />
              <stop offset="52%" stopColor="#E60012" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#650000" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="redDeepPanel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#650000" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#120707" stopOpacity="0.94" />
            </linearGradient>
            <linearGradient id="darkCutSlice" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#120707" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#080808" stopOpacity="0.98" />
            </linearGradient>
          </defs>

          {/* Subtle global network connection arcs & world-node mesh on left/center dark canvas */}
          <g opacity="0.28">
            <path
              d="M 70 250 Q 290 140 520 270 T 940 210"
              stroke="#FF101A"
              strokeWidth="1"
              className={reducedMotion ? '' : 'animate-packet-flow'}
            />
            <path
              d="M 110 640 Q 340 510 590 590 T 980 480"
              stroke="#E60012"
              strokeWidth="1"
              className={reducedMotion ? '' : 'animate-packet-flow-reverse'}
            />
            <path
              d="M 180 420 L 340 310 L 520 390 L 660 280"
              stroke="#FFFFFF"
              strokeOpacity="0.24"
              strokeWidth="0.9"
              strokeDasharray="3 5"
            />
            {[
              [120, 238],
              [265, 195],
              [340, 310],
              [520, 270],
              [520, 390],
              [180, 420],
              [360, 560],
              [590, 590],
              [660, 280],
            ].map(([cx, cy], idx) => (
              <g key={idx}>
                <circle cx={cx} cy={cy} r="2.5" fill={idx % 2 === 0 ? '#FF101A' : '#FFFFFF'} />
                <circle
                  cx={cx}
                  cy={cy}
                  r="8"
                  stroke="#FF101A"
                  strokeOpacity="0.3"
                  strokeWidth="0.8"
                />
              </g>
            ))}
          </g>

          {/* Large angular deep-crimson back panel */}
          <polygon
            className="hero-shard"
            points="780,0 1440,0 1440,900 545,900"
            fill="url(#redDeepPanel)"
          />

          {/* Bold primary red diagonal panel behind portrait */}
          <polygon
            className="hero-shard"
            points="920,0 1335,0 1075,900 660,900"
            fill="url(#redPrimaryPanel)"
          />

          {/* Sharp matte black foreground diagonal cut */}
          <polygon
            className="hero-shard"
            points="1265,0 1440,0 1440,900 1098,900"
            fill="url(#darkCutSlice)"
          />

          {/* Crisp red highlight diagonal lines */}
          <line
            className="hero-shard"
            x1="780"
            y1="0"
            x2="545"
            y2="900"
            stroke="#FF101A"
            strokeOpacity="0.52"
            strokeWidth="1.5"
          />
          <line
            className="hero-shard"
            x1="920"
            y1="0"
            x2="660"
            y2="900"
            stroke="#FF101A"
            strokeOpacity="0.82"
            strokeWidth="2"
          />
          <line
            className="hero-shard"
            x1="1335"
            y1="0"
            x2="1075"
            y2="900"
            stroke="#E60012"
            strokeOpacity="0.48"
            strokeWidth="1.5"
          />
          <polygon
            className="hero-shard"
            points="842,0 874,0 824,185 792,185"
            fill="#FF101A"
            fillOpacity="0.9"
          />
        </svg>

        {/* Left dark readability gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(8, 8, 8, 0.96) 0%, rgba(8, 8, 8, 0.86) 44%, rgba(8, 8, 8, 0.16) 72%, rgba(8, 8, 8, 0.44) 100%)',
          }}
        />
      </div>

      {/* Two-Column Hero Layout */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN */}
          <div className="order-2 lg:order-1 lg:col-span-6 lg:py-16">
            {/* Small Label */}
            <div className="hero-copy flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#FF101A]" aria-hidden="true" />
              <span className="font-mono text-xs font-medium tracking-[0.24em] text-[#B8B8B8] uppercase">
                {profile.smallLabel}
              </span>
            </div>

            {/* Main Heading: SUKUMAR (White) + KARNAM (Bold Red #FF101A) */}
            <h1 className="hero-copy mt-5 font-condensed text-6xl font-bold leading-[0.92] tracking-[0.02em] uppercase sm:text-7xl xl:text-[6.2rem]">
              <span className="block text-white">{profile.firstName}</span>
              <span className="block text-[#FF101A]">{profile.lastName}</span>
            </h1>

            {/* Professional Title */}
            <div className="hero-copy mt-5 inline-flex items-center gap-3 border-l-2 border-[#FF101A] pl-4">
              <span className="font-display text-lg font-semibold tracking-[0.22em] text-white uppercase sm:text-xl">
                {profile.title}
              </span>
            </div>

            {/* Supporting Text */}
            <p className="hero-copy mt-6 max-w-xl font-display text-lg font-medium leading-snug text-white sm:text-xl">
              {profile.subtitle}
            </p>

            {/* Introduction */}
            <p className="hero-copy mt-4 max-w-xl text-sm leading-relaxed text-[#B8B8B8] sm:text-base">
              {profile.heroIntro}
            </p>

            {/* Two CTA Buttons */}
            <div className="hero-copy mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => scrollTo('projects')}
                className="group inline-flex items-center gap-3 bg-[#FF101A] px-7 py-4 font-mono text-xs font-semibold tracking-[0.18em] text-white uppercase shadow-[0_12px_36px_-8px_rgba(255,16,26,0.68)] transition-all hover:bg-[#E60012] hover:shadow-[0_16px_42px_-6px_rgba(255,16,26,0.82)]"
              >
                <span>EXPLORE MY WORK</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('contact')}
                className="group inline-flex items-center gap-3 border border-[#351010] bg-[#120707]/90 px-7 py-4 font-mono text-xs font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm transition-all hover:border-[#FF101A] hover:bg-[#650000]/35"
              >
                <span>CONTACT ME</span>
                <ArrowDownRight
                  className="h-4 w-4 text-[#FF101A] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Subtle technical metadata footer */}
            <div className="hero-copy mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#351010] pt-5 font-mono text-[11px] tracking-[0.16em] text-[#B8B8B8] uppercase">
              <span>Routing &amp; Switching</span>
              <span className="text-[#FF101A]" aria-hidden="true">
                /
              </span>
              <span>Monitoring</span>
              <span className="text-[#FF101A]" aria-hidden="true">
                /
              </span>
              <span>Troubleshooting</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Actual Portrait Integrated into Angular Red Panels */}
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-6 lg:justify-end">
            <div className="hero-portrait relative w-full max-w-[430px] sm:max-w-[500px] lg:max-w-[580px]">
              {/* Primary angular red geometric frame behind portrait */}
              <div
                className="cr-diagonal-panel pointer-events-none absolute -inset-x-4 bottom-6 top-8 bg-gradient-to-br from-[#FF101A] via-[#E60012] to-[#650000] opacity-92 shadow-[0_30px_90px_-15px_rgba(255,16,26,0.5)]"
                aria-hidden="true"
              />

              {/* Dark crimson offset shard */}
              <div
                className="cr-diagonal-shard pointer-events-none absolute -right-3 bottom-12 top-2 w-[78%] border border-[#FF101A]/45 bg-[#120707]/50"
                aria-hidden="true"
              />

              {/* Red razor highlight accent */}
              <div
                className="pointer-events-none absolute left-4 top-6 h-24 w-[3px] -skew-x-12 bg-[#FF101A] shadow-[0_0_24px_rgba(255,16,26,0.95)]"
                aria-hidden="true"
              />

              {/* Actual Uploaded Portrait Cutout */}
              <div className="relative z-10 overflow-hidden pt-2">
                <img
                  src={imgSrc}
                  alt="Sukumar Karnam — Network Engineer"
                  onError={() => {
                    if (imgSrc !== profile.portraitFallbackUrl) {
                      setImgSrc(profile.portraitFallbackUrl);
                    }
                  }}
                  className="mx-auto block h-auto w-full max-h-[540px] object-contain object-bottom drop-shadow-[0_24px_44px_rgba(0,0,0,0.88)] sm:max-h-[620px] lg:max-h-[690px]"
                  style={{
                    filter: 'contrast(1.04) saturate(0.96)',
                  }}
                />

                {/* Bottom obsidian gradient blend */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
                  style={{
                    background:
                      'linear-gradient(to top, #080808 0%, rgba(8, 8, 8, 0.78) 42%, rgba(8, 8, 8, 0) 100%)',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Clean bottom bar */}
              <div className="relative z-20 -mt-5 flex items-center justify-between border-t border-[#FF101A]/55 bg-[#080808]/90 px-4 py-2.5 backdrop-blur-sm">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white uppercase">
                  SUKUMAR KARNAM
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-[#FF101A] uppercase">
                  NETWORK ENGINEER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
