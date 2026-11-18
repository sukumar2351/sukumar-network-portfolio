import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Radio,
  RotateCcw,
  ShieldAlert,
  Wifi,
} from 'lucide-react';
import { NetworkTopology } from './NetworkTopology';
import { useReducedMotion } from '../hooks/useReducedMotion';

const INITIAL_TRAFFIC = [42, 48, 45, 54, 60, 58, 65, 61, 67, 63, 70, 66, 72, 68, 64, 69];
const INITIAL_EGRESS = [26, 30, 29, 35, 39, 37, 43, 40, 44, 42, 46, 43, 48, 45, 41, 45];
const INITIAL_LATENCY = [14, 15, 14, 16, 15, 14, 15, 17, 15, 14, 15, 14, 16, 15, 14, 15];

function buildSvgPath(values: number[], width: number, height: number, maxVal: number): string {
  const stepX = width / (values.length - 1);
  return values
    .map((val, idx) => {
      const x = idx * stepX;
      const y = height - (Math.min(val, maxVal) / maxVal) * (height - 16) - 8;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export const MonitoringDashboard: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('core-router');
  const [faultSimulated, setFaultSimulated] = useState<boolean>(false);
  const [ingressSeries, setIngressSeries] = useState<number[]>(INITIAL_TRAFFIC);
  const [egressSeries, setEgressSeries] = useState<number[]>(INITIAL_EGRESS);
  const [latencySeries, setLatencySeries] = useState<number[]>(INITIAL_LATENCY);

  useEffect(() => {
    if (reducedMotion) return;
    let tick = 0;

    const timer = window.setInterval(() => {
      tick += 1;
      setIngressSeries((prev) => {
        const base = faultSimulated ? 22 : 63;
        const nextVal = Math.round(base + Math.sin(tick * 0.7) * 7 + Math.cos(tick * 0.35) * 4);
        return [...prev.slice(1), Math.max(8, nextVal)];
      });
      setEgressSeries((prev) => {
        const base = faultSimulated ? 14 : 43;
        const nextVal = Math.round(base + Math.cos(tick * 0.6) * 5 + Math.sin(tick * 0.25) * 3);
        return [...prev.slice(1), Math.max(5, nextVal)];
      });
      setLatencySeries((prev) => {
        const base = faultSimulated ? 66 : 15;
        const nextVal = Math.round(base + Math.sin(tick * 0.9) * (faultSimulated ? 12 : 2.2));
        return [...prev.slice(1), Math.max(10, nextVal)];
      });
    }, 2000);

    return () => window.clearInterval(timer);
  }, [faultSimulated, reducedMotion]);

  const toggleFault = () => {
    setFaultSimulated((prev) => {
      const next = !prev;
      if (next) setSelectedDeviceId('access-switch');
      return next;
    });
  };

  const currentIngress = ingressSeries[ingressSeries.length - 1];
  const currentEgress = egressSeries[egressSeries.length - 1];
  const currentLatency = latencySeries[latencySeries.length - 1];

  const statusCards = [
    {
      label: 'Router Status',
      device: 'CORE-RTR-01',
      status: 'OPERATIONAL',
      detail: 'Routing Table Active · NAT OK',
      healthy: true,
      icon: Cpu,
    },
    {
      label: 'Switch Status',
      device: 'DIST-SW-01 / ACC-SW-01',
      status: faultSimulated ? 'DOWNLINK FAULT' : 'OPERATIONAL',
      detail: faultSimulated
        ? 'Trunk Gig1/0/24 -> ACC-SW-01 Down'
        : '802.1Q Trunks Forwarding',
      healthy: !faultSimulated,
      icon: Activity,
    },
    {
      label: 'WAN Connectivity',
      device: 'ISP EDGE LINK',
      status: 'REACHABLE',
      detail: `Simulated RTT: ${faultSimulated ? '15 ms (Core)' : `${currentLatency} ms`}`,
      healthy: true,
      icon: Wifi,
    },
    {
      label: 'Device Connectivity',
      device: 'MONITORED HOPS',
      status: faultSimulated ? '3 / 5 REACHABLE' : '5 / 5 REACHABLE',
      detail: faultSimulated
        ? 'Access Segment Isolated (Demo)'
        : 'All Path Hops Responding',
      healthy: !faultSimulated,
      icon: Radio,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Clear Illustrative Demo Disclaimer + Fault Simulation Control */}
      <div className="cr-card flex flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="border border-[#FF101A] bg-[#650000]/45 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-white uppercase">
            Illustrative Demo Data
          </span>
          <p className="font-mono text-xs text-[#B8B8B8]">
            Simulated monitoring metrics for educational demonstration — not live production measurements.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleFault}
          className={`inline-flex items-center gap-2 border px-4 py-2 font-mono text-xs font-semibold tracking-wider uppercase transition-colors ${
            faultSimulated
              ? 'border-[#FF101A] bg-[#FF101A] text-white hover:bg-[#E60012]'
              : 'border-[#351010] bg-[#080808] text-white hover:border-[#FF101A] hover:text-[#FF101A]'
          }`}
        >
          {faultSimulated ? (
            <>
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Restore Simulated Link</span>
            </>
          ) : (
            <>
              <ShieldAlert className="h-3.5 w-3.5 text-[#FF101A]" aria-hidden="true" />
              <span>Simulate Access Fault</span>
            </>
          )}
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`border p-4 transition-colors ${
                card.healthy
                  ? 'border-[#351010] bg-[#120707]'
                  : 'border-[#FF101A] bg-[#210607]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-[#B8B8B8] uppercase">
                  {card.label}
                </span>
                <Icon className="h-4 w-4 text-[#FF101A]" aria-hidden="true" />
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                {card.healthy ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF101A]" aria-hidden="true" />
                )}
                <span
                  className={`font-display text-base font-bold ${
                    card.healthy ? 'text-white' : 'text-[#FF101A]'
                  }`}
                >
                  {card.status}
                </span>
              </div>

              <div className="mt-2 font-mono text-[11px] text-white/80">{card.device}</div>
              <div className="mt-0.5 font-mono text-[11px] text-[#B8B8B8]">{card.detail}</div>
            </div>
          );
        })}
      </div>

      {/* Interactive Network Topology + Device Inspector */}
      <NetworkTopology
        selectedDeviceId={selectedDeviceId}
        onSelectDevice={setSelectedDeviceId}
        faultSimulated={faultSimulated}
      />

      {/* Traffic & Latency Graphs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="cr-card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-mono text-[10px] tracking-[0.16em] text-[#B8B8B8] uppercase">
                SIMULATED TRAFFIC VISUALIZATION (DEMO)
              </div>
              <h3 className="font-display text-base font-bold text-white">
                WAN &amp; Core Interface Throughput
              </h3>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="text-[#FF101A]">IN: {currentIngress} Mbps</span>
              <span className="text-[#B8B8B8]">OUT: {currentEgress} Mbps</span>
            </div>
          </div>

          <div className="h-40 w-full border border-[#351010] bg-[#080808] p-2">
            <svg
              viewBox="0 0 420 140"
              className="h-full w-full"
              role="img"
              aria-label="Simulated ingress and egress network traffic visualization"
            >
              {[25, 55, 85, 115].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="420"
                  y2={y}
                  stroke="#FFFFFF"
                  strokeOpacity="0.07"
                  strokeDasharray="3 4"
                />
              ))}
              <path
                d={buildSvgPath(ingressSeries, 420, 140, 100)}
                fill="none"
                stroke="#FF101A"
                strokeWidth="2.2"
              />
              <path
                d={buildSvgPath(egressSeries, 420, 140, 100)}
                fill="none"
                stroke="#FFFFFF"
                strokeOpacity="0.55"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </svg>
          </div>
        </div>

        <div className="cr-card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-mono text-[10px] tracking-[0.16em] text-[#B8B8B8] uppercase">
                SIMULATED LATENCY GRAPH (DEMO)
              </div>
              <h3 className="font-display text-base font-bold text-white">
                ICMP Round-Trip Time (RTT)
              </h3>
            </div>
            <div className="font-mono text-xs">
              <span className={faultSimulated ? 'text-[#FF101A]' : 'text-white'}>
                {faultSimulated ? `SPIKE: ${currentLatency} ms` : `NOMINAL: ${currentLatency} ms`}
              </span>
            </div>
          </div>

          <div className="h-40 w-full border border-[#351010] bg-[#080808] p-2">
            <svg
              viewBox="0 0 420 140"
              className="h-full w-full"
              role="img"
              aria-label="Simulated network latency round-trip time chart"
            >
              {[25, 55, 85, 115].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="420"
                  y2={y}
                  stroke="#FFFFFF"
                  strokeOpacity="0.07"
                  strokeDasharray="3 4"
                />
              ))}
              <line
                x1="0"
                y1="62"
                x2="420"
                y2="62"
                stroke="#FF101A"
                strokeOpacity="0.45"
                strokeDasharray="5 5"
              />
              <text
                x="6"
                y="57"
                fill="#FF101A"
                fontSize="9"
                fontFamily="IBM Plex Mono, monospace"
              >
                ALERT THRESHOLD (50 ms DEMO)
              </text>
              <path
                d={buildSvgPath(latencySeries, 420, 140, 100)}
                fill="none"
                stroke={faultSimulated ? '#FF101A' : '#FFFFFF'}
                strokeWidth="2.2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
