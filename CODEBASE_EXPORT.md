# Codebase Export: Streamlined Menu, Typography Upgrade & Comprehensive Gist of Learnings

## index.html
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\index.html

`html
<!doctype html>
<html lang="en" class="dark scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2338bdf8'><circle cx='12' cy='12' r='10' stroke='%2338bdf8' stroke-width='2' fill='none'/><path d='M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VLSM & Multi-Area OSPF | Virtual Lab Pro</title>
    <!-- Google Fonts: Plus Jakarta Sans, Space Grotesk, & Fira Code -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Google Material Symbols -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  </head>
  <body class="bg-[#000000] text-[#f5f5f7] font-sans antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

`

---

## src/index.css
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\src\index.css

`css
@import "tailwindcss";

@layer base {
  :root {
    --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
    --font-display: 'Space Grotesk', 'Plus Jakarta Sans', -apple-system, sans-serif;
    --font-mono: 'Fira Code', 'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  html {
    color-scheme: dark;
    background-color: #000000;
    scroll-behavior: smooth;
    scroll-snap-type: y proximity;
  }

  body {
    font-family: var(--font-sans);
    background-color: #000000;
    color: #f5f5f7;
    letter-spacing: -0.012em;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, .font-display {
    font-family: var(--font-display);
    letter-spacing: -0.025em;
  }

  code, pre, .font-mono {
    font-family: var(--font-mono);
  }
}


/* Snap anchor on Section 2 to stop overscroll past starting text */
#aim {
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  scroll-margin-top: 60px;
}

/* Apple Pro Matte Dark Finish & Glass Utilities */
.pro-glass {
  background: rgba(10, 10, 14, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.pro-glass-card {
  background: rgba(10, 10, 14, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.pro-glass-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 30px -10px rgba(56, 189, 248, 0.12);
}

.pro-hairline {
  border-color: rgba(255, 255, 255, 0.08);
}

/* Custom subtle scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #000000;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

`

---

## src/App.tsx
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\src\App.tsx

`tsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useScroll, useSpring, motion, AnimatePresence } from 'motion/react';
import { Scene } from './components/Scene';
import { HUD } from './components/HUD';
import { Navigation } from './components/Navigation';
import { AimSection } from './components/AimSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { SpecTableSection } from './components/SpecTableSection';
import { TerminalCard } from './components/TerminalCard';
import { PreTestSection } from './components/PreTestSection';
import { SubnetPlannerSection } from './components/SubnetPlannerSection';
import { OspfAdjacencySection } from './components/OspfAdjacencySection';
import { PostTestSection } from './components/PostTestSection';

import { ConclusionSection } from './components/ConclusionSection';
import { LiquidButton } from '@/components/ui/liquid-glass-button';


export default function App() {
  const containerRef = useRef<HTMLDivElement>(null!);
  
  // Track scroll with responsive, snappy yet smooth spring physics
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 38,
    damping: 30,
    restDelta: 0.0001
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return smoothProgress.on("change", (v) => setProgress(v));
  }, [smoothProgress]);

  const enterLabDirectly = () => {
    const aimEl = document.getElementById('aim');
    if (aimEl) {
      aimEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Zoom stops at 0.65.
  // The first section fades in smoothly from 0.65 and completes by 0.92!
  const fadeProgress = Math.min(1, Math.max(0, (progress - 0.65) / 0.27));

  // Visual layer opacities
  const canvasOpacity = Math.max(0, 1 - fadeProgress * 1.15);
  const hudOpacity = Math.max(0, 1 - (progress - 0.58) * 3.8);
  const solidBlackOpacity = fadeProgress;

  // Snappy yet smooth fade parameters for the first section of the website
  const sectionOpacity = fadeProgress;
  const sectionBlur = (1 - fadeProgress) * 8;
  const sectionTranslateY = (1 - fadeProgress) * 24;

  return (
    <div className="relative w-full bg-[#000000] select-none overflow-x-hidden min-h-screen">
      {/* Calibrated 180vh scroll track: provides the perfect snappy balance between zoom pace and travel */}
      <div ref={containerRef} id="hero" className="h-[180vh] w-full relative" />

      {/* Subtle Studio Radial Specular Lighting behind Earth & Hero */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.06) 0%, rgba(37, 99, 235, 0.03) 35%, transparent 70%)',
          opacity: canvasOpacity,
          willChange: 'opacity',
        }}
      />

      {/* Primary 3D Visualization Layer */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          opacity: canvasOpacity,
          willChange: 'opacity',
          transition: progress >= 0.95 ? 'opacity 0.2s ease' : 'none',
        }}
      >
        <Canvas 
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance",
          }} 
          onCreated={({ gl }) => {
            gl.setClearColor('#000000', 1);
          }}
          camera={{ position: [0, 0, 8], fov: 35 }}
          dpr={[1, 2]} 
        >
          <Scene progress={progress} />
        </Canvas>
      </div>

      {/* Terminal UI Layer */}
      <div 
        className="fixed inset-0 z-20 pointer-events-none"
        style={{ 
          opacity: hudOpacity,
          willChange: 'opacity',
        }}
      >
        <HUD progress={progress} />
      </div>

      {/* Introductory Handshake */}
      <AnimatePresence mode="wait">
        {progress < 0.02 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center">
                <span className="material-symbols-outlined text-white text-4xl animate-pulse">public</span>
              </div>
              <h2 className="text-white text-xl font-light tracking-[0.5em] uppercase mb-1">Binary_Earth</h2>
              <div className="h-[1px] w-16 bg-white/20 mx-auto mb-4" />
              <p className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em] mb-4">
                Scroll to initiate transit
              </p>
              <div className="flex justify-center">
                <LiquidButton
                  onClick={enterLabDirectly}
                  size="sm"
                  className="px-5 py-2 text-white hover:text-cyan-300 font-mono text-[10px] uppercase tracking-widest cursor-pointer shadow-lg active:scale-95"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Enter Lab Directly</span>
                    <span className="text-cyan-400">↓</span>
                  </span>
                </LiquidButton>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Solid Black Fade Overlay */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ 
          backgroundColor: '#000000',
          opacity: solidBlackOpacity,
          willChange: 'opacity',
        }}
      />

      {/* Global Navigation: Apple Pro Floating Island */}
      <Navigation visible={progress >= 0.75} />

      {/* Main Virtual Laboratory Content:
          Appears with snappy and smooth fade, settling at top with zero overscroll */}
      <main 
        className="relative z-20 bg-black text-white -mt-[100vh] min-h-screen pt-4"
        style={{
          opacity: progress >= 0.95 ? 1 : sectionOpacity,
          filter: progress >= 0.95 ? 'none' : `blur(${sectionBlur}px)`,
          transform: progress >= 0.95 ? 'none' : `translateY(${sectionTranslateY}px)`,
          pointerEvents: progress >= 0.72 ? 'auto' : 'none',
          willChange: 'opacity, filter, transform',
          transition: progress >= 0.95 ? 'none' : 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Section 2: AIM — THE STATEMENT */}
        <AimSection />

        {/* Section 3: ARCHITECTURE & THEORY — "PRO ARCHITECTURE" */}
        <ArchitectureSection />

        {/* Section 3C: TECHNICAL SPECIFICATIONS TABLE */}
        <SpecTableSection />

        {/* Section 3D: CISCO IOS CLI TERMINAL CARD */}
        <TerminalCard />

        {/* Section 4: PRE-TEST (DIAGNOSTIC BENCHMARK) */}
        <PreTestSection />

        {/* Section 4.5: INTERACTIVE VLSM SUBNET PLANNER & OVERLAP VALIDATOR */}
        <SubnetPlannerSection />

        {/* Section 4.6: INTERACTIVE OSPF HELLO & NEIGHBOR ADJACENCY STATE MACHINE */}
        <OspfAdjacencySection />

        {/* Section 5: POST-TEST (MASTERY BENCHMARK) */}
        <PostTestSection />


        {/* Section 6: CONCLUSION — THE BOTTOM LINE & MICRO FOOTER */}
        <ConclusionSection />
      </main>
    </div>
  );
}

`

---

## src/components/Navigation.tsx
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\src\components\Navigation.tsx

`tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Activity, Sliders, Award, Sparkles } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

interface NavigationProps {
  visible: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ visible }) => {
  const [activeSection, setActiveSection] = useState('aim');

  const navItems = [
    { id: 'aim', label: 'Aim', icon: Compass },
    { id: 'diagnostics', label: 'Pre-Test', icon: Activity },
    { id: 'planner', label: 'Simulation', icon: Sliders },
    { id: 'mastery', label: 'Post-Test', icon: Award },
    { id: 'conclusion', label: 'Conclusion', icon: Sparkles },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['aim', 'diagnostics', 'planner', 'mastery', 'conclusion'];




      const scrollPos = window.scrollY + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed top-5 inset-x-0 mx-auto w-fit z-50 px-3 py-2 rounded-full backdrop-blur-2xl bg-[#0a0a0e]/60 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center gap-1.5 md:gap-2"
        >
          {/* Subtle Logo Emblem */}
          <div className="flex items-center gap-2 pl-3 pr-2.5 border-r border-white/[0.08]">
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            </div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/90 font-semibold hidden sm:inline">
              VLab<span className="text-cyan-400 font-light ml-0.5">PRO</span>
            </span>
          </div>

          {/* Navigation Pills */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <LiquidButton
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  size="sm"
                  className={`rounded-full px-3 py-1.5 text-xs transition-all duration-300 flex items-center gap-1.5 font-medium cursor-pointer ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.label.split(' ')[0]}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] pointer-events-none"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    >
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-400 shadow-[0_0_8px_#38bdf8] rounded-full" />
                    </motion.div>
                  )}
                </LiquidButton>
              );
            })}
          </nav>

        </motion.header>
      )}
    </AnimatePresence>
  );
};

