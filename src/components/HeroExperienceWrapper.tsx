"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

interface HeroExperienceProps {
  renderCanvas: (progress: number, unlock?: () => void) => React.ReactNode;
  children: React.ReactNode;
  onUnlockChange?: (unlocked: boolean) => void;
}

export default function HeroExperienceWrapper({
  renderCanvas,
  children,
  onUnlockChange,
}: HeroExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentZoom, setCurrentZoom] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 1. Spring-Damped Scroll Runway (420vh dedicated track)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring physics: eliminates raw wheel jitter and creates silky smooth liquid momentum
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 2. Coordinated Stage Transformations
  // Stage 1: Globe Zoom (0.00 -> 0.65) - Camera penetrates core
  const zoomProgress = useTransform(smoothProgress, [0, 0.65], [0, 1], {
    clamp: true,
  });

  // Stage 2: Canvas Fade (0.58 -> 0.68) - Dissolves before full blackout
  const canvasOpacity = useTransform(smoothProgress, [0, 0.58, 0.68], [1, 1, 0]);

  // Stage 3: Locked-Detent Blackout Void (0.60 -> 0.70 to 0.94 -> 1.0)
  // Massive ~100vh deadband buffer that completely absorbs wheel/trackpad inertia!
  const blackoutOpacity = useTransform(
    smoothProgress,
    [0.60, 0.70, 0.94, 1.0],
    [0, 1, 1, 0]
  );

  const blackoutTextOpacity = useTransform(
    smoothProgress,
    [0.70, 0.75, 0.90, 0.94],
    [0, 1, 1, 0]
  );

  // Stage 4: Main Dashboard Entrance (0.93 -> 1.00)
  const mainOpacity = useTransform(smoothProgress, [0.93, 1.0], [0, 1]);
  const mainScale = useTransform(smoothProgress, [0.93, 1.0], [0.98, 1]);

  // Sync zoom value to Three.js canvas smoothly
  useMotionValueEvent(zoomProgress, "change", (latest) => {
    setCurrentZoom(latest);
  });

  // Sync unlocked state to navigation & callbacks
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const unlocked = latest >= 0.94;
    if (unlocked !== isUnlocked) {
      setIsUnlocked(unlocked);
      onUnlockChange?.(unlocked);
    }
  });

  // Handle direct "Enter Lab" button click
  const enterLabDirectly = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const targetY = window.scrollY + rect.bottom - window.innerHeight;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full bg-black text-white selection:bg-white selection:text-black">
      {/* 1. DEDICATED SPRING-DAMPED SCROLL RUNWAY (420vh) */}
      <div ref={containerRef} className="relative h-[420vh] w-full bg-black">
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* 3D Canvas Layer with Smooth Crossfade */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ opacity: canvasOpacity }}
          >
            {renderCanvas(currentZoom, enterLabDirectly)}
          </motion.div>

          {/* Locked-Detent Blackout Interstitial Screen (Deadband) */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 bg-black flex flex-col items-center justify-end pb-16"
            style={{ opacity: blackoutOpacity }}
          >
            <motion.div
              className="flex flex-col items-center gap-2"
              style={{ opacity: blackoutTextOpacity }}
            >
              <span className="font-mono text-xs tracking-[0.25em] text-zinc-500 uppercase">
                Scroll down to explore architecture
              </span>
              <div className="h-4 w-[1px] bg-zinc-700 animate-bounce" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 2. MAIN WEBSITE CONTENT: Cinematic Curtain Entrance */}
      <motion.main
        id="main-content"
        style={{
          opacity: mainOpacity,
          scale: mainScale,
        }}
        className="relative z-10 w-full bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-250"
      >
        {children}
      </motion.main>
    </div>
  );
}
