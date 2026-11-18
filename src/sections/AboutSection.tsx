import React from 'react';
import { BookOpen, GraduationCap, Network, Wrench } from 'lucide-react';
import { SectionTransition } from '../components/SectionTransition';
import { profile } from '../data/profile';

const CARD_ICONS = [GraduationCap, Network, Wrench, BookOpen];

export const AboutSection: React.FC = () => {
  return (
    <SectionTransition
      id="about"
      sectionIndex="01"
      heading="ABOUT ME"
      description={profile.about}
      className="bg-[#080808]"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {profile.aboutCards.map((card, idx) => {
          const Icon = CARD_ICONS[idx % CARD_ICONS.length];
          return (
            <article
              key={card.title}
              className="cr-card group flex flex-col p-6 hover:-translate-y-1"
            >
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
          );
        })}
      </div>
    </SectionTransition>
  );
};
