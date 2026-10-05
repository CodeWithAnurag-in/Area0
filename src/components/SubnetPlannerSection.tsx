import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Binary,
  Layers,
  ArrowRight,
  ArrowLeft,
  Info,
  ShieldAlert,
  BookOpen,
  Monitor,
  Shield,
  Network,
  HelpCircle,
  Wand2,
  Check,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-react';
import { LiquidButton, MetalButton } from '@/components/ui/liquid-glass-button';



interface DepartmentRequirement {
  id: string;
  name: string;
  shortName: string;
  category: string;
  hostsNeeded: number;
  defaultCidr: number;
  defaultSubnetId: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  explanation: string;
}

interface ValidationResult {
  deptId: string;
  isValidIp: boolean;
  isBoundaryValid: boolean;
  usableHosts: number;
  totalAddresses: number;
  capacityDeficit: number; // >0 means deficit
  overlappingWith: string[];
  startInt: number;
  endInt: number;
  mask: string;
  broadcast: string;
  firstUsable: string;
  lastUsable: string;
}

// IP Math Helpers
function ipToInt(ip: string): number {
  const parts = ip.trim().split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return -1;
  }
  return (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

function intToIp(int: number): string {
  return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
}

function getMaskFromCidr(cidr: number): string {
  if (cidr === 0) return '0.0.0.0';
  const maskInt = (0xffffffff << (32 - cidr)) >>> 0;
  return intToIp(maskInt);
}

function intToBinary32(int: number): string {
  return int.toString(2).padStart(32, '0');
}

// Smallest CIDR that fits required hosts
function getRecommendedCidr(hosts: number): number {
  for (let c = 30; c >= 22; c--) {
    const usable = Math.pow(2, 32 - c) - 2;
    if (usable >= hosts) {
      return c;
    }
  }
  return 24;
}

export const DEPARTMENTS: DepartmentRequirement[] = [
  {
    id: 'cs-lab',
    name: 'CS Laboratory',
    shortName: 'CS Lab',
    category: 'Department 1',
    hostsNeeded: 220,
    defaultCidr: 24,
    defaultSubnetId: '10.10.0.0',
    color: '#06b6d4',
    icon: Monitor,
    explanation: '220 hosts -> /24 prefix (254 usable).',
  },
  {
    id: 'it-lab',
    name: 'IT Laboratory',
    shortName: 'IT Lab',
    category: 'Department 2',
    hostsNeeded: 110,
    defaultCidr: 25,
    defaultSubnetId: '10.10.1.0',
    color: '#38bdf8',
    icon: Network,
    explanation: '110 hosts -> /25 prefix (126 usable).',
  },
  {
    id: 'svu-library',
    name: 'SVU Library',
    shortName: 'SVU Library',
    category: 'Campus Facility',
    hostsNeeded: 50,
    defaultCidr: 26,
    defaultSubnetId: '10.10.1.128',
    color: '#818cf8',
    icon: BookOpen,
    explanation: '50 hosts -> /26 prefix (62 usable).',
  },
  {
    id: 'admin',
    name: 'College Administration',
    shortName: 'Admin',
    category: 'Administration',
    hostsNeeded: 25,
    defaultCidr: 27,
    defaultSubnetId: '10.10.1.192',
    color: '#34d399',
    icon: Shield,
    explanation: '25 hosts -> /27 prefix (30 usable).',
  },
  {
    id: 'core-gw',
    name: "College's Core GW",
    shortName: 'Core GW',
    category: 'WAN Transit Link',
    hostsNeeded: 2,
    defaultCidr: 30,
    defaultSubnetId: '10.10.1.224',
    color: '#fbbf24',
    icon: Network,
    explanation: '2 hosts -> /30 prefix (2 usable).',
  },
];

// Pure function to validate subnets and check overlap strictly when studentPlan changes
function validateSubnetPlan(
  plan: Record<string, { cidr: number; subnetId: string }>,
  departments: DepartmentRequirement[]
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};
  const subnetsParsed: { id: string; start: number; end: number; isValid: boolean }[] = [];

  departments.forEach((d) => {
    const entry = plan[d.id];
    if (!entry) return;
    const startInt = ipToInt(entry.subnetId);
    const isValidIp = startInt !== -1;
    const cidr = entry.cidr;
    const totalAddresses = Math.pow(2, 32 - cidr);
    const usableHosts = cidr === 31 ? 2 : cidr === 32 ? 1 : Math.max(0, totalAddresses - 2);

    let isBoundaryValid = false;
    let endInt = 0;

    if (isValidIp) {
      isBoundaryValid = startInt % totalAddresses === 0;
      endInt = startInt + totalAddresses - 1;
    }

    const deficit = d.hostsNeeded - usableHosts;

    results[d.id] = {
      deptId: d.id,
      isValidIp,
      isBoundaryValid,
      usableHosts,
      totalAddresses,
      capacityDeficit: deficit > 0 ? deficit : 0,
      overlappingWith: [],
      startInt,
      endInt,
      mask: getMaskFromCidr(cidr),
      broadcast: isValidIp ? intToIp(endInt) : 'N/A',
      firstUsable: isValidIp ? intToIp(startInt + 1) : 'N/A',
      lastUsable: isValidIp ? intToIp(endInt - 1) : 'N/A',
    };

    if (isValidIp) {
      subnetsParsed.push({ id: d.id, start: startInt, end: endInt, isValid: true });
    }
  });

  // Detect Overlaps
  for (let i = 0; i < subnetsParsed.length; i++) {
    for (let j = i + 1; j < subnetsParsed.length; j++) {
      const a = subnetsParsed[i];
      const b = subnetsParsed[j];
      if (Math.max(a.start, b.start) <= Math.min(a.end, b.end)) {
        const deptA = departments.find((d) => d.id === a.id)?.name || a.id;
        const deptB = departments.find((d) => d.id === b.id)?.name || b.id;
        results[a.id].overlappingWith.push(deptB);
        results[b.id].overlappingWith.push(deptA);
      }
    }
  }

  return results;
}

