import React, { useState } from 'react';
import { Search, Loader2, MapPin, Calendar } from 'lucide-react';
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
        <span className="font-mono text-xs uppercase tracking-widest text-black/40 block mb-2">
          AUTOMATED CAPSULE & ESSENTIALS STYLIST
        </span>
        <h1 className="font-serif text-5xl sm:text-7xl tracking-tight text-black font-normal mb-4">
          Where to next?
        </h1>
        <p className="text-sm sm:text-base font-sans text-black/60 max-w-lg mx-auto leading-relaxed">
          Enter any city or country. Gemini AI auto-detects local weather, aesthetic vibe, and curates an essential monochrome packing wardrobe.
        </p>
      </div>

      {/* Floating Glass Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="glass-panel p-3 rounded-3xl shadow-glass border border-black/10 flex flex-col sm:flex-row items-center gap-2">
          {/* Location Input */}
          <div className="relative flex-1 w-full flex items-center px-4">
            <MapPin className="w-5 h-5 text-black/40 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter City, Country... (e.g. Kyoto, Japan)"
              disabled={isLoading}
              className="w-full bg-transparent text-black placeholder:text-black/30 text-base font-sans font-medium focus:outline-none py-3 disabled:opacity-50"
              required
            />
          </div>

          {/* Duration Selector */}
          <div className="flex items-center space-x-2 border-t sm:border-t-0 sm:border-l border-black/10 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto px-4 sm:px-0">
            <Calendar className="w-4 h-4 text-black/40" />
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={isLoading}
              className="bg-transparent font-mono text-xs text-black font-medium focus:outline-none py-2 cursor-pointer disabled:opacity-50"
            >
              {[3, 4, 5, 7, 10, 14].map((d) => (
                <option key={d} value={d} className="bg-white text-black">
                  {d} Days Trip
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !location.trim()}
            className="w-full sm:w-auto h-12 bg-black hover:bg-black/90 text-white font-sans text-xs font-semibold rounded-2xl px-6 transition-all transform active:scale-95 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <span className="font-mono text-[10px] text-black/40 uppercase mr-1">Trending:</span>
          {PRESET_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectPreset(city)}
              className="font-mono text-[11px] px-3 py-1 rounded-full bg-black/5 hover:bg-black hover:text-white text-black/70 border border-black/5 transition-all disabled:opacity-40 disabled:hover:bg-black/5 disabled:hover:text-black/70"
            >
              {city}
            </button>
          ))}
        </div>
      </form>
    </motion.div>
  );
};