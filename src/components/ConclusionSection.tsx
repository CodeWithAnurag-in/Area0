import React from 'react';
import { ArrowUp, Globe } from 'lucide-react';

const ConclusionSectionComponent: React.FC = () => {
  const returnToOrbit = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer id="footer" className="relative pt-12 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--hairline)]">
      {/* Apple-Style Micro-Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--text-muted)] font-mono">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="w-5 h-5 rounded-full bg-white shadow-sm border border-black/10 dark:border-white/20 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/logo.svg"
              alt="Somaiya Vidyavihar Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
            />
          </div>
          <span>Anurag Natekar • Somaiya Vidyavihar • OSPFv2 & VLSM Specification</span>
        </div>

        {/* Return to Orbit Button */}
        <button
          onClick={returnToOrbit}
          className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 font-mono font-semibold text-xs px-5 py-2.5 rounded-full cursor-pointer shadow-md transition-all active:scale-95 group flex items-center gap-2"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-400 group-hover:rotate-12 transition-transform" />
          <span>Return to Orbit</span>
          <ArrowUp className="w-3.5 h-3.5 text-white dark:text-black group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};

export const ConclusionSection = React.memo(ConclusionSectionComponent);
