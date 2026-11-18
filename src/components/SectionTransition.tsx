import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  id: string;
  sectionIndex: string;
  heading: string;
  tagline?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export const SectionTransition: React.FC<SectionTransitionProps> = ({
  id,
  sectionIndex,
  heading,
  tagline,
  description,
  className = '',
  children,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 24, opacity: 0.15 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );
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
        <div ref={contentRef}>
          <div className="mb-12 max-w-3xl">
            <div className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase">
              <span className="h-[2px] w-8 bg-[#FF101A]" aria-hidden="true" />
              <span className="text-[#FF101A]">{sectionIndex}</span>
            </div>

            <h2 className="mt-3 font-condensed text-4xl font-bold tracking-[0.03em] text-white uppercase sm:text-5xl">
              {heading}
            </h2>

            {tagline && (
              <p className="mt-2 font-display text-lg font-medium text-[#FF101A] sm:text-xl">
                {tagline}
              </p>
            )}

            {description && (
              <p className="mt-3 text-base leading-relaxed text-[#B8B8B8]">
                {description}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </section>
  );
};
