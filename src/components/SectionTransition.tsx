import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedText, TextAnimationMode } from './AnimatedText';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  id: string;
  sectionIndex: string;
  heading: string;
  headingMode?: TextAnimationMode;
  tagline?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  id,
  sectionIndex,
  heading,
  headingMode = 'words3d',
  tagline,
  description,
  className = '',
  children,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (barRef.current) {
        gsap.fromTo(
          barRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 86%',
              once: true,
            },
          }
        );
      }

      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { y: 28, opacity: 0.12 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative scroll-mt-20 border-t border-[#351010] py-20 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
            <span
              ref={barRef}
              className="h-[2px] w-9 bg-[#FF101A] shadow-[0_0_12px_rgba(255,16,26,0.75)]"
              aria-hidden="true"
            />
            <span className="text-[#FF101A]">{sectionIndex}</span>
          </div>

          <AnimatedText
            text={heading}
            as="h2"
            mode={headingMode}
            trigger="scroll"
            className="text-3d-section mt-3 font-condensed text-4xl font-bold tracking-[0.03em] text-white uppercase sm:text-5xl"
          />

          {tagline && (
            <AnimatedText
              text={tagline}
              as="p"
              mode="words3d"
              trigger="scroll"
              delay={0.14}
              stagger={0.04}
              className="mt-2 font-display text-lg font-medium text-[#FF101A] sm:text-xl"
            />
          )}

          {description && (
            <AnimatedText
              text={description}
              as="p"
              mode="depth"
              trigger="scroll"
              delay={0.22}
              className="mt-3 text-base leading-relaxed text-[#B8B8B8]"
            />
          )}
        </div>

        <div ref={bodyRef}>{children}</div>
      </div>
    </section>
  );
};
