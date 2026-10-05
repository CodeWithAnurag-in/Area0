import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Activity, Sliders, Award } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { ThemeToggle } from './vlab/ThemeToggle';

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
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['aim', 'diagnostics', 'planner', 'mastery'];
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
          className="fixed top-6 inset-x-0 mx-auto w-fit max-w-[96vw] z-50 px-5 py-2.5 rounded-full border shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex items-center gap-2 md:gap-4 transition-colors duration-250 select-none"
          style={{
            backgroundColor: 'var(--glass-nav)',
            borderColor: 'var(--hairline)',
          }}
        >
          {/* Somaiya Vidyavihar Brand Logo & Area0 */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 pl-1 pr-3 border-r border-[var(--hairline)] cursor-pointer group select-none"
            title="Area0 - Somaiya Vidyavihar"
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-black/10 dark:border-white/20 p-0.5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img
                src="/logo.svg"
                alt="Somaiya Vidyavihar Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] font-semibold hidden sm:inline">
              Area<span className="text-neutral-900 dark:text-white font-bold">0</span>
            </span>
          </div>

          {/* Navigation Pills */}
          <nav className="flex items-center gap-2 md:gap-3">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <LiquidButton
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  size="sm"
                  className={`rounded-full px-3.5 py-1.5 text-[11px] font-body transition-all duration-200 flex items-center gap-2 font-medium cursor-pointer ${
                    isActive
                      ? 'text-neutral-900 dark:text-white font-semibold bg-neutral-900/5 dark:bg-white/10'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-neutral-900 dark:text-white' : 'text-[var(--text-muted)]'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="md:hidden">{item.label.split(' ')[0]}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full border border-black/10 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] pointer-events-none"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    >
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-neutral-900 dark:bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] rounded-full" />
                    </motion.div>
                  )}
                </LiquidButton>
              );
            })}
          </nav>

          {/* Apple Glass Segmented Theme Toggle */}
          <div className="pl-2 border-l border-[var(--hairline)]">
            <ThemeToggle />
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};