`

---

## src/components/ConclusionSection.tsx
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\src\components\ConclusionSection.tsx

`tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUp,
  ShieldCheck,
  Zap,
  Sliders,
  Globe,
  BookOpen,
  CheckCircle2,
  Network,
  Cpu,
  Layers,
  Sparkles,
  Award,
  Terminal,
  FileCheck,
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export const ConclusionSection: React.FC = () => {
  const returnToOrbit = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
  });

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const keyLearnings = [
    {
      number: '01',
      title: 'Zero-Waste VLSM Allocation',
      category: 'IPv4 Addressing Precision',
      desc: 'Order host requirements strictly descending by size. By assigning blocks to the nearest power of 2 (2ⁿ - 2 ≥ Hosts), we eradicated address waste while conserving over 75% of the 10.10.0.0/16 address space for future college expansion.',
      formula: 'Hosts = 2^(32 - CIDR) - 2',
      icon: Sliders,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      number: '02',
      title: '3-Tier Campus Hierarchy',
      category: 'Topological Architecture',
      desc: 'Structured the network into Core (Backbone Transit in Area 0), Distribution (ABR boundary summarization), and Access (Department VLANs). This architectural hierarchy isolates local broadcast storms and establishes predictable data flows.',
      formula: 'Core (Area 0) ⇄ Distribution (ABR) ⇄ Access (VLANs)',
      icon: Layers,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      number: '03',
      title: 'Multi-Area OSPFv2 Summarization',
      category: 'Routing Scalability',
      desc: 'Engineered contiguous /22 blocks per building. Area Border Routers (ABRs) compress internal subnets into a single Type-3 Summary LSA (10.10.0.0/22 for Area 10, 10.10.4.0/22 for Area 20), shrinking core routing tables by over 80%.',
      formula: 'area 10 range 10.10.0.0 255.255.252.0',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      number: '04',
      title: 'SPF Recalculation Shielding',
      category: 'Backbone Stability',
      desc: 'Local link flaps (e.g., student unplugging a cable in the CS Lab) only regenerate Type-1 and Type-2 LSAs within Area 10. The Core Router in Area 0 remains completely unaffected, preventing catastrophic network-wide SPF recalculation storms.',
      formula: 'Local Flap → Contained in Area 10 → 0 Core Impact',
      icon: Zap,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      number: '05',
      title: 'OSPF Adjacency State Machine',
      category: 'Protocol Mechanics',
      desc: 'Demystified the 7-state packet exchange (Down → Init → 2-Way → ExStart → Exchange → Loading → Full). Master/Slave election ensures reliable synchronization, while DBD summary headers save bandwidth before requesting full LSUs.',
      formula: 'Hellos (Multicast 224.0.0.5) → DBD → LSR/LSU → Full',
      icon: Network,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      number: '06',
      title: 'Edge Hardening & Transit Speed',
      category: 'Production Optimization',
      desc: 'Configured passive-interface default to halt rogue adjacencies and protect CPU cycles on user ports. Simultaneously deployed ip ospf network point-to-point on router-to-router /30 links, eliminating DR/BDR election delay.',
      formula: 'passive-interface default + ip ospf network point-to-point',
      icon: Terminal,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  const studentChecklist = [
    { text: 'I understand how descending host order prevents address overlap and fragmentation.', mastered: true },
    { text: 'I can calculate usable hosts and subnet boundaries using power-of-2 mathematics.', mastered: true },
    { text: 'I know how ABR route summarization confines Dijkstra SPF calculations to local areas.', mastered: true },
    { text: 'I can explain the difference between Down, Init, 2-Way, ExStart, Exchange, Loading, and Full.', mastered: true },
    { text: 'I know why point-to-point /30 links bypass DR/BDR election overhead and wait timers.', mastered: true },
    { text: 'I understand how passive-interface commands harden edge access switch ports against attacks.', mastered: true },
  ];

  return (
    <footer id="conclusion" className="relative pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08] scroll-mt-20">
      {/* High-Contrast Summary Card with Muted Gridlines */}
      <div className="relative rounded-[32px] p-8 sm:p-14 bg-[#0a0a0e]/60 backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-2xl mb-16">
        {/* Muted Gridline Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Ambient Specular Center Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Conclusion & Retrospective</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
              Gist of What We Learned
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              A comprehensive distillation of the enterprise engineering principles mastered in this laboratory. From binary VLSM allocation math to OSPFv2 multi-area convergence dynamics.
            </p>
          </div>

          {/* 6 Core Takeaway Modules Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {keyLearnings.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-black/60 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-zinc-500 font-semibold tracking-widest">
                        TAKEAWAY {item.number}
                      </span>
                      <div className={`w-9 h-9 rounded-xl ${item.bgColor} flex items-center justify-center ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-white font-semibold text-lg tracking-tight mb-2 group-hover:text-cyan-200 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
                      {item.desc}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5 font-mono text-[11px] text-zinc-300 truncate">
                    <span className="text-zinc-500 mr-1.5">$</span>
                    <span>{item.formula}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Knowledge Checklist Plaque */}
          <div className="rounded-2xl p-6 sm:p-8 bg-black/40 border border-white/[0.08] mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white tracking-tight">
                    Student Knowledge Self-Assessment
                  </h4>
                  <span className="text-xs text-zinc-400 font-sans">
                    Click each item to verify your grasp of core networking competencies
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
                {Object.values(checkedItems).filter(Boolean).length} of {studentChecklist.length} Competencies Mastered
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studentChecklist.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-200'
                        : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/15'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-emerald-400 border-emerald-400 text-black'
                          : 'border-zinc-600 bg-black/40'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="leading-relaxed font-sans">{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Apple-Style Micro-Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5 text-xs text-zinc-500 font-mono">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span>Enterprise Virtual Lab (VLab) • Autonomous Campus Architecture</span>
          <span className="hidden sm:inline">•</span>
          <span>RFC 2328 OSPFv2 & RFC 1878 VLSM Specification</span>
        </div>

        {/* Return to Orbit Button */}
        <LiquidButton
          onClick={returnToOrbit}
          size="sm"
          className="text-zinc-200 hover:text-white font-mono text-xs px-4 py-2 cursor-pointer shadow-lg group"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Return to Orbit</span>
            <ArrowUp className="w-3.5 h-3.5 text-zinc-400 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </LiquidButton>
      </div>
    </footer>
  );
};

`

---

## src/components/OspfAdjacencySection.tsx
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\src\components\OspfAdjacencySection.tsx

`tsx
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

export const OspfAdjacencySection: React.FC = () => {
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
      packetType: 'None (Silence on wire)',
      packetDirection: 'NONE',
      multicastIp: '—',
      analogy: 'Silence before the first knock on the door.',
      headline: 'Initial State: No OSPF packets received',
      description:
        'The OSPF routing process is enabled on both interfaces, but no Hello packets have been exchanged yet. Neither router is aware of its neighbor across the link.',
      studentTip:
        'Exam Tip: If a router stays permanently in DOWN state, check physical layer connectivity, mismatched subnets on the link, or an interface in shutdown status.',
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
      analogy: "R1 knocks and says: 'Hello! My name is 10.10.255.1.'",
      headline: 'R1 Transmits Hello Packet via Multicast',
      description:
        'R1 sends an OSPF Hello packet to multicast address 224.0.0.5 containing its Router ID (10.10.255.1). R2 receives it and places R1 into INIT state because R2 does not see its own Router ID in the packet yet.',
      studentTip:
        'Exam Tip: Routers will only transition to INIT if Area ID, Subnet Mask, Hello/Dead timers, and Authentication match exactly.',
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
      packetType: 'OSPF Hello (Type 1) with Neighbor List',
      packetDirection: 'R2_TO_R1',
      multicastIp: '224.0.0.5 (AllSPFRouters)',
      analogy: "R2 replies: 'Hello 10.10.255.1, I see you! My name is 10.10.255.2.'",
      headline: 'Bidirectional Communication Confirmed',
      description:
        'R2 replies with its own Hello packet, explicitly listing R1’s Router ID (10.10.255.1) in its Active Neighbor table. When R1 receives this, bidirectional communication is proven.',
      studentTip:
        linkType === 'p2p'
          ? 'Point-to-Point Link: DR/BDR election is completely bypassed! The routers move straight forward to form adjacency without delay.'
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
      analogy: "Determining who speaks first: 'Who has the higher Router ID?'",
      headline: 'Master / Slave Relationship & Sequence Negotiation',
      description:
        'Routers decide who controls the database synchronization sequence. Both send empty Database Description (DBD) packets claiming to be Master. The router with the higher Router ID wins. Since 10.10.255.2 > 10.10.255.1, R2 becomes Master and R1 becomes Slave.',
      studentTip:
        'Exam Tip: If routers get stuck in EXSTART, 99% of the time it is due to an MTU mismatch between the two interface endpoints!',
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
      packetType: 'DBD (LSA Summary Headers)',
      packetDirection: 'BIDIRECTIONAL',
      multicastIp: 'Unicast P2P',
      analogy: 'Swapping the table of contents of their routing encyclopedias.',
      headline: 'Exchanging Database Description (DBD) Summaries',
      description:
        'Routers send DBD packets containing LSA (Link State Advertisement) headers. Rather than sending entire routing tables, they only send the summary index so each router can identify which specific routes it is missing.',
      studentTip:
        'Efficiency: By sending only LSA headers first, OSPF saves massive bandwidth compared to legacy protocols like RIP which blindly broadcast full tables.',
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
      packetType: 'LSR (Request) & LSU (Update)',
      packetDirection: 'BIDIRECTIONAL',
      multicastIp: 'Unicast P2P',
      analogy: "R1: 'Send me the full details for 10.10.4.0/22!' R2 sends the full chapter.",
      headline: 'Requesting & Transferring Full Link State Updates',
      description:
        'Based on the DBD lists, routers send Link State Requests (LSR) for missing routes. The neighbor responds with Link State Updates (LSU) containing full network topologies, and the receiver acknowledges with Link State Acknowledgment (LSAck).',
      studentTip:
        'OSPF Reliability: Every single LSU packet must be explicitly acknowledged by an LSAck packet to guarantee 100% database synchronization.',
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
      packetType: 'Keepalive Hellos (Periodic 10s)',
      packetDirection: 'BIDIRECTIONAL',
      multicastIp: '224.0.0.5 (Keepalive)',
      analogy: 'Identical encyclopedias. Both routers have a 100% matching map of the network.',
      headline: 'Adjacency Fully Formed • LSDB Synchronized',
      description:
        'Both routers now have an identical Link State Database (LSDB). Dijkstra’s Shortest Path First (SPF) algorithm executes to compute optimal routes and install them into the IP routing table.',
      studentTip:
        'Goal Achieved: Routers are now fully adjacent! They will continue sending lightweight Hello packets every 10 seconds to maintain the adjacency heartbeat.',
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
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Network className="w-3.5 h-3.5" />
          <span>Interactive Simulation 2: Protocol Dynamics</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
          OSPF Adjacency State Machine
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Demystifying how two enterprise routers progress from <code className="text-zinc-300 font-mono">Down</code> to <code className="text-emerald-400 font-mono">Full</code> state. Step through packet exchanges across point-to-point and broadcast links in real time.
        </p>

        {/* Link Type Selector & Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="p-1 rounded-full bg-[#0a0a0e]/80 border border-white/[0.08] flex items-center gap-1">
            <LiquidButton
              onClick={() => setLinkType('p2p')}
              size="sm"
              className={`rounded-full px-3.5 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                linkType === 'p2p'
                  ? 'text-cyan-300 font-semibold bg-cyan-500/20 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Point-to-Point (/30 Link)</span>
            </LiquidButton>
            <LiquidButton
              onClick={() => setLinkType('broadcast')}
              size="sm"
              className={`rounded-full px-3.5 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                linkType === 'broadcast'
                  ? 'text-cyan-300 font-semibold bg-cyan-500/20 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Broadcast Multi-Access</span>
            </LiquidButton>
          </div>

          <LiquidButton
            onClick={() => setShowPacketInspector(!showPacketInspector)}
            size="sm"
            className="rounded-full px-3.5 py-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showPacketInspector ? 'Hide Packet Inspector' : 'Show Packet Inspector'}</span>
            </div>
          </LiquidButton>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative rounded-[32px] p-6 sm:p-10 bg-[#0a0a0e]/60 backdrop-blur-2xl border border-white/[0.08] shadow-2xl mb-8 overflow-hidden">
        {/* State Badge & Headline Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
              {currentStep.badge}
            </span>
            <span className="text-zinc-500 text-xs font-mono">•</span>
            <span className="text-zinc-300 font-mono text-xs uppercase tracking-wider">
              State: <strong className="text-white font-semibold">{currentStep.name}</strong>
            </span>
          </div>

          {/* Analogy Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="italic">{currentStep.analogy}</span>
          </div>
        </div>

        {/* 2-Router Animated Diagram */}
        <div className="relative py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 my-2">
          {/* Router 1 Card */}
          <div className="w-full md:w-72 rounded-2xl p-6 bg-black/60 border border-white/[0.08] relative overflow-hidden transition-all duration-300 hover:border-white/20">
            {/* Top scanning accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ${
                currentStep.id === 'FULL'
                  ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                  : currentStep.id === 'DOWN'
                  ? 'bg-zinc-700'
                  : 'bg-cyan-400 shadow-[0_0_12px_#38bdf8]'
              }`}
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0a0a0e] border border-white/10 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Router 1 (R₁)</h4>
                  <span className="text-[10px] font-mono text-zinc-400">Core-GW-01</span>
                </div>
              </div>

              {/* Status Dot */}
              <span
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep.id === 'FULL'
                    ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse'
                    : currentStep.id === 'DOWN'
                    ? 'bg-zinc-600'
                    : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse'
                }`}
              />
            </div>

            {/* Router Specs */}
            <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/5">
              <div className="flex justify-between text-zinc-400">
                <span>Router ID:</span>
                <span className="text-white font-semibold">10.10.255.1</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>IP Address:</span>
                <span className="text-zinc-300">10.10.254.1/30</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Interface:</span>
                <span className="text-zinc-300">Gi0/0/0</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">OSPF State:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    currentStep.id === 'FULL'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : currentStep.id === 'DOWN'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono text-zinc-300">
                <Cable className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {linkType === 'p2p' ? 'Point-to-Point Gigabit Transit (Area 0)' : 'Broadcast Ethernet Segment (Area 0)'}
                </span>
              </span>
            </div>

            {/* Wire Line with Gradient */}
            <div className="relative w-full h-12 flex items-center justify-center">
              {/* Wire Base */}
              <div className="absolute inset-x-0 h-[3px] bg-zinc-800 rounded-full" />
              {/* Wire Active Glow */}
              <div
                className={`absolute inset-x-0 h-[3px] rounded-full transition-all duration-500 ${
                  currentStep.id === 'FULL'
                    ? 'bg-emerald-400/80 shadow-[0_0_15px_#34d399]'
                    : currentStep.id === 'DOWN'
                    ? 'bg-zinc-700'
                    : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 shadow-[0_0_15px_#38bdf8]'
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
                    className={`z-20 px-3.5 py-1.5 rounded-full border text-xs font-mono font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-default ${
                      currentStep.id === 'FULL'
                        ? 'bg-emerald-950/80 border-emerald-400/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-cyan-950/80 border-cyan-400/60 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                    }`}
                  >
                    <Radio className="w-3 h-3 animate-spin text-cyan-300" />
                    <span>{currentStep.packetType.split('(')[0]}</span>
                    {currentStep.packetDirection === 'R1_TO_R2' && <ArrowRight className="w-3.5 h-3.5" />}
                    {currentStep.packetDirection === 'R2_TO_R1' && <ArrowLeft className="w-3.5 h-3.5" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transmission Meta */}
            <div className="mt-3 text-center">
              <span className="text-[11px] font-mono text-zinc-500">
                Destination: <strong className="text-zinc-300 font-semibold">{currentStep.multicastIp}</strong>
              </span>
            </div>
          </div>

          {/* Router 2 Card */}
          <div className="w-full md:w-72 rounded-2xl p-6 bg-black/60 border border-white/[0.08] relative overflow-hidden transition-all duration-300 hover:border-white/20">
            {/* Top scanning accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ${
                currentStep.id === 'FULL'
                  ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
                  : currentStep.id === 'DOWN'
                  ? 'bg-zinc-700'
                  : 'bg-blue-400 shadow-[0_0_12px_#60a5fa]'
              }`}
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#0a0a0e] border border-white/10 flex items-center justify-center text-blue-400 shadow-inner">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Router 2 (R₂)</h4>
                  <span className="text-[10px] font-mono text-zinc-400">Eng-ABR-01</span>
                </div>
              </div>

              {/* Status Dot */}
              <span
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentStep.id === 'FULL'
                    ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse'
                    : currentStep.id === 'DOWN'
                    ? 'bg-zinc-600'
                    : 'bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse'
                }`}
              />
            </div>

            {/* Router Specs */}
            <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/5">
              <div className="flex justify-between text-zinc-400">
                <span>Router ID:</span>
                <span className="text-white font-semibold">10.10.255.2</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>IP Address:</span>
                <span className="text-zinc-300">10.10.254.2/30</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Interface:</span>
                <span className="text-zinc-300">Gi0/0/0</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">OSPF State:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    currentStep.id === 'FULL'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : currentStep.id === 'DOWN'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  {currentStep.r2State}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step Explanation Card */}
        <div className="mt-8 rounded-2xl p-6 bg-black/40 border border-white/[0.08]">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                {currentStep.headline}
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                {currentStep.description}
              </p>
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 text-xs font-mono flex items-start gap-2 mt-3">
                <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <span>{currentStep.studentTip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Packet Inspector & Cisco CLI Verification */}
        {showPacketInspector && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Packet Header Inspector */}
            <div className="lg:col-span-7 rounded-2xl p-5 bg-black/50 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Wire Packet Inspector
                </span>
                <span className="text-[10px] text-zinc-500">RFC 2328 Header</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Packet Type</span>
                  <span className="text-cyan-300 font-semibold">{currentStep.packetDetails.type}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Source IP</span>
                  <span className="text-zinc-300">{currentStep.packetDetails.sourceIp}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Dest IP</span>
                  <span className="text-zinc-300">{currentStep.packetDetails.destIp}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">OSPF Version</span>
                  <span className="text-zinc-300">v{currentStep.packetDetails.version}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Area ID</span>
                  <span className="text-zinc-300">{currentStep.packetDetails.areaId}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Sequence / Flags</span>
                  <span className="text-amber-300 font-semibold">{currentStep.packetDetails.flags || 'Default'}</span>
                </div>
              </div>

              <div className="mt-2.5 p-2.5 rounded-lg bg-zinc-950 border border-white/5 text-xs font-mono text-zinc-300">
                <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">Payload Content:</span>
                <span>{currentStep.packetDetails.payloadSummary}</span>
              </div>
            </div>

            {/* Cisco IOS Terminal Neighbor State */}
            <div className="lg:col-span-5 rounded-2xl p-5 bg-black/50 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-zinc-400">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    Cisco IOS Telemetry
                  </span>
                  <span className="text-[10px] text-zinc-500">Live Console</span>
                </div>

                <pre className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 text-[11px] font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                  {currentStep.ciscoOutput}
                </pre>
              </div>

              <div className="pt-3 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                <span>Dead Timer: 40s</span>
                <span>Hello Timer: 10s</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Timeline & Step Controls Bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
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
                      ? 'bg-cyan-500/20 border border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : isPast
                      ? 'bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400'
                      : 'bg-zinc-950/40 border border-white/5 hover:border-white/15 text-zinc-500'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center font-bold ${
                      isCurrent
                        ? 'bg-cyan-400 text-black shadow-[0_0_8px_#38bdf8]'
                        : isPast
                        ? 'bg-emerald-400/30 text-emerald-300'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isPast ? '✓' : index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-medium truncate max-w-full ${
                      isCurrent ? 'text-white' : isPast ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Timeline Range Slider */}
          <div className="mb-6 px-1.5 py-3 rounded-2xl bg-black/40 border border-white/5">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2 px-1">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive Timeline Slider:</span>
              </span>
              <span className="text-cyan-300 font-semibold">
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
              className="w-full h-2.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/10 transition-all hover:bg-zinc-800"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1.5 px-0.5">
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
              <LiquidButton
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                size="sm"
                className="rounded-full px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </div>
              </LiquidButton>

              <LiquidButton
                onClick={() => setIsPlaying(!isPlaying)}
                size="sm"
                className="rounded-full px-4 py-2 text-xs font-mono text-cyan-300 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pause Auto-Step</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
                      <span>Auto-Play</span>
                    </>
                  )}
                </div>
              </LiquidButton>

              <LiquidButton
                onClick={handleReset}
                size="sm"
                className="rounded-full px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                title="Reset simulation to Down state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </LiquidButton>
            </div>

            {/* Primary Action Button: Step Next */}
            <div className="w-full sm:w-auto">
              {currentStepIndex < steps.length - 1 ? (
                <LiquidButton
                  onClick={handleNext}
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-8 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 hover:text-white cursor-pointer shadow-[0_0_25px_rgba(56,189,248,0.35)]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Step Next: {steps[currentStepIndex + 1].name}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </div>
                </LiquidButton>
              ) : (
                <LiquidButton
                  onClick={handleReset}
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-8 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-300 hover:text-white cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Adjacency Complete • Replay</span>
                  </div>
                </LiquidButton>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

`

---

## src/components/SubnetPlannerSection.tsx
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\src\components\SubnetPlannerSection.tsx

`tsx
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

export const SubnetPlannerSection: React.FC = () => {
  // Exactly 5 campus departments requested: CS Lab, IT Lab, SVU Library, Admin, College's Core GW
  const departments: DepartmentRequirement[] = useMemo(
    () => [
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
        explanation: 'Largest host requirement (220 hosts). Requires 2^8 - 2 = 254 usable hosts (/24 prefix).',
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
        explanation: 'Second largest requirement (110 hosts). Requires 2^7 - 2 = 126 usable hosts (/25 prefix).',
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
        explanation: 'Student e-library terminals (50 hosts). Requires 2^6 - 2 = 62 usable hosts (/26 prefix).',
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
        explanation: 'Accounts and administrative staff (25 hosts). Requires 2^5 - 2 = 30 usable hosts (/27 prefix).',
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
        explanation: 'Point-to-point link between Distribution ABR and Core Gateway router (2 hosts). Requires /30 prefix.',
      },
    ],
    []
  );

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

  // Validation Engine
  const validationResults: Record<string, ValidationResult> = useMemo(() => {
    const results: Record<string, ValidationResult> = {};
    const subnetsParsed: { id: string; start: number; end: number; isValid: boolean }[] = [];

    departments.forEach((d) => {
      const entry = studentPlan[d.id];
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
  }, [studentPlan, departments]);

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
    <section id="planner" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Background Specular Flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-600/10 via-cyan-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive VLSM Simulation</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-2">
            Campus Subnet Planner & Validator
          </h3>
          <p className="text-zinc-400 text-base max-w-2xl leading-relaxed">
            Design the zero-waste addressing plan for your 5 college networks: CS Lab, IT Lab, SVU Library, Admin, and Core GW.
          </p>
        </div>

        {/* View Switcher & Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="p-1 rounded-full bg-[#0a0a0e]/80 border border-white/10 flex items-center gap-1">
            <LiquidButton
              onClick={() => {
                setViewMode('guided');
                setSelectedDeptId(departments[currentStepIndex].id);
              }}
              size="sm"
              className={`rounded-full px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                viewMode === 'guided'
                  ? 'text-cyan-300 font-semibold bg-cyan-500/20 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Step-by-Step</span>
            </LiquidButton>
            <LiquidButton
              onClick={() => setViewMode('all')}
              size="sm"
              className={`rounded-full px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'text-cyan-300 font-semibold bg-cyan-500/20 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>All 5 Subnets</span>
            </LiquidButton>
          </div>

          <LiquidButton
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            size="sm"
            className="rounded-full px-3.5 py-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cheatsheet</span>
            </div>
          </LiquidButton>

          <LiquidButton
            onClick={loadBlueprint}
            size="sm"
            className="rounded-full px-3.5 py-1.5 text-xs font-mono text-white hover:text-cyan-300 transition-all cursor-pointer"
            title="Auto-fill the mathematically optimal plan"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Blueprint</span>
            </div>
          </LiquidButton>

          <LiquidButton
            onClick={simulateOverlapError}
            size="sm"
            variant="destructive"
            className="rounded-full px-3.5 py-1.5 text-xs font-mono text-rose-300 transition-all cursor-pointer"
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
            className="rounded-full px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-all cursor-pointer"
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
            className="mb-8 overflow-hidden rounded-[24px] bg-[#0a0a0e]/80 border border-cyan-500/30 p-6 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <Info className="w-4 h-4" />
                <span>VLSM Subnetting Cheat Sheet (Powers of 2: 2ⁿ - 2)</span>
              </div>
              <button
                onClick={() => setShowCheatsheet(false)}
                className="text-xs font-mono text-zinc-500 hover:text-white cursor-pointer"
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
                <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/[0.08] space-y-1">
                  <div className="text-cyan-400 font-bold text-sm">{row.cidr}</div>
                  <div className="text-[10px] text-zinc-400">{row.mask}</div>
                  <div className="text-white font-semibold text-xs mt-1">{row.usable} hosts</div>
                  <div className="text-[10px] text-emerald-400">{row.fit}</div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-sans text-zinc-400 text-center">
              💡 <strong>Golden Rule:</strong> Always assign subnets in descending order of host requirements (largest to smallest) to eliminate address fragmentation.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deployment & Metrics Banner */}
      <div className="p-6 rounded-[28px] bg-[#0a0a0e]/60 border border-white/[0.08] backdrop-blur-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Hosts Required</span>
            <span className="text-white text-base font-semibold">{summaryMetrics.totalNeeded} hosts</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
          <div>
            <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Allocated Block</span>
            <span className="text-cyan-400 text-base font-semibold font-mono">{summaryMetrics.totalAllocated} IPs</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
          <div>
            <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Efficiency</span>
            <span className={`text-base font-semibold ${summaryMetrics.efficiency >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {summaryMetrics.efficiency.toFixed(1)}% Optimal
            </span>
          </div>
          {isDeployed && (
            <>
              <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
              <div>
                <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Health Audit</span>
                {summaryMetrics.isFlawless ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 0 CONFLICTS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> {summaryMetrics.overlapCount} COLLISION(S)
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <LiquidButton
          onClick={handleDeploy}
          size="lg"
          className="w-full md:w-auto font-mono text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-full text-cyan-300 hover:text-white cursor-pointer shadow-[0_0_25px_rgba(56,189,248,0.35)]"
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-current text-cyan-400" />
            <span>Deploy Subnet Plan</span>
          </div>
        </LiquidButton>
      </div>



      {/* Formal Infrastructure Verification & Accreditation Seal */}
      <AnimatePresence>
        {isDeployed && summaryMetrics.isFlawless && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 p-6 sm:p-7 rounded-[26px] bg-gradient-to-r from-emerald-950/30 via-zinc-950/90 to-cyan-950/20 border border-emerald-500/40 backdrop-blur-2xl shadow-[0_0_35px_rgba(16,185,129,0.12)] relative overflow-hidden"
          >
            {/* Top scanning hairline indicator */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                {/* Official Concentric Seal Emblem */}
                <div className="relative w-13 h-13 rounded-2xl bg-zinc-900 border-2 border-emerald-400/50 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <div className="absolute inset-1 rounded-xl border border-dashed border-emerald-400/40" />
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] tracking-widest uppercase font-semibold">
                      Formal Audit Passed
                    </span>
                    <span className="text-zinc-500 text-xs">•</span>
                    <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                      SVU Campus Core
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                    Infrastructure Addressing Certified
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-0.5 max-w-2xl leading-relaxed">
                    Zero address overlaps detected across all 5 networks (CS Lab, IT Lab, SVU Library, Admin, and Core GW). Contiguous descending VLSM boundaries mathematically verified.
                  </p>
                </div>
              </div>

              {/* Cryptographic Checksum Pill */}
              <div className="px-4 py-3 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs space-y-1 shrink-0 self-stretch md:self-auto text-left md:text-right">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Audit Attestation ID</div>
                <div className="text-emerald-400 font-bold tracking-wider">{auditCertId || 'SVU-NET-2026-ARCH'}</div>
                <div className="text-[10px] text-zinc-400">Status: <span className="text-white font-medium">Production Approved</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proportional Visual Memory Map */}
      <div className="mb-10 rounded-[28px] p-6 bg-[#0a0a0e]/60 border border-white/[0.08] backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold uppercase tracking-wider">Visual Memory Map — 10.10.0.0/23 College Campus Space</span>
          </div>
          <span className="text-zinc-500 text-[11px]">Click any block to inspect binary layout</span>
        </div>

        {/* Visual Bar representation */}
        <div className="h-16 w-full rounded-2xl bg-black/80 border border-white/[0.08] p-1.5 flex gap-1.5 overflow-x-auto items-stretch select-none">
          {departments.map((d, index) => {
            const res = validationResults[d.id];
            const hasOverlap = res.overlappingWith.length > 0;
            const hasDeficit = res.capacityDeficit > 0;
            const isSelected = (viewMode === 'guided' ? departments[currentStepIndex].id : selectedDeptId) === d.id;

            // Proportional flex based on total addresses
            const flexGrow = Math.max(1, Math.round(res.totalAddresses / 4));

            let blockColor = 'bg-zinc-800/80 text-zinc-300 border-white/10';
            if (isDeployed) {
              if (hasOverlap) {
                blockColor = 'bg-rose-950/80 text-rose-200 border-rose-500/60 animate-pulse';
              } else if (hasDeficit) {
                blockColor = 'bg-amber-950/80 text-amber-200 border-amber-500/60';
              } else {
                blockColor = 'bg-cyan-950/60 text-cyan-200 border-cyan-500/40 hover:bg-cyan-900/60';
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
                className={`rounded-xl px-3 py-1.5 text-left border text-[11px] font-mono transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative ${blockColor} ${
                  isSelected ? 'ring-2 ring-white shadow-lg' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold truncate">{d.shortName}</span>
                  <span className="text-[10px] opacity-80 font-bold">/{studentPlan[d.id].cidr}</span>
                </div>
                <div className="text-[10px] truncate text-zinc-400 font-mono">
                  {studentPlan[d.id].subnetId}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500/40 border border-cyan-400" /> Optimal Subnet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/40 border border-rose-400" /> Overlap Collision
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-400" /> Capacity Deficit
            </span>
          </div>
          <span className="text-zinc-500 text-[10px]">Total Space: 512 IPs (10.10.0.0 – 10.10.1.255)</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {viewMode === 'guided' ? (
        /* STEP-BY-STEP GUIDED ASSISTANT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {/* Step Progress Stepper */}
            <div className="p-4 rounded-2xl bg-[#0a0a0e]/60 border border-white/[0.08] flex items-center justify-between gap-2 overflow-x-auto">
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer shrink-0 ${
                      isCurrent
                        ? 'bg-cyan-400 text-black font-semibold'
                        : isDone
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
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
                <div className="p-7 rounded-[28px] bg-[#0a0a0e]/70 border border-white/[0.08] backdrop-blur-2xl shadow-2xl space-y-6">
                  {/* Department Title & Host Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{dept.category}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-xs font-mono text-zinc-400">Step {currentStepIndex + 1} of 5</span>
                        </div>
                        <h4 className="text-2xl font-semibold text-white tracking-tight mt-0.5">{dept.name}</h4>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-right">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Host Requirement</span>
                      <span className="text-lg font-mono font-bold text-white">{dept.hostsNeeded} hosts</span>
                    </div>
                  </div>

                  {/* Educational Context & Math */}
                  <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1">
                    <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5" /> Subnetting Guideline
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">{dept.explanation}</p>
                  </div>

                  {/* Input Form Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Control 1: Prefix / CIDR Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">1. Select CIDR Prefix</label>
                        {plan.cidr !== recommendedCidr && (
                          <button
                            onClick={() => updateCidr(dept.id, recommendedCidr)}
                            className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Wand2 className="w-3 h-3" /> Auto-Set /{recommendedCidr}
                          </button>
                        )}
                      </div>

                      <select
                        value={plan.cidr}
                        onChange={(e) => updateCidr(dept.id, Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        {[24, 25, 26, 27, 28, 29, 30].map((c) => {
                          const usable = Math.pow(2, 32 - c) - 2;
                          const isRec = c === recommendedCidr;
                          return (
                            <option key={c} value={c} className="bg-zinc-900 text-white">
                              /{c} ({usable} usable hosts) {isRec ? '★ Recommended' : ''}
                            </option>
                          );
                        })}
                      </select>

                      <div className="text-[11px] font-mono text-zinc-500">
                        Provides <span className="text-white font-semibold">{res.usableHosts} usable hosts</span> (Mask: {res.mask})
                      </div>
                    </div>

                    {/* Control 2: Subnet ID Address */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">2. Subnet ID (Network)</label>
                        {plan.subnetId !== suggestedNextIp && (
                          <button
                            onClick={() => updateSubnetId(dept.id, suggestedNextIp)}
                            className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                      />

                      <div className="text-[11px] font-mono text-zinc-500">
                        Broadcast: <span className="text-zinc-300">{res.broadcast}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback / Validation Alert for this Department */}
                  {isDeployed && (
                    <div className="pt-2">
                      {hasOverlap && (
                        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2.5 font-mono text-xs">
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">Collision Alert: Overlapping Address Space</span>
                            <span className="text-[11px] text-rose-300/80">
                              This block collides with {res.overlappingWith.join(', ')}. Recommended start IP is{' '}
                              <strong className="text-white underline cursor-pointer" onClick={() => updateSubnetId(dept.id, suggestedNextIp)}>
                                {suggestedNextIp}
                              </strong>.
                            </span>
                          </div>
                        </div>
                      )}

                      {hasDeficit && (
                        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-start gap-2.5 font-mono text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">Capacity Deficit: Insufficient Host Addresses</span>
                            <span className="text-[11px] text-amber-300/80">
                              Requires {dept.hostsNeeded} hosts, but /{plan.cidr} only offers {res.usableHosts} usable addresses.
                              Select{' '}
                              <strong className="text-white underline cursor-pointer" onClick={() => updateCidr(dept.id, recommendedCidr)}>
                                /{recommendedCidr}
                              </strong>{' '}
                              to fit all devices.
                            </span>
                          </div>
                        </div>
                      )}

                      {isBoundaryErr && (
                        <div className="p-3 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-yellow-300 flex items-center gap-2 font-mono text-xs">
                          <Info className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                          <span>Invalid Boundary: Address {plan.subnetId} is not an integer multiple of block size {res.totalAddresses}.</span>
                        </div>
                      )}

                      {!hasOverlap && !hasDeficit && res.isBoundaryValid && (
                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between font-mono text-xs">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Perfectly Sized Subnet
                          </span>
                          <span className="text-zinc-400 text-[11px]">Range: {res.firstUsable} – {res.lastUsable}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step Navigation Controls */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <LiquidButton
                      onClick={() => {
                        const prevIdx = Math.max(0, currentStepIndex - 1);
                        setCurrentStepIndex(prevIdx);
                        setSelectedDeptId(departments[prevIdx].id);
                      }}
                      disabled={currentStepIndex === 0}
                      size="sm"
                      className="rounded-xl px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </div>
                    </LiquidButton>

                    {currentStepIndex < departments.length - 1 ? (
                      <LiquidButton
                        onClick={() => {
                          const nextIdx = currentStepIndex + 1;
                          setCurrentStepIndex(nextIdx);
                          setSelectedDeptId(departments[nextIdx].id);
                        }}
                        size="sm"
                        className="rounded-xl px-5 py-2 text-xs font-mono font-semibold text-cyan-300 hover:text-white cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2">
                          <span>Next Step</span>
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                      </LiquidButton>
                    ) : (
                      <LiquidButton
                        onClick={handleDeploy}
                        size="sm"
                        className="rounded-xl px-6 py-2 text-xs font-mono font-semibold text-emerald-300 hover:text-white cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        <div className="flex items-center gap-2">
                          <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                          <span>Deploy & Audit</span>
                        </div>
                      </LiquidButton>
                    )}
                  </div>

                </div>
              );
            })()}
          </div>

          {/* Right Column: 32-Bit Binary Octet Inspector */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="p-6 rounded-[28px] bg-[#0a0a0e]/70 border border-white/[0.08] backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                  <Binary className="w-4 h-4" />
                  <span>32-Bit Octet Inspector</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                  {activeDepartment.shortName}
                </span>
              </div>

              {binaryData ? (
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Binary IP Structure</span>
                      <span className="text-cyan-400">/{binaryData.cidr} Prefix</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs tracking-wider space-y-2">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {binaryData.octets.map((octet, oIdx) => {
                          const startBit = oIdx * 8;
                          return (
                            <div key={oIdx} className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase block">Octet {oIdx + 1}</span>
                              <div className="text-[11px] font-mono">
                                {octet.split('').map((bit, bIdx) => {
                                  const globalBitIdx = startBit + bIdx;
                                  const isNetworkBit = globalBitIdx < binaryData.cidr;
                                  return (
                                    <span
                                      key={bIdx}
                                      className={`inline-block ${
                                        isNetworkBit ? 'text-cyan-400 font-bold' : 'text-emerald-400'
                                      }`}
                                    >
                                      {bit}
                                    </span>
                                  );
                                })}
                              </div>
                              <span className="text-[11px] text-zinc-300 block font-semibold">
                                {parseInt(octet, 2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] font-mono">
                        <span className="flex items-center gap-1 text-cyan-400">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Network ({binaryData.cidr})
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Host ({32 - binaryData.cidr})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Subnet Mask</span>
                      <span className="text-zinc-300 font-medium">{selectedValidation.mask}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] grid grid-cols-4 gap-2 text-center text-zinc-400">
                      {binaryData.maskOctets.map((mOct, mIdx) => (
                        <div key={mIdx}>
                          <div className="text-[10px] text-zinc-500">Octet {mIdx + 1}</div>
                          <div className="text-zinc-300 font-mono tracking-wider">{mOct}</div>
                          <div className="text-xs text-white font-semibold">{parseInt(mOct, 2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-500">Subnet Network ID:</span>
                      <span className="text-white font-semibold">{studentPlan[activeDepartment.id].subnetId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-500">First Usable Host:</span>
                      <span className="text-cyan-300">{selectedValidation.firstUsable}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-500">Last Usable Host:</span>
                      <span className="text-cyan-300">{selectedValidation.lastUsable}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-500">Broadcast Address:</span>
                      <span className="text-white font-semibold">{selectedValidation.broadcast}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">Usable Hosts:</span>
                      <span className="text-emerald-400 font-semibold">{selectedValidation.usableHosts} Addresses</span>
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
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
              <span className="uppercase tracking-wider">All 5 Campus Networks</span>
              <span>CIDR & Subnet ID Input</span>
            </div>

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
                  className={`p-5 rounded-[22px] border transition-all duration-200 cursor-pointer ${
                    hasOverlap
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                      : hasDeficit
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : isSelected
                      ? 'bg-zinc-900/90 border-cyan-500/40 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                      : 'bg-[#0a0a0e]/60 border border-white/[0.08] backdrop-blur-2xl hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{dept.category}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs font-mono text-zinc-400">Needs {dept.hostsNeeded} Hosts</span>
                      </div>
                      <h4 className="text-base font-semibold text-white tracking-tight mt-0.5">{dept.name}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={plan.cidr}
                        onChange={(e) => updateCidr(dept.id, Number(e.target.value))}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        {[24, 25, 26, 27, 28, 29, 30].map((c) => (
                          <option key={c} value={c} className="bg-zinc-900 text-white">
                            /{c} ({Math.pow(2, 32 - c) - 2} hosts)
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={plan.subnetId}
                        onChange={(e) => updateSubnetId(dept.id, e.target.value)}
                        placeholder="10.10.x.x"
                        className="w-32 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Quick Helper Links */}
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 pt-1">
                    {plan.cidr !== recommendedCidr && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCidr(dept.id, recommendedCidr);
                        }}
                        className="text-cyan-400 hover:underline cursor-pointer"
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
                        className="text-cyan-400 hover:underline cursor-pointer"
                      >
                        👉 Auto-Align: {suggestedNextIp}
                      </button>
                    )}
                  </div>

                  {isDeployed && (
                    <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs font-mono">
                      {hasOverlap && (
                        <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">Conflict: Overlapping Address Space</span>
                            <span className="text-[11px] text-rose-300/80">
                              Intersects with {res.overlappingWith.join(', ')} ({plan.subnetId} – {res.broadcast})
                            </span>
                          </div>
                        </div>
                      )}

                      {hasDeficit && (
                        <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-2 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>
                            Capacity Deficit: Needs {dept.hostsNeeded}, mask /{plan.cidr} only offers {res.usableHosts} usable hosts.
                          </span>
                        </div>
                      )}

                      {!hasOverlap && !hasDeficit && res.isBoundaryValid && (
                        <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid Allocation ({res.usableHosts} usable hosts)
                          </span>
                          <span className="text-zinc-500">Range: {res.firstUsable} – {res.lastUsable}</span>
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
            <div className="p-6 rounded-[28px] bg-[#0a0a0e]/70 border border-white/[0.08] backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                  <Binary className="w-4 h-4" />
                  <span>32-Bit Binary Octet Inspector</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                  {selectedDept.name}
                </span>
              </div>

              {binaryData ? (
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex justify-between">
                      <span>IP Address Binary Layout</span>
                      <span className="text-cyan-400">/{binaryData.cidr} Prefix</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs tracking-wider space-y-2">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {binaryData.octets.map((octet, oIdx) => {
                          const startBit = oIdx * 8;
                          return (
                            <div key={oIdx} className="space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase block">Octet {oIdx + 1}</span>
                              <div className="text-[11px] font-mono">
                                {octet.split('').map((bit, bIdx) => {
                                  const globalBitIdx = startBit + bIdx;
                                  const isNetworkBit = globalBitIdx < binaryData.cidr;
                                  return (
                                    <span
                                      key={bIdx}
                                      className={`inline-block ${
                                        isNetworkBit ? 'text-cyan-400 font-bold' : 'text-emerald-400'
                                      }`}
                                    >
                                      {bit}
                                    </span>
                                  );
                                })}
                              </div>
                              <span className="text-[11px] text-zinc-300 block font-semibold">
                                {parseInt(octet, 2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] font-mono">
                        <span className="flex items-center gap-1 text-cyan-400">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Network ({binaryData.cidr})
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Host ({32 - binaryData.cidr})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-500">Network ID:</span>
                      <span className="text-white font-semibold">{studentPlan[selectedDept.id].subnetId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-500">First Usable Host:</span>
                      <span className="text-cyan-300">{selectedValidation.firstUsable}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-500">Last Usable Host:</span>
                      <span className="text-cyan-300">{selectedValidation.lastUsable}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-500">Broadcast Address:</span>
                      <span className="text-white font-semibold">{selectedValidation.broadcast}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">Capacity:</span>
                      <span className="text-emerald-400 font-semibold">{selectedValidation.usableHosts} Usable Hosts</span>
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

`

---

## src/components/PreTestSection.tsx
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\src\components\PreTestSection.tsx

`tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { SpeedometerGauge } from './SpeedometerGauge';
import { LiquidButton } from '@/components/ui/liquid-glass-button';


interface Question {
  id: number;
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PreTestSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: 'What is the default subnet mask and total IP address count in a standard /24 network?',
      context: 'Fundamental IPv4 CIDR boundary definition.',
      options: [
        '255.255.255.0 with 256 total IP addresses (254 usable hosts)',
        '255.255.0.0 with 65,536 total IP addresses (65,534 usable hosts)',
        '255.255.255.128 with 128 total IP addresses (126 usable hosts)',
        '255.255.255.240 with 16 total IP addresses (14 usable hosts)',
      ],
      correctIndex: 0,
      explanation: 'A /24 network has 24 network bits and 8 host bits. Total addresses = 2⁸ = 256. Subnet mask is 255.255.255.0.',
    },
    {
      id: 2,
      question: 'What is the fundamental architectural topology requirement for all non-backbone OSPF areas?',
      context: 'OSPF multi-area design specification (RFC 2328).',
      options: [
        'All non-backbone areas must directly connect physically or virtually to Area 0 (Backbone)',
        'Non-backbone areas must connect in a daisy-chain ring with each adjacent area',
        'Non-backbone areas can only route packets via static default routes',
        'Non-backbone areas must deploy twice as many routers as the backbone area',
      ],
      correctIndex: 0,
      explanation: 'In multi-area OSPF, Area 0 serves as the hub. All non-backbone areas (e.g., Area 10, Area 20) must attach directly to Area 0 via an Area Border Router (ABR) to prevent inter-area routing loops.',
    },
    {
      id: 3,
      question: 'Which formula calculates the number of usable host addresses given h host bits?',
      context: 'Subnet sizing and host calculation.',
      options: [
        '2ʰ - 2 (subtracting the network ID and the broadcast address)',
        '2ʰ (all bit combinations are usable for endpoints)',
        '2ʰ⁻¹ - 1 (deducting the gateway and multicast channels)',
        '2ʰ + 2 (including loopback and VIP offsets)',
      ],
      correctIndex: 0,
      explanation: 'Given h host bits, 2ʰ total addresses exist. We must subtract 2: all 0s in the host field represents the Network ID, and all 1s represents the Directed Broadcast.',
    },
    {
      id: 4,
      question: 'What is the equivalent wildcard mask for the subnet mask 255.255.255.192 (/26)?',
      context: 'Cisco IOS OSPF network statement matching.',
      options: [
        '0.0.0.63 (calculated by subtracting 255.255.255.192 from 255.255.255.255)',
        '0.0.0.127 (matching a /25 boundary)',
        '0.0.0.31 (matching a /27 boundary)',
        '0.0.0.255 (matching a /24 boundary)',
      ],
      correctIndex: 0,
      explanation: 'Wildcard masks invert subnet masks. 255 - 255 = 0, 255 - 255 = 0, 255 - 255 = 0, and 255 - 192 = 63, yielding 0.0.0.63.',
    },
  ];

  const handleSelect = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: (correct / questions.length) * 100,
    };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const scoreData = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <section id="diagnostics" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Section 4: Diagnostic Benchmark</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-2">
            Pre-Test Assessment
          </h3>
          <p className="text-zinc-400 text-base max-w-xl">
            Evaluate your prerequisite knowledge of binary IPv4 subnetting and OSPF multi-area topological constraints.
          </p>
        </div>

        {isSubmitted && (
          <LiquidButton
            onClick={handleReset}
            size="sm"
            className="rounded-full px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer w-fit"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic</span>
            </div>
          </LiquidButton>
        )}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 4 Diagnostic Questions */}
        <div className="lg:col-span-8 space-y-6">
          {questions.map((q, idx) => {
            const selected = selectedAnswers[q.id];
            const isCorrect = selected === q.correctIndex;

            return (
              <div
                key={q.id}
                className="rounded-[24px] p-6 sm:p-8 bg-[#0a0a0e]/60 border border-white/[0.08] backdrop-blur-2xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-cyan-400 font-medium uppercase tracking-wider">
                    Question 0{idx + 1}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Incorrect
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-medium text-white mb-2 leading-snug">
                  {q.question}
                </h4>
                {q.context && (
                  <p className="text-xs text-zinc-500 font-mono mb-4">{q.context}</p>
                )}

                {/* Options */}
                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    let optionStyle = 'bg-zinc-900/60 border-white/5 text-zinc-300 hover:border-white/20';

                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium';
                      } else if (isOptionSelected && !isCorrect) {
                        optionStyle = 'bg-rose-950/40 border-rose-500/40 text-rose-300';
                      } else {
                        optionStyle = 'bg-zinc-900/30 border-white/5 text-zinc-500 opacity-60';
                      }
                    } else if (isOptionSelected) {
                      optionStyle = 'bg-cyan-950/50 border-cyan-500/50 text-white font-medium shadow-[0_0_15px_rgba(56,189,248,0.15)]';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current/30 shrink-0 flex items-center justify-center font-mono text-xs mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Drawer if Submitted */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-400 font-mono leading-relaxed"
                  >
                    <span className="text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
                      Technical Rationale:
                    </span>
                    {q.explanation}
                  </motion.div>
                )}
              </div>
            );
          })}

          {!isSubmitted && (
            <div className="flex justify-end pt-2">
              <LiquidButton
                onClick={handleSubmit}
                disabled={!allAnswered}
                size="lg"
                className={`rounded-full px-8 py-3.5 text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  allAnswered
                    ? 'text-cyan-300 hover:text-white shadow-[0_0_25px_rgba(56,189,248,0.35)] cursor-pointer'
                    : 'text-zinc-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Submit Diagnostic Benchmark</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>
              </LiquidButton>
            </div>
          )}

        </div>

        {/* Right Column: Speedometer Gauge */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <SpeedometerGauge
            score={isSubmitted ? scoreData.percentage : 0}
            totalQuestions={questions.length}
            correctCount={isSubmitted ? scoreData.correct : 0}
            label="Pre-Test Dial"
            statusRating={
              isSubmitted
                ? scoreData.percentage === 100
                  ? 'DIAGNOSTIC PERFECT'
                  : scoreData.percentage >= 75
                  ? 'STRONG FOUNDATION'
                  : 'RECOMMEND REVIEW'
                : 'PENDING SUBMISSION'
            }
          />

          <div className="p-6 rounded-[24px] bg-[#0a0a0e]/60 border border-white/[0.08] backdrop-blur-2xl text-xs space-y-3 font-mono text-zinc-400">
            <div className="text-white font-medium uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Benchmark Criteria
            </div>
            <p className="text-zinc-500 leading-normal font-sans">
              Demonstrating 75%+ on this diagnostic proves mastery of binary host math, network boundaries, and OSPF backbone area coupling.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span>Answered: {Object.keys(selectedAnswers).length}/4</span>
              <span className="text-cyan-400">Target: ≥ 75%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

`

---

## src/components/PostTestSection.tsx
C:\Users\Anurag\.gemini\antigravity\scratch\vlsm-vlab\src\components\PostTestSection.tsx

`tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, ChevronDown, ChevronUp, Sparkles, BookOpen, BadgeCheck, ShieldCheck } from 'lucide-react';
import { SpeedometerGauge } from './SpeedometerGauge';
import { LiquidButton } from '@/components/ui/liquid-glass-button';


interface PostQuestion {
  id: number;
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  ciscoCommand?: string;
}

export const PostTestSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedDrawers, setExpandedDrawers] = useState<Record<number, boolean>>({});

  const questions: PostQuestion[] = [
    {
      id: 1,
      question: 'Which summarized CIDR route must be configured on the Area 20 ABR to encompass all building subnets across 10.10.4.0 through 10.10.7.255?',
      scenario: 'Area 20 contains Wi-Fi (/23), Classrooms (/24), and Executive Admin (/25) spanning 4 contiguous Class C blocks.',
      options: [
        '10.10.4.0/22 (Mask: 255.255.252.0, aggregating 1,024 addresses into a single Type 3 LSA)',
        '10.10.0.0/21 (Supernet that inadvertently encapsulates Area 10, causing blackholes)',
        '10.10.4.0/24 (Under-summarized prefix that ignores Classrooms and Admin subnets)',
        '10.10.4.0/20 (Over-summarized mask spanning 4,096 addresses, causing route collision)',
      ],
      correctIndex: 0,
      rationale: 'Area 20 subnets span 10.10.4.0 through 10.10.7.255, which is exactly 4 contiguous /24 blocks (4 × 256 = 1,024 addresses). The block size of 4 in the 3rd octet requires 2 borrowed host bits from /24, resulting in a /22 mask (255.255.252.0). Cisco syntax: area 20 range 10.10.4.0 255.255.252.0.',
      ciscoCommand: 'area 20 range 10.10.4.0 255.255.252.0',
    },
    {
      id: 2,
      question: 'How many usable host IP addresses are yielded respectively by a /25 subnet versus a /26 subnet?',
      scenario: 'Designing the departmental subnets for IT Laboratory (110 hosts) and Faculty (50 hosts).',
      options: [
        '/25 provides 126 usable hosts (2⁷ - 2), while /26 provides 62 usable hosts (2⁶ - 2)',
        '/25 provides 128 usable hosts, while /26 provides 64 usable hosts',
        '/25 provides 254 usable hosts, while /26 provides 126 usable hosts',
        '/25 provides 62 usable hosts, while /26 provides 30 usable hosts',
      ],
      correctIndex: 0,
      rationale: 'A /25 leaves 7 host bits (32 - 25 = 7), giving 2⁷ - 2 = 126 usable hosts, perfect for IT Lab (110 needed). A /26 leaves 6 host bits (32 - 26 = 6), giving 2⁶ - 2 = 62 usable hosts, perfect for Faculty (50 needed).',
      ciscoCommand: 'interface GigabitEthernet0/0/1.30 -> ip address 10.10.3.1 255.255.255.128',
    },
    {
      id: 3,
      question: 'What is the critical security and efficiency rationale for configuring "passive-interface" on user-facing switch ports?',
      scenario: 'Deploying GigabitEthernet0/0/1.10 serving 450 campus Wi-Fi mobile clients.',
      options: [
        'Suppresses OSPF Hello multicasts to protect CPU & prevent rogue routers from forming unauthorized adjacencies, while still advertising the subnet into OSPF',
        'Completely disables layer 3 forwarding and drops all client IPv4 unicast packets',
        'Converts the sub-interface into an unmanaged dot1q trunk carrying all campus VLANs',
        'Forces the router to flood Type 5 External LSAs out to client smartphones',
      ],
      correctIndex: 0,
      rationale: 'End-user access segments contain zero routers. Emitting OSPF Hellos (224.0.0.5) wastes CPU/bandwidth and invites malicious rogue routers to inject bogus LSA routes. "passive-interface" stops hello packet generation on the interface while preserving the route advertisement in the OSPF database.',
      ciscoCommand: 'router ospf 1\n passive-interface GigabitEthernet0/0/1.10',
    },
    {
      id: 4,
      question: 'What architectural advantage is unlocked by declaring "ip ospf network point-to-point" on inter-router /30 transit links?',
      scenario: 'Establishing dual uplink links between Core Router and Engineering ABR over GigabitEthernet0/0/0.',
      options: [
        'Eliminates DR/BDR election overhead and wait timers (40s dead interval wait), allowing instantaneous FULL adjacency convergence',
        'Increases Ethernet frame MTU from 1500 bytes to 9216 jumbo bytes',
        'Automatically enables IPSec AES-256 payload encryption across the copper cable',
        'Forces both routers to share identical Loopback Router IDs',
      ],
      correctIndex: 0,
      rationale: 'Ethernet interfaces default to Broadcast network type, requiring Designated Router (DR) and Backup Designated Router (BDR) elections with a 40-second wait timer. On a point-to-point link with only two routers, DR/BDR elections are redundant. Setting point-to-point achieves instant Full adjacency without unnecessary election packets.',
      ciscoCommand: 'interface GigabitEthernet0/0/0\n ip ospf network point-to-point',
    },
  ];

  const handleSelect = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleDrawer = (qId: number) => {
    setExpandedDrawers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const percentage = (correct / questions.length) * 100;

    let status = 'NEEDS REVIEW';
    if (percentage === 100) status = 'PRO ARCHITECT';
    else if (percentage >= 75) status = 'CERTIFIED';
    else if (percentage >= 50) status = 'PRACTITIONER';

    return {
      correct,
      total: questions.length,
      percentage,
      status,
    };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Expand all drawers on submit
    const allExpanded: Record<number, boolean> = {};
    questions.forEach((q) => (allExpanded[q.id] = true));
    setExpandedDrawers(allExpanded);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setExpandedDrawers({});
  };

  const scoreData = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <section id="mastery" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Background Specular Flare */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Section 5: Mastery Benchmark</span>
          </div>
          <h3 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-2">
            Post-Test Campus Mastery
          </h3>
          <p className="text-zinc-400 text-base max-w-xl">
            Validate deployment-grade architecture decisions: /22 supernet summarization, passive interfaces, and point-to-point convergence.
          </p>
        </div>

        {isSubmitted && (
          <LiquidButton
            onClick={handleReset}
            size="sm"
            className="rounded-full px-4 py-2 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer w-fit"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Mastery Exam</span>
            </div>
          </LiquidButton>
        )}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 4 Scenario-Driven Questions */}
        <div className="lg:col-span-8 space-y-6">
          {questions.map((q, idx) => {
            const selected = selectedAnswers[q.id];
            const isCorrect = selected === q.correctIndex;
            const isDrawerOpen = expandedDrawers[q.id];

            return (
              <div
                key={q.id}
                className="rounded-[24px] p-6 sm:p-8 bg-[#0a0a0e]/60 border border-white/[0.08] backdrop-blur-2xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-cyan-400 font-medium uppercase tracking-wider">
                    Mastery Scenario 0{idx + 1}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Incorrect
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-medium text-white mb-2 leading-snug">
                  {q.question}
                </h4>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-zinc-400 font-mono mb-4">
                  <span className="text-zinc-500 uppercase tracking-widest text-[10px] block mb-0.5">Deployment Scenario</span>
                  {q.scenario}
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    let optionStyle = 'bg-zinc-900/60 border-white/5 text-zinc-300 hover:border-white/20';

                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium';
                      } else if (isOptionSelected && !isCorrect) {
                        optionStyle = 'bg-rose-950/40 border-rose-500/40 text-rose-300';
                      } else {
                        optionStyle = 'bg-zinc-900/30 border-white/5 text-zinc-500 opacity-60';
                      }
                    } else if (isOptionSelected) {
                      optionStyle = 'bg-cyan-950/50 border-cyan-500/50 text-white font-medium shadow-[0_0_15px_rgba(56,189,248,0.15)]';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelect(q.id, optIdx)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current/30 shrink-0 flex items-center justify-center font-mono text-xs mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sleek Expandable Drawer Card for Rationale */}
                {isSubmitted && (
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <button
                      onClick={() => toggleDrawer(q.id)}
                      className="flex items-center justify-between w-full text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer py-1"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Technical Rationale & IOS Implementation</span>
                      </span>
                      {isDrawerOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isDrawerOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 p-4 rounded-xl bg-black/50 border border-white/10 space-y-3 font-mono text-xs"
                        >
                          <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                            {q.rationale}
                          </p>

                          {q.ciscoCommand && (
                            <div className="p-3 rounded-lg bg-zinc-950 border border-white/10 text-cyan-300 font-mono text-[11px] overflow-x-auto whitespace-pre">
                              <span className="text-zinc-500 block mb-1"># Verified Cisco IOS CLI Syntax</span>
                              {q.ciscoCommand}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            );
          })}

          {!isSubmitted && (
            <div className="flex justify-end pt-2">
              <LiquidButton
                onClick={handleSubmit}
                disabled={!allAnswered}
                size="lg"
                className={`rounded-full px-8 py-3.5 text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  allAnswered
                    ? 'text-cyan-300 hover:text-white shadow-[0_0_25px_rgba(56,189,248,0.35)] cursor-pointer'
                    : 'text-zinc-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>Submit Post-Test Mastery</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </LiquidButton>
            </div>
          )}

        </div>

        {/* Right Column: Independent Speedometer Gauge + Status Rating */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <SpeedometerGauge
            score={isSubmitted ? scoreData.percentage : 0}
            totalQuestions={questions.length}
            correctCount={isSubmitted ? scoreData.correct : 0}
            label="Mastery Benchmark Dial"
            statusRating={isSubmitted ? scoreData.status : 'UNVERIFIED'}
          />

          {isSubmitted && scoreData.percentage === 100 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-[26px] bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border border-emerald-500/40 text-left space-y-4 backdrop-blur-2xl shadow-[0_0_35px_rgba(16,185,129,0.15)] relative overflow-hidden"
            >
              {/* Top scanning accent rim */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-950/50 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold block">
                    Institutional Attestation
                  </span>
                  <h5 className="text-white font-semibold text-base tracking-tight">
                    Campus Network Architect
                  </h5>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 font-mono text-xs space-y-1.5 text-zinc-300">
                <div className="flex justify-between text-[11px] pb-1 border-b border-white/5">
                  <span className="text-zinc-500">Candidate Status:</span>
                  <span className="text-emerald-400 font-semibold">100% Mastered</span>
                </div>
                <div className="flex justify-between text-[11px] pb-1 border-b border-white/5">
                  <span className="text-zinc-500">Standard:</span>
                  <span className="text-white">OSPFv2 + VLSM</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Attestation ID:</span>
                  <span className="text-cyan-400">SVU-CERT-2026-ARCH</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Formally ratified: Demonstrated comprehensive competence in boundary summarization, zero-waste variable masking, and backbone isolation.
              </p>
            </motion.div>
          )}

          <div className="p-6 rounded-[24px] bg-[#0a0a0e]/60 border border-white/[0.08] backdrop-blur-2xl text-xs space-y-3 font-mono text-zinc-400">
            <div className="text-white font-medium uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Mastery Thresholds
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-cyan-400">100% Score</span>
                <span className="text-white font-semibold">PRO ARCHITECT</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-blue-400">75% Score</span>
                <span className="text-zinc-200">CERTIFIED</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-amber-400">50% Score</span>
                <span className="text-zinc-400">PRACTITIONER</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-rose-400">&lt; 50% Score</span>
                <span className="text-zinc-500">NEEDS REVIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

`

---

