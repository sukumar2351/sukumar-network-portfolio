export interface IspDeviceNode {
  id: string;
  name: string;
  shortLabel: string;
  role: string;
  osiLayer: string;
  interfaceUp: string;
  interfaceDown: string;
  simulatedIp: string;
  simulatedLatencyMs: number;
  description: string;
  responsibilities: string[];
  troubleshootingChecks: string[];
}

export interface EnterpriseNode {
  id: string;
  site: 'main' | 'wan' | 'branch';
  name: string;
  shortCode: string;
  deviceType: 'router' | 'dist-switch' | 'access-switch' | 'wan' | 'endpoint';
  ipSummary: string;
  vlans: string[];
  gateway: string;
  routingMode: string;
  roleSummary: string;
  technicalNotes: string[];
  x: number;
  y: number;
}

export interface EnterpriseLink {
  id: string;
  from: string;
  to: string;
  kind: 'wan' | 'trunk' | 'access';
}

export interface EnterpriseConcept {
  id: string;
  title: string;
  tag: string;
  summary: string;
  targetNodeId: string;
}

/**
 * Network Monitoring Illustrative Topology (Demo Data Only)
 */
export const ispTopologyDevices: IspDeviceNode[] = [
  {
    id: 'internet',
    name: 'Internet',
    shortLabel: 'ISP EDGE',
    role: 'External WAN Transit & Peering Edge',
    osiLayer: 'Layer 3 (IP Transit)',
    interfaceUp: 'Upstream Transit',
    interfaceDown: 'Fiber Hand-off -> Core Router',
    simulatedIp: '203.0.113.1/30 (RFC 5737 Demo)',
    simulatedLatencyMs: 14.2,
    description:
      'Represents external ISP transit connectivity where traffic leaves the local network toward public internet destinations.',
    responsibilities: [
      'Provides upstream reachability beyond the local routing domain',
      'Delivers WAN circuit hand-off into the Core Router edge interface',
      'Establishes external RTT baseline for isolating WAN vs. LAN faults',
    ],
    troubleshootingChecks: [
      'Verify external IP reachability using ping before testing hostnames',
      'Use tracert / traceroute to spot latency jumps past the edge router',
      'Verify DNS resolution separately using nslookup',
    ],
  },
  {
    id: 'core-router',
    name: 'Core Router',
    shortLabel: 'CORE-RTR-01',
    role: 'WAN Edge Routing, NAT & Gateway Boundary',
    osiLayer: 'Layer 3 (Network / Routing)',
    interfaceUp: 'Gig0/0/0 (WAN Edge)',
    interfaceDown: 'Gig0/0/1 (Core Downlink)',
    simulatedIp: '10.10.0.1/30 (Demo Internal)',
    simulatedLatencyMs: 2.1,
    description:
      'Primary Layer 3 routing boundary maintaining routing tables, NAT/PAT translation, perimeter ACLs, and inter-subnet forwarding.',
    responsibilities: [
      'Maintains static, dynamic, and default routes in the RIB',
      'Performs NAT/PAT translation between private LANs and WAN edge',
      'Routes packets between upstream WAN and internal distribution switches',
    ],
    troubleshootingChecks: [
      'Check interface up/up state with show ip interface brief',
      'Confirm default route 0.0.0.0/0 points to valid WAN next-hop',
      'Inspect NAT translations and ACL hit counters for unintended drops',
    ],
  },
  {
    id: 'dist-switch',
    name: 'Distribution Switch',
    shortLabel: 'DIST-SW-01',
    role: 'Aggregation, 802.1Q Trunking & VLAN Policy',
    osiLayer: 'Layer 2 / Layer 3 (Aggregation)',
    interfaceUp: 'TenGig1/0/1 (Uplink to Core)',
    interfaceDown: 'Gig1/0/24 (802.1Q Trunk)',
    simulatedIp: '10.10.1.2/24 (Management Demo)',
    simulatedLatencyMs: 1.4,
    description:
      'Aggregates access switches, transports tagged VLAN frames over 802.1Q trunks, and enforces campus segmentation.',
    responsibilities: [
      'Carries multiple VLANs across 802.1Q trunk uplinks',
      'Supports inter-VLAN routing boundaries and redundant paths',
      'Prevents switching loops through Spanning Tree awareness',
    ],
    troubleshootingChecks: [
      'Confirm allowed VLAN list and native VLAN match on both trunk ends',
      'Check interface CRC errors and duplex/speed mismatches',
      'Verify VLAN database consistency across connected switches',
    ],
  },
  {
    id: 'access-switch',
    name: 'Access Switch',
    shortLabel: 'ACC-SW-01',
    role: 'End-Device Attachment & VLAN Access Ports',
    osiLayer: 'Layer 2 (Data Link / Ethernet)',
    interfaceUp: 'Gig0/1 (Trunk to Distribution)',
    interfaceDown: 'Fa0/1–Fa0/24 (Access Ports)',
    simulatedIp: '10.10.1.11/24 (Management Demo)',
    simulatedLatencyMs: 0.9,
    description:
      'Connects workstations and end devices to the network, mapping each physical port to its assigned VLAN broadcast domain.',
    responsibilities: [
      'Learns endpoint MAC addresses dynamically into the MAC table',
      'Places untagged access ports into departmental VLANs',
      'Forwards intra-VLAN frames locally and off-subnet traffic up the trunk',
    ],
    troubleshootingChecks: [
      'Verify link state (connected / notconnect / err-disabled)',
      'Confirm port VLAN assignment with show vlan brief',
      'Check MAC address learning on the host port',
    ],
  },
  {
    id: 'end-devices',
    name: 'End Devices',
    shortLabel: 'ENDPOINTS',
    role: 'Workstations, Servers & Client Hosts',
    osiLayer: 'Layers 1–7 (Host Network Stack)',
    interfaceUp: 'NIC Eth0 (Access Port Link)',
    interfaceDown: 'User Applications & Services',
    simulatedIp: '192.168.10.25/24 (DHCP Demo)',
    simulatedLatencyMs: 0.6,
    description:
      'Traffic source and destination hosts relying on DHCP, ARP, DNS, and a valid default gateway to reach local and remote networks.',
    responsibilities: [
      'Obtains IPv4, subnet mask, gateway, and DNS via DHCP DORA',
      'Resolves local gateway MAC address via ARP before off-subnet forwarding',
      'Provides first-line diagnostic visibility during user fault reports',
    ],
    troubleshootingChecks: [
      'Verify IPv4, subnet mask, and gateway using ipconfig or ip addr',
      'Test loopback (127.0.0.1), default gateway, and remote target in order',
      'Inspect ARP table and DNS resolution with arp -a and nslookup',
    ],
  },
];

