import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Database,
  Radio,
  FileText,
  Zap,
  Cable,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  Cpu,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export type OspfStateId = 'DOWN' | 'INIT' | 'TWO_WAY' | 'EXSTART' | 'EXCHANGE' | 'LOADING' | 'FULL';

interface OspfStep {
  id: OspfStateId;
  stepNumber: number;
  name: string;
  badge: string;
  r1State: string;
  r2State: string;
  packetType: string;
  packetDirection: 'R1_TO_R2' | 'R2_TO_R1' | 'BIDIRECTIONAL' | 'NONE';
  multicastIp: string;
  analogy: string;
  headline: string;
  description: string;
  studentTip: string;
  ciscoOutput: string;
  packetDetails: {
    type: string;
    version: number;
    sourceIp: string;
    destIp: string;
    routerId: string;
    areaId: string;
    flags?: string;
    payloadSummary: string;
  };
}

const OspfAdjacencySectionComponent: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [linkType, setLinkType] = useState<'p2p' | 'broadcast'>('p2p');
  const [showPacketInspector, setShowPacketInspector] = useState<boolean>(true);

  const steps: OspfStep[] = [
    {
      id: 'DOWN',
      stepNumber: 1,
      name: 'Down',
      badge: 'State 1 of 7',
      r1State: 'DOWN',
      r2State: 'DOWN',
      packetType: 'None',
      packetDirection: 'NONE',
      multicastIp: '—',
      analogy: 'Silence before the first knock on the door.',
      headline: 'No OSPF Packets Detected',
      description:
        'Interfaces active; no Hello packets detected on wire.',
      studentTip:
        'Exam Tip: If a router stays in DOWN state, check physical layer connectivity, mismatched subnets, or shut interfaces.',
      ciscoOutput: `# show ip ospf neighbor\n% No neighbors found on GigabitEthernet0/0/0`,
      packetDetails: {
        type: 'No Transmission',
        version: 2,
        sourceIp: '—',
        destIp: '—',
        routerId: '—',
        areaId: '0.0.0.0',
        payloadSummary: 'Link idle. Waiting for Hello timer tick (every 10s on point-to-point).',
      },
    },
    {
      id: 'INIT',
      stepNumber: 2,
      name: 'Init',
      badge: 'State 2 of 7',
      r1State: 'DOWN (Sent Hello)',
      r2State: 'INIT (Saw R1 Hello)',
      packetType: 'OSPF Hello (Type 1)',
      packetDirection: 'R1_TO_R2',
      multicastIp: '224.0.0.5 (AllSPFRouters)',
      analogy: "R1 knocks: 'Hello! My Router ID is 10.10.255.1.'",
      headline: 'R1 Transmits Multicast Hello',
      description:
        'R1 sends multicast Hello (224.0.0.5); R2 detects neighbor.',
      studentTip:
        'Exam Tip: Routers transition to INIT only if Area ID, Subnet Mask, Hello/Dead timers, and Auth match.',
      ciscoOutput: `# R2# show ip ospf neighbor\nNeighbor ID     Pri   State     Dead Time   Address         Interface\n10.10.255.1       1   INIT/-    00:00:36    10.10.254.1     GigabitEthernet0/0/0`,
      packetDetails: {
        type: 'Type 1: Hello Packet',
        version: 2,
        sourceIp: '10.10.254.1',
        destIp: '224.0.0.5 (Multicast)',
        routerId: '10.10.255.1 (R1)',
        areaId: '0.0.0.0 (Area 0)',
        flags: 'Hello: 10s, Dead: 40s',
        payloadSummary: 'Active Neighbors: [None]. R1 announces presence to the network.',
      },
    },
    {
      id: 'TWO_WAY',
      stepNumber: 3,
      name: '2-Way',
      badge: 'State 3 of 7',
      r1State: '2-WAY',
      r2State: '2-WAY',
      packetType: 'OSPF Hello (Type 1)',
      packetDirection: 'R2_TO_R1',
      multicastIp: '224.0.0.5 (AllSPFRouters)',
      analogy: "R2 replies: 'Hello 10.10.255.1, I see you! My ID is 10.10.255.2.'",
      headline: 'Bidirectional Communication Validated',
      description:
        "R2 replies listing R1's Router ID; bidirectional communication validated.",
      studentTip:
        linkType === 'p2p'
          ? 'Point-to-Point Link: DR/BDR election is bypassed; routers move directly to ExStart.'
          : 'Broadcast Link: DR/BDR election occurs in 2-Way. R2 (higher RID) is elected DR, R1 is elected BDR.',
      ciscoOutput: `# R1# show ip ospf neighbor\nNeighbor ID     Pri   State     Dead Time   Address         Interface\n10.10.255.2       1   2WAY/-    00:00:39    10.10.254.2     GigabitEthernet0/0/0`,
      packetDetails: {
        type: 'Type 1: Hello Packet',
        version: 2,
        sourceIp: '10.10.254.2',
        destIp: '224.0.0.5 (Multicast)',
        routerId: '10.10.255.2 (R2)',
        areaId: '0.0.0.0 (Area 0)',
        flags: linkType === 'p2p' ? 'P2P Link (No DR/BDR)' : 'DR: 10.10.255.2, BDR: 10.10.255.1',
        payloadSummary: 'Active Neighbors: [10.10.255.1]. Mutual discovery validated.',
      },
    },
    {
      id: 'EXSTART',
      stepNumber: 4,
      name: 'ExStart',
      badge: 'State 4 of 7',
      r1State: 'EXSTART (Slave)',
      r2State: 'EXSTART (Master)',
      packetType: 'Database Description (Empty DBD)',
      packetDirection: 'BIDIRECTIONAL',
      multicastIp: 'Unicast P2P',
      analogy: "Determining who speaks first based on higher Router ID.",
      headline: 'Master/Slave Negotiation',
      description:
        'Routers negotiate Master/Slave status and initial DBD sequence numbers.',
      studentTip:
        'Exam Tip: If routers stay in EXSTART, check for interface MTU mismatches.',
      ciscoOutput: `# R1# show ip ospf neighbor\nNeighbor ID     Pri   State      Dead Time   Address         Interface\n10.10.255.2       1   EXSTART/-  00:00:33    10.10.254.2     GigabitEthernet0/0/0`,
      packetDetails: {
        type: 'Type 2: Database Description (DBD)',
        version: 2,
        sourceIp: '10.10.254.1 & 10.10.254.2',
        destIp: 'Unicast to Neighbor',
        routerId: '10.10.255.2 elected MASTER',
        areaId: '0.0.0.0',
        flags: 'I (Init)=1, M (More)=1, MS (Master)=1',
        payloadSummary: 'Negotiating initial Sequence Number (Seq# 0x2A41) to sequence DB exchange.',
      },
    },
    {
      id: 'EXCHANGE',
      stepNumber: 5,
      name: 'Exchange',
      badge: 'State 5 of 7',
      r1State: 'EXCHANGE',
      r2State: 'EXCHANGE',
      packetType: 'DBD (LSA Headers)',
      packetDirection: 'BIDIRECTIONAL',
      multicastIp: 'Unicast P2P',
      analogy: 'Swapping index summaries of Link-State Databases.',
      headline: 'Exchanging DBD Summaries',
      description:
        'Routers exchange Database Descriptors to compare Link-State Databases.',
      studentTip:
        'Efficiency: Exchanging LSA headers first conserves bandwidth before requesting full records.',
      ciscoOutput: `# R2# show ip ospf neighbor\nNeighbor ID     Pri   State       Dead Time   Address         Interface\n10.10.255.1       1   EXCHANGE/-  00:00:35    10.10.254.1     GigabitEthernet0/0/0`,
      packetDetails: {
        type: 'Type 2: Database Description (DBD)',
        version: 2,
        sourceIp: '10.10.254.2',
        destIp: '10.10.254.1',
        routerId: '10.10.255.2',
        areaId: '0.0.0.0',
        flags: 'M (More)=0, MS (Master)=1',
        payloadSummary: 'LSA Headers: Router-LSA (10.10.255.2), Summary-LSA (10.10.4.0/22).',
      },
    },
    {
      id: 'LOADING',
      stepNumber: 6,
      name: 'Loading',
      badge: 'State 6 of 7',
      r1State: 'LOADING',
      r2State: 'LOADING',
      packetType: 'LSR & LSU',
      packetDirection: 'BIDIRECTIONAL',
      multicastIp: 'Unicast P2P',
      analogy: "Requesting and transferring missing link-state records.",
      headline: 'Transferring Link State Updates',
      description:
        'Routers send LSRs and receive LSUs for missing link-state records.',
      studentTip:
        'OSPF Reliability: Every LSU packet must be explicitly acknowledged by an LSAck packet.',
      ciscoOutput: `# R1# show ip ospf neighbor\nNeighbor ID     Pri   State      Dead Time   Address         Interface\n10.10.255.2       1   LOADING/-  00:00:38    10.10.254.2     GigabitEthernet0/0/0`,
      packetDetails: {
        type: 'Type 3: LSR / Type 4: LSU / Type 5: LSAck',
        version: 2,
        sourceIp: '10.10.254.1 ⇄ 10.10.254.2',
        destIp: 'Direct Interface Link',
        routerId: '10.10.255.1 / 10.10.255.2',
        areaId: '0.0.0.0',
        payloadSummary: 'LSR: Requesting Area 10 & 20 topology. LSU: Transferring full 32-bit subnet records.',
      },
    },
    {
      id: 'FULL',
      stepNumber: 7,
      name: 'Full',
      badge: 'State 7 of 7',
      r1State: 'FULL / ADJACENT',
      r2State: 'FULL / ADJACENT',
      packetType: 'Keepalive Hellos',
      packetDirection: 'BIDIRECTIONAL',
      multicastIp: '224.0.0.5 (Keepalive)',
      analogy: 'Identical synchronized Link-State Databases on both routers.',
      headline: 'Adjacency Established • LSDB Synchronized',
      description:
        'Link-State Databases synchronized; OSPF adjacency established.',
      studentTip:
        'Adjacency Established: Routers send 10-second Hellos to maintain neighbor liveness.',
      ciscoOutput: `# R1# show ip ospf neighbor\n\nNeighbor ID     Pri   State      Dead Time   Address         Interface\n10.10.255.2       0   FULL/  -   00:00:34    10.10.254.2     GigabitEthernet0/0/0\n\n# show ip route ospf\nO    10.10.4.0/22 [110/2] via 10.10.254.2, GigabitEthernet0/0/0`,
      packetDetails: {
        type: 'FULL ADJACENCY CONFIRMED',
        version: 2,
        sourceIp: '10.10.254.1 & 10.10.254.2',
        destIp: '224.0.0.5',
        routerId: 'LSDB Checksum MATCH',
        areaId: '0.0.0.0 (Converged)',
        payloadSummary: 'Full neighbor adjacency established. Routing table populated via Dijkstra SPF algorithm.',
      },
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <section id="ospf-sim" className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-neutral-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-[var(--text-primary)] mb-6">
          OSPF Adjacency State Machine
        </h2>

        {/* Link Type Selector & Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="p-1 rounded-full bg-[var(--bg-card)] border border-[var(--hairline)] flex items-center gap-1 shadow-sm">
            <LiquidButton
              onClick={() => setLinkType('p2p')}
              size="sm"
              className={`rounded-full px-3.5 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                linkType === 'p2p'
                  ? 'text-neutral-900 bg-neutral-100 border border-neutral-300 shadow-sm dark:text-white dark:bg-white/10 dark:border-white/20 font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>Point-to-Point (/30 Link)</span>
            </LiquidButton>
            <LiquidButton
              onClick={() => setLinkType('broadcast')}
              size="sm"
              className={`rounded-full px-3.5 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                linkType === 'broadcast'
                  ? 'text-neutral-900 bg-neutral-100 border border-neutral-300 shadow-sm dark:text-white dark:bg-white/10 dark:border-white/20 font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>Broadcast Multi-Access</span>
            </LiquidButton>
          </div>

          <LiquidButton
            onClick={() => setShowPacketInspector(!showPacketInspector)}
            size="sm"
            className="rounded-full px-3.5 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card-subtle)] border border-[var(--hairline)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>{showPacketInspector ? 'Hide Packet Inspector' : 'Show Packet Inspector'}</span>
            </div>
          </LiquidButton>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative rounded-[28px] p-6 sm:p-10 bg-[var(--bg-card)] border border-[var(--hairline)] shadow-xl mb-8 overflow-hidden">
        {/* State Badge & Headline Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--hairline-subtle)]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 dark:bg-white/5 dark:border-white/10 dark:text-white/80 font-mono text-xs font-semibold uppercase tracking-wider">
              {currentStep.badge}
            </span>
            <span className="text-[var(--text-muted)] text-xs font-mono">•</span>
            <span className="text-[var(--text-secondary)] font-mono text-xs uppercase tracking-wider">
              State: <strong className="text-[var(--text-primary)] font-semibold">{currentStep.name}</strong>
            </span>
          </div>
        </div>

        {/* 2-Router Animated Diagram */}
        <div className="relative py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 my-2">
          {/* Router 1 Card */}
          <div className="w-full md:w-72 rounded-[28px] p-6 bg-[var(--bg-card-subtle)] border border-[var(--hairline)] relative overflow-hidden transition-all duration-300 hover:border-neutral-400 dark:hover:border-white/30 shadow-sm">
            {/* Top scanning accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ${
                currentStep.id === 'FULL'
                  ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                  : currentStep.id === 'DOWN'
                  ? 'bg-zinc-700'
                  : 'bg-neutral-900 dark:bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]'
              }`}
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--hairline)] flex items-center justify-center text-neutral-700 dark:text-neutral-300 shadow-inner">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-semibold text-sm">Router 1 (R₁)</h4>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Core-GW-01</span>
                </div>
              </div>

              {/* Status Dot */}
              <span
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep.id === 'FULL'
                    ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse'
                    : currentStep.id === 'DOWN'
                    ? 'bg-zinc-600'
                    : 'bg-neutral-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] dark:shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-pulse'
                }`}
              />
            </div>

            {/* Router Specs */}
            <div className="space-y-2 text-xs font-mono pt-2 border-t border-[var(--hairline-subtle)]">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Router ID:</span>
                <span className="text-[var(--text-primary)] font-semibold tabular-nums">10.10.255.1</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>IP Address:</span>
                <span className="text-[var(--text-secondary)] tabular-nums">10.10.254.1/30</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Interface:</span>
                <span className="text-[var(--text-secondary)]">Gi0/0/0</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--hairline-subtle)]">
                <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">OSPF State:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    currentStep.id === 'FULL'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : currentStep.id === 'DOWN'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-white/10 dark:text-neutral-200 dark:border-white/10'
                  }`}
                >
                  {currentStep.r1State}
                </span>
              </div>
            </div>
          </div>

          {/* Center Inter-Router Wire & Animated Packet */}
          <div className="flex-1 w-full md:w-auto relative flex flex-col items-center justify-center px-4">
            {/* Link Description Label */}
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--hairline)] text-[11px] font-mono text-[var(--text-secondary)]">
                <Cable className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>
                  {linkType === 'p2p' ? 'Point-to-Point Gigabit Transit (Area 0)' : 'Broadcast Ethernet Segment (Area 0)'}
                </span>
              </span>
            </div>

            {/* Wire Line with Gradient */}
            <div className="relative w-full h-12 flex items-center justify-center">
              {/* Wire Base */}
              <div className="absolute inset-x-0 h-[3px] bg-[var(--hairline)] rounded-full" />
              {/* Wire Active Glow */}
              <div
                className={`absolute inset-x-0 h-[3px] rounded-full transition-all duration-500 ${
                  currentStep.id === 'FULL'
                    ? 'bg-emerald-400/80 shadow-[0_0_15px_#34d399]'
                    : currentStep.id === 'DOWN'
                    ? 'bg-zinc-700'
                    : 'bg-neutral-400 dark:bg-neutral-600 shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                }`}
              />

              {/* Animated Traveling Packet Capsule */}
              <AnimatePresence mode="wait">
                {currentStep.packetDirection !== 'NONE' && (
                  <motion.div
                    key={currentStep.id + currentStep.packetDirection}
                    initial={{
                      x: currentStep.packetDirection === 'R1_TO_R2' ? '-40%' : currentStep.packetDirection === 'R2_TO_R1' ? '40%' : '0%',
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      x: currentStep.packetDirection === 'R1_TO_R2' ? '35%' : currentStep.packetDirection === 'R2_TO_R1' ? '-35%' : '0%',
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                    className={`z-20 px-3.5 py-1.5 rounded-full border text-xs font-mono font-semibold flex items-center gap-2 shadow-2xl cursor-default ${
                      currentStep.id === 'FULL'
                        ? 'bg-emerald-950/80 border-emerald-400/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-neutral-100 border-neutral-300 text-neutral-900 shadow-md dark:bg-neutral-900 dark:border-white/20 dark:text-white dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    }`}
                  >
                    <Radio className="w-3 h-3 animate-spin text-neutral-700 dark:text-neutral-300" />
                    <span>{currentStep.packetType.split('(')[0]}</span>
                    {currentStep.packetDirection === 'R1_TO_R2' && <ArrowRight className="w-3.5 h-3.5" />}
                    {currentStep.packetDirection === 'R2_TO_R1' && <ArrowLeft className="w-3.5 h-3.5" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transmission Meta */}
            <div className="mt-3 text-center">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Destination: <strong className="text-[var(--text-primary)] font-semibold tabular-nums">{currentStep.multicastIp}</strong>
              </span>
            </div>
          </div>

          {/* Router 2 Card */}
          <div className="w-full md:w-72 rounded-[28px] p-6 bg-[var(--bg-card-subtle)] border border-[var(--hairline)] relative overflow-hidden transition-all duration-300 hover:border-neutral-400 dark:hover:border-white/30 shadow-sm">
            {/* Top scanning accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ${
                currentStep.id === 'FULL'
                  ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                  : currentStep.id === 'DOWN'
                  ? 'bg-zinc-700'
                  : 'bg-neutral-800 dark:bg-neutral-200'
              }`}
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--hairline)] flex items-center justify-center text-neutral-700 dark:text-neutral-300 shadow-inner">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-semibold text-sm">Router 2 (R₂)</h4>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Eng-ABR-01</span>
                </div>
              </div>

              {/* Status Dot */}
              <span
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep.id === 'FULL'
                    ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse'
                    : currentStep.id === 'DOWN'
                    ? 'bg-zinc-600'
                    : 'bg-neutral-800 dark:bg-neutral-200 animate-pulse'
                }`}
              />
            </div>

            {/* Router Specs */}
            <div className="space-y-2 text-xs font-mono pt-2 border-t border-[var(--hairline-subtle)]">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Router ID:</span>
                <span className="text-[var(--text-primary)] font-semibold tabular-nums">10.10.255.2</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>IP Address:</span>
                <span className="text-[var(--text-secondary)] tabular-nums">10.10.254.2/30</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Interface:</span>
                <span className="text-[var(--text-secondary)]">Gi0/0/0</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--hairline-subtle)]">
                <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">OSPF State:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    currentStep.id === 'FULL'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : currentStep.id === 'DOWN'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-white/10 dark:text-neutral-200 dark:border-white/10'
                  }`}
                >
                  {currentStep.r2State}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Explanation Card */}
        <div className="mt-8 rounded-[28px] p-6 bg-[var(--bg-card-subtle)] border border-[var(--hairline)]">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 dark:bg-white/5 dark:border-white/10 dark:text-neutral-300 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
                {currentStep.headline}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-sans">
                {currentStep.description}
              </p>
              <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 dark:bg-white/5 dark:border-white/10 dark:text-neutral-300 text-xs font-mono flex items-start gap-2 mt-3">
                <Sparkles className="w-4 h-4 shrink-0 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                <span>{currentStep.studentTip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Packet Inspector & Cisco CLI Verification */}
        {showPacketInspector && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Packet Header Inspector */}
            <div className="lg:col-span-7 rounded-[28px] p-5 bg-[var(--bg-card-subtle)] border border-[var(--hairline)]">
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold">
                  <FileText className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                  Wire Packet Inspector
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">RFC 2328 Header</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--hairline-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Packet Type</span>
                  <span className="text-neutral-900 dark:text-white font-semibold">{currentStep.packetDetails.type}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--hairline-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Source IP</span>
                  <span className="text-[var(--text-secondary)] tabular-nums">{currentStep.packetDetails.sourceIp}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--hairline-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Dest IP</span>
                  <span className="text-[var(--text-secondary)] tabular-nums">{currentStep.packetDetails.destIp}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--hairline-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">OSPF Version</span>
                  <span className="text-[var(--text-secondary)] tabular-nums">v{currentStep.packetDetails.version}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--hairline-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Area ID</span>
                  <span className="text-[var(--text-secondary)] tabular-nums">{currentStep.packetDetails.areaId}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--hairline-subtle)]">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase block">Sequence / Flags</span>
                  <span className="text-amber-400 font-semibold">{currentStep.packetDetails.flags || 'Default'}</span>
                </div>
              </div>

              <div className="mt-2.5 p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--hairline-subtle)] text-xs font-mono text-[var(--text-secondary)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase block mb-0.5">Payload Content:</span>
                <span>{currentStep.packetDetails.payloadSummary}</span>
              </div>
            </div>

            {/* Cisco IOS Terminal Neighbor State */}
            <div className="lg:col-span-5 rounded-[28px] p-5 bg-neutral-950 border border-white/10 text-neutral-200 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Cisco IOS Telemetry
                  </span>
                  <span className="text-[10px] text-neutral-500">Live Console</span>
                </div>

                <pre className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed tabular-nums">
                  {currentStep.ciscoOutput}
                </pre>
              </div>

              <div className="pt-3 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                <span>Dead Timer: 40s</span>
                <span>Hello Timer: 10s</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Timeline & Step Controls Bar */}
        <div className="mt-8 pt-6 border-t border-[var(--hairline-subtle)]">
          {/* Labeled Step Checkpoints Bar */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6 select-none">
            {steps.map((s, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(index);
                  }}
                  className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isCurrent
                      ? 'bg-neutral-100 border border-neutral-300 shadow-sm dark:bg-white/10 dark:border-white/20'
                      : isPast
                      ? 'bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400'
                      : 'bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] hover:border-[var(--hairline)] text-[var(--text-muted)]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center font-bold tabular-nums ${
                      isCurrent
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-[var(--hairline)] text-[var(--text-muted)]'
                    }`}
                  >
                    {isPast ? '✓' : index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-medium truncate max-w-full ${
                      isCurrent ? 'text-[var(--text-primary)] font-semibold' : isPast ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Timeline Range Slider */}
          <div className="mb-6 px-3 py-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)]">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-2 px-1">
              <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
                <Clock className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>Interactive Timeline Slider:</span>
              </span>
              <span className="text-neutral-900 dark:text-white font-semibold">
                Step {currentStepIndex + 1} of 7: {currentStep.name}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={currentStepIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStepIndex(Number(e.target.value));
              }}
              className="w-full h-2 bg-[var(--gauge-track)] rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white border border-[var(--hairline)] transition-all"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mt-1.5 px-0.5">
              <span>01. Down</span>
              <span>02. Init</span>
              <span>03. 2-Way</span>
              <span>04. ExStart</span>
              <span>05. Exchange</span>
              <span>06. Loading</span>
              <span>07. Full</span>
            </div>
          </div>

          {/* Stepper Buttons Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="rounded-full px-4 py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card-subtle)] border border-[var(--hairline)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </div>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full px-4 py-2 text-xs font-mono text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white bg-[var(--bg-card-subtle)] border border-[var(--hairline)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                      <span>Pause Auto-Step</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-neutral-600 dark:text-neutral-400" />
                      <span>Auto-Play</span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={handleReset}
                className="rounded-full p-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-card-subtle)] border border-[var(--hairline)] transition-all cursor-pointer"
                title="Reset simulation to Down state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Action Button: Step Next */}
            <div className="w-full sm:w-auto">
              {currentStepIndex < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto rounded-full px-7 py-3 text-xs font-mono font-semibold uppercase tracking-wider bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 cursor-pointer shadow-lg transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Next: {steps[currentStepIndex + 1].name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white dark:text-black" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto rounded-full px-7 py-3 text-xs font-mono font-semibold uppercase tracking-wider bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 cursor-pointer shadow-lg transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white dark:text-black" />
                    <span>Restart Simulation</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export const OspfAdjacencySection = React.memo(OspfAdjacencySectionComponent);
