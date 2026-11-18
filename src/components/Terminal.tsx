import React, { useRef, useState } from 'react';
import { Play, RotateCcw, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalEntry {
  id: number;
  command: string;
  output: string;
  explanation: string;
}

const COMMAND_PRESETS: Array<{
  cmd: string;
  label: string;
  explanation: string;
  output: string;
}> = [
  {
    cmd: 'ping 192.168.10.1',
    label: 'ping',
    explanation: 'Sends ICMP Echo requests to verify Layer 3 reachability and round-trip latency.',
    output: `Pinging 192.168.10.1 with 32 bytes of data:
Reply from 192.168.10.1: bytes=32 time=1ms TTL=255
Reply from 192.168.10.1: bytes=32 time=1ms TTL=255
Reply from 192.168.10.1: bytes=32 time=2ms TTL=255
Reply from 192.168.10.1: bytes=32 time=1ms TTL=255

Ping statistics for 192.168.10.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
  },
  {
    cmd: 'tracert 192.168.40.10',
    label: 'tracert',
    explanation: 'Windows command tracing each Layer 3 router hop along the path to a remote host.',
    output: `Tracing route to 192.168.40.10 over a maximum of 30 hops:

  1    1 ms    1 ms    1 ms  192.168.10.1    [HQ-CORE-R1]
  2    4 ms    3 ms    4 ms  10.20.0.2       [BR-RTR-01]
  3    5 ms    5 ms    4 ms  192.168.40.10   [BR-HOST-01]

Trace complete.`,
  },
  {
    cmd: 'ipconfig',
    label: 'ipconfig',
    explanation: 'Displays Windows network adapter IPv4 address, subnet mask, and default gateway.',
    output: `Windows IP Configuration (Educational Demo Host)

Ethernet adapter Ethernet0:
   Connection-specific DNS Suffix  . : corp.lab.local
   IPv4 Address. . . . . . . . . . . : 192.168.10.25
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.10.1`,
  },
  {
    cmd: 'ip addr',
    label: 'ip addr',
    explanation: 'Linux command inspecting interface link state, MAC address, and IPv4 CIDR prefix.',
    output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP
    link/ether 00:50:56:9a:14:2b brd ff:ff:ff:ff:ff:ff
    inet 192.168.10.25/24 brd 192.168.10.255 scope global dynamic eth0`,
  },
  {
    cmd: 'traceroute 203.0.113.1',
    label: 'traceroute',
    explanation: 'Linux/Unix path-tracing utility revealing intermediate routers and per-hop RTT.',
    output: `traceroute to 203.0.113.1 (203.0.113.1), 30 hops max, 60 byte packets
 1  192.168.10.1 (192.168.10.1)  0.94 ms  0.88 ms  0.86 ms
 2  10.10.0.1 (10.10.0.1)        2.11 ms  2.09 ms  2.07 ms
 3  203.0.113.1 (203.0.113.1)   14.21 ms 14.18 ms 14.20 ms`,
  },
  {
    cmd: 'nslookup portal.lab.local',
    label: 'nslookup',
    explanation: 'Queries the configured DNS server to verify hostname-to-IP resolution.',
    output: `Server:  dns01.lab.local
Address: 192.168.30.10

Name:    portal.lab.local
Address: 192.168.20.50`,
  },
  {
    cmd: 'arp -a',
    label: 'arp',
    explanation: 'Displays the local Layer 2 ARP table mapping IPv4 addresses to Ethernet MACs.',
    output: `Interface: 192.168.10.25 --- 0x6
  Internet Address      Physical Address      Type
  192.168.10.1          00-1b-2a-4c-88-01     dynamic   (Default Gateway)
  192.168.10.12         00-50-56-8b-31-9e     dynamic
  192.168.10.255        ff-ff-ff-ff-ff-ff     static    (Broadcast)`,
  },
  {
    cmd: 'route print',
    label: 'route print',
    explanation: 'Shows the host IPv4 routing table including the default route 0.0.0.0/0.',
    output: `IPv4 Route Table (Educational Demo)
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0     192.168.10.1   192.168.10.25      25
        127.0.0.0        255.0.0.0         On-link        127.0.0.1     331
     192.168.10.0    255.255.255.0         On-link    192.168.10.25     281
    192.168.10.25  255.255.255.255         On-link    192.168.10.25     281
===========================================================================`,
  },
];

function evaluateCommand(rawInput: string): { output: string; explanation: string } {
  const normalized = rawInput.trim().toLowerCase();

  if (normalized === 'help' || normalized === '?') {
    return {
      explanation: 'Lists available educational networking diagnostic commands.',
      output: `Supported educational demo commands:
  ping | tracert | ipconfig | ip addr | traceroute | nslookup | arp | route print | clear`,
    };
  }

  const matched = COMMAND_PRESETS.find((preset) => {
    const base = preset.label.toLowerCase();
    return (
      normalized === base ||
      normalized === preset.cmd.toLowerCase() ||
      normalized.startsWith(`${base} `)
    );
  });

  if (matched) {
    return { output: matched.output, explanation: matched.explanation };
  }

  return {
    explanation: 'Unrecognized input in educational simulator.',
    output: `Command '${rawInput.trim()}' is not in this demonstration console. Select a button above or type 'help'.`,
  };
}

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: 1,
      command: COMMAND_PRESETS[0].cmd,
      output: COMMAND_PRESETS[0].output,
      explanation: COMMAND_PRESETS[0].explanation,
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const viewportRef = useRef<HTMLDivElement>(null);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    }

    const result = evaluateCommand(trimmed);
    setHistory((prev) => [
      ...prev.slice(-6),
      {
        id: Date.now() + Math.random(),
        command: trimmed,
        output: result.output,
        explanation: result.explanation,
      },
    ]);

    window.setTimeout(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    }, 30);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(inputValue);
    setInputValue('');
  };

  return (
    <div className="cr-panel overflow-hidden">
      {/* Terminal Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#351010] bg-[#120707] px-4 py-3">
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <TerminalIcon className="h-4 w-4 text-[#FF101A]" aria-hidden="true" />
          <span className="font-semibold text-white">NETWORK COMMAND CENTER</span>
          <span className="hidden text-[#B8B8B8] sm:inline">// sukumar@net-lab:~</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="border border-[#FF101A]/55 bg-[#650000]/35 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-white uppercase">
            Educational Demo Only
          </span>
          <button
            type="button"
            onClick={() => setHistory([])}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-[#B8B8B8] transition-colors hover:text-[#FF101A]"
            aria-label="Clear terminal output"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>CLEAR</span>
          </button>
        </div>
      </div>

      {/* Command Selector Buttons */}
      <div className="border-b border-[#351010] bg-[#0B0505] px-4 py-3">
        <div className="mb-2 font-mono text-[10px] tracking-[0.14em] text-[#B8B8B8] uppercase">
          Select a diagnostic command to preview its explanation and illustrative output:
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMAND_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => runCommand(preset.cmd)}
              className="inline-flex items-center gap-1.5 border border-[#351010] bg-[#080808] px-3 py-1.5 font-mono text-xs text-white transition-colors hover:border-[#FF101A] hover:bg-[#120707] hover:text-[#FF101A]"
            >
              <Play className="h-2.5 w-2.5 text-[#FF101A]" aria-hidden="true" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Output Console */}
      <div
        ref={viewportRef}
        className="h-72 overflow-y-auto bg-[#060606] p-4 font-mono text-xs leading-relaxed sm:h-80 sm:p-5"
        aria-live="polite"
      >
        {history.length === 0 ? (
          <div className="text-[#B8B8B8]">
            Console cleared. Select a command above or type{' '}
            <span className="text-[#FF101A]">help</span>.
          </div>
        ) : (
          <div className="space-y-5">
            {history.map((entry) => (
              <div key={entry.id} className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[#FF101A]">sukumar@net-lab:~$</span>
                  <span className="font-semibold text-white">{entry.command}</span>
                </div>
                <div className="border-l-2 border-[#FF101A] pl-3 text-[11px] text-[#B8B8B8]">
                  {entry.explanation}
                </div>
                <pre className="overflow-x-auto whitespace-pre text-white/90">
                  {entry.output}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Line */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-[#351010] bg-[#120707] px-4 py-3 font-mono text-xs"
      >
        <label htmlFor="net-cli-input" className="shrink-0 text-[#FF101A]">
          $
        </label>
        <input
          id="net-cli-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type ping, tracert, ipconfig, ip addr, traceroute, nslookup, arp, route print..."
          className="w-full bg-transparent text-white placeholder:text-[#B8B8B8]/60 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="shrink-0 border border-[#FF101A] bg-[#FF101A] px-3.5 py-1 text-[11px] font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#E60012]"
        >
          RUN
        </button>
      </form>
    </div>
  );
};
