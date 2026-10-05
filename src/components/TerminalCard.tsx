import React, { useState } from 'react';
import { Copy, Check, Terminal, Play, RotateCcw } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';


export const TerminalCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'verify'>('config');
  const [verifyCommand, setVerifyCommand] = useState('show ip route');

  const fullConfig = `interface Loopback0
 ip address 10.10.255.2 255.255.255.255
!
interface GigabitEthernet0/0/0
 ip address 10.10.254.2 255.255.255.252
 ip ospf network point-to-point
!
interface GigabitEthernet0/0/1.10
 encapsulation dot1Q 10
 ip address 10.10.0.1 255.255.254.0
!
router ospf 1
 router-id 10.10.255.2
 ! Area 10 Summary Route
 area 10 range 10.10.0.0 255.255.252.0
 passive-interface GigabitEthernet0/0/1.10
 network 10.10.254.0 0.0.0.3 area 0
 network 10.10.0.0 0.0.3.255 area 10
 network 10.10.255.2 0.0.0.0 area 0`;

  const copyConfig = () => {
    navigator.clipboard.writeText(fullConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verificationOutputs: Record<string, string> = {
    'show ip route': `Eng-ABR-R1# show ip route
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 

Gateway of last resort is not set

     10.0.0.0/8 is variably subnetted, 8 subnets, 4 masks
O IA    10.10.4.0/22 [110/11] via 10.10.254.1, 00:14:22, GigabitEthernet0/0/0
C       10.10.0.0/23 is directly connected, GigabitEthernet0/0/1.10
L       10.10.0.1/32 is directly connected, GigabitEthernet0/0/1.10
C       10.10.254.0/30 is directly connected, GigabitEthernet0/0/0
L       10.10.254.2/32 is directly connected, GigabitEthernet0/0/0
C       10.10.255.2/32 is directly connected, Loopback0
O       10.10.255.1/32 [110/2] via 10.10.254.1, 00:18:41, GigabitEthernet0/0/0
*Summary route: 10.10.0.0/22 advertised to Area 0 with cost 1`,

    'show ip ospf neighbor': `Eng-ABR-R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
10.10.255.1       0   FULL/  -        00:00:34    10.10.254.1     GigabitEthernet0/0/0

[Note: State is FULL/ - because interface is configured as point-to-point (No DR/BDR election)]`,

    'show ip ospf interface brief': `Eng-ABR-R1# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Lo0          1     0               10.10.255.2/32     1     LOOP  0/0
Gi0/0/0      1     0               10.10.254.2/30     1     P2P   1/1
Gi0/0/1.10   1     10              10.10.0.1/23       1     P/I*  0/0

*P/I indicates PASSIVE INTERFACE (No Hellos emitted, protected user LAN)`,
  };

  const renderHighlightedLine = (line: string, index: number) => {
    if (line.startsWith('!')) {
      return (
        <span key={index} className="text-zinc-500 italic block">
          {line}
        </span>
      );
    }
    if (line.startsWith('interface') || line.startsWith('router ospf')) {
      return (
        <span key={index} className="text-white font-semibold block">
          {line}
        </span>
      );
    }
    if (line.trim().startsWith('ip address')) {
      const parts = line.split(' ');
      return (
        <span key={index} className="block text-neutral-300">
          {'  '}
          <span className="text-white font-semibold">ip address</span>{' '}
          <span className="text-neutral-200 font-medium tabular-nums">{parts[3]}</span>{' '}
          <span className="text-neutral-400 tabular-nums">{parts[4]}</span>
        </span>
      );
    }
    if (line.trim().startsWith('area 10 range')) {
      return (
        <span key={index} className="block text-neutral-300">
          {'  '}
          <span className="text-white font-semibold">area 10 range</span>{' '}
          <span className="text-neutral-200 font-bold tabular-nums">10.10.0.0</span>{' '}
          <span className="text-neutral-400 tabular-nums">255.255.252.0</span>
        </span>
      );
    }
    if (line.trim().startsWith('passive-interface')) {
      return (
        <span key={index} className="block text-neutral-300">
          {'  '}
          <span className="text-neutral-400 font-medium">passive-interface</span>{' '}
          <span className="text-neutral-200">{line.replace('passive-interface', '').trim()}</span>
        </span>
      );
    }
    if (line.trim().startsWith('network')) {
      return (
        <span key={index} className="block text-neutral-300">
          {'  '}
          <span className="text-white font-semibold">network</span>{' '}
          <span className="text-neutral-200 tabular-nums">{line.replace('network', '').trim()}</span>
        </span>
      );
    }
    return (
      <span key={index} className="text-neutral-300 block">
        {line}
      </span>
    );
  };

  return (
    <section className="relative py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="rounded-[28px] overflow-hidden border border-white/10 bg-neutral-950 text-neutral-200 shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-colors duration-200">
        {/* macOS Terminal Title Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-white/10">
          {/* Subtle Traffic Lights at 40% opacity with fine stroke */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]/40 border border-[#ff5f56]/70 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]/40 border border-[#ffbd2e]/70 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]/40 border border-[#27c93f]/70 inline-block shadow-sm" />
            <span className="ml-3 text-xs font-mono text-neutral-400 flex items-center gap-1.5 hidden sm:inline-flex">
              <Terminal className="w-3 h-3 text-neutral-400" />
              Eng-ABR-01 (Cisco IOS)
            </span>
          </div>

          {/* Mode Switcher Tabs & Copy */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
              <LiquidButton
                onClick={() => setActiveTab('config')}
                size="sm"
                className={`rounded-lg px-3 py-1 transition-colors cursor-pointer ${
                  activeTab === 'config'
                    ? 'text-white font-medium bg-white/10'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>IOS Config</span>
              </LiquidButton>
              <LiquidButton
                onClick={() => setActiveTab('verify')}
                size="sm"
                className={`rounded-lg px-3 py-1 transition-colors cursor-pointer ${
                  activeTab === 'verify'
                    ? 'text-white font-medium bg-white/10'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>CLI Verify</span>
              </LiquidButton>
            </div>

            <LiquidButton
              onClick={copyConfig}
              size="sm"
              className="rounded-lg px-3 py-1 text-xs font-mono bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </LiquidButton>
          </div>
        </div>


        {/* Terminal Body */}
        {activeTab === 'config' ? (
          <div className="p-6 md:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-neutral-300">
            <div className="grid grid-cols-[30px_1fr] gap-4">
              {/* Line Numbers */}
              <div className="text-neutral-600 select-none text-right font-mono text-xs leading-relaxed">
                {fullConfig.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              {/* Syntax Highlighting */}
              <div className="space-y-0.5">
                {fullConfig.split('\n').map((line, idx) => renderHighlightedLine(line, idx))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 font-mono text-xs sm:text-sm leading-relaxed">
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-white/5">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-mono">Test Command:</span>
              {['show ip route', 'show ip ospf neighbor', 'show ip ospf interface brief'].map((cmd) => (
                <LiquidButton
                  key={cmd}
                  onClick={() => setVerifyCommand(cmd)}
                  size="sm"
                  className={`rounded-md px-3 py-1 text-xs font-mono transition-all cursor-pointer ${
                    verifyCommand === cmd
                      ? 'border border-white/20 text-white font-semibold bg-white/10'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>{cmd}</span>
                </LiquidButton>
              ))}

            </div>

            <pre className="text-neutral-300 bg-black/60 p-5 rounded-xl border border-white/5 overflow-x-auto whitespace-pre font-mono text-xs sm:text-sm">
              {verificationOutputs[verifyCommand]}
            </pre>
          </div>
        )}

        {/* Terminal Status Bar */}
        <div className="px-6 py-2.5 bg-neutral-950 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> OSPF Process 1 • Full
            </span>
            <span>Area 0 & 10</span>
          </div>
          <span className="text-neutral-600">Cisco IOS 15.7(3)M2</span>
        </div>
      </div>
    </section>
  );
};
