import React from 'react';
import { Sparkles, Luggage, History, Plus } from 'lucide-react';
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
  activeDestination?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNewTripClick,
  savedTrips,
  onSelectSavedTrip,
  activeDestination,
}) => {
  return (
    <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4 mb-6">
      <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-2xl px-5 py-3 shadow-2xl shadow-cyan-950/20 flex items-center justify-between transition-all duration-300 hover:border-cyan-500/30">
        {/* Brand logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewTripClick}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 shadow-lg shadow-cyan-500/30">
            <Luggage className="w-5 h-5 text-white" />
            <Sparkles className="w-3 h-3 text-cyan-200 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                PackSmart
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI 2.5
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Liquid Glass Capsule & Packing Planner</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* History dropdown */}
          {savedTrips.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl px-3 flex items-center space-x-2 text-xs">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span className="hidden md:inline">Trips History</span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded-full text-[10px]">
                    {savedTrips.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-slate-900/95 border border-white/10 text-slate-200 backdrop-blur-2xl rounded-xl p-2 shadow-2xl">
                <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-wider px-2 py-1">
                  Saved Packing Plans
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {savedTrips.map((plan, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => onSelectSavedTrip(plan)}
                      className={`cursor-pointer rounded-lg px-2 py-2 transition-colors flex justify-between items-center ${
                        activeDestination === plan.destination ? 'bg-cyan-500/20 border border-cyan-500/30 text-white' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-medium text-xs text-white truncate">{plan.destination}</p>
                        <p className="text-[10px] text-slate-400">
                          {plan.durationDays} Days • {plan.vibe}
                        </p>
                      </div>
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        {plan.essentialsChecklist?.filter((i) => i.packed).length || 0}/
                        {plan.essentialsChecklist?.length || 0}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* New Trip button */}
          <Button
            onClick={onNewTripClick}
            className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30 rounded-xl px-4 py-2 text-xs font-semibold flex items-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </Button>
        </div>
      </div>
    </header>
  );
};