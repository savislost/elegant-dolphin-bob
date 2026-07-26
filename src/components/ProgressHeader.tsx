import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Filter, Clock, CircleCheck as CheckCircle2 } from 'lucide-react';
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
    let text = `PackSmart AI — ${plan.location}\n`;
    text += `${plan.durationDays} Days | Weather: ${plan.city_info.weather_summary}\n\n`;

    text += `CAPSULE WARDROBE:\n`;
    plan.capsule_wardrobe.forEach((item) => {
      text += `- [${item.category}] ${item.item}: ${item.reason}\n`;
    });

    text += `\nESSENTIALS CHECKLIST:\n`;
    plan.essentialsChecklist.forEach((item) => {
      text += `${item.packed ? '[x]' : '[ ]'} ${item.name} (${item.category})\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    showSuccess('Minimalist list copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  const previewItems = plan.essentialsChecklist.slice(0, 6);

  return (
    <div className="glass-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block mb-1">
            Checklist Status
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="font-serif text-3xl text-neutral-900 dark:text-neutral-100 font-normal">{percentage}% Packed</span>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
              ({packedCount} of {totalCount} items)
            </span>
          </div>
        </div>

        {/* Outlined action buttons */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleCopyList}
            variant="outline"
            size="sm"
            className="rounded-full border border-neutral-200/80 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 text-xs font-sans font-medium hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-300 px-4 h-9"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            <span>{copied ? 'Copied' : 'Copy Minimal List'}</span>
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="rounded-full border border-neutral-200/80 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 text-xs font-sans font-medium hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-300 px-4 h-9"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Checks</span>
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-neutral-200/70 dark:bg-neutral-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist preview items — fills the void */}
      {previewItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-6">
          {previewItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-2.5 rounded-2xl px-3.5 py-2.5 border transition-all text-xs font-sans ${
                item.packed
                  ? 'bg-neutral-100/60 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-700/50 text-neutral-400 dark:text-neutral-500'
                  : 'bg-white/70 dark:bg-neutral-900/40 border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                  item.packed
                    ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-900'
                    : 'border-neutral-300 dark:border-neutral-600 bg-transparent'
                }`}
              >
                {item.packed && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className={`truncate ${item.packed ? 'line-through' : ''}`}>{item.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 pt-4 border-t border-neutral-200/80 dark:border-neutral-800 font-mono text-xs">
        <Filter className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 mr-1" />
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3.5 py-1.5 rounded-full transition-all duration-300 ${
            activeFilter === 'all'
              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange('unpacked')}
          className={`px-3.5 py-1.5 rounded-full transition-all duration-300 flex items-center space-x-1 ${
            activeFilter === 'unpacked'
              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>To Pack ({totalCount - packedCount})</span>
        </button>
        <button
          onClick={() => onFilterChange('packed')}
          className={`px-3.5 py-1.5 rounded-full transition-all duration-300 flex items-center space-x-1 ${
            activeFilter === 'packed'
              ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Packed ({packedCount})</span>
        </button>
      </div>
    </div>
  );
};
