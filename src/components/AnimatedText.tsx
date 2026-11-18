import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export type TextAnimationMode = 'chars3d' | 'words3d' | 'depth';

interface AnimatedTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  mode?: TextAnimationMode;
  trigger?: 'scroll' | 'ready';
  ready?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
}

/**
 * Reusable 3D Dimensional Typography Animator
 * - chars3d: character-by-character 3D perspective rotateX + Z-depth flip
 * - words3d: word-by-word 3D perspective entrance
 * - depth: clean dimensional slide + letter-spacing settle
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  as: Tag = 'div',
  mode = 'words3d',
  trigger = 'scroll',
  ready = true,
  delay = 0,
  stagger,
  duration,
  className = '',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;

    const units =
      mode === 'depth'
        ? [el]
        : Array.from(el.querySelectorAll<HTMLElement>('.anim-unit'));

    if (units.length === 0) return;

    const ctx = gsap.context(() => {
      const fromVars: gsap.TweenVars =
        mode === 'chars3d'
          ? {
              opacity: 0,
              y: 34,
              rotateX: -78,
              z: -24,
              transformOrigin: '50% 100% -12px',
            }
          : mode === 'words3d'
            ? {
                opacity: 0,
                y: 26,
                rotateX: -48,
                transformOrigin: '50% 100%',
              }
            : {
                opacity: 0,
                y: 20,
                rotateX: -14,
                transformOrigin: '50% 100%',
              };

      if (trigger === 'ready' && !ready) {
        gsap.set(units, fromVars);
        return;
      }

      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        rotateX: 0,
        z: 0,
        duration:
          duration ?? (mode === 'chars3d' ? 0.85 : mode === 'words3d' ? 0.72 : 0.75),
        stagger:
          stagger ?? (mode === 'chars3d' ? 0.042 : mode === 'words3d' ? 0.065 : 0),
        delay,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      };

      if (trigger === 'scroll') {
        toVars.scrollTrigger = {
          trigger: el,
          start: 'top 88%',
          once: true,
        };
      }

      gsap.fromTo(units, fromVars, toVars);
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration, mode, ready, reducedMotion, stagger, text, trigger]);

  if (mode === 'depth') {
    return (
      <Tag
        ref={containerRef as React.RefObject<never>}
        className={`perspective-1000 ${className}`}
      >
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef as React.RefObject<never>}
      className={`perspective-1000 ${className}`}
      aria-label={text}
    >
      {words.map((word, wIdx) => (
        <span
          key={`${word}-${wIdx}`}
          className="inline-block whitespace-nowrap"
          aria-hidden="true"
        >
          {mode === 'chars3d' ? (
            Array.from(word).map((char, cIdx) => (
              <span
                key={`${wIdx}-${cIdx}`}
                className="anim-unit inline-block will-change-transform"
              >
                {char}
              </span>
            ))
          ) : (
            <span className="anim-unit inline-block will-change-transform">
              {word}
            </span>
          )}
          {wIdx < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
};
