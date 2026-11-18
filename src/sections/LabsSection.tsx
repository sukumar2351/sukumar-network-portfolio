import React from 'react';
import { SectionTransition } from '../components/SectionTransition';
import { LabExplorer } from '../components/LabExplorer';

export const LabsSection: React.FC = () => {
  return (
    <SectionTransition
      id="labs"
      sectionIndex="05"
      heading="HANDS-ON LABS"
      tagline="Built through hands-on practice."
      description="Twelve core networking lab domains practicing addressing, VLANs, trunking, routing, ACLs, NAT, DHCP, DNS, ARP, and structured fault troubleshooting."
      className="bg-[#0B0505]"
    >
      <LabExplorer />
    </SectionTransition>
  );
};
