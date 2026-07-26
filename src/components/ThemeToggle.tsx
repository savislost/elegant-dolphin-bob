import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative h-8 w-14 rounded-full p-1 duration-300 border backdrop-blur-md transition-all overflow-hidden flex items-center
        bg-white/20 border-white/30 shadow-inner
        dark:bg-black/30 dark:border-white/10
        hover:shadow-md"
    >
      {/* Sliding glass knob */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="absolute top-1 left-1 h-6 w-6 rounded-full shadow-md border backdrop-blur-lg flex items-center justify-center
          bg-white/80 border-white/50
          dark:bg-neutral-800/80 dark:border-neutral-700/50"
        style={{ left: isDark ? 'calc(100% - 1.75rem)' : '0.25rem' }}
      >
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-neutral-300" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500" />
          )}
        </motion.span>
      </motion.div>

      {/* Faint background icons */}
      <Sun className="absolute left-2 w-3 h-3 text-amber-400/40 pointer-events-none" />
      <Moon className="absolute right-2 w-3 h-3 text-neutral-400/40 pointer-events-none" />
    </button>
  );
};
