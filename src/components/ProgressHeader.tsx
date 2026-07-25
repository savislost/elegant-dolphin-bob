import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Filter, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GeneratedPackingPlan } from '@/types/trip';
import { showSuccess } from '@/utils/toast';

interface ProgressHeaderProps {
  plan: GeneratedPackingPlan;
  packedCount: number;
  totalCount: number;
  percentage: number;
  onReset: () => void;
  activeFilter: 'all' | 'unpacked' | 'packed';
  onFilterChange: (filter: 'all' | 'unpacked' | 'packed') => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  plan,
  packedCount,
  totalCount,
  percentage,
  onReset,
  activeFilter,
  onFilterChange,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyList = () => {
    let text = `✈️ PackSmart AI — ${plan.location}\n`;
    text += `📅 ${plan.durationDays} Days | Weather: ${plan.city_info.weather_summary}\n\n`;

    text += `👗 CAPSULE WARDROBE:\n`;
    plan.capsule_wardrobe.forEach((item) => {
      text += `- [${item.category}] ${item.item}: ${item.reason}\n`;
    });

    text += `\n🎒 ESSENTIALS CHECKLIST:\n`;
    plan.essentialsChecklist.forEach((item) => {
      text += `${item.packed ? '[x]' : '[ ]'} ${item.name} (${item.category})\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    showSuccess('Minimalist list copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-glass border border-black/10 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-black/40 block mb-1">
            Checklist Status
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="font-serif text-3xl text-black font-normal">{percentage}% Packed</span>
            <span className="font-mono text-xs text-black/50">
              ({packedCount} of {totalCount} items)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCopyList}
            variant="outline"
            size="sm"
            className="rounded-full border-black/10 text-xs font-sans font-medium hover:bg-black hover:text-white transition-all px-4"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            <span>{copied ? 'Copied' : 'Copy Minimal List'}</span>
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="rounded-full border-black/10 text-xs font-sans font-medium hover:bg-black hover:text-white transition-all px-4"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Checks</span>
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-black rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 pt-2 border-t border-black/5 font-mono text-xs">
        <Filter className="w-3.5 h-3.5 text-black/40 mr-1" />
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1 rounded-full transition-all ${
            activeFilter === 'all' ? 'bg-black text-white font-bold' : 'text-black/60 hover:text-black'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange('unpacked')}
          className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
            activeFilter === 'unpacked' ? 'bg-black text-white font-bold' : 'text-black/60 hover:text-black'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>To Pack ({totalCount - packedCount})</span>
        </button>
        <button
          onClick={() => onFilterChange('packed')}
          className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
            activeFilter === 'packed' ? 'bg-black text-white font-bold' : 'text-black/60 hover:text-black'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Packed ({packedCount})</span>
        </button>
      </div>
    </div>
  );
};