const SubnetPlannerSectionComponent: React.FC = () => {
  const departments = DEPARTMENTS;

  // Student inputs state
  const [studentPlan, setStudentPlan] = useState<Record<string, { cidr: number; subnetId: string }>>(() => {
    const initial: Record<string, { cidr: number; subnetId: string }> = {};
    departments.forEach((d) => {
      initial[d.id] = { cidr: d.defaultCidr, subnetId: d.defaultSubnetId };
    });
    return initial;
  });

  const [isDeployed, setIsDeployed] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('cs-lab');
  const [viewMode, setViewMode] = useState<'guided' | 'all'>('guided');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [auditCertId, setAuditCertId] = useState<string>('');

  // Input helpers
  const updateCidr = (id: string, cidr: number) => {
    setStudentPlan((prev) => ({
      ...prev,
      [id]: { ...prev[id], cidr },
    }));
  };

  const updateSubnetId = (id: string, subnetId: string) => {
    setStudentPlan((prev) => ({
      ...prev,
      [id]: { ...prev[id], subnetId },
    }));
  };

  // Quick Presets
  const loadBlueprint = () => {
    const blueprint: Record<string, { cidr: number; subnetId: string }> = {};
    departments.forEach((d) => {
      blueprint[d.id] = { cidr: d.defaultCidr, subnetId: d.defaultSubnetId };
    });
    setStudentPlan(blueprint);
    setIsDeployed(true);
  };

  const simulateOverlapError = () => {
    const faulty = { ...studentPlan };
    // Intentional collision: assign 10.10.1.0/25 to IT Lab and also 10.10.1.64/26 to SVU Library
    faulty['cs-lab'] = { cidr: 24, subnetId: '10.10.0.0' };
    faulty['it-lab'] = { cidr: 25, subnetId: '10.10.1.0' }; // spans 10.10.1.0 - 10.10.1.127
    faulty['svu-library'] = { cidr: 26, subnetId: '10.10.1.64' }; // Overlaps inside IT Lab's block!
    setStudentPlan(faulty);
    setIsDeployed(true);
  };

  const clearPlan = () => {
    const empty: Record<string, { cidr: number; subnetId: string }> = {};
    departments.forEach((d) => {
      empty[d.id] = { cidr: 24, subnetId: '10.10.0.0' };
    });
    setStudentPlan(empty);
    setIsDeployed(false);
  };

  // Validation Engine strictly recomputed when studentPlan changes
  const validationResults: Record<string, ValidationResult> = useMemo(() => {
    return validateSubnetPlan(studentPlan, departments);
  }, [studentPlan]);

  // Overall Simulation Metrics
  const summaryMetrics = useMemo(() => {
    let totalNeeded = 0;
    let totalAllocated = 0;
    let overlapCount = 0;
    let deficitCount = 0;
    let boundaryErrorCount = 0;

    departments.forEach((d) => {
      const res = validationResults[d.id];
      totalNeeded += d.hostsNeeded;
      if (res.isValidIp) totalAllocated += res.totalAddresses;
      if (res.overlappingWith.length > 0) overlapCount++;
      if (res.capacityDeficit > 0) deficitCount++;
      if (!res.isBoundaryValid) boundaryErrorCount++;
    });

    const efficiency = totalAllocated > 0 ? Math.min(100, (totalNeeded / totalAllocated) * 100) : 0;
    const isFlawless = overlapCount === 0 && deficitCount === 0 && boundaryErrorCount === 0;

    return {
      totalNeeded,
      totalAllocated,
      overlapCount,
      deficitCount,
      boundaryErrorCount,
      efficiency,
      isFlawless,
    };
  }, [departments, validationResults]);

  const handleDeploy = () => {
    setIsDeployed(true);
    if (summaryMetrics.isFlawless) {
      setAuditCertId('SVU-NET-2026-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    }
  };

  // Smart Helper: Calculate Next Contiguous Boundary-Aligned Address
  const getNextFreeSubnet = (index: number): string => {
    if (index === 0) return '10.10.0.0';
    const prevDept = departments[index - 1];
    const prevValidation = validationResults[prevDept.id];
    const currentDept = departments[index];
    const currentCidr = studentPlan[currentDept.id].cidr;
    const currentBlockSize = Math.pow(2, 32 - currentCidr);

    if (prevValidation && prevValidation.isValidIp) {
      const nextCandidateInt = prevValidation.endInt + 1;
      const remainder = nextCandidateInt % currentBlockSize;
      const alignedInt = remainder === 0 ? nextCandidateInt : nextCandidateInt + (currentBlockSize - remainder);
      return intToIp(alignedInt);
    }
    return '10.10.1.0';
  };

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || departments[0];
  const selectedValidation = validationResults[selectedDept.id];

  // 32-Bit Binary Representation
  const binaryData = useMemo(() => {
    if (!selectedValidation || !selectedValidation.isValidIp) return null;
    const ipBin = intToBinary32(selectedValidation.startInt);
    const maskBin = intToBinary32(ipToInt(selectedValidation.mask));
    const cidr = studentPlan[selectedDept.id].cidr;

    return {
      ipBin,
      maskBin,
      cidr,
      octets: [ipBin.slice(0, 8), ipBin.slice(8, 16), ipBin.slice(16, 24), ipBin.slice(24, 32)],
      maskOctets: [maskBin.slice(0, 8), maskBin.slice(8, 16), maskBin.slice(16, 24), maskBin.slice(24, 32)],
    };
  }, [selectedDept, selectedValidation, studentPlan]);

  const activeDepartment = viewMode === 'guided' ? departments[currentStepIndex] : selectedDept;

  return (
    <section id="planner" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
      {/* Background Specular Flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-neutral-500/5 via-neutral-400/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-mono text-xs tracking-[0.25em] uppercase mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive VLSM Simulation</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-[var(--text-primary)] mb-2">
            Campus Subnet Planner & Validator
          </h3>
        </div>

        {/* View Switcher & Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="p-1 rounded-full bg-[var(--bg-card)] border border-[var(--hairline)] flex items-center gap-1 shadow-sm">
            <LiquidButton
              onClick={() => {
                setViewMode('guided');
                setSelectedDeptId(departments[currentStepIndex].id);
              }}
              size="sm"
              className={`rounded-full px-3.5 py-1.5 text-xs transition-all cursor-pointer ${
                viewMode === 'guided'
                  ? 'bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-white/10 dark:border-white/20 dark:text-white shadow-sm font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>Step-by-Step</span>
            </LiquidButton>
            <LiquidButton
              onClick={() => setViewMode('all')}
              size="sm"
              className={`rounded-full px-3.5 py-1.5 text-xs transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-white/10 dark:border-white/20 dark:text-white shadow-sm font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>All 5 Subnets</span>
            </LiquidButton>
          </div>

          <LiquidButton
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            size="sm"
            className="rounded-full px-3.5 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card-subtle)] border border-[var(--hairline)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>Cheatsheet</span>
            </div>
          </LiquidButton>

          <LiquidButton
            onClick={loadBlueprint}
            size="sm"
            className="rounded-full px-3.5 py-1.5 text-xs font-mono text-[var(--text-primary)] hover:text-neutral-900 dark:hover:text-white bg-[var(--bg-card-subtle)] border border-[var(--hairline)] transition-all cursor-pointer"
            title="Auto-fill the mathematically optimal plan"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>Blueprint</span>
            </div>
          </LiquidButton>

          <LiquidButton
            onClick={simulateOverlapError}
            size="sm"
            variant="destructive"
            className="rounded-full px-3.5 py-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
            title="Inject an intentional collision to test detector"
          >
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Overlap</span>
            </div>
          </LiquidButton>

          <LiquidButton
            onClick={clearPlan}
            size="sm"
            className="rounded-full p-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-card-subtle)] border border-[var(--hairline)] transition-all cursor-pointer"
            title="Reset all inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </LiquidButton>
        </div>
      </div>


      {/* Expandable VLSM Cheatsheet Drawer */}
      <AnimatePresence>
        {showCheatsheet && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden rounded-[28px] bg-[var(--bg-card)] border border-[var(--hairline)] p-6 sm:p-7 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-mono text-xs uppercase tracking-wider font-semibold">
                <Info className="w-4 h-4" />
                <span>VLSM Subnetting Cheat Sheet (Powers of 2: 2ⁿ - 2)</span>
              </div>
              <button
                onClick={() => setShowCheatsheet(false)}
                className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center font-mono text-xs">
              {[
                { cidr: '/24', mask: '255.255.255.0', total: 256, usable: 254, fit: 'CS Lab (220)' },
                { cidr: '/25', mask: '255.255.255.128', total: 128, usable: 126, fit: 'IT Lab (110)' },
                { cidr: '/26', mask: '255.255.255.192', total: 64, usable: 62, fit: 'SVU Library (50)' },
                { cidr: '/27', mask: '255.255.255.224', total: 32, usable: 30, fit: 'Admin (25)' },
                { cidr: '/28', mask: '255.255.255.240', total: 16, usable: 14, fit: 'Small Office (10)' },
                { cidr: '/30', mask: '255.255.255.252', total: 4, usable: 2, fit: 'Core GW link (2)' },
              ].map((row, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] space-y-1">
                  <div className="text-neutral-900 dark:text-white font-bold text-sm tabular-nums">{row.cidr}</div>
                  <div className="text-[10px] text-[var(--text-muted)] tabular-nums">{row.mask}</div>
                  <div className="text-[var(--text-primary)] font-semibold text-xs mt-1 tabular-nums">{row.usable} hosts</div>
                  <div className="text-[10px] text-emerald-500 dark:text-emerald-400">{row.fit}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-sans text-[var(--text-secondary)] text-center">
              💡 <strong>Golden Rule:</strong> Always assign subnets in descending order of host requirements (largest to smallest) to eliminate address fragmentation.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deployment & Metrics Banner */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-[var(--bg-card)] border border-[var(--hairline)] mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[var(--pro-card-shadow)]">
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-[var(--text-muted)] uppercase tracking-wider block text-[10px]">Hosts Required</span>
            <span className="text-[var(--text-primary)] text-base font-semibold tabular-nums">{summaryMetrics.totalNeeded} hosts</span>
          </div>
          <div className="h-8 w-[1px] bg-[var(--hairline-subtle)] hidden sm:block" />
          <div>
            <span className="text-[var(--text-muted)] uppercase tracking-wider block text-[10px]">Allocated Block</span>
            <span className="text-neutral-900 dark:text-white text-base font-semibold font-mono tabular-nums">{summaryMetrics.totalAllocated} IPs</span>
          </div>
          <div className="h-8 w-[1px] bg-[var(--hairline-subtle)] hidden sm:block" />
          <div>
            <span className="text-[var(--text-muted)] uppercase tracking-wider block text-[10px]">Efficiency</span>
            <span className={`text-base font-semibold tabular-nums ${summaryMetrics.efficiency >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {summaryMetrics.efficiency.toFixed(1)}% Optimal
            </span>
          </div>
          {isDeployed && (
            <>
              <div className="h-8 w-[1px] bg-[var(--hairline-subtle)] hidden sm:block" />
              <div>
                <span className="text-[var(--text-muted)] uppercase tracking-wider block text-[10px]">Health Audit</span>
                {summaryMetrics.isFlawless ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold tabular-nums">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 0 CONFLICTS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-400 font-semibold tabular-nums">
                    <AlertTriangle className="w-3.5 h-3.5" /> {summaryMetrics.overlapCount} COLLISION(S)
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleDeploy}
          className="w-full md:w-auto font-mono text-xs font-semibold tracking-wider uppercase px-7 py-3 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 cursor-pointer shadow-lg transition-all active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-2">
            <Play className="w-3.5 h-3.5 fill-current text-white dark:text-black" />
            <span>Deploy Subnets</span>
          </div>
        </button>
      </div>



      {/* Formal Infrastructure Verification & Accreditation Seal */}
      <AnimatePresence>
        {isDeployed && summaryMetrics.isFlawless && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 p-6 sm:p-7 rounded-[28px] bg-[var(--bg-card)] border border-emerald-500/40 shadow-xl relative overflow-hidden"
          >
            {/* Top scanning hairline indicator */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                {/* Official Concentric Seal Emblem */}
                <div className="relative w-12 h-12 rounded-2xl bg-[var(--bg-card-subtle)] border-2 border-emerald-400/50 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <div className="absolute inset-1 rounded-xl border border-dashed border-emerald-400/40" />
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] tracking-widest uppercase font-semibold">
                      Formal Audit Passed
                    </span>
                    <span className="text-[var(--text-muted)] text-xs">•</span>
                    <span className="text-[var(--text-secondary)] font-mono text-[11px] uppercase tracking-wider">
                      SVU Campus Core
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
                    Infrastructure Addressing Certified
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans mt-0.5 max-w-2xl leading-relaxed">
                    Zero address overlaps detected across all 5 networks (CS Lab, IT Lab, SVU Library, Admin, and Core GW). Contiguous descending VLSM boundaries mathematically verified.
                  </p>
                </div>
              </div>

              {/* Cryptographic Checksum Pill */}
              <div className="px-4 py-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--hairline)] font-mono text-xs space-y-1 shrink-0 self-stretch md:self-auto text-left md:text-right">
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Audit Attestation ID</div>
                <div className="text-emerald-400 font-bold tracking-wider">{auditCertId || 'SVU-NET-2026-ARCH'}</div>
                <div className="text-[10px] text-[var(--text-secondary)]">Status: <span className="text-[var(--text-primary)] font-medium">Production Approved</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proportional Visual Memory Map */}
      <div className="mb-10 rounded-[28px] p-6 bg-[var(--bg-card)] border border-[var(--hairline)] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <Layers className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="font-semibold uppercase tracking-wider">Visual Memory Map — 10.10.0.0/23 College Campus Space</span>
          </div>
          <span className="text-[var(--text-muted)] text-[11px]">Click any block to inspect binary layout</span>
        </div>

        {/* Visual Bar representation */}
        <div className="h-16 w-full rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--hairline)] p-1.5 flex gap-1.5 overflow-x-auto items-stretch select-none">
          {departments.map((d, index) => {
            const res = validationResults[d.id];
            const hasOverlap = res.overlappingWith.length > 0;
            const hasDeficit = res.capacityDeficit > 0;
            const isSelected = (viewMode === 'guided' ? departments[currentStepIndex].id : selectedDeptId) === d.id;

            // Proportional flex based on total addresses
            const flexGrow = Math.max(1, Math.round(res.totalAddresses / 4));

            let blockColor = 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--hairline)]';
            if (isDeployed) {
              if (hasOverlap) {
                blockColor = 'bg-rose-950/80 text-rose-200 border-rose-500/60 animate-pulse';
              } else if (hasDeficit) {
                blockColor = 'bg-amber-950/80 text-amber-200 border-amber-500/60';
              } else {
                blockColor = 'bg-neutral-100 text-neutral-900 border-neutral-300 hover:bg-neutral-200/80 dark:bg-white/10 dark:text-neutral-200 dark:border-white/10 dark:hover:bg-white/15';
              }
            }

            return (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDeptId(d.id);
                  if (viewMode === 'guided') setCurrentStepIndex(index);
                }}
                style={{ flex: `${flexGrow} 1 80px` }}
                className={`rounded-xl px-3 py-1.5 text-left border text-[11px] font-mono transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative tabular-nums ${blockColor} ${
                  isSelected ? 'ring-2 ring-neutral-400 dark:ring-white/40 shadow-lg' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold truncate">{d.shortName}</span>
                  <span className="text-[10px] opacity-80 font-bold">/{studentPlan[d.id].cidr}</span>
                </div>
                <div className="text-[10px] truncate text-[var(--text-muted)] font-mono">
                  {studentPlan[d.id].subnetId}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-neutral-200 border border-neutral-400 dark:bg-white/20 dark:border-white/40" /> Optimal Subnet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-400" /> Overlap Collision
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-400" /> Capacity Deficit
            </span>
          </div>
          <span className="text-[var(--text-muted)] text-[10px] tabular-nums">Total Space: 512 IPs (10.10.0.0 – 10.10.1.255)</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {viewMode === 'guided' ? (
        /* STEP-BY-STEP GUIDED ASSISTANT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {/* Step Progress Stepper */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--hairline)] flex items-center justify-between gap-2 overflow-x-auto shadow-sm">
              {departments.map((dept, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isDone = isDeployed && validationResults[dept.id].isBoundaryValid && validationResults[dept.id].capacityDeficit === 0 && validationResults[dept.id].overlappingWith.length === 0;

                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setSelectedDeptId(dept.id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer shrink-0 ${
                      isCurrent
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                        : isDone
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span>{dept.shortName}</span>
                    {isDone && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Current Step Card */}
            {(() => {
              const dept = departments[currentStepIndex];
              const plan = studentPlan[dept.id];
              const res = validationResults[dept.id];
              const recommendedCidr = getRecommendedCidr(dept.hostsNeeded);
              const suggestedNextIp = getNextFreeSubnet(currentStepIndex);
              const hasOverlap = isDeployed && res.overlappingWith.length > 0;
              const hasDeficit = isDeployed && res.capacityDeficit > 0;
              const isBoundaryErr = isDeployed && !res.isBoundaryValid;
              const Icon = dept.icon;

              return (
                <div className="p-7 rounded-[28px] bg-[var(--bg-card)] border border-[var(--hairline)] shadow-xl space-y-6">
                  {/* Department Title & Host Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--hairline-subtle)]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 dark:bg-white/5 dark:border-white/10 dark:text-white">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">{dept.category}</span>
                          <span className="text-[var(--text-muted)]">•</span>
                          <span className="text-xs font-mono text-[var(--text-muted)]">Step {currentStepIndex + 1} of 5</span>
                        </div>
                        <h4 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight mt-0.5">{dept.name}</h4>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline)] text-right">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">Host Requirement</span>
                      <span className="text-lg font-mono font-bold text-[var(--text-primary)] tabular-nums">{dept.hostsNeeded} hosts</span>
                    </div>
                  </div>

                  {/* Educational Context & Math */}
                  <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] space-y-1">
                    <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5" /> Subnetting Guideline
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">{dept.explanation}</p>
                  </div>

                  {/* Input Form Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Control 1: Prefix / CIDR Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">1. Select CIDR Prefix</label>
                        {plan.cidr !== recommendedCidr && (
                          <button
                            onClick={() => updateCidr(dept.id, recommendedCidr)}
                            className="text-[10px] font-mono text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Wand2 className="w-3 h-3" /> Auto-Set /{recommendedCidr}
                          </button>
                        )}
                      </div>

                      <select
                        value={plan.cidr}
                        onChange={(e) => updateCidr(dept.id, Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-400 dark:bg-neutral-900 dark:border-white/10 dark:text-white dark:focus:border-white/30 cursor-pointer tabular-nums text-sm font-mono"
                      >
                        {[24, 25, 26, 27, 28, 29, 30].map((c) => {
                          const usable = Math.pow(2, 32 - c) - 2;
                          const isRec = c === recommendedCidr;
                          return (
                            <option key={c} value={c} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                              /{c} ({usable} usable hosts) {isRec ? '★ Recommended' : ''}
                            </option>
                          );
                        })}
                      </select>

                      <div className="text-[11px] font-mono text-[var(--text-muted)]">
                        Provides <span className="text-[var(--text-primary)] font-semibold tabular-nums">{res.usableHosts} usable hosts</span> (Mask: <span className="tabular-nums">{res.mask}</span>)
                      </div>
                    </div>

                    {/* Control 2: Subnet ID Address */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">2. Subnet ID (Network)</label>
                        {plan.subnetId !== suggestedNextIp && (
                          <button
                            onClick={() => updateSubnetId(dept.id, suggestedNextIp)}
                            className="text-[10px] font-mono text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Wand2 className="w-3 h-3" /> Use {suggestedNextIp}
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={plan.subnetId}
                        onChange={(e) => updateSubnetId(dept.id, e.target.value)}
                        placeholder="10.10.x.x"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-400 dark:bg-neutral-900 dark:border-white/10 dark:text-white dark:focus:border-white/30 tabular-nums text-sm font-mono"
                      />

                      <div className="text-[11px] font-mono text-[var(--text-muted)]">
                        Broadcast: <span className="text-[var(--text-secondary)] tabular-nums">{res.broadcast}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback / Validation Alert for this Department */}
                  {isDeployed && (
                    <div className="pt-2">
                      {hasOverlap && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-300 flex items-start gap-2.5 font-mono text-xs">
                          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">Collision: Overlaps with {res.overlappingWith.join(', ')}</span>
                            <span className="text-[11px] text-rose-700 dark:text-rose-300/80">
                              Recommended start IP: {' '}
                              <strong className="font-bold underline cursor-pointer text-rose-950 dark:text-white" onClick={() => updateSubnetId(dept.id, suggestedNextIp)}>
                                {suggestedNextIp}
                              </strong>
                            </span>
                          </div>
                        </div>
                      )}

                      {hasDeficit && (
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-500/30 dark:text-amber-300 flex items-start gap-2.5 font-mono text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">Capacity Deficit: Needs {dept.hostsNeeded} hosts, /{plan.cidr} offers {res.usableHosts}</span>
                            <span className="text-[11px] text-amber-700 dark:text-amber-300/80">
                              Select{' '}
                              <strong className="font-bold underline cursor-pointer text-amber-950 dark:text-white" onClick={() => updateCidr(dept.id, recommendedCidr)}>
                                /{recommendedCidr}
                              </strong>{' '}
                              for {Math.pow(2, 32 - recommendedCidr) - 2} usable hosts.
                            </span>
                          </div>
                        </div>
                      )}

                      {isBoundaryErr && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-yellow-950/40 dark:border-yellow-500/30 dark:text-yellow-300 flex items-center gap-2 font-mono text-xs">
                          <Info className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400 shrink-0" />
                          <span>Invalid Boundary: Address {plan.subnetId} is not an integer multiple of block size {res.totalAddresses}.</span>
                        </div>
                      )}

                      {!hasOverlap && !hasDeficit && res.isBoundaryValid && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-300 flex items-center justify-between font-mono text-xs">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Valid Subnet
                          </span>
                          <span className="text-[var(--text-muted)] text-[11px] tabular-nums">Range: {res.firstUsable} – {res.lastUsable}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step Navigation Controls */}
                  <div className="pt-4 border-t border-[var(--hairline-subtle)] flex items-center justify-between">
                    <button
                      onClick={() => {
                        const prevIdx = Math.max(0, currentStepIndex - 1);
                        setCurrentStepIndex(prevIdx);
                        setSelectedDeptId(departments[prevIdx].id);
                      }}
                      disabled={currentStepIndex === 0}
                      className="rounded-full px-4 py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-card-subtle)] border border-[var(--hairline)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </div>
                    </button>

                    {currentStepIndex < departments.length - 1 ? (
                      <button
                        onClick={() => {
                          const nextIdx = currentStepIndex + 1;
                          setCurrentStepIndex(nextIdx);
                          setSelectedDeptId(departments[nextIdx].id);
                        }}
                        className="rounded-full px-5 py-2 text-xs font-mono font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 cursor-pointer shadow-md active:scale-95 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span>Next Step</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white dark:text-black" />
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={handleDeploy}
                        className="rounded-full px-6 py-2 text-xs font-mono font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 cursor-pointer shadow-md active:scale-95 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Play className="w-3.5 h-3.5 fill-current text-white dark:text-black" />
                          <span>Deploy & Audit</span>
                        </div>
                      </button>
                    )}
                  </div>

                </div>
              );
            })()}
          </div>

          {/* Right Column: 32-Bit Binary Octet Inspector */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="p-6 rounded-[28px] bg-[var(--bg-card)] border border-[var(--hairline)] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-wider">
                  <Binary className="w-4 h-4" />
                  <span>32-Bit Octet Inspector</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] border border-[var(--hairline)] text-[var(--text-muted)]">
                  {activeDepartment.shortName}
                </span>
              </div>

              {binaryData ? (
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex justify-between">
                      <span>Binary IP Structure</span>
                      <span className="text-neutral-900 dark:text-white font-semibold">/{binaryData.cidr} Prefix</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] font-mono text-xs tracking-wider space-y-2 tabular-nums">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {binaryData.octets.map((octet, oIdx) => {
                          const startBit = oIdx * 8;
                          return (
                            <div key={oIdx} className="space-y-1">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Octet {oIdx + 1}</span>
                              <div className="text-[11px] font-mono">
                                {octet.split('').map((bit, bIdx) => {
                                  const globalBitIdx = startBit + bIdx;
                                  const isNetworkBit = globalBitIdx < binaryData.cidr;
                                  return (
                                    <span
                                      key={bIdx}
                                      className={`inline-block ${
                                        isNetworkBit ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-400 dark:text-neutral-500'
                                      }`}
                                    >
                                      {bit}
                                    </span>
                                  );
                                })}
                              </div>
                              <span className="text-[11px] text-[var(--text-primary)] block font-semibold tabular-nums">
                                {parseInt(octet, 2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-[var(--hairline-subtle)] flex items-center justify-center gap-4 text-[10px] font-mono">
                        <span className="flex items-center gap-1 text-neutral-900 dark:text-white font-medium">
                          <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" /> Network ({binaryData.cidr})
                        </span>
                        <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                          <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600" /> Host ({32 - binaryData.cidr})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex justify-between">
                      <span>Subnet Mask</span>
                      <span className="text-[var(--text-primary)] font-medium tabular-nums">{selectedValidation.mask}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] font-mono text-[11px] grid grid-cols-4 gap-2 text-center tabular-nums">
                      {binaryData.maskOctets.map((mOct, mIdx) => (
                        <div key={mIdx}>
                          <div className="text-[10px] text-[var(--text-muted)]">Octet {mIdx + 1}</div>
                          <div className="text-[var(--text-secondary)] font-mono tracking-wider">{mOct}</div>
                          <div className="text-xs text-[var(--text-primary)] font-semibold tabular-nums">{parseInt(mOct, 2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] font-mono text-xs space-y-2 tabular-nums">
                    <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                      <span className="text-[var(--text-muted)]">Subnet Network ID:</span>
                      <span className="text-[var(--text-primary)] font-semibold">{studentPlan[activeDepartment.id].subnetId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                      <span className="text-[var(--text-muted)]">First Usable Host:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">{selectedValidation.firstUsable}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                      <span className="text-[var(--text-muted)]">Last Usable Host:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">{selectedValidation.lastUsable}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                      <span className="text-[var(--text-muted)]">Broadcast Address:</span>
                      <span className="text-[var(--text-primary)] font-semibold">{selectedValidation.broadcast}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--text-muted)]">Usable Hosts:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedValidation.usableHosts} Addresses</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        /* ALL 5 SUBNETS UNIFIED VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            {departments.map((dept, index) => {
              const plan = studentPlan[dept.id];
              const res = validationResults[dept.id];
              const hasOverlap = isDeployed && res.overlappingWith.length > 0;
              const hasDeficit = isDeployed && res.capacityDeficit > 0;
              const isBoundaryErr = isDeployed && !res.isBoundaryValid;
              const isSelected = selectedDeptId === dept.id;
              const recommendedCidr = getRecommendedCidr(dept.hostsNeeded);
              const suggestedNextIp = getNextFreeSubnet(index);

              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-5 rounded-[28px] border transition-all duration-200 cursor-pointer ${
                    hasOverlap
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                      : hasDeficit
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : isSelected
                      ? 'bg-[var(--bg-card)] border-neutral-400 dark:border-white/30 shadow-md ring-1 ring-neutral-400/40 dark:ring-white/20'
                      : 'bg-[var(--bg-card)] border-[var(--hairline)] hover:border-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">{dept.category}</span>
                        <span className="text-[var(--text-muted)]">•</span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">Needs {dept.hostsNeeded} Hosts</span>
                      </div>
                      <h4 className="text-base font-semibold text-[var(--text-primary)] tracking-tight mt-0.5">{dept.name}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={plan.cidr}
                        onChange={(e) => updateCidr(dept.id, Number(e.target.value))}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-400 dark:bg-neutral-900 dark:border-white/10 dark:text-white dark:focus:border-white/30 cursor-pointer tabular-nums text-xs font-mono"
                      >
                        {[24, 25, 26, 27, 28, 29, 30].map((c) => (
                          <option key={c} value={c} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
                            /{c} ({Math.pow(2, 32 - c) - 2} hosts)
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={plan.subnetId}
                        onChange={(e) => updateSubnetId(dept.id, e.target.value)}
                        placeholder="10.10.x.x"
                        className="w-32 px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 focus:outline-none focus:border-neutral-400 dark:bg-neutral-900 dark:border-white/10 dark:text-white dark:focus:border-white/30 tabular-nums text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Quick Helper Links */}
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-muted)] pt-1">
                    {plan.cidr !== recommendedCidr && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCidr(dept.id, recommendedCidr);
                        }}
                        className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:underline cursor-pointer"
                      >
                        💡 Recommended: /{recommendedCidr}
                      </button>
                    )}
                    {plan.subnetId !== suggestedNextIp && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSubnetId(dept.id, suggestedNextIp);
                        }}
                        className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:underline cursor-pointer"
                      >
                        👉 Auto-Align: {suggestedNextIp}
                      </button>
                    )}
                  </div>

                  {isDeployed && (
                    <div className="mt-3 pt-3 border-t border-[var(--hairline-subtle)] space-y-1.5 text-xs font-mono">
                      {hasOverlap && (
                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-300 flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">Collision: Overlaps with {res.overlappingWith.join(', ')}</span>
                            <span className="text-[11px] text-rose-700 dark:text-rose-300/80">
                              Intersects with {res.overlappingWith.join(', ')} ({plan.subnetId} – {res.broadcast})
                            </span>
                          </div>
                        </div>
                      )}

                      {hasDeficit && (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-500/30 dark:text-amber-300 flex items-center gap-2 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>
                            Capacity Deficit: Needs {dept.hostsNeeded} hosts, mask /{plan.cidr} offers {res.usableHosts} usable hosts.
                          </span>
                        </div>
                      )}

                      {!hasOverlap && !hasDeficit && res.isBoundaryValid && (
                        <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px]">
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid Allocation ({res.usableHosts} hosts)
                          </span>
                          <span className="text-[var(--text-muted)] tabular-nums">Range: {res.firstUsable} – {res.lastUsable}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Binary Inspector */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="p-6 rounded-[28px] bg-[var(--bg-card)] border border-[var(--hairline)] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-wider">
                  <Binary className="w-4 h-4" />
                  <span>32-Bit Binary Octet Inspector</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] border border-[var(--hairline)] text-[var(--text-muted)]">
                  {selectedDept.name}
                </span>
              </div>

              {binaryData ? (
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex justify-between">
                      <span>IP Address Binary Layout</span>
                      <span className="text-neutral-900 dark:text-white font-semibold">/{binaryData.cidr} Prefix</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] font-mono text-xs tracking-wider space-y-2 tabular-nums">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {binaryData.octets.map((octet, oIdx) => {
                          const startBit = oIdx * 8;
                          return (
                            <div key={oIdx} className="space-y-1">
                              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Octet {oIdx + 1}</span>
                              <div className="text-[11px] font-mono">
                                {octet.split('').map((bit, bIdx) => {
                                  const globalBitIdx = startBit + bIdx;
                                  const isNetworkBit = globalBitIdx < binaryData.cidr;
                                  return (
                                    <span
                                      key={bIdx}
                                      className={`inline-block ${
                                        isNetworkBit ? 'text-neutral-900 dark:text-white font-bold' : 'text-neutral-400 dark:text-neutral-500'
                                      }`}
                                    >
                                      {bit}
                                    </span>
                                  );
                                })}
                              </div>
                              <span className="text-[11px] text-[var(--text-primary)] block font-semibold tabular-nums">
                                {parseInt(octet, 2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-[var(--hairline-subtle)] flex items-center justify-center gap-4 text-[10px] font-mono">
                        <span className="flex items-center gap-1 text-neutral-900 dark:text-white font-medium">
                          <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" /> Network ({binaryData.cidr})
                        </span>
                        <span className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                          <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600" /> Host ({32 - binaryData.cidr})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] font-mono text-xs space-y-2 tabular-nums">
                    <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                      <span className="text-[var(--text-muted)]">Network ID:</span>
                      <span className="text-[var(--text-primary)] font-semibold">{studentPlan[selectedDept.id].subnetId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                      <span className="text-[var(--text-muted)]">First Usable Host:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">{selectedValidation.firstUsable}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                      <span className="text-[var(--text-muted)]">Last Usable Host:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">{selectedValidation.lastUsable}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                      <span className="text-[var(--text-muted)]">Broadcast Address:</span>
                      <span className="text-[var(--text-primary)] font-semibold">{selectedValidation.broadcast}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--text-muted)]">Capacity:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedValidation.usableHosts} Usable Hosts</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export const SubnetPlannerSection = React.memo(SubnetPlannerSectionComponent);
