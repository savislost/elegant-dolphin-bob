import React, { useState } from 'react';
import {
  Sun,
  Laptop,
  Shield,
  Umbrella,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EssentialItem } from '@/types/trip';
import { motion } from 'framer-motion';

interface EssentialsChecklistProps {
  items: EssentialItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string, category: EssentialItem['category']) => void;
  onDeleteItem: (id: string) => void;
  filter: 'all' | 'unpacked' | 'packed';
}

const CATEGORY_META: Record<
  EssentialItem['category'],
  { icon: React.ReactNode; accent: string; iconBg: string }
> = {
  'Skincare & Sun': {
    icon: <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    accent: 'from-amber-50/60 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40 border-amber-200/60 dark:border-amber-800/40',
  },
  'Tech & Gear': {
    icon: <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    accent: 'from-blue-50/60 to-sky-50/40 dark:from-blue-950/20 dark:to-sky-950/10',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200/60 dark:border-blue-800/40',
  },
  'Documents & Carry': {
    icon: <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    accent: 'from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/10',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200/60 dark:border-emerald-800/40',
  },
  'Weather & Extras': {
    icon: <Umbrella className="w-4 h-4 text-violet-600 dark:text-violet-400" />,
    accent: 'from-violet-50/60 to-fuchsia-50/40 dark:from-violet-950/20 dark:to-fuchsia-950/10',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40 border-violet-200/60 dark:border-violet-800/40',
  },
};

export const EssentialsChecklist: React.FC<EssentialsChecklistProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  filter,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<EssentialItem['category']>('Tech & Gear');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemCategory);
    setNewItemName('');
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'packed' && !item.packed) return false;
    if (filter === 'unpacked' && item.packed) return false;
    return true;
  });

  const categories: EssentialItem['category'][] = [
    'Skincare & Sun',
    'Tech & Gear',
    'Documents & Carry',
    'Weather & Extras',
  ];

  return (
    <div className="space-y-8">
      {/* Quick Add Custom Item Form */}
      <form
        onSubmit={handleAddSubmit}
        className="glass-card rounded-3xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md flex flex-col sm:flex-row gap-3 items-center"
      >
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add custom packing item (e.g. Travel Pillow, Prescriptions)..."
          className="flex-1 w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 font-sans text-sm focus:outline-none px-2 py-2"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as EssentialItem['category'])}
          className="w-full sm:w-48 bg-neutral-100/80 dark:bg-neutral-800/80 font-mono text-xs text-neutral-900 dark:text-neutral-100 border border-neutral-200/80 dark:border-neutral-700 rounded-2xl px-3 py-2.5 focus:outline-none cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-white dark:bg-neutral-900">
              {cat}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          size="sm"
          className="w-full sm:w-auto bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-2xl px-4 py-2.5 font-sans text-xs font-semibold flex items-center justify-center space-x-1 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </Button>
      </form>

      {/* Categorized Packing Checklists */}
      <div className="space-y-6">
        {categories.map((category) => {
          const catItems = filteredItems.filter((i) => i.category === category);
          const totalCat = items.filter((i) => i.category === category).length;
          const packedCat = items.filter((i) => i.category === category && i.packed).length;

          if (catItems.length === 0 && filter !== 'all') return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md bg-gradient-to-br ${CATEGORY_META[category].accent}`}
            >
              <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${CATEGORY_META[category].iconBg}`}>
                    {CATEGORY_META[category].icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-neutral-900 dark:text-neutral-100 font-normal">{category}</h4>
                    <p className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                      {packedCat} of {totalCat} packed
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100 bg-neutral-100/80 dark:bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-200/80 dark:border-neutral-700">
                  {totalCat > 0 ? Math.round((packedCat / totalCat) * 100) : 0}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleItem(item.id)}
                    className={`group cursor-pointer rounded-2xl p-3.5 border transition-all duration-300 flex items-center justify-between select-none ${
                      item.packed
                        ? 'bg-neutral-100/60 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-700/50 opacity-70'
                        : 'bg-white/80 dark:bg-neutral-900/60 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                          item.packed
                            ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-900'
                            : 'border-neutral-300 dark:border-neutral-600 bg-transparent group-hover:border-neutral-900 dark:group-hover:border-neutral-100'
                        }`}
                      >
                        {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`font-sans text-sm font-medium truncate ${
                          item.packed ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {item.isCustom && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="text-neutral-400 dark:text-neutral-500 hover:text-red-600 dark:hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
