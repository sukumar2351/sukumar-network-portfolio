import React, { useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

/**
 * Hardware-accelerated CSS 3D Tilt Card with subtle crimson rim light reflection.
 * Automatically disables pointer-tilt on touch devices and when prefers-reduced-motion is active.
 */
export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  maxTilt = 5.5,
  glare = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [transform, setTransform] = useState<string>(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  );
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  const isDesktopPointer = () =>
    typeof window !== 'undefined' &&
    window.innerWidth >= 1024 &&
    window.matchMedia('(pointer: fine)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !isDesktopPointer() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotY = (px - 0.5) * (maxTilt * 2);
    const rotX = (0.5 - py) * (maxTilt * 2);

    setTransform(
      `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(6px)`
    );
    if (glare) {
      setGlarePos({ x: px * 100, y: py * 100, active: true });
    }
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setGlarePos((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: glarePos.active
          ? 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)'
          : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: glarePos.active ? 1 : 0,
            background: `radial-gradient(280px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 16, 26, 0.16), transparent 72%)`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};
