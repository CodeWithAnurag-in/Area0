import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Table, Copy, Check, Search, Filter } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';


interface SubnetRow {
  location: string;
  category: 'area10' | 'area20' | 'infra';
  hostsNeeded: string;
  subnetSize: string;
  maskCidr: string;
  subnetId: string;
  usableRange: string;
  broadcast: string;
}

const SpecTableSectionComponent: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'area10' | 'area20' | 'infra'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const subnets: SubnetRow[] = [
    {
      location: 'Area 10: Wi-Fi',
      category: 'area10',
      hostsNeeded: '450',
      subnetSize: '512',
      maskCidr: '/23 (255.255.254.0)',
      subnetId: '10.10.0.0',
      usableRange: '10.10.0.1 – 10.10.1.254',
      broadcast: '10.10.1.255',
    },
    {
      location: 'Area 10: CS Lab',
      category: 'area10',
      hostsNeeded: '220',
      subnetSize: '256',
      maskCidr: '/24 (255.255.255.0)',
      subnetId: '10.10.2.0',
      usableRange: '10.10.2.1 – 10.10.2.254',
      broadcast: '10.10.2.255',
    },
    {
      location: 'Area 10: IT Lab',
      category: 'area10',
      hostsNeeded: '110',
      subnetSize: '128',
      maskCidr: '/25 (255.255.255.128)',
      subnetId: '10.10.3.0',
      usableRange: '10.10.3.1 – 10.10.3.126',
      broadcast: '10.10.3.127',
    },
    {
      location: 'Area 10: Faculty',
      category: 'area10',
      hostsNeeded: '50',
      subnetSize: '64',
      maskCidr: '/26 (255.255.255.192)',
      subnetId: '10.10.3.128',
      usableRange: '10.10.3.129 – 10.10.3.190',
      broadcast: '10.10.3.191',
    },
    {
      location: 'Area 10: Spare',
      category: 'area10',
      hostsNeeded: '—',
      subnetSize: '64',
      maskCidr: '/26 (255.255.255.192)',
      subnetId: '10.10.3.192',
      usableRange: 'Future Expansion',
      broadcast: '10.10.3.255',
    },
    {
      location: 'Area 20: Wi-Fi',
      category: 'area20',
      hostsNeeded: '300',
      subnetSize: '512',
      maskCidr: '/23 (255.255.254.0)',
      subnetId: '10.10.4.0',
      usableRange: '10.10.4.1 – 10.10.5.254',
      broadcast: '10.10.5.255',
    },
    {
      location: 'Area 20: Classrooms',
      category: 'area20',
      hostsNeeded: '200',
      subnetSize: '256',
      maskCidr: '/24 (255.255.255.0)',
      subnetId: '10.10.6.0',
      usableRange: '10.10.6.1 – 10.10.6.254',
      broadcast: '10.10.6.255',
    },
    {
      location: 'Area 20: Admin',
      category: 'area20',
      hostsNeeded: '100',
      subnetSize: '128',
      maskCidr: '/25 (255.255.255.128)',
      subnetId: '10.10.7.0',
      usableRange: '10.10.7.1 – 10.10.7.126',
      broadcast: '10.10.7.127',
    },
    {
      location: 'P2P: Core to Eng ABR',
      category: 'infra',
      hostsNeeded: '2',
      subnetSize: '4',
      maskCidr: '/30 (255.255.255.252)',
      subnetId: '10.10.254.0',
      usableRange: '10.10.254.1 – 10.10.254.2',
      broadcast: '10.10.254.3',
    },
    {
      location: 'P2P: Core to Mgmt ABR',
      category: 'infra',
      hostsNeeded: '2',
      subnetSize: '4',
      maskCidr: '/30 (255.255.255.252)',
      subnetId: '10.10.254.4',
      usableRange: '10.10.254.5 – 10.10.254.6',
      broadcast: '10.10.254.7',
    },
    {
      location: 'Core Router Loopback',
      category: 'infra',
      hostsNeeded: '1',
      subnetSize: '1',
      maskCidr: '/32 (255.255.255.255)',
      subnetId: '10.10.255.1',
      usableRange: '10.10.255.1',
      broadcast: 'N/A',
    },
  ];

  const filteredSubnets = subnets.filter((sub) => {
    const matchesFilter = filter === 'all' || sub.category === filter;
    const matchesSearch =
      search.trim() === '' ||
      sub.location.toLowerCase().includes(search.toLowerCase()) ||
      sub.subnetId.includes(search) ||
      sub.maskCidr.includes(search);
    return matchesFilter && matchesSearch;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section id="spec" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-mono text-xs tracking-[0.25em] uppercase mb-3">
            <Table className="w-3.5 h-3.5" />
            <span>Technical Specifications</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-[var(--text-primary)] mb-2">
            The Subnet Specification
          </h3>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search subnets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[var(--input-bg)] border border-[var(--hairline)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-neutral-400 dark:focus:border-white/30 w-44 font-mono transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--hairline)]">
            {[
              { id: 'all', label: 'All (11)' },
              { id: 'area10', label: 'Area 10' },
              { id: 'area20', label: 'Area 20' },
              { id: 'infra', label: 'P2P / Loop' },
            ].map((tab) => (
              <LiquidButton
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                size="sm"
                className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition-all ${
                  filter === tab.id
                    ? 'text-[var(--text-primary)] font-semibold bg-black/10 dark:bg-white/15'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{tab.label}</span>
              </LiquidButton>
            ))}
          </div>

        </div>
      </div>

      {/* Specifications Table */}
      <div className="rounded-[28px] overflow-hidden border border-[var(--hairline)] bg-[var(--bg-card)] shadow-2xl transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--hairline)] bg-[var(--bg-card-subtle)] font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                <th className="py-4 px-6 font-medium">Subnet</th>
                <th className="py-4 px-4 font-medium text-right">Hosts</th>
                <th className="py-4 px-4 font-medium text-right">Block</th>
                <th className="py-4 px-5 font-medium">CIDR</th>
                <th className="py-4 px-5 font-medium">Subnet ID</th>
                <th className="py-4 px-5 font-medium">Usable Range</th>
                <th className="py-4 px-6 font-medium">Broadcast</th>
                <th className="py-4 px-4 font-medium text-center">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline-subtle)] text-xs font-mono">
              {filteredSubnets.map((sub, idx) => {
                const isCopied = copiedId === sub.subnetId;
                return (
                  <tr
                    key={idx}
                    className="hover:bg-black/[0.025] dark:hover:bg-white/[0.025] transition-colors group"
                  >
                    <td className="py-4 px-6 text-[var(--text-primary)] font-sans font-medium flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          sub.category === 'area10'
                            ? 'bg-neutral-800 dark:bg-white'
                            : sub.category === 'area20'
                            ? 'bg-neutral-500 dark:bg-neutral-400'
                            : 'bg-neutral-300 dark:bg-neutral-600'
                        }`}
                      />
                      <span>{sub.location}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-[var(--text-secondary)] font-mono tabular-nums">
                      {sub.hostsNeeded}
                    </td>
                    <td className="py-4 px-4 text-right text-neutral-900 dark:text-neutral-100 font-semibold tabular-nums">
                      {sub.subnetSize}
                    </td>
                    <td className="py-4 px-5 tabular-nums">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-white/5 dark:border-white/10 dark:text-white/90 font-medium tracking-tight text-xs">
                        {sub.maskCidr}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[var(--text-primary)] font-semibold font-mono tabular-nums">
                      {sub.subnetId}
                    </td>
                    <td className="py-4 px-5 text-[var(--text-secondary)] font-mono tabular-nums">
                      {sub.usableRange}
                    </td>
                    <td className="py-4 px-6 text-[var(--text-muted)] font-mono tabular-nums">
                      {sub.broadcast}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <LiquidButton
                        onClick={() => copyToClipboard(`${sub.subnetId} ${sub.maskCidr}`, sub.subnetId)}
                        title="Copy Subnet & Mask"
                        size="icon"
                        className="p-1.5 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--hairline)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </LiquidButton>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Subnet Meta */}
        <div className="py-3 px-6 bg-[var(--bg-card-subtle)] border-t border-[var(--hairline-subtle)] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[var(--text-muted)] font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-800 dark:bg-white" /> Area 10 (Engineering)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-500 dark:bg-neutral-400" /> Area 20 (Management)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600" /> Infrastructure (P2P & Loop)
            </span>
          </div>
          <span className="tabular-nums">Showing {filteredSubnets.length} of 11 specifications</span>
        </div>
      </div>
    </section>
  );
};

export const SpecTableSection = React.memo(SpecTableSectionComponent);
