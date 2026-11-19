import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Linkedin,
  Mail,
} from 'lucide-react';
import { SectionTransition } from '../components/SectionTransition';
import { ContactForm } from '../components/ContactForm';
import { TiltCard3D } from '../components/TiltCard3D';
import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { contact } = profile;

  useEffect(() => {
    if (reducedMotion || !cardsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-card-3d',
        { opacity: 0, y: 26, rotateX: -12 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );
    }, cardsRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const contactCards = [
    {
      key: 'email',
      label: 'Email',
      icon: Mail,
      value: contact.email,
      displayValue: contact.email,
      href: contact.email ? `mailto:${contact.email}` : '',
      placeholder: 'Add your email in src/data/profile.ts',
      actionText: 'Send Email',
      isExternal: false,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      value: contact.linkedinUrl,
      displayValue: 'in/sukumar-karnam-595128313',
      href: contact.linkedinUrl,
      placeholder: 'Add LinkedIn URL in src/data/profile.ts',
      actionText: 'Open Profile',
      isExternal: true,
    },
    {
      key: 'resume',
      label: 'Resume',
      icon: FileText,
      value: contact.resumeUrl,
      displayValue: 'Sukumar-Karnam-Resume.pdf',
      href: contact.resumeUrl,
      placeholder: 'Add resume PDF link in src/data/profile.ts',
      actionText: 'View Resume',
      isExternal: true,
    },
  ];

  const handleCopy = async (key: string, text: string) => {
    try {
      const copyVal =
        key === 'resume' && text.startsWith('/')
          ? `${window.location.origin}${text}`
          : text;
      await navigator.clipboard.writeText(copyVal);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1600);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Cinematic Final Red Atmospheric Spotlight */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 16, 26, 0.24) 0%, rgba(101, 0, 0, 0.14) 48%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <SectionTransition
        id="contact"
        sectionIndex="08"
        heading="LET'S CONNECT"
        headingMode="chars3d"
        description={profile.contactIntro}
        className="bg-[#080808]/82"
      >
        <div
          ref={cardsRef}
          className="perspective-1200 grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {contactCards.map((card) => {
              const Icon = card.icon;
              const configured = Boolean(card.value.trim());

              return (
                <div key={card.key} className="contact-card-3d">
                  <TiltCard3D maxTilt={4}>
                    <div className="cr-card flex flex-col justify-between p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#FF101A]/50 bg-[#080808] text-[#FF101A]">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div>
                            <div className="font-mono text-[10px] tracking-[0.16em] text-[#B8B8B8] uppercase">
                              CHANNEL
                            </div>
                            <div className="font-display text-base font-bold text-white">
                              {card.label}
                            </div>
                            {configured && (
                              <div className="mt-0.5 max-w-[210px] truncate font-mono text-[11px] text-[#FF101A] sm:max-w-[260px]">
                                {card.displayValue}
                              </div>
                            )}
                          </div>
                        </div>

                        <span
                          className={`font-mono text-[10px] tracking-wider uppercase ${
                            configured ? 'text-[#FF101A]' : 'text-[#B8B8B8]'
                          }`}
                        >
                          {configured ? 'ACTIVE' : 'EDITABLE'}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#351010] pt-3">
                        {configured ? (
                          <>
                            <a
                              href={card.href}
                              target={card.isExternal ? '_blank' : undefined}
                              rel={card.isExternal ? 'noopener noreferrer' : undefined}
                              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#FF101A] hover:underline"
                            >
                              <span>{card.actionText}</span>
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(card.key, card.value)}
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-[#B8B8B8] hover:text-white"
                            >
                              {copiedKey === card.key ? (
                                <>
                                  <Check className="h-3 w-3 text-[#FF101A]" aria-hidden="true" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" aria-hidden="true" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <span className="font-mono text-[11px] text-[#B8B8B8]">
                            {card.placeholder}
                          </span>
                        )}
                      </div>
                    </div>
                  </TiltCard3D>
                </div>
              );
            })}
          </div>

          <div className="contact-card-3d lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </SectionTransition>
    </div>
  );
};
