import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { SectionTransition } from '../components/SectionTransition';
import { ContactForm } from '../components/ContactForm';
import { profile } from '../data/profile';

export const ContactSection: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { contact } = profile;

  const contactCards = [
    {
      key: 'email',
      label: 'Email',
      icon: Mail,
      value: contact.email,
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
      href: contact.linkedinUrl,
      placeholder: 'Add LinkedIn URL in src/data/profile.ts',
      actionText: 'Open Profile',
      isExternal: true,
    },
    {
      key: 'github',
      label: 'GitHub',
      icon: Github,
      value: contact.githubUrl,
      href: contact.githubUrl,
      placeholder: 'Add GitHub URL in src/data/profile.ts',
      actionText: 'View Repositories',
      isExternal: true,
    },
    {
      key: 'resume',
      label: 'Resume',
      icon: FileText,
      value: contact.resumeUrl,
      href: contact.resumeUrl,
      placeholder: 'Add resume PDF link in src/data/profile.ts',
      actionText: 'View Resume',
      isExternal: true,
    },
  ];

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1600);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <SectionTransition
      id="contact"
      sectionIndex="08"
      heading="LET'S CONNECT"
      description={profile.contactIntro}
      className="bg-[#080808]"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {contactCards.map((card) => {
            const Icon = card.icon;
            const configured = Boolean(card.value.trim());

            return (
              <div key={card.key} className="cr-card flex flex-col justify-between p-5">
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
            );
          })}
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </SectionTransition>
  );
};
