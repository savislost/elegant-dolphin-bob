import React from 'react';
import { Shirt, Sparkles, Layers } from 'lucide-react';
import { CapsuleItem, OutfitCombo } from '@/types/trip';
import { motion } from 'framer-motion';

interface CapsuleWardrobeProps {
  capsuleItems: CapsuleItem[];
  outfitCombos: OutfitCombo[];
}

export const CapsuleWardrobe: React.FC<CapsuleWardrobeProps> = ({ capsuleItems, outfitCombos }) => {
  return (
    <div className="space-y-8">
      {/* Capsule Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100 font-normal">Minimal Capsule Wardrobe</h3>
              <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">High versatility, minimal bulk</p>
            </div>
          </div>
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100">
            {capsuleItems.length} Key Pieces
          </span>
        </div>

        {/* Horizontal Cards Carousel */}
        <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
          {capsuleItems.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0 w-72 bg-white dark:bg-neutral-900/80 rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold inline-block mb-3">
                  {item.category}
                </span>
                <h4 className="font-serif text-xl font-normal text-neutral-900 dark:text-neutral-100 leading-snug mb-2">
                  {item.item}
                </h4>
              </div>
              <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pt-3 border-t border-neutral-200/80 dark:border-neutral-800">
                {item.reason}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Outfit Combinations Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200/80 dark:border-neutral-800 dark:bg-neutral-900/60 backdrop-blur-md"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100 font-normal">Daily Outfit Combos</h3>
            <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">Styled exclusively from your capsule wardrobe</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {outfitCombos.map((combo, idx) => (
            <div
              key={combo.id || idx}
              className="bg-white dark:bg-neutral-900/80 rounded-3xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200/80 dark:border-neutral-800 pb-2 block mb-3">
                  {combo.title}
                </span>

                <div className="space-y-2 mb-4">
                  <span className="font-mono text-[10px] uppercase text-neutral-400 dark:text-neutral-500 flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-neutral-900 dark:text-neutral-100" />
                    <span>Selected Pieces:</span>
                  </span>
                  <ul className="space-y-1.5">
                    {combo.items.map((piece, pIdx) => (
                      <li
                        key={pIdx}
                        className="font-sans text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-700"
                      >
                        • {piece}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
