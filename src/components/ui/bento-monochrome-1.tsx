import React, { useRef } from 'react';

export const bentoPalettes = {
  dark: {
    surface: '#0a0a0a', // bg-neutral-950
    card: 'rgba(23, 23, 23, 0.55)', // bg-neutral-900/55
    border: 'rgba(255, 255, 255, 0.10)', // border-white/10
    glow: 'rgba(255, 255, 255, 0.14)',
    badge: {
      bg: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.10)',
      text: 'rgba(255, 255, 255, 0.80)',
    },
    heading: '#ffffff',
    body: '#a3a3a3', // text-neutral-400
    button: {
      border: 'rgba(255, 255, 255, 0.15)',
      text: '#ffffff',
      hoverBorder: 'rgba(255, 255, 255, 0.40)',
      hoverBg: 'rgba(255, 255, 255, 0.10)',
    },
    terminal: {
      bg: '#0a0a0a',
      border: 'rgba(255, 255, 255, 0.10)',
      text: '#e5e5e5', // text-neutral-200
    },
  },
  light: {
    surface: '#f1f5f9', // bg-slate-100 / #f8fafc
    card: 'rgba(255, 255, 255, 0.80)', // bg-white/80
    border: '#e5e5e5', // border-neutral-200
    glow: 'rgba(15, 23, 42, 0.15)',
    badge: {
      bg: 'rgba(255, 255, 255, 0.70)',
      border: '#e5e5e5',
      text: '#3f3f46', // text-neutral-700
    },
    heading: '#171717', // text-neutral-900
    body: '#525252', // text-neutral-600
    button: {
      border: '#d4d4d4', // border-neutral-300
      text: '#171717',
      hoverBorder: '#737373', // hover:border-neutral-500
      hoverBg: 'rgba(23, 23, 23, 0.05)',
    },
  },
};

export interface FlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const FlowCard: React.FC<FlowCardProps> = ({
  children,
  className = '',
  glowColor,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`bento-card group rounded-[28px] bg-[var(--bg-card)] border border-[var(--hairline)] relative overflow-hidden transition-all duration-300 hover:border-[var(--pro-card-hover-border)] shadow-[var(--pro-card-shadow)] ${className}`}
      style={{
        ...props.style,
        ...(glowColor ? { '--bento3-focus-glow': glowColor } as React.CSSProperties : {}),
      }}
      {...props}
    >
      {/* Interactive mouse-following radial focus glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"
        style={{
          background: `radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--bento3-focus-glow, var(--bento-glow)), transparent 70%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
