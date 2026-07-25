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
        className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass border border-black/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-black font-normal">Minimal Capsule Wardrobe</h3>
              <p className="font-mono text-xs text-black/50">High versatility, minimal bulk</p>
            </div>
          </div>
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-black/5 border border-black/10 text-black">
            {capsuleItems.length} Key Pieces
          </span>
        </div>

        {/* Horizontal Glass Cards Carousel */}
        <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
          {capsuleItems.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0 w-72 bg-white rounded-2xl p-5 border border-black/10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md bg-black/5 text-black font-semibold inline-block mb-3">
                  {item.category}
                </span>
                <h4 className="font-serif text-xl font-normal text-black leading-snug mb-2">
                  {item.item}
                </h4>
              </div>
              <p className="font-sans text-xs text-black/60 leading-relaxed pt-3 border-t border-black/5">
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
        className="glass-card rounded-3xl p-6 sm:p-8 shadow-glass border border-black/10"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-black font-normal">Daily Outfit Combos</h3>
            <p className="font-mono text-xs text-black/50">Styled exclusively from your capsule wardrobe</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {outfitCombos.map((combo, idx) => (
            <div
              key={combo.id || idx}
              className="bg-white rounded-2xl p-5 border border-black/10 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-black border-b border-black/10 pb-2 block mb-3">
                  {combo.title}
                </span>

                <div className="space-y-2 mb-4">
                  <span className="font-mono text-[10px] uppercase text-black/40 flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-black" />
                    <span>Selected Pieces:</span>
                  </span>
                  <ul className="space-y-1.5">
                    {combo.items.map((piece, pIdx) => (
                      <li
                        key={pIdx}
                        className="font-sans text-xs font-medium text-black/80 bg-black/5 px-3 py-1.5 rounded-xl border border-black/5"
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