import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('bento-theme') || localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'dark';
      setTheme(initial);
      document.documentElement.classList.toggle('dark', initial === 'dark');
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'bento-theme') {
        const val = e.newValue as 'light' | 'dark';
        if (val === 'light' || val === 'dark') {
          setTheme(val);
          document.documentElement.classList.toggle('dark', val === 'dark');
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('bento-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isLight = mounted && theme === 'light';

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="relative flex items-center p-0.5 rounded-full select-none"
      style={{
        backgroundColor: 'rgba(120, 120, 128, 0.16)',
        border: '1px solid var(--hairline)',
      }}
    >
      {/* Sliding lens */}
      <div
        className="absolute top-0.5 w-[26px] h-[22px] rounded-full pointer-events-none"
        style={{
          transform: isLight ? 'translateX(0px)' : 'translateX(26px)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, box-shadow 0.25s ease',
          backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
          boxShadow: isLight
            ? '0 2px 8px rgba(0,0,0,0.12)'
            : 'inset 0 0.5px 0.5px rgba(255,255,255,0.3), 0 2px 6px rgba(0,0,0,0.2)',
          border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
        }}
      />

      {/* Light Mode Button */}
      <button
        type="button"
        onClick={() => toggleTheme('light')}
        aria-checked={isLight}
        role="radio"
        title="Light Mode"
        className="relative z-10 w-[26px] h-[22px] flex items-center justify-center rounded-full cursor-pointer transition-colors"
      >
        <Sun
          className={`w-3.5 h-3.5 transition-colors ${
            isLight ? 'text-amber-500' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        />
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        onClick={() => toggleTheme('dark')}
        aria-checked={!isLight}
        role="radio"
        title="Dark Mode"
        className="relative z-10 w-[26px] h-[22px] flex items-center justify-center rounded-full cursor-pointer transition-colors"
      >
        <Moon
          className={`w-3.5 h-3.5 transition-colors ${
            !isLight ? 'text-white' : 'text-neutral-400 hover:text-neutral-600'
          }`}
        />
      </button>
    </div>
  );
};
