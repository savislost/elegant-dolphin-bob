import React, { useState } from 'react';
import { Sparkles, Compass, Calendar, Thermometer, Shirt, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TripInput, TripVibe, WeatherForecast } from '@/types/trip';

interface TripBuilderModalProps {
  onGenerate: (input: TripInput) => Promise<void>;
  isLoading: boolean;
}

const DESTINATION_PRESETS = [
  { name: 'Tokyo, Japan', vibe: 'Minimalist Streetwear' as TripVibe, weather: 'Cool & Rainy' as WeatherForecast },
  { name: 'Goa Beach, India', vibe: 'Beach Casual' as TripVibe, weather: 'Sunny & Hot' as WeatherForecast },
  { name: 'Swiss Alps, Switzerland', vibe: 'Outdoor/Adventure' as TripVibe, weather: 'Cold & Snowy' as WeatherForecast },
  { name: 'London, UK', vibe: 'Formal/Business' as TripVibe, weather: 'Cool & Rainy' as WeatherForecast },
  { name: 'Paris Nightlife, France', vibe: 'Nightlife & Glam' as TripVibe, weather: 'Mild & Humid' as WeatherForecast },
];

const VIBES: { id: TripVibe; title: string; desc: string; icon: string }[] = [
  { id: 'Minimalist Streetwear', title: 'Streetwear', desc: 'Sleek, relaxed layers & versatile basics', icon: '👟' },
  { id: 'Beach Casual', title: 'Beach Casual', desc: 'Breezy linens, quick-dry swim & resort wear', icon: '🌴' },
  { id: 'Formal/Business', title: 'Formal / Business', desc: 'Tailored shirts, sharp blazers & dress shoes', icon: '💼' },
  { id: 'Outdoor/Adventure', title: 'Outdoor / Adventure', desc: 'Weatherproof shells, sturdy trail gear', icon: '🏔️' },
  { id: 'Nightlife & Glam', title: 'Nightlife & Glam', desc: 'Chic evening outfits & elevated accessories', icon: '✨' },
];

const WEATHERS: { id: WeatherForecast; label: string; icon: string; color: string }[] = [
  { id: 'Sunny & Hot', label: 'Sunny & Hot', icon: '☀️', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300' },
  { id: 'Cool & Rainy', label: 'Cool & Rainy', icon: '🌧️', color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-300' },
  { id: 'Cold & Snowy', label: 'Cold & Snowy', icon: '❄️', color: 'from-sky-500/20 to-indigo-500/20 border-sky-500/40 text-sky-300' },
  { id: 'Mild & Humid', label: 'Mild & Humid', icon: '🌤️', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300' },
];

export const TripBuilderModal: React.FC<TripBuilderModalProps> = ({ onGenerate, isLoading }) => {
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [durationDays, setDurationDays] = useState(5);
  const [vibe, setVibe] = useState<TripVibe>('Minimalist Streetwear');
  const [weather, setWeather] = useState<WeatherForecast>('Cool & Rainy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onGenerate({
      destination: destination.trim(),
      durationDays,
      vibe,
      weather,
    });
  };

  const applyPreset = (preset: typeof DESTINATION_PRESETS[0]) => {
    setDestination(preset.name);
    setVibe(preset.vibe);
    setWeather(preset.weather);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Liquid Glass Hero Card */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-slate-900/70 border border-white/15 p-6 sm:p-10 shadow-2xl shadow-cyan-950/40">
        {/* Glow backdrop decorative spots */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered Capsule Wardrobe & Smart Packing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 bg-gradient-to-r from-white via-slate-100 to-cyan-100 bg-clip-text">
            Pack Smarter, Travel Lighter.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Specify your destination, style vibe, and weather. Gemini AI builds your optimal capsule wardrobe & tailored essential checklist in seconds.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Popular Destinations:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DESTINATION_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/40 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
              >
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destination */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Destination / City</span>
              </Label>
              <div className="relative">
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kyoto, New York, Bali, Reykjavik"
                  className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20 h-12 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            {/* Trip Duration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trip Duration</span>
                </Label>
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
                  {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="pt-2 px-1">
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 Day</span>
                  <span>7 Days</span>
                  <span>14 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Style Vibe Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Shirt className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Capsule Vibe & Style</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {VIBES.map((v) => {
                const isSelected = vibe === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVibe(v.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-500/20 to-violet-600/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                        : 'bg-slate-950/40 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-1">{v.icon}</div>
                    <div>
                      <p className="font-semibold text-xs leading-tight">{v.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{v.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Forecast Weather */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Forecast Weather Condition</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {WEATHERS.map((w) => {
                const isSelected = weather === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWeather(w.id)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all flex items-center space-x-2 ${
                      isSelected
                        ? `bg-gradient-to-r ${w.color} font-semibold ring-1 ring-cyan-400/50 shadow-md`
                        : 'bg-slate-950/40 border-white/10 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{w.icon}</span>
                    <span className="truncate">{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-cyan-500/30 border border-cyan-300/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Curating Smart Capsule & Essentials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-cyan-200 animate-bounce" />
                  <span>Generate PackSmart Plan</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};