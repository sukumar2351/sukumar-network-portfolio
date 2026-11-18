import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';
import { SectionTransition } from '../components/SectionTransition';
import { TiltCard3D } from '../components/TiltCard3D';
import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const EducationSection: React.FC = () => {
  const { education, certification } = profile;
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !timelineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.edu-timeline-rail',
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.edu-timeline-item',
        { opacity: 0, x: -24, rotateY: 8 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.85,
          stagger: 0.22,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, timelineRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <SectionTransition
      id="education"
      sectionIndex="07"
      heading="EDUCATION & CERTIFICATION"
      headingMode="words3d"
      className="bg-[#0B0505]/80"
    >
      <div ref={timelineRef} className="perspective-1200 relative pl-7 sm:pl-10">
        {/* Progressive Vertical Crimson Timeline Rail */}
        <div
          className="edu-timeline-rail absolute bottom-4 left-2 top-3 w-[2px] bg-gradient-to-b from-[#FF101A] via-[#650000] to-[#351010] sm:left-3"
          aria-hidden="true"
        />

        <div className="space-y-6">
          {/* Timeline Item 01: Education */}
          <div className="edu-timeline-item relative">
            <span
              className="absolute -left-[25px] top-8 h-3 w-3 border-2 border-[#FF101A] bg-[#080808] shadow-[0_0_12px_rgba(255,16,26,0.9)] sm:-left-[34px]"
              aria-hidden="true"
            />
            <TiltCard3D maxTilt={4}>
              <article className="cr-card flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex items-center justify-between border-b border-[#351010] pb-4">
                    <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-[#FF101A] uppercase">
                      <GraduationCap className="h-4 w-4" aria-hidden="true" />
                      Education
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.14em] text-[#B8B8B8] uppercase">
                      DEGREE
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-bold text-white">
                    {education.degree}
                  </h3>
                  <p className="mt-2 font-mono text-sm font-medium text-[#FF101A]">
                    {education.institution}
                  </p>
                  <p className="mt-1 text-sm text-[#B8B8B8]">{education.location}</p>
                  {education.period && (
                    <p className="mt-2 font-mono text-xs text-white/80">{education.period}</p>
                  )}
                </div>

                <p className="mt-5 border-t border-[#351010] pt-4 text-xs leading-relaxed text-[#B8B8B8]">
                  Academic foundation in computer systems, data communications, operating
                  systems, and structured analytical problem solving.
                </p>
              </article>
            </TiltCard3D>
          </div>

          {/* Timeline Item 02: Certification */}
          <div className="edu-timeline-item relative">
            <span
              className="absolute -left-[25px] top-8 h-3 w-3 border-2 border-[#FF101A] bg-[#080808] shadow-[0_0_12px_rgba(255,16,26,0.9)] sm:-left-[34px]"
              aria-hidden="true"
            />
            <TiltCard3D maxTilt={4}>
              <article className="cr-card flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex items-center justify-between border-b border-[#351010] pb-4">
                    <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-[#FF101A] uppercase">
                      <Award className="h-4 w-4" aria-hidden="true" />
                      Certification
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.14em] text-[#B8B8B8] uppercase">
                      CREDENTIAL
                    </span>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-xs tracking-[0.16em] text-[#FF101A] uppercase">
                        {certification.provider}
                      </div>
                      <h3 className="mt-1 font-display text-2xl font-bold text-white">
                        {certification.provider} — {certification.title}
                      </h3>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#FF101A]/50 bg-[#080808] text-[#FF101A]">
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#B8B8B8]">
                    {certification.description}
                  </p>

                  {certification.certificateImageUrl && (
                    <div className="mt-4 overflow-hidden border border-[#351010] bg-[#080808] p-2">
                      <img
                        src={certification.certificateImageUrl}
                        alt={`${certification.provider} ${certification.title} certificate`}
                        loading="lazy"
                        className="max-h-48 w-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-[#351010] pt-4">
                  {certification.verificationUrl ? (
                    <a
                      href={certification.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[#FF101A] bg-[#650000]/35 px-4 py-2 font-mono text-xs text-white transition-colors hover:bg-[#FF101A]"
                    >
                      <span>Verify Certificate</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] text-[#B8B8B8]">
                      {certification.credentialNote}
                    </span>
                  )}
                </div>
              </article>
            </TiltCard3D>
          </div>
        </div>
      </div>
    </SectionTransition>
  );
};
