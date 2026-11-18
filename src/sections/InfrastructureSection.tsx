import React from 'react';
import { SectionTransition } from '../components/SectionTransition';
import { EnterpriseArchitecture } from '../components/EnterpriseArchitecture';

export const InfrastructureSection: React.FC = () => {
  return (
    <SectionTransition
      id="enterprise"
      sectionIndex="03"
      heading="ENTERPRISE NETWORKING"
      headingMode="chars3d"
      tagline="Connect every location with intent."
      description="Interactive multi-site enterprise reference diagram showing Main Office, Branch Office, Core/Distribution/Access layers, VLAN segmentation, inter-VLAN routing, and WAN connectivity."
      className="bg-[#080808]/78"
    >
      <EnterpriseArchitecture />
    </SectionTransition>
  );
};
