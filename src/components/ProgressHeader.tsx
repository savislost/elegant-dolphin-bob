import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Sparkles, Filter, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GeneratedPackingPlan } from '@/types/trip';
import { showSuccess } from '@/utils/toast';

interface ProgressHeaderProps {
  plan: GeneratedPackingPlan;
  packedCount: number;
  totalCount: number;
  percentage: number;
  onReset: () => void;
  onRegenerate: () => void;
  activeFilter: 'all' | 'unpacked' | 'packed';
  onFilterChange: (filter: 'all' | 'unpacked' | 'packed') => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  plan,
  packedCount,
  totalCount,
  percentage,
  onReset,
  onRegenerate,
  activeFilter,
  onFilterChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyList = () => {
    let text = `✈️ PackSmart AI Plan for ${plan.destination}\n`;
    text += `📅 ${plan.durationDays} Days | Vibe: ${plan.vibe} | Weather: ${plan.weather}\n\n`;

    text += `👗 CAPSULE WARDROBE:\n`;
    plan.capsuleWardrobe.forEach((item) => {
      text += `- [${item.category}] ${item.name} (${item.color}) x${item.quantity}\n`;
    });

    text += `\n🎒 ESSENTIALS CHECKLIST:\n`;
    plan.essentialsChecklist.forEach((item) => {
      text += `${item.packed ? '[x]' : '[ ]'} ${item.name} (${item.category})\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    showSuccess('Minimal packing list copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-5 sm:p-6 mb-8 shadow-2xl shadow-cyan-950/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        {/* Destination & Meta summary */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 mb-1">
            <span className="bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">{plan.vibe}</span>
            <span>•</span>
            <span className="text-slate-300">{plan.weather}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>{plan.destination}</span>
            <span className="text-slate-400 font-medium text-lg">({plan.durationDays} Days)</span>
          </h2>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <Button
            onClick={handleCopyList}
            variant="ghost"
            size="sm"
            className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl px-3 text-xs flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy Minimal List'}</span>
          </Button>

          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl px-3 text-xs flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Checks</span>
          </Button>

          <Button
            onClick={onRegenerate}
            variant="ghost"
            size="sm"
            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl px-3 text-xs flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Regenerate Vibe</span>
          </Button>
        </div>
      </div>

      {/* Progress Bar & Ring Metrics */}
      <div className="space-y-2 mb-5">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white text-sm">Packing Progress</span>
            <span className="text-slate-400">
              ({packedCount} of {totalCount} items packed)
            </span>
          </div>
          <span className="font-extrabold text-cyan-300 text-sm">{percentage}%</span>
        </div>

        <div className="w-full h-3 bg-slate-950/80 rounded-full p-0.5 border border-white/10 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center space-x-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Items ({totalCount})
          </button>
          <button
            onClick={() => onFilterChange('unpacked')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center space-x-1 ${
              activeFilter === 'unpacked'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span>To Pack ({totalCount - packedCount})</span>
          </button>
          <button
            onClick={() => onFilterChange('packed')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center space-x-1 ${
              activeFilter === 'packed'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Packed ({packedCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};