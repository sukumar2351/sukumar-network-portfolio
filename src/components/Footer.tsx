import React from 'react';
import { ArrowUp } from 'lucide-react';
import { profile } from '../data/profile';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#351010] bg-[#060606]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-2.5">
            <div className="font-condensed text-lg font-bold tracking-[0.14em] uppercase">
              <span className="text-white">SK</span>
              <span className="text-[#FF101A]">.</span>
              <span className="ml-1 text-xs font-semibold tracking-[0.2em] text-[#B8B8B8]">
                PORTFOLIO
              </span>
            </div>
            <p className="font-display text-base font-medium text-white">
              {profile.footerTagline}
            </p>
            <p className="max-w-lg text-xs text-[#B8B8B8]">
              Monitoring metrics, topologies, and terminal outputs shown on this portfolio are
              illustrative educational demonstrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <nav
              aria-label="Footer Navigation"
              className="flex flex-wrap gap-5 font-mono text-xs tracking-[0.14em] text-[#B8B8B8] uppercase"
            >
              <a href="#home" className="hover:text-[#FF101A]">
                Home
              </a>
              <a href="#about" className="hover:text-[#FF101A]">
                About
              </a>
              <a href="#skills" className="hover:text-[#FF101A]">
                Skills
              </a>
              <a href="#projects" className="hover:text-[#FF101A]">
                Projects
              </a>
              <a href="#contact" className="hover:text-[#FF101A]">
                Contact
              </a>
            </nav>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 border border-[#351010] bg-[#120707] px-3.5 py-2 font-mono text-xs text-white transition-colors hover:border-[#FF101A] hover:bg-[#FF101A]"
              aria-label="Back to top"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              <span>TOP</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-[#351010] pt-6 font-mono text-[11px] text-[#B8B8B8] sm:flex-row">
          <span>&copy; {currentYear} Sukumar Karnam. All rights reserved.</span>
          <span>BCA Graduate · Krishna University · Network Engineer</span>
        </div>
      </div>
    </footer>
  );
};
