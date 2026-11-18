import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Building2,
  GitBranch,
  Globe2,
  Layers,
  Monitor,
  Network,
  Route,
  Server,
} from 'lucide-react';
import {
  enterpriseConcepts,
  enterpriseLinks,
  enterpriseNodes,
  EnterpriseNode,
} from '../data/projects';
import { TiltCard3D } from './TiltCard3D';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const getNodeGlyph = (type: EnterpriseNode['deviceType']) => {
  switch (type) {
    case 'router':
      return Route;
    case 'dist-switch':
      return Network;
    case 'access-switch':
      return Server;
    case 'wan':
      return Globe2;
    default:
      return Monitor;
  }
};

export const EnterpriseArchitecture: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('hq-core');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !wrapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ent-svg-link',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.ent-svg-node',
        { opacity: 0, scale: 0.88, transformOrigin: 'center center' },
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.055,
          ease: 'back.out(1.4)',
          clearProps: 'opacity',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const selectedNode =
    enterpriseNodes.find((n) => n.id === selectedNodeId) ?? enterpriseNodes[0];

  const getNodeById = (id: string) => enterpriseNodes.find((n) => n.id === id);

  return (
    <div ref={wrapRef} className="space-y-8">
      {/* Main Technical Diagram + Selected Device Purpose Panel */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="cr-panel cr-fine-grid relative overflow-hidden p-4 sm:p-5 xl:col-span-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#351010] pb-3 font-mono text-[11px] text-[#B8B8B8]">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-white">
                <Building2 className="h-3.5 w-3.5 text-[#FF101A]" aria-hidden="true" />
                MAIN OFFICE
              </span>
              <span className="text-[#FF101A]" aria-hidden="true">
                ↔
              </span>
              <span className="inline-flex items-center gap-1.5 text-white">
                <GitBranch className="h-3.5 w-3.5 text-[#FF101A]" aria-hidden="true" />
                BRANCH OFFICE
              </span>
            </div>
            <span>SELECT ANY DEVICE TO INSPECT</span>
          </div>

          <div className="w-full overflow-x-auto pb-2">
            <svg
              viewBox="0 0 900 410"
              className="h-auto min-w-[660px] w-full select-none"
              role="img"
              aria-label="Enterprise Network Infrastructure Topology connecting Main Office and Branch Office over WAN"
            >
              {/* Main Office Zone */}
              <rect
                x="24"
                y="22"
                width="462"
                height="366"
                fill="rgba(18, 7, 7, 0.72)"
                stroke="#351010"
                strokeDasharray="6 4"
              />
              <text
                x="40"
                y="44"
                fill="#FF101A"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.4"
              >
                MAIN OFFICE CAMPUS
              </text>

              {/* WAN Zone */}
              <rect
                x="504"
                y="22"
                width="112"
                height="150"
                fill="rgba(101, 0, 0, 0.16)"
                stroke="#650000"
                strokeDasharray="4 4"
              />
              <text
                x="560"
                y="44"
                textAnchor="middle"
                fill="#B8B8B8"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.2"
              >
                WAN LINK
              </text>

              {/* Branch Office Zone */}
              <rect
                x="634"
                y="22"
                width="242"
                height="366"
                fill="rgba(18, 7, 7, 0.72)"
                stroke="#351010"
                strokeDasharray="6 4"
              />
              <text
                x="650"
                y="44"
                fill="#FF101A"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
                letterSpacing="1.4"
              >
                BRANCH OFFICE
              </text>

              {/* VLAN Subnet Annotations */}
              <g fontFamily="IBM Plex Mono, monospace" fontSize="9.5" fill="#B8B8B8">
                <text x="115" y="374" textAnchor="middle">
                  VLAN 10 · 192.168.10.0/24
                </text>
                <text x="270" y="374" textAnchor="middle">
                  VLAN 20 · 192.168.20.0/24
                </text>
                <text x="415" y="374" textAnchor="middle">
                  VLAN 30 · 192.168.30.0/24
                </text>
              </g>

              {/* Subtle Animated Red Connection Lines */}
              {enterpriseLinks.map((link) => {
                const from = getNodeById(link.from);
                const to = getNodeById(link.to);
                if (!from || !to) return null;
                const isWan = link.kind === 'wan';

                return (
                  <g key={link.id} className="ent-svg-link">
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={isWan ? '#FF101A' : '#650000'}
                      strokeOpacity={isWan ? 0.55 : 0.7}
                      strokeWidth={isWan ? 2.4 : 1.6}
                    />
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={isWan ? '#FF101A' : '#E60012'}
                      strokeOpacity={isWan ? 0.95 : 0.75}
                      strokeWidth={isWan ? 2 : 1.4}
                      className={
                        reducedMotion
                          ? ''
                          : isWan
                            ? 'animate-packet-flow-fast'
                            : 'animate-packet-flow'
                      }
                    />
                  </g>
                );
              })}

              {/* Interactive Devices */}
              {enterpriseNodes.map((node) => {
                const isSelected = node.id === selectedNode.id;
                const boxW = node.deviceType === 'wan' ? 92 : 118;
                const boxH = 50;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x - boxW / 2}, ${node.y - boxH / 2})`}
                    className="ent-svg-node cursor-pointer"
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setSelectedNodeId(node.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${node.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNodeId(node.id);
                      }
                    }}
                  >
                    <rect
                      width={boxW}
                      height={boxH}
                      fill={isSelected ? '#1C0808' : '#080808'}
                      stroke={isSelected ? '#FF101A' : '#351010'}
                      strokeWidth={isSelected ? 1.8 : 1.1}
                    />
                    <rect
                      x="0"
                      y="0"
                      width={boxW}
                      height="3"
                      fill={isSelected ? '#FF101A' : '#650000'}
                    />
                    <text
                      x={boxW / 2}
                      y="22"
                      textAnchor="middle"
                      fill={isSelected ? '#FF101A' : '#FFFFFF'}
                      fontSize="10.5"
                      fontWeight="600"
                      fontFamily="IBM Plex Mono, monospace"
                    >
                      {node.shortCode}
                    </text>
                    <text
                      x={boxW / 2}
                      y="38"
                      textAnchor="middle"
                      fill="#B8B8B8"
                      fontSize="8.8"
                      fontFamily="Inter, sans-serif"
                    >
                      {node.name.length > 17 ? `${node.name.slice(0, 16)}…` : node.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Device Details Drawer */}
        <div className="cr-card flex flex-col p-5 xl:col-span-4">
          <div className="flex items-start justify-between gap-3 border-b border-[#351010] pb-4">
            <div>
              <div className="font-mono text-[11px] tracking-[0.14em] text-[#FF101A] uppercase">
                DEVICE DETAILS // {selectedNode.shortCode}
              </div>
              <h3 className="mt-1 font-display text-lg font-bold text-white">
                {selectedNode.name}
              </h3>
            </div>
            {(() => {
              const Icon = getNodeGlyph(selectedNode.deviceType);
              return (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#FF101A]/50 bg-[#080808] text-[#FF101A]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
              );
            })()}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#B8B8B8]">
            {selectedNode.roleSummary}
          </p>

          <dl className="mt-5 space-y-3 border-t border-[#351010] pt-4 font-mono text-xs">
            <div>
              <dt className="text-[10px] tracking-wider text-[#B8B8B8] uppercase">
                IP Plan
              </dt>
              <dd className="mt-0.5 text-[#FF101A]">{selectedNode.ipSummary}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-wider text-[#B8B8B8] uppercase">
                Default Gateway / Next Hop
              </dt>
              <dd className="mt-0.5 text-white">{selectedNode.gateway}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-wider text-[#B8B8B8] uppercase">
                Routing / Switching Mode
              </dt>
              <dd className="mt-0.5 text-white">{selectedNode.routingMode}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-wider text-[#B8B8B8] uppercase">
                VLAN Scope
              </dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {selectedNode.vlans.map((vlan) => (
                  <span
                    key={vlan}
                    className="border border-[#351010] bg-[#080808] px-2 py-0.5 text-[10px] text-white"
                  >
                    {vlan}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-[#351010] pt-4">
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] tracking-wider text-white uppercase">
              <Layers className="h-3.5 w-3.5 text-[#FF101A]" aria-hidden="true" />
              <span>Architecture Notes</span>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-[#B8B8B8]">
              {selectedNode.technicalNotes.map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#FF101A]" aria-hidden="true" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 7 Enterprise Networking Concept Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {enterpriseConcepts.map((concept) => {
          const isLinked = selectedNode.id === concept.targetNodeId;
          return (
            <TiltCard3D key={concept.id} maxTilt={4.5} className="h-full">
              <button
                type="button"
                onClick={() => setSelectedNodeId(concept.targetNodeId)}
                className={`flex h-full w-full flex-col border p-4 text-left transition-all ${
                  isLinked
                    ? 'border-[#FF101A] bg-[#180707]'
                    : 'border-[#351010] bg-[#120707] hover:border-[#E60012]'
                }`}
              >
                <span className="font-mono text-[10px] tracking-[0.14em] text-[#FF101A] uppercase">
                  {concept.tag}
                </span>
                <h4 className="mt-1.5 font-display text-base font-bold text-white">
                  {concept.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#B8B8B8]">
                  {concept.summary}
                </p>
              </button>
            </TiltCard3D>
          );
        })}
      </div>
    </div>
  );
};
