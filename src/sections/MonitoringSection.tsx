import React from 'react';
import { SectionTransition } from '../components/SectionTransition';
import { MonitoringDashboard } from '../components/MonitoringDashboard';

export const MonitoringSection: React.FC = () => {
  return (
    <SectionTransition
      id="projects"
      sectionIndex="02"
      heading="NETWORK MONITORING"
      headingMode="chars3d"
      tagline="See the network. Find the fault."
      description="Illustrative monitoring dashboard demonstrating how routers, switches, WAN links, traffic utilization, and latency work together to isolate connectivity issues."
      className="bg-[#0B0505]/80"
    >
      <MonitoringDashboard />
    </SectionTransition>
  );
};
