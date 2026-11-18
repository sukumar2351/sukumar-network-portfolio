import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionTransition } from '../components/SectionTransition';
import { Terminal } from '../components/Terminal';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const TerminalSection: React.FC = () => {
  const consoleRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !consoleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        consoleRef.current,
        { opacity: 0, y: 36, rotateX: 9, transformOrigin: '50% 0%' },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: consoleRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );
    }, consoleRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <SectionTransition
      id="terminal"
      sectionIndex="06"
      heading="NETWORK COMMAND CENTER"
      headingMode="chars3d"
      description="Interactive educational demonstration of essential Windows and Linux diagnostic commands used during network verification and troubleshooting. Commands are simulated locally for learning only."
      className="bg-[#080808]/78"
    >
      <div className="perspective-1200">
        <div ref={consoleRef}>
          <Terminal />
        </div>
      </div>
    </SectionTransition>
  );
};
