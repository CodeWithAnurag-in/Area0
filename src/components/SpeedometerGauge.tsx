import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SpeedometerGaugeProps {
  score: number; // 0 to 100
  totalQuestions: number;
  correctCount: number;
  label?: string;
  statusRating?: string;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  score,
  totalQuestions,
  correctCount,
  label = 'Accuracy Benchmark',
  statusRating,
}) => {
  // Speedometer angle from -90 degrees (0%) to +90 degrees (100%)
  const targetAngle = -90 + (Math.max(0, Math.min(100, score)) / 100) * 180;
  const [animatedAngle, setAnimatedAngle] = useState(-90);
  const [displayScore, setDisplayScore] = useState(0);

  // Smooth needle and score counter animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedAngle(targetAngle);
    }, 50);

    // Number counter effect
    let startTimestamp: number | null = null;
    const duration = 1000;
    const startVal = displayScore;
    const endVal = Math.round(score);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startVal + (endVal - startVal) * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    return () => clearTimeout(timer);
  }, [score, targetAngle]);

  // Arc path geometry
  const radius = 85;
  const strokeWidth = 9;
  const circumference = Math.PI * radius; // Semi-circle circumference ≈ 267
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-7 rounded-[28px] bg-[var(--bg-card)] border border-[var(--hairline)] relative overflow-hidden shadow-xl transition-colors duration-250">
      {/* Subtle Specular Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-36 bg-neutral-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Label Header */}
      <div className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-200" />
        <span>{label}</span>
      </div>

      {/* Speedometer SVG Canvas */}
      <div className="relative w-64 h-32 flex items-center justify-center">
        <svg
          viewBox="0 0 220 115"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Monochrome Active Gradient Arc */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#737373" />
              <stop offset="100%" stopColor="var(--gauge-indicator)" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 25 105 A 85 85 0 0 1 195 105"
            fill="none"
            stroke="var(--gauge-track)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Tick Marks along the arc */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = -180 + (tick / 100) * 180;
            const rad = (angle * Math.PI) / 180;
            const x1 = 110 + 68 * Math.cos(rad);
            const y1 = 105 + 68 * Math.sin(rad);
            const x2 = 110 + 75 * Math.cos(rad);
            const y2 = 105 + 75 * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--hairline)"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Active Monochrome Arc */}
          <motion.path
            d="M 25 105 A 85 85 0 0 1 195 105"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Speedometer Needle (anchored at pivot 110, 105) */}
          <g
            style={{
              transform: `rotate(${animatedAngle}deg)`,
              transformOrigin: '110px 105px',
              transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Needle Body */}
            <line
              x1="110"
              y1="105"
              x2="110"
              y2="28"
              stroke="var(--gauge-indicator)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Needle Tip */}
            <circle cx="110" cy="28" r="3" fill="var(--gauge-indicator)" />
          </g>

          {/* Center Hub Cap with Solid Pivot */}
          <circle cx="110" cy="105" r="7" fill="var(--bg-card)" stroke="var(--hairline)" strokeWidth="1.5" />
          <circle cx="110" cy="105" r="3" fill="var(--gauge-indicator)" />
        </svg>
      </div>

      {/* Numeric Readout & Benchmark Status */}
      <div className="mt-3 text-center select-none w-full">
        {/* Large Prominent Percentage */}
        <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--text-primary)] font-mono flex items-baseline justify-center tabular-nums">
          <span>{displayScore}</span>
          <span className="text-base sm:text-lg font-light text-[var(--text-muted)] ml-1">%</span>
        </div>

        {/* Questions Fraction */}
        <div className="text-xs text-[var(--text-muted)] font-mono mt-1.5 tabular-nums">
          <span className="text-[var(--text-primary)] font-medium">{correctCount}</span> / {totalQuestions}
        </div>

        {/* Status Rating Badge */}
        {statusRating && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/70 border border-neutral-200 text-neutral-700 dark:bg-white/5 dark:border-white/10 dark:text-white/80 font-mono text-[11px] font-semibold tracking-wider uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-200" />
            {statusRating}
          </div>
        )}
      </div>
    </div>
  );
};