/**
 * Enterprise Network Infrastructure Reference Topology
 */
export const enterpriseNodes: EnterpriseNode[] = [
  {
    id: 'hq-core',
    site: 'main',
    name: 'HQ Core Router',
    shortCode: 'HQ-CORE-R1',
    deviceType: 'router',
    ipSummary: '10.20.0.1/30 (WAN) · 192.168.10/20/30.1 (Gateways)',
    vlans: ['VLAN 10 (Users)', 'VLAN 20 (Ops)', 'VLAN 30 (Mgmt)'],
    gateway: 'Next-Hop -> Branch WAN 10.20.0.2',
    routingMode: 'Inter-VLAN Routing + Static / Dynamic Routing',
    roleSummary:
      'Central Layer 3 router for the Main Office, executing inter-VLAN routing and maintaining routes to the Branch Office across the WAN.',
    technicalNotes: [
      'Acts as default gateway for HQ departmental VLAN subnets',
      'Evaluates routing table prefixes via Longest Prefix Match',
      'Connects Main Office campus to Branch Office over a /30 WAN link',
    ],
    x: 245,
    y: 92,
  },
  {
    id: 'hq-dist-a',
    site: 'main',
    name: 'HQ Distribution SW-A',
    shortCode: 'HQ-DIST-A',
    deviceType: 'dist-switch',
    ipSummary: '192.168.30.11/24 (Mgmt SVI)',
    vlans: ['VLAN 10', 'VLAN 20', 'VLAN 30'],
    gateway: '192.168.30.1',
    routingMode: '802.1Q Trunk Aggregation',
    roleSummary:
      'Aggregates Main Office access switches and carries 802.1Q tagged VLAN traffic cleanly toward HQ Core Router.',
    technicalNotes: [
      'Maintains 802.1Q trunk links with consistent native VLAN settings',
      'Provides redundant distribution peering with HQ-DIST-B',
    ],
    x: 150,
    y: 205,
  },
  {
    id: 'hq-dist-b',
    site: 'main',
    name: 'HQ Distribution SW-B',
    shortCode: 'HQ-DIST-B',
    deviceType: 'dist-switch',
    ipSummary: '192.168.30.12/24 (Mgmt SVI)',
    vlans: ['VLAN 10', 'VLAN 20', 'VLAN 30'],
    gateway: '192.168.30.1',
    routingMode: 'Redundant 802.1Q Trunking',
    roleSummary:
      'Redundant distribution switch serving Operations and Management access switches inside the Main Office.',
    technicalNotes: [
      'Separates campus broadcast traffic cleanly across VLANs',
      'Transports tagged frames to the Core Router for inter-VLAN forwarding',
    ],
    x: 340,
    y: 205,
  },
  {
    id: 'hq-acc-1',
    site: 'main',
    name: 'HQ Access SW-01',
    shortCode: 'HQ-ACC-01',
    deviceType: 'access-switch',
    ipSummary: '192.168.30.21/24 (Mgmt)',
    vlans: ['VLAN 10 (192.168.10.0/24)'],
    gateway: '192.168.10.1 (Client GW)',
    routingMode: 'L2 Access Switching',
    roleSummary:
      'Connects Main Office user workstations in VLAN 10 with untagged access ports and a tagged trunk uplink.',
    technicalNotes: [
      'Isolates VLAN 10 broadcast domain at Layer 2',
      'Off-subnet frames traverse trunk uplink to HQ-CORE-R1',
    ],
    x: 115,
    y: 320,
  },
  {
    id: 'hq-acc-2',
    site: 'main',
    name: 'HQ Access SW-02',
    shortCode: 'HQ-ACC-02',
    deviceType: 'access-switch',
    ipSummary: '192.168.30.22/24 (Mgmt)',
    vlans: ['VLAN 20 (192.168.20.0/24)'],
    gateway: '192.168.20.1 (Client GW)',
    routingMode: 'L2 Access Switching',
    roleSummary:
      'Connects Operations hosts in VLAN 20, separated at Layer 2 from VLAN 10 workstations.',
    technicalNotes: [
      'Requires Inter-VLAN routing to communicate with VLAN 10 or Branch subnets',
      'Enables clean departmental ACL enforcement at the router boundary',
    ],
    x: 270,
    y: 320,
  },
  {
    id: 'hq-acc-3',
    site: 'main',
    name: 'HQ Management Switch',
    shortCode: 'HQ-ACC-03',
    deviceType: 'access-switch',
    ipSummary: '192.168.30.23/24 (Mgmt)',
    vlans: ['VLAN 30 (192.168.30.0/24)'],
    gateway: '192.168.30.1',
    routingMode: 'Dedicated Management VLAN',
    roleSummary:
      'Dedicated infrastructure management segment isolating administrative device access from user traffic.',
    technicalNotes: [
      'Follows enterprise segmentation practice for SSH/SNMP management plane',
      'Supports strict Extended ACL restrictions',
    ],
    x: 415,
    y: 320,
  },
  {
    id: 'wan-link',
    site: 'wan',
    name: 'WAN Connectivity',
    shortCode: 'WAN-P2P',
    deviceType: 'wan',
    ipSummary: '10.20.0.0/30 Point-to-Point',
    vlans: ['Layer 3 Routed Transit'],
    gateway: 'Next-Hop Peering',
    routingMode: 'Static Route / OSPF Transit',
    roleSummary:
      'Site-to-site Layer 3 WAN transit connecting Main Office and Branch Office networks.',
    technicalNotes: [
      'Uses efficient /30 point-to-point subnetting (2 usable router IPs)',
      'Requires symmetric forward and return routing tables at both sites',
    ],
    x: 560,
    y: 92,
  },
  {
    id: 'br-router',
    site: 'branch',
    name: 'Branch Router',
    shortCode: 'BR-RTR-01',
    deviceType: 'router',
    ipSummary: '10.20.0.2/30 (WAN) · 192.168.40.1/24 (LAN)',
    vlans: ['VLAN 40 (Branch LAN)'],
    gateway: 'Default Route -> HQ Core 10.20.0.1',
    routingMode: 'Static Default + OSPF Branch',
    roleSummary:
      'Terminates the Branch WAN link and provides default gateway 192.168.40.1 for local branch endpoints.',
    technicalNotes: [
      'Forwards remote HQ destinations over WAN link toward 10.20.0.1',
      'Advertises 192.168.40.0/24 prefix back to Main Office',
    ],
    x: 785,
    y: 92,
  },
  {
    id: 'br-switch',
    site: 'branch',
    name: 'Branch Access Switch',
    shortCode: 'BR-ACC-01',
    deviceType: 'access-switch',
    ipSummary: '192.168.40.2/24 (Mgmt)',
    vlans: ['VLAN 40 (Branch Users)'],
    gateway: '192.168.40.1',
    routingMode: 'L2 Access + Trunk Uplink',
    roleSummary:
      'Provides Ethernet port connectivity for branch staff endpoints and uplinks to Branch Router.',
    technicalNotes: [
      'Switches intra-branch traffic locally at Layer 2',
      'Sends inter-site frames to BR-RTR-01 default gateway',
    ],
    x: 785,
    y: 225,
  },
  {
    id: 'br-hosts',
    site: 'branch',
    name: 'Branch End Devices',
    shortCode: 'BR-HOSTS',
    deviceType: 'endpoint',
    ipSummary: '192.168.40.10–192.168.40.50/24',
    vlans: ['VLAN 40 (Branch Users)'],
    gateway: '192.168.40.1',
    routingMode: 'Host IPv4 Stack',
    roleSummary:
      'Branch office workstations accessing Main Office subnets across the WAN routed infrastructure.',
    technicalNotes: [
      'Uses 192.168.40.1 as default gateway for all off-subnet traffic',
      'Relies on ARP locally and IP routing end-to-end',
    ],
    x: 785,
    y: 342,
  },
];

