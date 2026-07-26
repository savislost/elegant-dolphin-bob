import React from 'react';
import { Compass, Thermometer, Sparkles, MapPin, Coffee, Lightbulb } from 'lucide-react';
import { CityInfo } from '@/types/trip';
import { motion } from 'framer-motion';

interface CityHighlightsProps {
  cityInfo: CityInfo;
  location: string;
  durationDays: number;
}

const INSIGHT_ICONS = [Coffee, MapPin, Lightbulb];

export const CityHighlights: React.FC<CityHighlightsProps> = ({ cityInfo, location, durationDays }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="flex items-center space-x-2 font-mono text-[11px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Auto-Detected Location & Climate</span>
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-none mb-1">
            {location}
          </h2>
          <p className="font-serif text-2xl font-normal text-neutral-400 dark:text-neutral-500 tracking-tight mb-1">
            ({durationDays} days)
          </p>
          <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400">
            Auto-curated capsule wardrobe & checklist
          </p>
        </div>

        {/* Climate & Vibe Badges */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-center space-x-2.5 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Thermometer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">Forecast</span>
              <span className="font-sans text-xs font-semibold text-neutral-900 dark:text-neutral-100">{cityInfo.weather_summary}</span>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-br from-violet-50/80 to-fuchsia-50/50 dark:from-violet-950/30 dark:to-fuchsia-950/20 border border-violet-200/60 dark:border-violet-800/40 flex items-center space-x-2.5 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">City Aesthetic</span>
              <span className="font-sans text-xs font-semibold text-neutral-900 dark:text-neutral-100">{cityInfo.auto_vibe}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quick Local Highlights */}
      <div className="pt-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block mb-4">
          Local Insights & Packing Tips
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cityInfo.local_highlights.map((tip, idx) => {
            const Icon = INSIGHT_ICONS[idx % INSIGHT_ICONS.length];
            const accents = [
              'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30',
              'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-800/30',
              'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30',
            ];
            const iconColors = [
              'text-amber-600 dark:text-amber-400',
              'text-rose-600 dark:text-rose-400',
              'text-emerald-600 dark:text-emerald-400',
            ];
            return (
              <div
                key={idx}
                className={`p-4 rounded-3xl border text-xs text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed flex items-start space-x-3 transition-all duration-300 hover:shadow-sm ${accents[idx % 3]}`}
              >
                <div className={`flex-shrink-0 mt-0.5 ${iconColors[idx % 3]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className={`font-mono font-bold text-xs ${iconColors[idx % 3]} block mb-1`}>0{idx + 1}</span>
                  <span>{tip}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
