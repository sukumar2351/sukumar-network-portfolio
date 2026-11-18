import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTransition } from '../components/SectionTransition';
import { TiltCard3D } from '../components/TiltCard3D';
import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const SkillsSection: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skill-card-3d',
        { opacity: 0, y: 36, rotateY: -14, rotateX: 8, transformOrigin: 'left center' },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.11,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.skill-item-reveal',
        { opacity: 0, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.035,
          delay: 0.2,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <SectionTransition
      id="skills"
      sectionIndex="04"
      heading="TECHNICAL SKILLS"
      headingMode="chars3d"
      description="Core networking domains structured across fundamentals, switching, routing, network services, security, and troubleshooting."
      className="bg-[#080808]/78"
    >
      <div
        ref={gridRef}
        className="perspective-1200 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {profile.skills.map((group, idx) => (
          <div key={group.category} className="skill-card-3d">
            <TiltCard3D className="h-full">
              <article className="cr-card flex h-full flex-col p-6">
                <div className="mb-4 flex items-center justify-between border-b border-[#351010] pb-3">
                  <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#FF101A] uppercase">
                    0{idx + 1} // DOMAIN
                  </span>
                  <span className="font-mono text-[10px] text-[#B8B8B8]">
                    {group.items.length} TOPICS
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white">
                  {group.category}
                </h3>

                <ul className="mt-5 space-y-2.5 text-sm">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="skill-item-reveal flex items-center gap-3 text-[#B8B8B8]"
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 bg-[#FF101A]"
                        aria-hidden="true"
                      />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </TiltCard3D>
          </div>
        ))}
      </div>
    </SectionTransition>
  );
};
