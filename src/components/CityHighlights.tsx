import React from 'react';
import { Sun, Sparkles, Compass, Thermometer } from 'lucide-react';
import { CityInfo } from '@/types/trip';
import { motion } from 'framer-motion';

interface CityHighlightsProps {
  cityInfo: CityInfo;
  location: string;
  durationDays: number;
}

export const CityHighlights: React.FC<CityHighlightsProps> = ({ cityInfo, location, durationDays }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass border border-black/10 mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-black/10">
        <div>
          <div className="flex items-center space-x-2 font-mono text-[11px] uppercase tracking-widest text-black/50 mb-2">
            <Compass className="w-3.5 h-3.5 text-black" />
            <span>AI Auto-Detected Location & Climate</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal text-black tracking-tight mb-2">
            {location}
          </h2>
          <p className="font-sans text-sm text-black/70">
            {durationDays} Days Duration • Auto-curated capsule wardrobe & checklist
          </p>
        </div>

        {/* Climate & Vibe Badges */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-black/5 border border-black/10 flex items-center space-x-2.5">
            <Thermometer className="w-4 h-4 text-black" />
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-black/40 block">Forecast</span>
              <span className="font-sans text-xs font-semibold text-black">{cityInfo.weather_summary}</span>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-black/5 border border-black/10 flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-black" />
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-black/40 block">City Aesthetic</span>
              <span className="font-sans text-xs font-semibold text-black">{cityInfo.auto_vibe}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quick Local Highlights */}
      <div className="pt-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-black/40 block mb-4">
          Local Insights & Packing Tips
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cityInfo.local_highlights.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-black/[0.02] border border-black/5 text-xs text-black/80 font-sans leading-relaxed flex items-start space-x-2.5"
            >
              <span className="font-mono font-bold text-black/40 text-xs">0{idx + 1}.</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};