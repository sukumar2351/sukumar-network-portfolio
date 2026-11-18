import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Check,
  ChevronRight,
  Copy,
  FileCode2,
  Network,
  Target,
  Wrench,
  X,
} from 'lucide-react';
import { EngineeringLab, engineeringLabs } from '../data/labs';
import { TiltCard3D } from './TiltCard3D';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const LabExplorer: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<EngineeringLab | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.lab-card-3d',
        { opacity: 0, y: 36, rotateX: 12, transformOrigin: '50% 0%' },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.78,
          stagger: 0.065,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!selectedLab) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLab(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedLab]);

  const handleCopyConfig = async (lab: EngineeringLab) => {
    try {
      await navigator.clipboard.writeText(lab.configExample);
      setCopiedId(lab.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="space-y-6">
      {/* Clean 12-Lab Grid with Subtle 3D Perspective Entrance & Hover Tilt (No Filter Bar) */}
      <div
        ref={gridRef}
        className="perspective-1200 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {engineeringLabs.map((lab) => (
          <div key={lab.id} className="lab-card-3d">
            <TiltCard3D className="h-full" maxTilt={5}>
              <article className="cr-card group flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold tracking-[0.16em] text-[#FF101A]">
                      {lab.code}
                    </span>
                    <span className="border border-[#351010] bg-[#080808] px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-[#B8B8B8] uppercase">
                      {lab.progress}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-bold text-white">
                    {lab.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#B8B8B8]">
                    {lab.shortDescription}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {lab.concepts.slice(0, 4).map((concept) => (
                      <span
                        key={concept}
                        className="border border-[#351010] bg-[#080808] px-2 py-0.5 font-mono text-[10px] text-[#B8B8B8]"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#351010] pt-4">
                  <div className="font-mono text-[10px] tracking-[0.14em] text-[#B8B8B8] uppercase">
                    Learning Objective
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-white/85">
                    {lab.learningOutcome}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedLab(lab)}
                    className="mt-4 inline-flex w-full items-center justify-between border border-[#351010] bg-[#080808] px-4 py-2.5 font-mono text-xs font-medium tracking-[0.14em] text-white uppercase transition-all hover:border-[#FF101A] hover:bg-[#FF101A] hover:text-white"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            </TiltCard3D>
          </div>
        ))}
      </div>

      {/* Portaled Lab Detail Panel */}
      {selectedLab &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/86 p-4 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-modal-title"
            onClick={() => setSelectedLab(null)}
          >
            <div
              className="max-h-[88vh] w-full max-w-3xl overflow-y-auto border border-[#FF101A]/55 bg-[#0C0606] shadow-[0_24px_80px_rgba(0,0,0,0.92)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#351010] bg-[#080808] px-5 py-4 sm:px-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#FF101A]">
                    <span>{selectedLab.code}</span>
                    <span className="text-[#B8B8B8]">/</span>
                    <span className="border border-[#351010] bg-[#120707] px-2 py-0.5 text-[10px] text-white">
                      {selectedLab.progress}
                    </span>
                  </div>
                  <h3
                    id="lab-modal-title"
                    className="mt-1 font-display text-xl font-bold text-white sm:text-2xl"
                  >
                    {selectedLab.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLab(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#351010] bg-[#120707] text-white transition-colors hover:border-[#FF101A] hover:bg-[#FF101A]"
                  aria-label="Close lab details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-wider text-[#FF101A] uppercase">
                    <Target className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Objective</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/90">
                    {selectedLab.objective}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-wider text-[#FF101A] uppercase">
                    <Network className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Topology Diagram</span>
                  </div>
                  <pre className="overflow-x-auto border border-[#351010] bg-[#060606] p-4 font-mono text-xs leading-relaxed text-white/90">
                    {selectedLab.topologyDiagram}
                  </pre>
                </div>

                <div>
                  <div className="mb-2 font-mono text-xs tracking-wider text-[#FF101A] uppercase">
                    Concepts
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedLab.concepts.map((concept) => (
                      <span
                        key={concept}
                        className="border border-[#351010] bg-[#120707] px-2.5 py-1 font-mono text-xs text-white"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[#FF101A] uppercase">
                      <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{selectedLab.configTitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyConfig(selectedLab)}
                      className="inline-flex items-center gap-1.5 border border-[#351010] bg-[#080808] px-2.5 py-1 font-mono text-[11px] text-white transition-colors hover:border-[#FF101A] hover:text-[#FF101A]"
                    >
                      {copiedId === selectedLab.id ? (
                        <>
                          <Check className="h-3 w-3 text-[#FF101A]" aria-hidden="true" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" aria-hidden="true" />
                          <span>COPY CLI</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto border border-[#351010] bg-[#060606] p-4 font-mono text-xs leading-relaxed text-white">
                    {selectedLab.configExample}
                  </pre>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-wider text-[#FF101A] uppercase">
                    <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Troubleshooting Notes</span>
                  </div>
                  <ul className="space-y-2 border border-[#351010] bg-[#120707] p-4 text-sm text-[#B8B8B8]">
                    {selectedLab.troubleshootingNotes.map((note) => (
                      <li key={note} className="flex items-start gap-2.5">
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#FF101A]"
                          aria-hidden="true"
                        />
                        <span className="text-white/90">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