export const enterpriseLinks: EnterpriseLink[] = [
  { id: 'l1', from: 'hq-core', to: 'hq-dist-a', kind: 'trunk' },
  { id: 'l2', from: 'hq-core', to: 'hq-dist-b', kind: 'trunk' },
  { id: 'l3', from: 'hq-dist-a', to: 'hq-dist-b', kind: 'trunk' },
  { id: 'l4', from: 'hq-dist-a', to: 'hq-acc-1', kind: 'access' },
  { id: 'l5', from: 'hq-dist-b', to: 'hq-acc-2', kind: 'access' },
  { id: 'l6', from: 'hq-dist-b', to: 'hq-acc-3', kind: 'access' },
  { id: 'l7', from: 'hq-core', to: 'wan-link', kind: 'wan' },
  { id: 'l8', from: 'wan-link', to: 'br-router', kind: 'wan' },
  { id: 'l9', from: 'br-router', to: 'br-switch', kind: 'trunk' },
  { id: 'l10', from: 'br-switch', to: 'br-hosts', kind: 'access' },
];

export const enterpriseConcepts: EnterpriseConcept[] = [
  {
    id: 'vlan',
    title: 'VLAN',
    tag: 'Layer 2 Segmentation',
    summary: 'Separates physical switch ports into isolated broadcast domains by department or function.',
    targetNodeId: 'hq-acc-1',
  },
  {
    id: 'trunking',
    title: 'Trunking',
    tag: 'IEEE 802.1Q Tagging',
    summary: 'Carries multiple tagged VLANs across a single switch-to-switch or router uplink.',
    targetNodeId: 'hq-dist-a',
  },
  {
    id: 'inter-vlan',
    title: 'Inter-VLAN Routing',
    tag: 'Layer 3 Forwarding',
    summary: 'Routes traffic cleanly between isolated VLAN subnets via subinterfaces or Layer 3 SVIs.',
    targetNodeId: 'hq-core',
  },
  {
    id: 'static-routing',
    title: 'Static Routing',
    tag: 'Explicit Next-Hop',
    summary: 'Manually defined routes providing deterministic forwarding for stub and branch links.',
    targetNodeId: 'br-router',
  },
  {
    id: 'dynamic-routing',
    title: 'Dynamic Routing',
    tag: 'Adaptive Protocols',
    summary: 'Routers automatically exchange reachability updates (e.g., OSPF) and reconverge on faults.',
    targetNodeId: 'wan-link',
  },
  {
    id: 'routing-tables',
    title: 'Routing Tables',
    tag: 'Longest Prefix Match',
    summary: 'Maps connected, static, and dynamic prefixes to select the most specific egress path.',
    targetNodeId: 'hq-core',
  },
  {
    id: 'default-gateway',
    title: 'Default Gateway',
    tag: 'Off-Subnet Exit',
    summary: 'Local Layer 3 router interface that receives host packets destined for remote networks.',
    targetNodeId: 'br-hosts',
  },
];
