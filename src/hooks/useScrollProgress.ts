import { useEffect, useState } from 'react';

export type NavSectionId = 'home' | 'about' | 'skills' | 'projects' | 'contact';

export interface ScrollState {
  progress: number;
  activeSection: NavSectionId;
  scrollY: number;
}

const SECTION_MAP: Array<{ id: string; nav: NavSectionId }> = [
  { id: 'home', nav: 'home' },
  { id: 'about', nav: 'about' },
  { id: 'projects', nav: 'projects' },
  { id: 'enterprise', nav: 'projects' },
  { id: 'skills', nav: 'skills' },
  { id: 'labs', nav: 'projects' },
  { id: 'terminal', nav: 'projects' },
  { id: 'education', nav: 'about' },
  { id: 'contact', nav: 'contact' },
];

export function useScrollProgress(): ScrollState {
  const [state, setState] = useState<ScrollState>({
    progress: 0,
    activeSection: 'home',
    scrollY: 0,
  });

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      let activeSection: NavSectionId = 'home';
      const viewportTrigger = window.innerHeight * 0.36;

      for (const entry of SECTION_MAP) {
        const el = document.getElementById(entry.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportTrigger) {
            activeSection = entry.nav;
          }
        }
      }

      setState((prev) => {
        if (
          Math.abs(prev.progress - progress) < 0.001 &&
          prev.activeSection === activeSection &&
          Math.abs(prev.scrollY - scrollTop) < 1
        ) {
          return prev;
        }
        return { progress, activeSection, scrollY: scrollTop };
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return state;
}
