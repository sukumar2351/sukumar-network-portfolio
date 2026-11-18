import React, { Suspense, lazy, useCallback, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageLoader } from './components/PageLoader';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { MonitoringSection } from './sections/MonitoringSection';
import { InfrastructureSection } from './sections/InfrastructureSection';
import { SkillsSection } from './sections/SkillsSection';
import { LabsSection } from './sections/LabsSection';
import { TerminalSection } from './sections/TerminalSection';
import { EducationSection } from './sections/EducationSection';
import { ContactSection } from './sections/ContactSection';
import { useScrollProgress } from './hooks/useScrollProgress';

const Scene3D = lazy(() =>
  import('./components/Scene3D').then((mod) => ({ default: mod.Scene3D }))
);

export const App: React.FC = () => {
  const { progress, activeSection } = useScrollProgress();
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080808] text-white">
      {/* 1% -> 100% Cinematic Black & Red Loader */}
      <PageLoader onComplete={handleLoaderComplete} />

      {/* Lazy-Loaded Responsive 3D WebGL Environment & Cinematic Camera */}
      <Suspense fallback={<div className="fixed inset-0 z-0 bg-[#080808]" aria-hidden="true" />}>
        <Scene3D ready={loaderDone} />
      </Suspense>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-[#FF101A] focus:bg-[#080808] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar activeSection={activeSection} scrollProgress={progress} ready={loaderDone} />

      <main id="main-content" className="relative z-10">
        <HeroSection ready={loaderDone} />
        <AboutSection />
        <MonitoringSection />
        <InfrastructureSection />
        <SkillsSection />
        <LabsSection />
        <TerminalSection />
        <EducationSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
