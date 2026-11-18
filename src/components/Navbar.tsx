import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { NavSectionId } from '../hooks/useScrollProgress';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NavbarProps {
  activeSection: NavSectionId;
  scrollProgress: number;
  ready?: boolean;
}

const NAV_ITEMS: Array<{ label: string; id: NavSectionId; href: string }> = [
  { label: 'HOME', id: 'home', href: '#home' },
  { label: 'ABOUT', id: 'about', href: '#about' },
  { label: 'SKILLS', id: 'skills', href: '#skills' },
  { label: 'PROJECTS', id: 'projects', href: '#projects' },
  { label: 'CONTACT', id: 'contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  scrollProgress,
  ready = true,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !navRef.current || !ready) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nav-item-3d',
        { y: -12, rotateX: -45, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.06,
          delay: 0.15,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );
    }, navRef);
    return () => ctx.revert();
  }, [ready, reducedMotion]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: NavSectionId) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#351010] bg-[#080808]/90 backdrop-blur-md">
      {/* Continuous crimson scroll progress indicator */}
      <div
        className="h-[2px] bg-gradient-to-r from-[#650000] via-[#E60012] to-[#FF101A] shadow-[0_0_10px_rgba(255,16,26,0.8)] transition-[width] duration-150 ease-out"
        style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        aria-hidden="true"
      />

      <nav
        ref={navRef}
        aria-label="Primary Navigation"
        className="perspective-1000 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Left Logo: SK. PORTFOLIO */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="nav-item-3d group inline-flex items-baseline gap-1.5 font-condensed text-xl font-bold tracking-[0.12em] uppercase"
        >
          <span className="text-white">SK</span>
          <span className="text-[#FF101A]">.</span>
          <span className="ml-0.5 text-sm font-semibold tracking-[0.22em] text-[#B8B8B8] transition-colors group-hover:text-white">
            PORTFOLIO
          </span>
        </a>

        {/* Right Minimal Navigation: HOME | ABOUT | SKILLS | PROJECTS | CONTACT */}
        <ul className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="nav-item-3d">
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative px-3.5 py-2 font-mono text-xs font-medium tracking-[0.16em] uppercase transition-colors ${
                    isActive ? 'text-white' : 'text-[#B8B8B8] hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-3.5 bottom-0 h-[2px] origin-left bg-[#FF101A] transition-transform duration-200 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    aria-hidden="true"
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center border border-[#351010] bg-[#120707] text-white transition-colors hover:border-[#FF101A] hover:text-[#FF101A] md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-primary-nav"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-primary-nav"
          className="border-t border-[#351010] bg-[#080808] px-4 py-4 md:hidden"
        >
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`flex items-center justify-between border px-3.5 py-2.5 font-mono text-xs tracking-[0.16em] uppercase transition-colors ${
                      isActive
                        ? 'border-[#FF101A] bg-[#120707] text-white'
                        : 'border-transparent text-[#B8B8B8] hover:border-[#351010] hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 bg-[#FF101A]" aria-hidden="true" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};
