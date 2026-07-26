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
import { ThemeToggle } from '@/components/ThemeToggle';

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
      <div className="glass-panel rounded-full px-6 py-3.5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={onNewTripClick}>
          <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center text-sm transition-transform group-hover:scale-105">
            <span role="img" aria-label="necktie">👔</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 block leading-tight">
              PackSmart AI
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2.5">
          {savedTrips.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-4 py-2 border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 transition-all duration-300 text-xs font-sans font-medium h-9"
                >
                  <History className="w-3.5 h-3.5 mr-1.5" />
                  <span>Recent Cities ({savedTrips.length})</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-2xl border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-2 shadow-2xl mt-2">
                <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 py-1.5">
                  Saved Travel Destinations
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-200/80 dark:bg-neutral-800" />
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {savedTrips.map((plan, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => onSelectSavedTrip(plan)}
                      className={`cursor-pointer rounded-xl px-3 py-2.5 transition-all flex justify-between items-center ${
                        activeLocation?.toLowerCase() === plan.location.toLowerCase()
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-serif text-base tracking-tight truncate">{plan.location}</p>
                        <p className={`font-mono text-[10px] ${activeLocation?.toLowerCase() === plan.location.toLowerCase() ? 'text-white/60 dark:text-neutral-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
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

          {/* Liquid glass theme toggle */}
          <ThemeToggle />

          <Button
            onClick={onNewTripClick}
            className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-full px-4 py-2 text-xs font-sans font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.03] active:scale-95 flex items-center space-x-1.5 h-9"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Search City</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
