import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, GraduationCap, Network, Wrench } from 'lucide-react';
import { SectionTransition } from '../components/SectionTransition';
import { TiltCard3D } from '../components/TiltCard3D';
import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const CARD_ICONS = [GraduationCap, Network, Wrench, BookOpen];

export const AboutSection: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-card-3d',
        { opacity: 0, y: 38, rotateX: -18, transformOrigin: '50% 100%' },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <SectionTransition
      id="about"
      sectionIndex="01"
      heading="ABOUT ME"
      headingMode="chars3d"
      description={profile.about}
      className="bg-[#080808]/78"
    >
      <div
        ref={gridRef}
        className="perspective-1200 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {profile.aboutCards.map((card, idx) => {
          const Icon = CARD_ICONS[idx % CARD_ICONS.length];
          return (
            <div key={card.title} className="about-card-3d">
              <TiltCard3D className="h-full">
                <article className="cr-card group flex h-full flex-col p-6">
                  <div className="flex h-11 w-11 items-center justify-center border border-[#FF101A]/60 bg-[#080808] text-[#FF101A] transition-colors group-hover:bg-[#FF101A] group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold text-white">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#B8B8B8]">
                    {card.subtitle}
                  </p>
                </article>
              </TiltCard3D>
            </div>
          );
        })}
      </div>
    </SectionTransition>
  );
};
