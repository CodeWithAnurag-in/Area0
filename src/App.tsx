import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
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
import HeroExperienceWrapper from './components/HeroExperienceWrapper';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Explicitly enforce manual scroll restoration so every page reload starts at the hero bitsphere
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const id1 = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      const id2 = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
      return () => cancelAnimationFrame(id2);
    });

    return () => cancelAnimationFrame(id1);
  }, []);

  return (
    <div className="relative w-full bg-[var(--bg)] text-[var(--text-primary)] select-none min-h-screen">
      {/* Global Navigation: Apple Pro Floating Island (reveals when main site is unlocked) */}
      <Navigation visible={isUnlocked} />

      <HeroExperienceWrapper
        onUnlockChange={setIsUnlocked}
        renderCanvas={(progress, unlock) => (
          <div className="relative w-full h-full">
            {/* Subtle Studio Radial Specular Lighting */}
            <div 
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 35%, transparent 70%)',
              }}
            />

            {/* Primary 3D Visualization Layer */}
            <div 
              className="absolute inset-0 z-0 pointer-events-none"
              style={{ contain: 'paint layout', transform: 'translateZ(0)' }}
            >
              <Canvas 
                frameloop={progress < 0.99 ? "always" : "never"}
                gl={{ 
                  antialias: true, 
                  alpha: true,
                  powerPreference: "high-performance",
                  stencil: false,
                }} 
                onCreated={({ gl }) => {
                  gl.setClearColor('#000000', 1);
                }}
                camera={{ position: [0, 0, 8], fov: 35 }}
                dpr={[1, 1.5]} 
              >
                <Scene animProgress={progress} />
              </Canvas>
            </div>

            {/* Terminal UI Telemetry Layer */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-150"
              style={{ opacity: Math.max(0, 1 - (progress - 0.85) / 0.15) }}
            >
              <HUD animProgress={progress} />
            </div>

            {/* Introductory Handshake Modal */}
            {progress < 0.02 && (
              <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#000000]/90">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <span className="material-symbols-outlined text-white text-4xl animate-pulse">public</span>
                  </div>
                  <h2 className="text-white text-xl font-light tracking-[0.5em] uppercase mb-1">Binary Earth</h2>
                  <div className="h-[1px] w-16 bg-white/20 mx-auto mb-4" />
                  <p className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em] mb-4">
                    Scroll to start
                  </p>
                  <div className="flex justify-center">
                    <LiquidButton
                      onClick={() => unlock?.()}
                      size="sm"
                      className="px-5 py-2 text-white hover:text-white/80 font-mono text-[10px] uppercase tracking-widest cursor-pointer shadow-lg active:scale-95"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Enter Lab</span>
                        <span className="text-white/70">↓</span>
                      </span>
                    </LiquidButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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
      </HeroExperienceWrapper>
    </div>
  );
}
