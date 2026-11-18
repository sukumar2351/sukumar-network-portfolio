/**
 * SUKUMAR KARNAM — SINGLE SOURCE OF TRUTH PROFILE CONFIGURATION
 * ---------------------------------------------------------------------------
 * Update your personal details, links, certificate image/verification URL,
 * skills, and contact details directly in this file.
 * Leave contact URLs or certificate fields empty ("") until ready;
 * the UI renders clean editable placeholders instead of fake details.
 */

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  period?: string;
}

export interface CertificationEntry {
  provider: string;
  title: string;
  description: string;
  certificateImageUrl: string;
  verificationUrl: string;
  credentialNote: string;
}

export interface ContactLinks {
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  resumeUrl: string;
  location: string;
}

export interface ProfileConfig {
  firstName: string;
  lastName: string;
  name: string;
  brandLogo: string;
  smallLabel: string;
  title: string;
  subtitle: string;
  heroIntro: string;
  about: string;
  aboutCards: Array<{ title: string; subtitle: string }>;
  contactIntro: string;
  footerTagline: string;
  portraitCutoutUrl: string;
  portraitFallbackUrl: string;
  education: EducationEntry;
  certification: CertificationEntry;
  skills: SkillGroup[];
  projectsOverview: Array<{ id: string; title: string; summary: string }>;
  contact: ContactLinks;
}

export const profile: ProfileConfig = {
  firstName: 'SUKUMAR',
  lastName: 'KARNAM',
  name: 'SUKUMAR KARNAM',
  brandLogo: 'SK. PORTFOLIO',
  smallLabel: 'NETWORK ENGINEER PORTFOLIO',
  title: 'NETWORK ENGINEER',
  subtitle:
    'Building reliable networks through routing, switching, monitoring and troubleshooting.',
  heroIntro:
    'I am a BCA graduate passionate about computer networking and IT infrastructure, continuously developing my skills through practical networking labs.',
  about:
    'I am a BCA graduate passionate about computer networking and IT infrastructure. I am continuously developing my technical skills through networking fundamentals, routing, switching, monitoring and troubleshooting.',
  aboutCards: [
    {
      title: 'BCA Graduate',
      subtitle: 'Academic foundation in computer applications and systems from Krishna University.',
    },
    {
      title: 'Networking Enthusiast',
      subtitle: 'Strong interest in enterprise routing, switching, and reliable network architecture.',
    },
    {
      title: 'Hands-on Lab Practice',
      subtitle: 'Building practical configuration and diagnostic skills across 12 core networking labs.',
    },
    {
      title: 'Continuous Learner',
      subtitle: 'Dedicated to structured troubleshooting, protocol mastery, and IT operations growth.',
    },
  ],
  contactIntro:
    "Interested in networking opportunities, technical discussions and new challenges? Let's connect.",
  footerTagline: 'Designed with curiosity. Built for connectivity.',

  portraitCutoutUrl: '/images/profile-cutout.png',
  portraitFallbackUrl: '/images/profile.png',

  education: {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Krishna University',
    location: 'Machilipatnam, Andhra Pradesh',
  },

  certification: {
    provider: 'Blue Teamers',
    title: 'Networking Certification',
    description:
      'Completed foundational networking certification covering network architecture, packet flow, protocols, and structured troubleshooting fundamentals.',
    certificateImageUrl: '', // Add e.g. '/certificates/blue-teamers-networking.png'
    verificationUrl: '', // Add official verification URL when available
    credentialNote: 'Add your certificate image or verification URL in src/data/profile.ts',
  },

  skills: [
    {
      category: 'Networking Fundamentals',
      items: [
        'OSI Model',
        'TCP/IP',
        'IPv4 Addressing',
        'Subnetting',
        'MAC and IP Addressing',
      ],
    },
    {
      category: 'Switching',
      items: ['VLAN', 'VLAN Trunking', 'Inter-VLAN Routing'],
    },
    {
      category: 'Routing',
      items: ['Static Routing', 'Dynamic Routing', 'Routing Tables', 'Default Gateway'],
    },
    {
      category: 'Network Services',
      items: ['DHCP', 'DNS', 'ARP', 'NAT'],
    },
    {
      category: 'Security and Troubleshooting',
      items: ['Standard ACL', 'Extended ACL', 'Network Troubleshooting'],
    },
  ],

  projectsOverview: [
    {
      id: 'monitoring',
      title: 'ISP Network Monitoring Demo',
      summary: 'Interactive path visibility, fault simulation, and simulated traffic/latency telemetry.',
    },
    {
      id: 'enterprise',
      title: 'Enterprise Multi-Site Architecture',
      summary: 'HQ-to-Branch interactive schematic demonstrating VLANs, 802.1Q trunking, and WAN routing.',
    },
    {
      id: 'labs',
      title: '12 Hands-on Networking Labs & CLI Center',
      summary: 'Structured lab modules and educational diagnostic command simulations.',
    },
  ],

  /**
   * CONTACT DETAILS — REPLACE EMPTY STRINGS WITH YOUR REAL INFORMATION
   */
  contact: {
    email: '', // e.g. 'sukumar.karnam@example.com'
    linkedinUrl: '', // e.g. 'https://www.linkedin.com/in/your-profile'
    githubUrl: '', // e.g. 'https://github.com/your-username'
    resumeUrl: '', // e.g. '/resume/Sukumar-Karnam-Resume.pdf'
    location: 'Andhra Pradesh, India',
  },
};
