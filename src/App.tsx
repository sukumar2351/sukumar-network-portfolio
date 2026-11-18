import React, { useCallback, useState } from 'react';
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

export const App: React.FC = () => {
  const { progress, activeSection } = useScrollProgress();
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080808] text-white">
      <PageLoader onComplete={handleLoaderComplete} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-[#FF101A] focus:bg-[#080808] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar activeSection={activeSection} scrollProgress={progress} />

      <main id="main-content" className="relative">
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
