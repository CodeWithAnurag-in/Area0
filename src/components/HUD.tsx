import React from 'react';
import { motion } from 'motion/react';

export const HUD = ({ progress = 0, animProgress: animProgressProp }: { progress?: number; animProgress?: number }) => {
  // Sync HUD telemetry to zoom progress [0, 1]
  const animProgress = animProgressProp !== undefined
    ? Math.min(1, Math.max(0, animProgressProp))
    : Math.min(1, Math.max(0, progress));
  
  const satelliteCount = Math.floor(400 + (400 * animProgress));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-8 md:p-10 font-mono text-white/50">
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-4 py-2.5 rounded-2xl bg-[#08080c] border border-white/[0.08] shadow-lg"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-white font-medium mb-0.5">Orbit Terminal</div>
          <div className="text-[9px] tracking-wider text-zinc-500">Live Telemetry</div>
        </motion.div>
        <div className="px-4 py-2.5 rounded-2xl bg-[#08080c] border border-white/[0.08] shadow-lg text-right">
          <div className="text-[9px] uppercase tracking-widest text-zinc-400 mb-0.5">Active Nodes</div>
          <div className="text-[11px] font-bold tracking-widest text-white">
            {satelliteCount.toString().padStart(3, '0')}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className="p-4 rounded-2xl bg-[#08080c] border border-white/[0.08] shadow-lg flex flex-col gap-2.5 max-w-[260px]">
          <div className="text-[10px] leading-relaxed text-zinc-400 uppercase tracking-tight">
            Camera: <span className="text-white font-semibold">{animProgress >= 1 ? 'LOCKED' : 'SYNCING'}</span> <br/>
            Velocity: <span className="text-white font-semibold">{(0.002 + (animProgress * 0.035)).toFixed(4)} rad/f</span>
          </div>
          <div className="h-[2px] w-full bg-white/10 rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-white"
              style={{ x: `${(animProgress - 1) * 100}%` }}
            />
          </div>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-[#08080c] border border-white/[0.08] shadow-lg flex items-baseline gap-2">
           <div className="text-[26px] font-light text-white tracking-tighter">
            {Math.floor(animProgress * 100).toString().padStart(3, '0')}
            <span className="text-[10px] text-zinc-400 ml-1.5 font-mono">PRG</span>
           </div>
        </div>
      </div>
    </div>
  );
};
