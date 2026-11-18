/**
 * HANDS-ON ENGINEERING LABS — LEARNING AREAS & PRACTICE TRACKER
 * ---------------------------------------------------------------------------
 * Update the `progress` field on any lab entry as you complete or revisit
 * lab topologies in Cisco Packet Tracer, GNS3, EVE-NG, or home labs.
 */

export type LabProgress = 'Hands-on Practice' | 'Active Study' | 'Core Topic' | 'Reviewed';

export interface EngineeringLab {
  id: string;
  code: string;
  title: string;
  domain: 'Fundamentals' | 'Switching' | 'Routing' | 'Services & Security' | 'Diagnostics';
  progress: LabProgress;
  shortDescription: string;
  concepts: string[];
  learningOutcome: string;
  objective: string;
  topologyDiagram: string;
  configTitle: string;
  configExample: string;
  troubleshootingNotes: string[];
}

export const engineeringLabs: EngineeringLab[] = [
  {
    id: 'network-fundamentals',
    code: 'LAB-01',
    title: 'Network Fundamentals',
    domain: 'Fundamentals',
    progress: 'Hands-on Practice',
    shortDescription:
      'Mapping end-to-end packet encapsulation across OSI and TCP/IP layers using switch and host packet walkthroughs.',
    concepts: ['OSI Model', 'TCP/IP Suite', 'Encapsulation', 'Ethernet Frames', 'Collision vs Broadcast Domains'],
    learningOutcome:
      'Trace how application data is encapsulated into segments, IP packets, and Ethernet frames across local and routed hops.',
    objective:
      'Build a foundational understanding of Layer 1–Layer 4 boundaries by observing how Layer 2 MAC headers change hop-by-hop while Layer 3 source and destination IP addresses remain intact end to end.',
    topologyDiagram: `[Host A: 192.168.1.10] ──(Eth)──> [L2 Switch] ──(Eth)──> [Router R1] ──> [Host B: 192.168.2.10]
   L4: TCP Segment (Src:49210 Dst:443)
   L3: IPv4 Packet (192.168.1.10 -> 192.168.2.10)  [Persists end-to-end]
   L2: Frame Header (Src MAC -> R1 MAC)            [Rewritten at each L3 hop]`,
    configTitle: 'Reference Verification Commands',
    configExample: `! Inspect Layer 1 / Layer 2 interface status on switch
Switch# show interfaces status
Switch# show mac address-table dynamic

! Verify Layer 3 reachability & ARP neighbor resolution
HostA> arp -a
HostA> ping 192.168.1.1`,
    troubleshootingNotes: [
      'Start from Layer 1 (physical link/cable/duplex) before assuming Layer 3 routing faults.',
      'A switch splits collision domains per port but forwards broadcasts across the entire VLAN.',
      'A router terminates Layer 2 broadcast domains and re-encapsulates frames for the egress media.',
    ],
  },
  {
    id: 'ipv4-subnetting',
    code: 'LAB-02',
    title: 'IPv4 Addressing and Subnetting',
    domain: 'Fundamentals',
    progress: 'Hands-on Practice',
    shortDescription:
      'Designing structured CIDR and VLSM address plans to eliminate IP waste and enforce clean summarization boundaries.',
    concepts: ['IPv4', 'CIDR', 'VLSM', 'Network & Broadcast ID', 'RFC 1918 Private Ranges'],
    learningOutcome:
      'Calculate network IDs, usable host ranges, broadcast addresses, and subnet masks rapidly without overlap.',
    objective:
      'Partition a 192.168.100.0/24 block using Variable Length Subnet Masking (VLSM) to accommodate multiple departments and /30 point-to-point router links.',
    topologyDiagram: `Parent Block: 192.168.100.0/24 (256 Addresses)
 ├── Operations LAN : 192.168.100.0/26   (.1 – .62 usable | Broadcast .63)
 ├── Engineering LAN: 192.168.100.64/26  (.65 – .126 usable | Broadcast .127)
 ├── Mgmt / NOC LAN : 192.168.100.128/28 (.129 – .142 usable | Broadcast .143)
 └── WAN P2P Link   : 192.168.100.144/30 (.145 & .146 usable | Broadcast .147)`,
    configTitle: 'Subnet Mask & Prefix Reference',
    configExample: `! Common subnetting boundaries practiced in lab topologies
/24 = 255.255.255.0   -> 254 usable hosts (LAN standard)
/25 = 255.255.255.128 -> 126 usable hosts
/26 = 255.255.255.192 ->  62 usable hosts
/27 = 255.255.255.224 ->  30 usable hosts
/28 = 255.255.255.240 ->  14 usable hosts
/30 = 255.255.255.252 ->   2 usable hosts (Router P2P WAN)`,
    troubleshootingNotes: [
      'Always allocate the largest host requirement first when applying VLSM to avoid overlapping ranges.',
      'Mismatched subnet masks between host and default gateway cause asymmetric or failed ARP lookups.',
      'Never assign the network ID or broadcast address to a host or router interface.',
    ],
  },
  {
    id: 'vlan-configuration',
    code: 'LAB-03',
    title: 'VLAN Configuration',
    domain: 'Switching',
    progress: 'Hands-on Practice',
    shortDescription:
      'Segmenting access switch ports into isolated departmental VLANs to contain broadcast traffic and enforce policy.',
    concepts: ['VLAN IDs', 'Access Ports', 'Broadcast Containment', 'VLAN Database', 'Management VLAN'],
    learningOutcome:
      'Create named VLANs, assign access ports cleanly, and verify Layer 2 isolation between distinct broadcast domains.',
    objective:
      'Configure VLAN 10 (Engineering), VLAN 20 (Operations), and VLAN 30 (Management) on an access switch and confirm hosts in different VLANs cannot communicate directly at Layer 2.',
    topologyDiagram: `                 [ACC-SW-01]
        ┌─────────────┼─────────────┐
     Fa0/1–8       Fa0/9–16      Fa0/17–20
    (VLAN 10)     (VLAN 20)     (VLAN 30)
   Engineering    Operations    Management
  192.168.10.x   192.168.20.x  192.168.30.x`,
    configTitle: 'Switch VLAN & Access Port CLI Example',
    configExample: `ACC-SW-01(config)# vlan 10
ACC-SW-01(config-vlan)# name ENGINEERING
ACC-SW-01(config-vlan)# vlan 20
ACC-SW-01(config-vlan)# name OPERATIONS

ACC-SW-01(config)# interface range fa0/1 - 8
ACC-SW-01(config-if-range)# switchport mode access
ACC-SW-01(config-if-range)# switchport access vlan 10
ACC-SW-01(config-if-range)# no shutdown`,
    troubleshootingNotes: [
      'Verify VLAN existence and active port mapping with `show vlan brief`.',
      'Deleting a VLAN while access ports remain assigned to it leaves those ports inactive until reassigned.',
      'Explicitly set `switchport mode access` to disable Dynamic Trunking Protocol (DTP) negotiation on user ports.',
    ],
  },
  {
    id: 'vlan-trunking',
    code: 'LAB-04',
    title: 'VLAN Trunking',
    domain: 'Switching',
    progress: 'Hands-on Practice',
    shortDescription:
      'Configuring IEEE 802.1Q trunk links between switches to transport multiple tagged VLANs across a single uplink.',
    concepts: ['IEEE 802.1Q', 'VLAN Tagging', 'Native VLAN', 'Allowed VLAN Pruning', 'DTP'],
    learningOutcome:
      'Establish deterministic 802.1Q trunks between distribution and access switches with matching native VLANs.',
    objective:
      'Configure an inter-switch uplink carrying VLANs 10, 20, and 30 using 802.1Q encapsulation, a dedicated native VLAN, and explicit allowed-VLAN filtering.',
    topologyDiagram: `[ACC-SW-01] ═════(Gig0/1 ── 802.1Q Trunk ── Gig1/0/24)═════ [DIST-SW-01]
                 Tagged Frames: VLAN 10, 20, 30
                 Native VLAN  : VLAN 99 (Untagged, Matched Both Ends)`,
    configTitle: '802.1Q Trunk Configuration Example',
    configExample: `ACC-SW-01(config)# interface gigabitEthernet 0/1
ACC-SW-01(config-if)# description TRUNK_TO_DIST-SW-01
ACC-SW-01(config-if)# switchport trunk encapsulation dot1q
ACC-SW-01(config-if)# switchport mode trunk
ACC-SW-01(config-if)# switchport trunk native vlan 99
ACC-SW-01(config-if)# switchport trunk allowed vlan 10,20,30,99
ACC-SW-01(config-if)# switchport nonegotiate`,
    troubleshootingNotes: [
      'Use `show interfaces trunk` to confirm operational mode, encapsulation, native VLAN, and forwarding VLAN list.',
      'A native VLAN mismatch between neighboring switches triggers CDP/STP warnings and can leak traffic across VLANs.',
      'Ensure every VLAN allowed on the trunk actually exists in the local switch VLAN database.',
    ],
  },
  {
    id: 'inter-vlan-routing',
    code: 'LAB-05',
    title: 'Inter-VLAN Routing',
    domain: 'Routing',
    progress: 'Hands-on Practice',
    shortDescription:
      'Enabling routed communication across segmented VLANs using Router-on-a-Stick subinterfaces and Layer 3 SVIs.',
    concepts: ['Router-on-a-Stick', '802.1Q Subinterfaces', 'Layer 3 SVI', 'Default Gateway', 'IP Routing'],
    learningOutcome:
      'Route traffic cleanly between isolated departmental VLANs while preserving Layer 2 segmentation.',
    objective:
      'Configure dot1Q subinterfaces on a router trunk link so hosts in VLAN 10 (192.168.10.0/24) can reach hosts in VLAN 20 (192.168.20.0/24) via their gateways.',
    topologyDiagram: `                   [CORE-RTR-01]
              Gig0/0.10 (.10.1) | Gig0/0.20 (.20.1)
                         │ (802.1Q Trunk)
                   [DIST-SW-01]
                 ┌───────┴───────┐
         VLAN 10 Hosts     VLAN 20 Hosts
       192.168.10.10/24   192.168.20.10/24`,
    configTitle: 'Router-on-a-Stick Subinterface Example',
    configExample: `CORE-RTR-01(config)# interface gigabitEthernet 0/0
CORE-RTR-01(config-if)# no shutdown

CORE-RTR-01(config)# interface gigabitEthernet 0/0.10
CORE-RTR-01(config-subif)# encapsulation dot1Q 10
CORE-RTR-01(config-subif)# ip address 192.168.10.1 255.255.255.0

CORE-RTR-01(config)# interface gigabitEthernet 0/0.20
CORE-RTR-01(config-subif)# encapsulation dot1Q 20
CORE-RTR-01(config-subif)# ip address 192.168.20.1 255.255.255.0`,
    troubleshootingNotes: [
      'Always issue `no shutdown` on the parent physical interface (e.g., Gig0/0) or all subinterfaces stay down.',
      'The `encapsulation dot1Q <id>` command must match the switch VLAN ID before assigning an IP address.',
      'On Layer 3 switches using SVIs, verify `ip routing` is enabled globally.',
    ],
  },
  {
    id: 'static-routing',
    code: 'LAB-06',
    title: 'Static Routing',
    domain: 'Routing',
    progress: 'Hands-on Practice',
    shortDescription:
      'Configuring deterministic static, default, and floating backup routes across multi-router enterprise WAN links.',
    concepts: ['Static Routes', 'Default Route (0.0.0.0/0)', 'Floating Static Route', 'Administrative Distance', 'Next-Hop Lookup'],
    learningOutcome:
      'Establish bidirectional reachability between HQ and Branch routers and verify exact RIB entries.',
    objective:
      'Configure static routes between Main Office and Branch Office routers across a /30 WAN link, plus a default route for external destinations.',
    topologyDiagram: `[HQ LAN: 192.168.10.0/24] ── [HQ-R1] ══10.20.0.0/30══ [BR-R1] ── [Branch LAN: 192.168.40.0/24]
                                .1                       .2`,
    configTitle: 'Static & Default Route CLI Example',
    configExample: `! On HQ-R1: static route toward Branch LAN
HQ-R1(config)# ip route 192.168.40.0 255.255.255.0 10.20.0.2

! On BR-R1: default route forwarding all non-local traffic to HQ-R1
BR-R1(config)# ip route 0.0.0.0 0.0.0.0 10.20.0.1

! Verify routing table entries
HQ-R1# show ip route static`,
    troubleshootingNotes: [
      'Check routing in BOTH directions — forward path success still fails ping if the return route is missing.',
      'Ensure the configured next-hop IP is directly reachable or resolvable via a connected interface.',
      'Remember static routes carry an Administrative Distance (AD) of 1 by default.',
    ],
  },
  {
    id: 'dynamic-routing',
    code: 'LAB-07',
    title: 'Dynamic Routing',
    domain: 'Routing',
    progress: 'Active Study',
    shortDescription:
      'Exploring OSPF neighbor adjacency, area design, cost metrics, and automatic convergence during link failover.',
    concepts: ['OSPF (Single Area)', 'Router ID', 'Hello/Dead Timers', 'LSDB & SPF', 'Route Convergence'],
    learningOutcome:
      'Configure OSPF Area 0 adjacencies, inspect neighbor states, and observe dynamic rerouting when a link drops.',
    objective:
      'Enable single-area OSPF across a three-router mesh topology so routers dynamically advertise connected prefixes and converge around simulated link outages.',
    topologyDiagram: `            [CORE-R1 (RID 1.1.1.1)]
               /               \\
      (10.0.12.0/30)       (10.0.13.0/30)
            /                     \\
   [R2 (RID 2.2.2.2)] ──10.0.23.0/30── [R3 (RID 3.3.3.3)]
         |                                   |
   192.168.20.0/24                     192.168.30.0/24`,
    configTitle: 'Single-Area OSPF Configuration Example',
    configExample: `CORE-R1(config)# router ospf 1
CORE-R1(config-router)# router-id 1.1.1.1
CORE-R1(config-router)# passive-interface gigabitEthernet 0/1
CORE-R1(config-router)# network 10.0.12.0 0.0.0.3 area 0
CORE-R1(config-router)# network 10.0.13.0 0.0.0.3 area 0

! Inspection commands
CORE-R1# show ip ospf neighbor
CORE-R1# show ip route ospf`,
    troubleshootingNotes: [
      'OSPF neighbors require matching Area ID, subnet mask, Hello/Dead timers, and authentication settings.',
      'Use `passive-interface` on LAN-facing ports to prevent unnecessary OSPF hellos toward end-user segments.',
      'Check wildcard mask inversion carefully (e.g., /30 uses 0.0.0.3, /24 uses 0.0.0.255).',
    ],
  },
  {
    id: 'access-control-lists',
    code: 'LAB-08',
    title: 'Access Control Lists',
    domain: 'Services & Security',
    progress: 'Active Study',
    shortDescription:
      'Filtering IPv4 traffic using Standard and Extended ACLs with precise directionality and implicit deny awareness.',
    concepts: ['Standard ACL', 'Extended ACL', 'Wildcard Masks', 'Inbound vs Outbound', 'Implicit Deny Any'],
    learningOutcome:
      'Author and place ACL rules accurately to permit legitimate services while blocking unauthorized subnet access.',
    objective:
      'Apply an Extended ACL permitting HTTP/HTTPS and DNS from Operations (VLAN 20) while restricting direct SSH access to Management (VLAN 30) only.',
    topologyDiagram: `[VLAN 20: Operations] ──> (Inbound ACL on Gig0/0.20) ──> [CORE-RTR-01] ──> [VLAN 30: Mgmt]
   Permit: TCP 80/443, UDP 53
   Deny  : TCP 22 to 192.168.30.0/24`,
    configTitle: 'Named Extended ACL CLI Example',
    configExample: `CORE-RTR-01(config)# ip access-list extended OPS_POLICY_IN
CORE-RTR-01(config-ext-nacl)# deny tcp 192.168.20.0 0.0.0.255 192.168.30.0 0.0.0.255 eq 22
CORE-RTR-01(config-ext-nacl)# permit ip 192.168.20.0 0.0.0.255 any

CORE-RTR-01(config)# interface gigabitEthernet 0/0.20
CORE-RTR-01(config-subif)# ip access-group OPS_POLICY_IN in`,
    troubleshootingNotes: [
      'Every ACL ends with an invisible `deny ip any any` — include an explicit permit statement where required.',
      'Place Extended ACLs closest to the traffic source; place Standard ACLs closest to the destination.',
      'Use `show access-lists` to verify rule evaluation order and packet match counters.',
    ],
  },
  {
    id: 'nat-configuration',
    code: 'LAB-09',
    title: 'NAT Configuration',
    domain: 'Services & Security',
    progress: 'Hands-on Practice',
    shortDescription:
      'Translating internal RFC 1918 private addresses to public edge IP space via Static NAT, Dynamic NAT, and PAT.',
    concepts: ['Static NAT', 'Dynamic NAT', 'PAT (NAT Overload)', 'Inside Local / Global', 'Outside Interface'],
    learningOutcome:
      'Configure Port Address Translation (PAT) on an edge router and inspect active translation table entries.',
    objective:
      'Configure NAT Overload (PAT) on the Core Router so multiple private LAN hosts share a single WAN egress IP address.',
    topologyDiagram: `[Private LAN: 192.168.10.0/24] ──(ip nat inside)──> [EDGE-R1] ──(ip nat outside)──> [ISP WAN]
   Inside Local : 192.168.10.25:51420
   Inside Global: 203.0.113.2:51420 (Translated via PAT)`,
    configTitle: 'PAT (NAT Overload) Configuration Example',
    configExample: `EDGE-R1(config)# access-list 10 permit 192.168.10.0 0.0.0.255
EDGE-R1(config)# ip nat inside source list 10 interface gigabitEthernet 0/0/0 overload

EDGE-R1(config)# interface gigabitEthernet 0/0/1
EDGE-R1(config-if)# ip nat inside
EDGE-R1(config)# interface gigabitEthernet 0/0/0
EDGE-R1(config-if)# ip nat outside

! Verify active NAT translations
EDGE-R1# show ip nat translations`,
    troubleshootingNotes: [
      'Confirm both `ip nat inside` and `ip nat outside` are applied on the correct interfaces.',
      'Ensure the ACL referenced by NAT matches the exact internal subnets intended for translation.',
      'Verify routing to the destination exists before blaming NAT — routing occurs in tandem with translation.',
    ],
  },
  {
    id: 'dhcp-and-dora',
    code: 'LAB-10',
    title: 'DHCP and DORA',
    domain: 'Services & Security',
    progress: 'Hands-on Practice',
    shortDescription:
      'Automating IPv4 host configuration via DHCP pools, excluded ranges, ip helper-address relays, and the DORA handshake.',
    concepts: ['Discover / Offer / Request / Ack', 'DHCP Pool', 'Excluded Addresses', 'DHCP Relay (ip helper-address)', 'Lease Timers'],
    learningOutcome:
      'Deploy router-based DHCP pools and trace all four DORA messages across both local and relayed subnets.',
    objective:
      'Configure an excluded static infrastructure range and a dynamic DHCP pool for VLAN 10, verifying DORA broadcast/unicast progression.',
    topologyDiagram: `Client (0.0.0.0) ──[1. DISCOVER (Broadcast UDP 67)]──> DHCP Server
Client           <──[2. OFFER (Proposed IP + Lease)]── DHCP Server
Client           ──[3. REQUEST (Accept Offered IP)]──> DHCP Server
Client           <──[4. ACK (Lease Confirmed)      ]── DHCP Server`,
    configTitle: 'Router DHCP Pool & Relay Example',
    configExample: `CORE-RTR-01(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.20
CORE-RTR-01(config)# ip dhcp pool VLAN10_ENG
CORE-RTR-01(dhcp-config)# network 192.168.10.0 255.255.255.0
CORE-RTR-01(dhcp-config)# default-router 192.168.10.1
CORE-RTR-01(dhcp-config)# dns-server 8.8.8.8

! If DHCP server resides in a remote subnet:
CORE-RTR-01(config-subif)# ip helper-address 192.168.30.10`,
    troubleshootingNotes: [
      'Hosts receiving an APIPA address (169.254.x.x) indicate the DHCP Discover never received an Offer.',
      'Routers do not forward Layer 2 broadcasts by default — use `ip helper-address` on the client gateway interface for centralized DHCP.',
      'Inspect active leases with `show ip dhcp binding` and check for pool exhaustion.',
    ],
  },
  {
    id: 'dns-and-arp',
    code: 'LAB-11',
    title: 'DNS and ARP',
    domain: 'Services & Security',
    progress: 'Hands-on Practice',
    shortDescription:
      'Understanding how domain names resolve to IPv4 addresses via DNS and how IPv4 addresses map to Layer 2 MACs via ARP.',
    concepts: ['DNS A / AAAA / CNAME / PTR', 'Recursive vs Iterative Lookup', 'ARP Request / Reply', 'ARP Cache', 'Default Gateway MAC'],
    learningOutcome:
      'Diagnose name-resolution failures separately from Layer 2/3 IP forwarding problems using nslookup and arp.',
    objective:
      'Trace the complete sequence when a workstation opens a hostname: DNS query to resolver -> local vs remote subnet check -> ARP resolution for target or default gateway.',
    topologyDiagram: `1. DNS Lookup : Host -> DNS Resolver ("app.corp.local" -> 192.168.20.50)
2. Subnet Test: 192.168.20.50 is off-subnet -> Send to Default Gateway 192.168.10.1
3. ARP Lookup : Broadcast "Who has 192.168.10.1?" -> Unicast Reply (Gateway MAC)
4. Frame Sent : Dst MAC = Gateway MAC | Dst IP = 192.168.20.50`,
    configTitle: 'DNS & ARP Diagnostic Reference',
    configExample: `! Query A-record and active DNS server
C:\\> nslookup intranet.lab.local

! View dynamic and static IP-to-MAC bindings
C:\\> arp -a

! Router-side ARP inspection
CORE-RTR-01# show ip arp`,
    troubleshootingNotes: [
      'If `ping 8.8.8.8` succeeds but `ping example.com` fails, IP routing works and the fault is DNS.',
      'ARP is strictly Layer 2 broadcast-scoped — it resolves local peers or the local gateway, never a remote subnet host MAC.',
      'Incomplete ARP entries often indicate a mismatched VLAN, down port, or host firewall/offline state.',
    ],
  },
  {
    id: 'network-troubleshooting',
    code: 'LAB-12',
    title: 'Network Troubleshooting',
    domain: 'Diagnostics',
    progress: 'Core Topic',
    shortDescription:
      'Applying structured OSI bottom-up and divide-and-conquer fault isolation methodologies to restore connectivity.',
    concepts: ['Bottom-Up Method', 'Divide & Conquer', 'ICMP Diagnostics', 'Path Isolation', 'Root Cause Analysis'],
    learningOutcome:
      'Isolate faults systematically across cabling, VLANs, IP addressing, gateways, routing tables, ACLs, and DNS.',
    objective:
      'Follow a repeatable NOC troubleshooting checklist to diagnose broken end-to-end connectivity without guesswork.',
    topologyDiagram: `Step 1 [L1/L2] : Link LEDs, interface status, VLAN & trunk alignment
Step 2 [Host ] : ipconfig / ip addr -> valid IP, mask, gateway, DNS?
Step 3 [Local] : ping 127.0.0.1 -> ping Default Gateway -> check arp -a
Step 4 [Path ] : tracert / traceroute -> locate exact hop where packets drop
Step 5 [L3/L7] : Verify routing tables, NAT, ACL counters, and nslookup`,
    configTitle: 'Structured CLI Triage Workflow',
    configExample: `! 1. Host check
ipconfig /all   (Windows)  |  ip addr & ip route (Linux)

! 2. Layered reachability test
ping 127.0.0.1             # Local TCP/IP stack
ping 192.168.10.1          # Default gateway (L2 + L3 local)
tracert 192.168.40.10      # Hop-by-hop routing path
nslookup portal.lab.local  # Name resolution check`,
    troubleshootingNotes: [
      'Change one variable at a time and re-test immediately so root cause remains clear.',
      'Document baseline working state (`show ip int brief`, `show ip route`, `show vlan brief`) before troubleshooting changes.',
      'Always differentiate between link-down, routing blackhole, ACL block, and DNS misconfiguration.',
    ],
  },
];
