import React from 'react';
import { History, Plus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GeneratedPackingPlan } from '@/types/trip';

interface HeaderProps {
  onNewTripClick: () => void;
  savedTrips: GeneratedPackingPlan[];
  onSelectSavedTrip: (plan: GeneratedPackingPlan) => void;
  activeLocation?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNewTripClick,
  savedTrips,
  onSelectSavedTrip,
  activeLocation,
}) => {
  return (
    <header className="sticky top-6 z-50 w-full max-w-6xl mx-auto px-4 mb-10">
      <div className="glass-panel rounded-full px-6 py-3.5 shadow-glass flex items-center justify-between border border-black/10 transition-all">
        {/* Brand logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onNewTripClick}>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-mono text-xs font-bold tracking-tighter">
            PS
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-black block leading-none">
              PackSmart
            </span>
            <span className="font-mono text-[9px] text-black/50 tracking-widest uppercase">
              EDITORIAL AI
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {savedTrips.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full px-4 py-1.5 border border-black/10 bg-white/60 hover:bg-black hover:text-white transition-all text-xs font-sans font-medium">
                  <History className="w-3.5 h-3.5 mr-1.5" />
                  <span>Recent Cities ({savedTrips.length})</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-white/95 backdrop-blur-2xl border border-black/10 rounded-2xl p-2 shadow-2xl mt-2">
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-black/40 px-3 py-1.5">
                  Saved Travel Destinations
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-black/5" />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {savedTrips.map((plan, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => onSelectSavedTrip(plan)}
                      className={`cursor-pointer rounded-xl px-3 py-2.5 transition-all flex justify-between items-center ${
                        activeLocation?.toLowerCase() === plan.location.toLowerCase()
                          ? 'bg-black text-white font-medium'
                          : 'hover:bg-black/5 text-black'
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-serif text-base tracking-tight truncate">{plan.location}</p>
                        <p className={`font-mono text-[10px] ${activeLocation?.toLowerCase() === plan.location.toLowerCase() ? 'text-white/60' : 'text-black/50'}`}>
                          {plan.durationDays} Days • {plan.city_info?.weather_summary?.split('•')[0] || 'Temperate'}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 opacity-60" />
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            onClick={onNewTripClick}
            className="bg-black hover:bg-black/80 text-white rounded-full px-5 py-2 text-xs font-sans font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Search City</span>
          </Button>
        </div>
      </div>
    </header>
  );
};