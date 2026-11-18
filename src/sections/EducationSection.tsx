import React from 'react';
import { Award, ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';
import { SectionTransition } from '../components/SectionTransition';
import { profile } from '../data/profile';

export const EducationSection: React.FC = () => {
  const { education, certification } = profile;

  return (
    <SectionTransition
      id="education"
      sectionIndex="07"
      heading="EDUCATION & CERTIFICATION"
      className="bg-[#0B0505]"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Education Card */}
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

            <h3 className="mt-6 font-display text-2xl font-bold text-white">
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

          <p className="mt-6 border-t border-[#351010] pt-4 text-xs leading-relaxed text-[#B8B8B8]">
            Academic foundation in computer systems, data communications, operating systems,
            and structured analytical problem solving.
          </p>
        </article>

        {/* Certification Card */}
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

            <div className="mt-6 flex items-start justify-between gap-4">
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

          <div className="mt-6 border-t border-[#351010] pt-4">
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
      </div>
    </SectionTransition>
  );
};
