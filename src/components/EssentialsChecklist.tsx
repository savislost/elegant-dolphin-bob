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
  { icon: React.ReactNode }
> = {
  'Skincare & Sun': { icon: <Sun className="w-4 h-4 text-black" /> },
  'Tech & Gear': { icon: <Laptop className="w-4 h-4 text-black" /> },
  'Documents & Carry': { icon: <Shield className="w-4 h-4 text-black" /> },
  'Weather & Extras': { icon: <Umbrella className="w-4 h-4 text-black" /> },
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
      <form onSubmit={handleAddSubmit} className="glass-card rounded-2xl p-4 shadow-sm border border-black/10 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add custom packing item (e.g. Travel Pillow, Prescriptions)..."
          className="flex-1 w-full bg-transparent text-black placeholder:text-black/30 font-sans text-xs focus:outline-none px-2 py-1"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value as EssentialItem['category'])}
          className="w-full sm:w-48 bg-black/5 font-mono text-xs text-black border border-black/10 rounded-xl px-3 py-2 focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          size="sm"
          className="w-full sm:w-auto bg-black text-white hover:bg-black/90 rounded-xl px-4 py-2 font-sans text-xs font-semibold flex items-center justify-center space-x-1"
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
              className="glass-card rounded-3xl p-6 shadow-glass border border-black/10"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center border border-black/10">
                    {CATEGORY_META[category].icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-black font-normal">{category}</h4>
                    <p className="font-mono text-[10px] text-black/40">
                      {packedCat} of {totalCat} packed
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-black bg-black/5 px-2.5 py-1 rounded-full border border-black/5">
                  {totalCat > 0 ? Math.round((packedCat / totalCat) * 100) : 0}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleItem(item.id)}
                    className={`group cursor-pointer rounded-2xl p-3.5 border transition-all flex items-center justify-between select-none ${
                      item.packed
                        ? 'bg-black/5 border-black/10 opacity-60'
                        : 'bg-white border-black/10 hover:border-black'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          item.packed
                            ? 'bg-black border-black text-white'
                            : 'border-black/30 bg-transparent group-hover:border-black'
                        }`}
                      >
                        {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`font-sans text-xs font-medium truncate ${
                          item.packed ? 'line-through text-black/50' : 'text-black'
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
                        className="text-black/40 hover:text-red-600 p-1 transition-colors"
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