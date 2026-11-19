import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, ArrowRight, FileText } from 'lucide-react';
import { profile } from '../data/profile';
import { AnimatedText } from '../components/AnimatedText';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroSectionProps {
  ready?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ ready = true }) => {
  const heroRef = useRef<HTMLElement>(null);
  const portraitRigRef = useRef<HTMLDivElement>(null);
  const backShardRef = useRef<HTMLDivElement>(null);
  const midShardRef = useRef<HTMLDivElement>(null);
  const rimLightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [imgSrc, setImgSrc] = useState<string>(profile.portraitCutoutUrl);

  // Coordinated GSAP 3D Hero Entrance after PageLoader lifts
  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      if (!ready) {
        gsap.set('.hero-shard', { x: 90, opacity: 0 });
        gsap.set('.hero-portrait', { y: 42, scale: 0.94, rotateY: -8, opacity: 0 });
        gsap.set('.hero-copy', { y: 26, rotateX: -18, opacity: 0 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.25, defaults: { ease: 'power3.out' } });

      // 1. Angular red geometric panels glide into 3D space
      tl.fromTo(
        '.hero-shard',
        { x: 90, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.15, stagger: 0.1, clearProps: 'transform,opacity' },
        0
      )
        // 2. Portrait enters with subtle 3D depth & perspective rotation
        .fromTo(
          '.hero-portrait',
          { y: 42, scale: 0.94, rotateY: -8, opacity: 0 },
          { y: 0, scale: 1, rotateY: 0, opacity: 1, duration: 1.3, clearProps: 'transform,opacity' },
          0.3
        )
        // 3. Supporting copy, subtitle & 3D buttons reveal cleanly
        .fromTo(
          '.hero-copy',
          { y: 26, rotateX: -18, opacity: 0 },
          { y: 0, rotateX: 0, opacity: 1, duration: 0.9, stagger: 0.13, clearProps: 'transform,opacity' },
          0.35
        );
    }, heroRef);

    return () => ctx.revert();
  }, [ready, reducedMotion]);

  // Subtle Desktop/Laptop Mouse-Based 3D Portrait Parallax & Red Rim Light Shift
  useEffect(() => {
    if (reducedMotion) return;

    let rafId = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const isDesktop = () =>
      window.innerWidth >= 1024 && window.matchMedia('(pointer: fine)').matches;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDesktop()) return;
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.065;
      current.y += (target.y - current.y) * 0.065;

      if (isDesktop()) {
        if (portraitRigRef.current) {
          portraitRigRef.current.style.transform = `perspective(1200px) rotateY(${(
            current.x * 4.2
          ).toFixed(2)}deg) rotateX(${(-current.y * 3.0).toFixed(2)}deg) translate3d(${(
            current.x * 8
          ).toFixed(1)}px, ${(current.y * 5).toFixed(1)}px, 0)`;
        }
        if (backShardRef.current) {
          backShardRef.current.style.transform = `translate3d(${(-current.x * 14).toFixed(
            1
          )}px, ${(-current.y * 10).toFixed(1)}px, 0)`;
        }
        if (midShardRef.current) {
          midShardRef.current.style.transform = `translate3d(${(-current.x * 8).toFixed(
            1
          )}px, ${(-current.y * 6).toFixed(1)}px, 0)`;
        }
        if (rimLightRef.current) {
          rimLightRef.current.style.transform = `translate3d(${(current.x * 18).toFixed(
            1
          )}px, ${(current.y * 12).toFixed(1)}px, 0)`;
        }
      } else {
        if (portraitRigRef.current) portraitRigRef.current.style.transform = '';
        if (backShardRef.current) backShardRef.current.style.transform = '';
        if (midShardRef.current) midShardRef.current.style.transform = '';
        if (rimLightRef.current) rimLightRef.current.style.transform = '';
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16 lg:pt-20 lg:pb-8"
    >
      {/* Layered Black & Crimson Angular Geometric Composition over 3D WebGL Stage */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Atmospheric red backlight glow */}
        <div
          className={`absolute -right-24 top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full blur-[130px] ${
            reducedMotion ? '' : 'animate-red-drift'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(255, 16, 26, 0.42) 0%, rgba(101, 0, 0, 0.25) 48%, rgba(8, 8, 8, 0) 76%)',
          }}
        />

        {/* Secondary red light sweep */}
        <div
          className={`absolute right-[10%] top-[8%] h-[480px] w-[360px] blur-[95px] ${
            reducedMotion ? '' : 'animate-red-sweep'
          }`}
          style={{
            background:
              'linear-gradient(135deg, rgba(230, 0, 18, 0.34) 0%, rgba(101, 0, 0, 0.08) 70%, transparent 100%)',
          }}
        />

        {/* Angular Red Geometric Panels + Subtle Network Connection Lines */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id="redPrimaryPanel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF101A" stopOpacity="0.82" />
              <stop offset="52%" stopColor="#E60012" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#650000" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient id="redDeepPanel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#650000" stopOpacity="0.52" />
              <stop offset="100%" stopColor="#120707" stopOpacity="0.78" />
            </linearGradient>
            <linearGradient id="darkCutSlice" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#120707" stopOpacity="0.84" />
              <stop offset="100%" stopColor="#080808" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Subtle Network Connection Arcs on Dark Left Canvas */}
          <g opacity="0.3">
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
          </g>

          {/* Angular Crimson Back Plane */}
          <polygon
            className="hero-shard"
            points="795,0 1440,0 1440,900 560,900"
            fill="url(#redDeepPanel)"
          />

          {/* Bold Primary Red Diagonal Panel */}
          <polygon
            className="hero-shard"
            points="930,0 1340,0 1080,900 670,900"
            fill="url(#redPrimaryPanel)"
          />

          {/* Sharp Obsidian Foreground Cut */}
          <polygon
            className="hero-shard"
            points="1270,0 1440,0 1440,900 1104,900"
            fill="url(#darkCutSlice)"
          />

          {/* Precision Red Razor Highlight Lines */}
          <line
            className="hero-shard"
            x1="795"
            y1="0"
            x2="560"
            y2="900"
            stroke="#FF101A"
            strokeOpacity="0.52"
            strokeWidth="1.5"
          />
          <line
            className="hero-shard"
            x1="930"
            y1="0"
            x2="670"
            y2="900"
            stroke="#FF101A"
            strokeOpacity="0.85"
            strokeWidth="2"
          />
          <polygon
            className="hero-shard"
            points="850,0 882,0 832,185 800,185"
            fill="#FF101A"
            fillOpacity="0.9"
          />
        </svg>

        {/* Left Dark Readability Scrim (preserving 3D scene visibility behind text) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(8, 8, 8, 0.86) 0%, rgba(8, 8, 8, 0.68) 42%, rgba(8, 8, 8, 0.12) 72%, rgba(8, 8, 8, 0.36) 100%)',
          }}
        />
      </div>

      {/* Responsive Two-Column (Desktop/Laptop) & Centered Vertical (Tablet/Mobile) Composition */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN: 3D Dimensional Typography & Actions */}
          <div className="perspective-1200 order-2 text-left md:mx-auto md:max-w-2xl md:text-center lg:order-1 lg:col-span-6 lg:mx-0 lg:max-w-none lg:py-12 lg:text-left">
            {/* Small Label */}
            <div className="hero-copy flex items-center gap-3 md:justify-center lg:justify-start">
              <span className="h-[2px] w-10 bg-[#FF101A]" aria-hidden="true" />
              <span className="font-mono text-xs font-medium tracking-[0.24em] text-[#B8B8B8] uppercase">
                {profile.smallLabel}
              </span>
            </div>

            {/* Monumental 3D Character-by-Character Extruded Name */}
            <h1
              className="mt-5 font-condensed text-[3.6rem] font-bold leading-[0.9] tracking-[0.025em] uppercase sm:text-7xl lg:text-[5.2rem] xl:text-[6.4rem]"
              aria-label="SUKUMAR KARNAM"
            >
              <AnimatedText
                text={profile.firstName}
                as="span"
                mode="chars3d"
                trigger="ready"
                ready={ready}
                delay={0.32}
                stagger={0.055}
                duration={0.95}
                className="text-3d-white block"
              />
              <AnimatedText
                text={profile.lastName}
                as="span"
                mode="chars3d"
                trigger="ready"
                ready={ready}
                delay={0.58}
                stagger={0.06}
                duration={0.98}
                className="text-3d-red block"
              />
            </h1>

            {/* Professional Title */}
            <div className="hero-copy mt-5 inline-flex items-center gap-3 border-l-2 border-[#FF101A] pl-4">
              <span className="font-display text-base font-semibold tracking-[0.24em] text-white uppercase sm:text-xl">
                {profile.title}
              </span>
            </div>

            {/* Supporting Text */}
            <AnimatedText
              text={profile.subtitle}
              as="p"
              mode="words3d"
              trigger="ready"
              ready={ready}
              delay={0.82}
              stagger={0.045}
              duration={0.78}
              className="mt-5 max-w-xl font-display text-lg font-medium leading-snug text-white md:mx-auto sm:text-xl lg:mx-0"
            />

            {/* Introduction */}
            <p className="hero-copy mt-4 max-w-xl text-sm leading-relaxed text-[#B8B8B8] md:mx-auto sm:text-base lg:mx-0">
              {profile.heroIntro}
            </p>

            {/* 3D Dimensional CTA Buttons */}
            <div className="hero-copy mt-8 flex flex-wrap items-center gap-4 md:justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => scrollTo('projects')}
                className="btn-3d-red group inline-flex items-center gap-3 px-7 py-4 font-mono text-xs font-semibold tracking-[0.18em] text-white uppercase"
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
                className="btn-3d-dark group inline-flex items-center gap-3 px-7 py-4 font-mono text-xs font-semibold tracking-[0.18em] text-white uppercase"
              >
                <span>CONTACT ME</span>
                <ArrowDownRight
                  className="h-4 w-4 text-[#FF101A] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </button>

              <a
                href={profile.contact.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-dark group inline-flex items-center gap-2.5 px-6 py-4 font-mono text-xs font-semibold tracking-[0.18em] text-[#B8B8B8] transition-colors hover:border-[#FF101A] hover:text-white uppercase"
              >
                <FileText className="h-4 w-4 text-[#FF101A]" aria-hidden="true" />
                <span>RESUME</span>
              </a>
            </div>

            {/* Subtle Focus Metadata */}
            <div className="hero-copy mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#351010] pt-5 font-mono text-[11px] tracking-[0.16em] text-[#B8B8B8] uppercase md:justify-center lg:justify-start">
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

          {/* RIGHT COLUMN: 3D Parallax Portrait Cutout + Red Rim Lighting */}
          <div className="perspective-1200 order-1 flex justify-center lg:order-2 lg:col-span-6 lg:justify-end">
            <div className="hero-portrait relative w-full max-w-[330px] sm:max-w-[430px] md:max-w-[460px] lg:max-w-[520px] xl:max-w-[570px]">
              {/* Back Angular Crimson Geometric Panel (Parallax Layer 1) */}
              <div
                ref={backShardRef}
                className="cr-diagonal-panel pointer-events-none absolute -inset-x-3 bottom-6 top-8 bg-gradient-to-br from-[#FF101A] via-[#E60012] to-[#650000] opacity-92 shadow-[0_30px_90px_-15px_rgba(255,16,26,0.52)] will-change-transform sm:-inset-x-4"
                aria-hidden="true"
              />

              {/* Mid Obsidian Geometric Offset Frame (Parallax Layer 2) */}
              <div
                ref={midShardRef}
                className="cr-diagonal-shard pointer-events-none absolute -right-2 bottom-12 top-2 w-[78%] border border-[#FF101A]/50 bg-[#120707]/52 will-change-transform sm:-right-3"
                aria-hidden="true"
              />

              {/* Moving Red Rim-Light Halo Behind Portrait */}
              <div
                ref={rimLightRef}
                className="pointer-events-none absolute inset-x-4 top-8 h-64 rounded-full blur-[65px] will-change-transform"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255, 16, 26, 0.55) 0%, rgba(230, 0, 18, 0.18) 55%, transparent 78%)',
                }}
                aria-hidden="true"
              />

              {/* Razor Red Accent Slash */}
              <div
                className="pointer-events-none absolute left-3 top-6 h-20 w-[3px] -skew-x-12 bg-[#FF101A] shadow-[0_0_24px_rgba(255,16,26,0.95)] sm:left-4 sm:h-24"
                aria-hidden="true"
              />

              {/* Foreground 3D Portrait Rig (Zero Face Distortion, Uncropped Headroom) */}
              <div
                ref={portraitRigRef}
                className="relative z-10 overflow-hidden pt-2 will-change-transform"
              >
                <img
                  src={imgSrc}
                  alt="Sukumar Karnam — Network Engineer"
                  onError={() => {
                    if (imgSrc !== profile.portraitFallbackUrl) {
                      setImgSrc(profile.portraitFallbackUrl);
                    }
                  }}
                  className="mx-auto block h-auto w-full max-h-[400px] object-contain object-top drop-shadow-[0_24px_46px_rgba(0,0,0,0.9)] sm:max-h-[520px] lg:max-h-[590px] xl:max-h-[670px]"
                  style={{
                    filter: 'contrast(1.04) saturate(0.96)',
                  }}
                />

                {/* Smooth Bottom Obsidian Fade */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-32"
                  style={{
                    background:
                      'linear-gradient(to top, #080808 0%, rgba(8, 8, 8, 0.8) 44%, rgba(8, 8, 8, 0) 100%)',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Minimal Identity Bar */}
              <div className="relative z-20 -mt-5 flex items-center justify-between border-t border-[#FF101A]/55 bg-[#080808]/92 px-4 py-2.5 backdrop-blur-sm">
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
