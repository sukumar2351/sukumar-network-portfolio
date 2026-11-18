import React from 'react';
import { SectionTransition } from '../components/SectionTransition';
import { profile } from '../data/profile';

export const SkillsSection: React.FC = () => {
  return (
    <SectionTransition
      id="skills"
      sectionIndex="04"
      heading="TECHNICAL SKILLS"
      description="Core networking domains structured across fundamentals, switching, routing, network services, security, and troubleshooting."
      className="bg-[#080808]"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {profile.skills.map((group, idx) => (
          <article key={group.category} className="cr-card flex flex-col p-6">
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
                <li key={item} className="flex items-center gap-3 text-[#B8B8B8]">
                  <span
                    className="h-1.5 w-1.5 shrink-0 bg-[#FF101A]"
                    aria-hidden="true"
                  />
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionTransition>
  );
};
