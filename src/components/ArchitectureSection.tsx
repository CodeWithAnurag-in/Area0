import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Server, Share2, Users, Radio, Binary, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';

const ArchitectureSectionComponent: React.FC = () => {
  const [activeTier, setActiveTier] = useState<number>(0);

  const tiers = [
    {
      name: 'Core Layer',
      area: 'Area 0 (Backbone Transit)',
      badge: 'Backbone Core',
      role: 'High-speed transit backbone connecting distribution routers and server farms.',
      highlight: 'Strict transit only with zero endpoint attachment.',
      specs: [
        'Dedicated /30 P2P transit links (10.10.254.0/24)',
        'Router ID Loopback interfaces (10.10.255.0/24)',
        'Dual ABR uplinks with deterministic Dijkstra metric calculation',
      ],
      icon: Server,
      accent: 'from-neutral-500/10 to-transparent',
      glow: 'rgba(255, 255, 255, 0.14)',
    },
    {
      name: 'Distribution Layer',
      area: 'Area Border Routers (ABRs)',
      badge: 'Boundary Isolation',
      role: 'Traffic boundary between Area 0 and building areas.',
      highlight: 'Summarizes internal subnets into clean /22 Type 3 Summary LSAs.',
      specs: [
        'Area 10 ABR summarizes 10.10.0.0/22 into Area 0',
        'Area 20 ABR summarizes 10.10.4.0/22 into Area 0',
        'Passive-interface edge suppression to prevent rogue OSPF adjacencies',
      ],
      icon: Share2,
      accent: 'from-neutral-500/10 to-transparent',
      glow: 'rgba(255, 255, 255, 0.14)',
    },
    {
      name: 'Access Layer',
      area: 'Area 10 & 20 (Internal VLANs)',
      badge: 'Endpoint Termination',
      role: 'High-density endpoint termination for campus labs, offices, and Wi-Fi.',
      highlight: '802.1Q sub-interfaces providing micro-segmentation.',
      specs: [
        'VLAN 10 Wi-Fi (450 hosts) /23 subnet',
        'VLAN 20 CS Labs (220 hosts) /24 subnet',
        'VLAN 30 IT Labs (110 hosts) /25 subnet',
        'VLAN 40 Faculty (50 hosts) /26 subnet',
      ],
      icon: Users,
      accent: 'from-neutral-500/10 to-transparent',
      glow: 'rgba(255, 255, 255, 0.14)',
    },
  ];

  const contiguousBlocks = [
    {
      area: 'Area 10',
      title: 'Engineering Complex',
      cidr: '10.10.0.0/22',
      mask: '255.255.252.0',
      range: '10.10.0.0 – 10.10.3.255',
      capacity: '1,024 IP Addresses',
      binary: '11111111.11111111.11111100.00000000',
      allocations: [
        { name: 'Campus Wi-Fi', cidr: '10.10.0.0/23', size: '512 IPs' },
        { name: 'CS Laboratory', cidr: '10.10.2.0/24', size: '256 IPs' },
        { name: 'IT Laboratory', cidr: '10.10.3.0/25', size: '128 IPs' },
        { name: 'Faculty Offices', cidr: '10.10.3.128/26', size: '64 IPs' },
        { name: 'Spare Expansion', cidr: '10.10.3.192/26', size: '64 IPs' },
      ],
    },
    {
      area: 'Area 20',
      title: 'Management Complex',
      cidr: '10.10.4.0/22',
      mask: '255.255.252.0',
      range: '10.10.4.0 – 10.10.7.255',
      capacity: '1,024 IP Addresses',
      binary: '11111111.11111111.11111100.00000000',
      allocations: [
        { name: 'Campus Wi-Fi', cidr: '10.10.4.0/23', size: '512 IPs' },
        { name: 'Lecture Classrooms', cidr: '10.10.6.0/24', size: '256 IPs' },
        { name: 'Executive Admin', cidr: '10.10.7.0/25', size: '128 IPs' },
        { name: 'Area 20 Spares', cidr: '10.10.7.128/25', size: '128 IPs' },
      ],
    },
    {
      area: 'Area 0 P2P',
      title: 'Point-to-Point Transit',
      cidr: '10.10.254.0/24',
      mask: '255.255.255.0 (Carved into /30)',
      range: '10.10.254.0 – 10.10.254.255',
      capacity: '64 Point-to-Point Links',
      binary: '11111111.11111111.11111111.11111100 (/30)',
      allocations: [
        { name: 'Core to Eng ABR', cidr: '10.10.254.0/30', size: '2 usable' },
        { name: 'Core to Mgmt ABR', cidr: '10.10.254.4/30', size: '2 usable' },
        { name: 'Future ABR Uplinks', cidr: '10.10.254.8/30', size: 'Reserved' },
      ],
    },
    {
      area: 'Loopbacks',
      title: 'Router Loopback IDs',
      cidr: '10.10.255.0/24',
      mask: '255.255.255.255 (/32 Host Routes)',
      range: '10.10.255.0 – 10.10.255.255',
      capacity: '256 Stable Router IDs',
      binary: '11111111.11111111.11111111.11111111 (/32)',
      allocations: [
        { name: 'Core Router 1 ID', cidr: '10.10.255.1/32', size: 'Loopback 0' },
        { name: 'Engineering ABR ID', cidr: '10.10.255.2/32', size: 'Loopback 0' },
        { name: 'Management ABR ID', cidr: '10.10.255.3/32', size: 'Loopback 0' },
      ],
    },
  ];

  return (
    <section id="architecture" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-16">
        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-mono text-xs tracking-[0.25em] uppercase mb-3">
          <Binary className="w-3.5 h-3.5" />
          <span>Pro Architecture</span>
        </div>
        <h3 className="text-3xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight text-[var(--text-primary)]">
          Engineered for deterministic scale.
        </h3>
      </div>

      {/* A. 3-Tier Hierarchy Bento Grid */}
      <div className="mb-24">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
            A. 3-Tier Campus Hierarchy
          </h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            const isSelected = activeTier === idx;
            return (
              <motion.div
                key={idx}
                onClick={() => setActiveTier(idx)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-[28px] p-7 sm:p-8 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden shadow-[var(--pro-card-shadow)] ${
                  isSelected
                    ? 'bg-[var(--bg-card)] border-neutral-400 dark:border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                    : 'bg-[var(--bg-card)] border-[var(--hairline)] hover:border-[var(--pro-card-hover-border)]'
                }`}
              >
                {/* Ambient Top Glow */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
                    isSelected ? 'opacity-20 bg-neutral-400 dark:bg-white' : 'opacity-0'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--hairline)] flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--hairline)] text-[var(--text-secondary)]">
                      {tier.badge}
                    </span>
                  </div>

                  <div className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-1">
                    {tier.area}
                  </div>
                  <h5 className="text-2xl font-heading font-semibold text-[var(--text-primary)] tracking-tight mb-3">
                    {tier.name}
                  </h5>

                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                    {tier.role}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] text-xs text-[var(--text-secondary)] leading-normal mb-6">
                    {tier.highlight}
                  </div>
                </div>

                <div className="border-t border-[var(--hairline-subtle)] pt-4 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">Key Implementation</div>
                  {tier.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <CornerDownRight className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* B. Area-Level Contiguous Block Allocation */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
              B. Area-Level Contiguous Block Allocation
            </h4>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Deterministic CIDR boundaries enabling single-line OSPF area range summarization.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contiguousBlocks.map((block, idx) => (
            <div
              key={idx}
              className="rounded-[28px] p-7 bg-[var(--bg-card)] border border-[var(--hairline)] hover:border-[var(--pro-card-hover-border)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-medium">
                    {block.area}
                  </span>
                  <h5 className="text-xl font-heading font-semibold text-[var(--text-primary)] tracking-tight mt-0.5">
                    {block.title}
                  </h5>
                </div>
                <div className="text-right">
                  <span className="text-base sm:text-lg font-medium tracking-tight bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-white/5 dark:border-white/10 dark:text-white/90 px-2.5 py-1 rounded-lg tabular-nums">
                    {block.cidr}
                  </span>
                </div>
              </div>

              {/* Subnet Metadata */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] font-mono text-xs mb-5">
                <div>
                  <div className="text-[10px] uppercase text-[var(--text-muted)]">Address Bounds</div>
                  <div className="text-[var(--text-secondary)] font-medium tabular-nums">{block.range}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[var(--text-muted)]">Capacity & Mask</div>
                  <div className="text-neutral-900 dark:text-neutral-100 font-medium tabular-nums">{block.capacity}</div>
                </div>
              </div>

              {/* Binary Mask Visualization */}
              <div className="mb-5">
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1 flex justify-between">
                  <span>Binary Mask Layout</span>
                  <span className="text-neutral-900 dark:text-neutral-100 font-medium tabular-nums">{block.mask}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--code-bg)] border border-[var(--hairline-subtle)] font-mono text-[11px] tracking-widest text-[var(--text-secondary)] overflow-x-auto tabular-nums">
                  {block.binary.split('.').map((octet, oIdx) => (
                    <span key={oIdx} className={octet === '00000000' ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100 font-medium'}>
                      {octet}{oIdx < 3 ? '.' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Internal Subnet Carveouts */}
              <div className="space-y-1.5 border-t border-[var(--hairline-subtle)] pt-4">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Carved Allocations
                </div>
                {block.allocations.map((alloc, aIdx) => (
                  <div
                    key={aIdx}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-200" />
                      <span className="text-[var(--text-secondary)] font-medium">{alloc.name}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">{alloc.cidr}</span>
                      <span className="text-[var(--text-muted)] text-[11px] w-20 text-right">{alloc.size}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ArchitectureSection = React.memo(ArchitectureSectionComponent);
