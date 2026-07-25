import React, { useState } from 'react';
import {
  Sun,
  Laptop,
  Shield,
  Umbrella,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PackingItem } from '@/types/trip';

interface EssentialsChecklistProps {
  items: PackingItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string, category: PackingItem['category']) => void;
  onDeleteItem: (id: string) => void;
  filter: 'all' | 'unpacked' | 'packed';
  searchQuery: string;
}

const CATEGORY_META: Record<
  PackingItem['category'],
  { icon: React.ReactNode; color: string; badge: string }
> = {
  'Skincare & Sun': {
    icon: <Sun className="w-4 h-4 text-amber-400" />,
    color: 'border-amber-500/20 bg-amber-500/5',
    badge: 'text-amber-300 bg-amber-950/60 border-amber-800/40',
  },
  'Tech & Gear': {
    icon: <Laptop className="w-4 h-4 text-cyan-400" />,
    color: 'border-cyan-500/20 bg-cyan-500/5',
    badge: 'text-cyan-300 bg-cyan-950/60 border-cyan-800/40',
  },
  'Documents & Carry': {
    icon: <Shield className="w-4 h-4 text-emerald-400" />,
    color: 'border-emerald-500/20 bg-emerald-500/5',
    badge: 'text-emerald-300 bg-emerald-950/60 border-emerald-800/40',
  },
  'Weather & Extras': {
    icon: <Umbrella className="w-4 h-4 text-violet-400" />,
    color: 'border-violet-500/20 bg-violet-500/5',
    badge: 'text-violet-300 bg-violet-950/60 border-violet-800/40',
  },
  Clothing: {
    icon: <Sparkles className="w-4 h-4 text-pink-400" />,
    color: 'border-pink-500/20 bg-pink-500/5',
    badge: 'text-pink-300 bg-pink-950/60 border-pink-800/40',
  },
};

export const EssentialsChecklist: React.FC<EssentialsChecklistProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  filter,
  searchQuery,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('Tech & Gear');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemCategory);
    setNewItemName('');
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filter === 'packed' && !item.packed) return false;
    if (filter === 'unpacked' && item.packed) return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Group by category
  const categories: PackingItem['category'][] = [
    'Skincare & Sun',
    'Tech & Gear',
    'Documents & Carry',
    'Weather & Extras',
  ];

  return (
    <div className="space-y-6">
      {/* Quick Add Custom Item Liquid Container */}
      <form onSubmit={handleAddSubmit} className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-3 items-center">
        <div className="w-full sm:flex-1">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add a custom item (e.g. Travel Pillow, Prescriptions)..."
            className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 text-xs h-10 rounded-xl"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={newItemCategory} onValueChange={(v) => setNewItemCategory(v as PackingItem['category'])}>
            <SelectTrigger className="bg-slate-950/60 border-white/10 text-slate-200 text-xs h-10 rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-slate-200 rounded-xl">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-xs">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full sm:w-auto h-10 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl px-4 flex items-center justify-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </Button>
      </form>

      {/* Categorized Items */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryItems = filteredItems.filter((i) => i.category === category);
          if (categoryItems.length === 0 && (filter !== 'all' || searchQuery)) return null;

          const meta = CATEGORY_META[category];
          const totalCatItems = items.filter((i) => i.category === category).length;
          const packedCatItems = items.filter((i) => i.category === category && i.packed).length;

          return (
            <div
              key={category}
              className={`backdrop-blur-xl bg-slate-900/60 border ${meta.color} rounded-3xl p-5 shadow-2xl shadow-cyan-950/10`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">{meta.icon}</div>
                  <div>
                    <h3 className="font-bold text-base text-white">{category}</h3>
                    <p className="text-[11px] text-slate-400">
                      {packedCatItems} of {totalCatItems} packed
                    </p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.badge}`}>
                  {totalCatItems > 0 ? Math.round((packedCatItems / totalCatItems) * 100) : 0}% Packed
                </span>
              </div>

              {categoryItems.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No matching items in this category.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onToggleItem(item.id)}
                      className={`group cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex items-start space-x-3 select-none ${
                        item.packed
                          ? 'bg-slate-950/30 border-emerald-500/20 opacity-70 hover:opacity-100'
                          : 'bg-slate-950/60 border-white/10 hover:border-cyan-500/40 hover:bg-slate-950/80'
                      }`}
                    >
                      {/* Checkbox button */}
                      <div
                        className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-all ${
                          item.packed
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'border-white/20 bg-white/5 group-hover:border-cyan-400'
                        }`}
                      >
                        {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs font-semibold truncate transition-colors ${
                              item.packed ? 'line-through text-slate-400' : 'text-slate-100 group-hover:text-cyan-200'
                            }`}
                          >
                            {item.name}
                          </p>
                          {item.isCustom && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem(item.id);
                              }}
                              className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {item.recommendationReason && (
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 flex items-center space-x-1">
                            <Info className="w-2.5 h-2.5 text-cyan-400 flex-shrink-0" />
                            <span>{item.recommendationReason}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};