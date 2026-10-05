import React from 'react';
import { motion } from 'motion/react';
import { Network, ShieldCheck, Zap, Cpu } from 'lucide-react';

const AimSectionComponent: React.FC = () => {
  return (
    <section id="aim" className="relative pt-20 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Specular Radial Glow in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-neutral-500/5 via-neutral-400/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Massive Editorial Headline - Crisp, readable in both light and dark modes */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-semibold tracking-tight text-zinc-950 dark:text-white leading-[1.04] mb-12 max-w-5xl"
      >
        Hierarchical routing. <br />
        <span className="text-zinc-600 dark:text-zinc-400 block font-heading font-medium">
          Subnetted to perfection.
        </span>
      </motion.h2>

      {/* Two Editorial Columns */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 pt-8 border-t border-[var(--hairline-subtle)]"
      >
        {/* Column 1: VLSM */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-zinc-950 dark:text-white text-lg font-heading font-semibold tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline)] flex items-center justify-center text-neutral-700 dark:text-neutral-300">
              <Network className="w-4 h-4" />
            </div>
            <span>VLSM Addressing</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-body font-normal text-base md:text-lg">
            Variable Length Subnet Masking (VLSM) partitions the <code className="bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-white/5 dark:border-white/10 dark:text-white/90 font-medium tracking-tight text-sm px-1.5 py-0.5 rounded">10.10.0.0/16</code> supernet by descending host requirements. Zero address waste across campus enclaves.
          </p>
        </div>

        {/* Column 2: Multi-Area OSPF */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-zinc-950 dark:text-white text-lg font-heading font-semibold tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline)] flex items-center justify-center text-neutral-700 dark:text-neutral-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Multi-Area OSPF Summarization</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-body font-normal text-base md:text-lg">
            Multi-area design isolates Dijkstra SPF calculations to local buildings. Area Border Routers (ABRs) summarize contiguous <code className="bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-white/5 dark:border-white/10 dark:text-white/90 font-medium tracking-tight text-sm px-1.5 py-0.5 rounded">/22</code> blocks into Area 0, shielding the backbone from edge flaps.
          </p>
        </div>
      </motion.div>

      {/* Floating Metric Pillars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14"
      >
        {[
          { label: 'Supernet Allocation', value: '10.10.0.0/16', sub: '65,536 Total IPs', icon: Cpu },
          { label: 'Summarized Blocks', value: '2 × /22 Blocks', sub: 'Area 10 & Area 20', icon: Network },
          { label: 'Backbone Flap Shield', value: '100% Isolated', sub: 'Type 3 LSA Summary', icon: ShieldCheck },
          { label: 'Point-to-Point Links', value: '/30 Precision', sub: '2 Usable Hosts / Link', icon: Zap },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-[28px] bg-[var(--bg-card)] border border-[var(--hairline)] shadow-[var(--pro-card-shadow)] relative overflow-hidden group hover:border-[var(--pro-card-hover-border)] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3 text-[var(--text-muted)]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</span>
                <Icon className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:opacity-80 transition-opacity" />
              </div>
              <div className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight font-mono mb-1 tabular-nums">{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)] font-body">{stat.sub}</div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-400/20 dark:via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};

export const AimSection = React.memo(AimSectionComponent);
