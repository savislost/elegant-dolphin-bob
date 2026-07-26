import React, { useState } from 'react';
import { Search, Loader as Loader2, MapPin, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface TripSearchProps {
  onSearch: (location: string, duration: number) => Promise<void>;
  isLoading: boolean;
}

const PRESET_CITIES = [
  'Kyoto, Japan',
  'Paris, France',
  'New York, USA',
  'Reykjavik, Iceland',
  'Bali, Indonesia',
  'Zurich, Switzerland',
];

export const TripSearch: React.FC<TripSearchProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || isLoading) return;
    onSearch(location.trim(), duration);
  };

  const handleSelectPreset = (city: string) => {
    if (isLoading) return;
    setLocation(city);
    onSearch(city, duration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto my-8 px-4"
    >
      {/* Editorial Title Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-5xl sm:text-7xl tracking-tight text-neutral-900 dark:text-neutral-100 font-normal mb-4">
          Where to next?
        </h1>
        <p className="text-sm sm:text-base font-sans text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Enter any city or country. PackSmart AI auto-detects local weather, aesthetic vibe, and curates an essential monochrome packing wardrobe.
        </p>
      </div>

      {/* Floating Glass Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass-panel p-3 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center gap-2">
          {/* Location Input */}
          <div className="relative flex-1 w-full flex items-center px-4">
            <MapPin className="w-5 h-5 text-neutral-400 dark:text-neutral-500 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter City, Country... (e.g. Kyoto, Japan)"
              disabled={isLoading}
              className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-base font-sans font-medium focus:outline-none py-3 disabled:opacity-50"
              required
            />
          </div>

          {/* Duration Selector */}
          <div className="flex items-center space-x-2 border-t sm:border-t-0 sm:border-l border-neutral-200/80 dark:border-neutral-800 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto px-4 sm:px-0">
            <Calendar className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={isLoading}
              className="bg-transparent font-mono text-xs text-neutral-900 dark:text-neutral-100 font-medium focus:outline-none py-2 cursor-pointer disabled:opacity-50"
            >
              {[3, 4, 5, 7, 10, 14].map((d) => (
                <option key={d} value={d} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                  {d} Days Trip
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !location.trim()}
            className="w-full sm:w-auto h-12 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-sans text-xs font-semibold rounded-2xl px-6 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-mono">Generating Wardrobe...</span>
              </>
            ) : (
              <>
                <span>Curate Packing Plan</span>
                <Search className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Preset City Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase mr-1 flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Trending:</span>
          </span>
          {PRESET_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectPreset(city)}
              className="font-mono text-[11px] px-3 py-1 rounded-full bg-neutral-100/60 dark:bg-neutral-900/60 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 transform hover:scale-[1.05] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-neutral-100/60 dark:disabled:hover:bg-neutral-900/60 disabled:hover:text-neutral-700 dark:disabled:hover:text-neutral-300"
            >
              {city}
            </button>
          ))}
        </div>
      </form>

      {/* Skeleton loading shimmer */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-12 space-y-4"
        >
          <div className="glass-card rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md overflow-hidden">
            <div className="h-3 w-40 rounded-full bg-neutral-200/70 dark:bg-neutral-800 shimmer mb-3" />
            <div className="h-8 w-56 rounded-xl bg-neutral-200/70 dark:bg-neutral-800 shimmer mb-2" />
            <div className="h-3 w-72 rounded-full bg-neutral-200/60 dark:bg-neutral-800/70 shimmer" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 rounded-3xl bg-neutral-200/60 dark:bg-neutral-800/70 shimmer" />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
