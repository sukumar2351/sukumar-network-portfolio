import React from 'react';
import { SectionTransition } from '../components/SectionTransition';
import { Terminal } from '../components/Terminal';

export const TerminalSection: React.FC = () => {
  return (
    <SectionTransition
      id="terminal"
      sectionIndex="06"
      heading="NETWORK COMMAND CENTER"
      description="Interactive educational demonstration of essential Windows and Linux diagnostic commands used during network verification and troubleshooting. Commands are simulated locally for learning only."
      className="bg-[#080808]"
    >
      <Terminal />
    </SectionTransition>
  );
};
