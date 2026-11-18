import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AlertTriangle,
  CheckCircle2,
  Globe,
  Layers,
  Monitor,
  Network,
  Router,
  Server,
  Wrench,
} from 'lucide-react';
import { IspDeviceNode, ispTopologyDevices } from '../data/projects';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface NetworkTopologyProps {
  selectedDeviceId: string;
  onSelectDevice: (id: string) => void;
  faultSimulated: boolean;
}

const getDeviceIcon = (id: string) => {
  switch (id) {
    case 'internet':
      return Globe;
    case 'core-router':
      return Router;
    case 'dist-switch':
      return Network;
    case 'access-switch':
      return Server;
    default:
      return Monitor;
  }
};

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  selectedDeviceId,
  onSelectDevice,
  faultSimulated,
}) => {
  const reducedMotion = useReducedMotion();
  const chainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !chainRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.isp-node-3d',
        { opacity: 0, y: 28, rotateX: -16, transformOrigin: '50% 100%' },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.72,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: chainRef.current,
            start: 'top 86%',
            once: true,
          },
        }
      );
    }, chainRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const selectedDevice: IspDeviceNode =
    ispTopologyDevices.find((d) => d.id === selectedDeviceId) ?? ispTopologyDevices[1];

  const isAffectedByFault = (id: string) =>
    faultSimulated && (id === 'access-switch' || id === 'end-devices');

  return (
    <div ref={chainRef} className="space-y-6">
      {/* Interactive Black-and-Red Topology Chain */}
      <div className="cr-panel cr-fine-grid relative overflow-hidden p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#351010] pb-3">
          <div className="font-mono text-xs tracking-[0.14em] text-white uppercase">
            NETWORK TOPOLOGY // CLICK ANY DEVICE TO INSPECT ROLE
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-[#B8B8B8]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 bg-[#FF101A]" aria-hidden="true" />
              Packet Flow
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 border border-[#FF101A] bg-[#650000]" aria-hidden="true" />
              {faultSimulated ? 'Fault Isolated (Demo)' : 'Fault Simulation Idle'}
            </span>
          </div>
        </div>

        <div className="relative">
          {/* Desktop Animated Red Packet Flow Connectors */}
          <svg
            className="pointer-events-none absolute inset-x-0 top-[44px] hidden h-10 w-full lg:block"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((segment) => {
              const x1 = 100 + segment * 200;
              const x2 = x1 + 200;
              const isFaultSegment = faultSimulated && segment >= 2;
              return (
                <g key={segment}>
                  <line
                    x1={x1}
                    y1={20}
                    x2={x2}
                    y2={20}
                    stroke={isFaultSegment ? '#FF101A' : '#FFFFFF'}
                    strokeOpacity={isFaultSegment ? 0.45 : 0.18}
                    strokeWidth={2}
                    strokeDasharray={isFaultSegment ? '4 4' : undefined}
                  />
                  {!isFaultSegment && (
                    <line
                      x1={x1}
                      y1={20}
                      x2={x2}
                      y2={20}
                      stroke="#FF101A"
                      strokeWidth={2.2}
                      className={reducedMotion ? '' : 'animate-packet-flow'}
                    />
                  )}
                  {isFaultSegment && segment === 2 && (
                    <text
                      x={(x1 + x2) / 2}
                      y={12}
                      textAnchor="middle"
                      fill="#FF101A"
                      fontSize="10"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      LINK DOWN
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 5 Interactive Topology Nodes */}
          <div className="perspective-1200 relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {ispTopologyDevices.map((device, idx) => {
              const Icon = getDeviceIcon(device.id);
              const isSelected = device.id === selectedDevice.id;
              const degraded = isAffectedByFault(device.id);

              return (
                <div key={device.id} className="isp-node-3d relative flex flex-col">
                  {idx > 0 && (
                    <div
                      className="mx-auto mb-3 flex h-5 items-center justify-center sm:hidden"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full w-[2px] ${
                          faultSimulated && idx >= 3 ? 'bg-[#650000]' : 'bg-[#FF101A]/75'
                        }`}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectDevice(device.id)}
                    aria-pressed={isSelected}
                    className={`group relative flex h-full flex-col items-start border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-[#FF101A] bg-[#160707] shadow-[0_0_0_1px_rgba(255,16,26,0.38)]'
                        : 'border-[#351010] bg-[#080808] hover:border-[#E60012] hover:bg-[#120707]'
                    }`}
                  >
                    <div className="mb-3 flex w-full items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center border ${
                          degraded
                            ? 'border-[#FF101A] bg-[#650000]/45 text-[#FF101A]'
                            : isSelected
                              ? 'border-[#FF101A] bg-[#FF101A] text-white'
                              : 'border-[#351010] bg-[#120707] text-[#FF101A]'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase ${
                          degraded ? 'text-[#FF101A]' : 'text-white'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 ${
                            degraded
                              ? 'bg-[#FF101A]'
                              : `bg-white ${reducedMotion ? '' : 'animate-status-pulse'}`
                          }`}
                          aria-hidden="true"
                        />
                        {degraded ? 'FAULT' : 'UP'}
                      </span>
                    </div>

                    <div className="font-mono text-[10px] tracking-[0.14em] text-[#B8B8B8] uppercase">
                      HOP 0{idx + 1} · {device.shortLabel}
                    </div>
                    <div className="mt-0.5 font-display text-sm font-bold text-white">
                      {device.name}
                    </div>
                    <div className="mt-2 font-mono text-[11px] text-[#B8B8B8]">
                      {degraded
                        ? 'RTT: Timeout (Demo)'
                        : `RTT: ${device.simulatedLatencyMs.toFixed(1)} ms`}
                    </div>

                    <div className="mt-auto pt-3 font-mono text-[10px] text-[#FF101A]">
                      {isSelected ? '[ INSPECTING ]' : 'Inspect device ->'}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Device Details Inspector */}
      <div
        className="cr-card p-5 sm:p-6"
        role="region"
        aria-live="polite"
        aria-label={`Technical description for ${selectedDevice.name}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#351010] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#FF101A]">
              <span>DEVICE INSPECTOR</span>
              <span className="text-[#B8B8B8]">/</span>
              <span>{selectedDevice.shortLabel}</span>
              <span className="border border-[#351010] bg-[#080808] px-2 py-0.5 text-[10px] text-[#B8B8B8]">
                ILLUSTRATIVE DEMO DATA
              </span>
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-white">
              {selectedDevice.name} — {selectedDevice.role}
            </h3>
          </div>

          <div className="flex items-center gap-2 border border-[#351010] bg-[#080808] px-3 py-1.5 font-mono text-xs">
            {isAffectedByFault(selectedDevice.id) ? (
              <>
                <AlertTriangle className="h-4 w-4 text-[#FF101A]" aria-hidden="true" />
                <span className="text-[#FF101A]">SIMULATED FAULT IMPACTED</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-[#FF101A]" aria-hidden="true" />
                <span className="text-white">REACHABLE (DEMO)</span>
              </>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#B8B8B8]">
          {selectedDevice.description}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="border border-[#351010] bg-[#080808] p-3">
            <div className="font-mono text-[10px] tracking-wider text-[#B8B8B8] uppercase">
              OSI Layer
            </div>
            <div className="mt-1 font-mono text-xs text-white">
              {selectedDevice.osiLayer}
            </div>
          </div>
          <div className="border border-[#351010] bg-[#080808] p-3">
            <div className="font-mono text-[10px] tracking-wider text-[#B8B8B8] uppercase">
              Interfaces
            </div>
            <div className="mt-1 font-mono text-xs text-white">
              {selectedDevice.interfaceUp} · {selectedDevice.interfaceDown}
            </div>
          </div>
          <div className="border border-[#351010] bg-[#080808] p-3">
            <div className="font-mono text-[10px] tracking-wider text-[#B8B8B8] uppercase">
              Illustrative Addressing
            </div>
            <div className="mt-1 font-mono text-xs text-[#FF101A]">
              {selectedDevice.simulatedIp}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-wider text-white uppercase">
              <Layers className="h-3.5 w-3.5 text-[#FF101A]" aria-hidden="true" />
              <span>Operational Role</span>
            </div>
            <ul className="space-y-2 text-sm text-[#B8B8B8]">
              {selectedDevice.responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#FF101A]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-wider text-white uppercase">
              <Wrench className="h-3.5 w-3.5 text-[#FF101A]" aria-hidden="true" />
              <span>Fault-Isolation Checks</span>
            </div>
            <ul className="space-y-2 text-sm text-[#B8B8B8]">
              {selectedDevice.troubleshootingChecks.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-white/50" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
