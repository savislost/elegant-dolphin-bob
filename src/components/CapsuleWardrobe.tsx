import React from 'react';
import { Shirt, Sparkles, Tag, Layers, Flame } from 'lucide-react';
import { CapsuleItem, OutfitCombo } from '@/types/trip';

interface CapsuleWardrobeProps {
  capsuleItems: CapsuleItem[];
  outfitCombos: OutfitCombo[];
}

export const CapsuleWardrobe: React.FC<CapsuleWardrobeProps> = ({ capsuleItems, outfitCombos }) => {
  return (
    <div className="space-y-8">
      {/* Capsule Items Section */}
      <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-cyan-950/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Smart Capsule Wardrobe</h3>
              <p className="text-xs text-slate-400">Lightweight selection designed for high versatility</p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-white/10 font-semibold">
            {capsuleItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0)} Total Clothes
          </span>
        </div>

        {/* Horizontal Scroll Glass Cards */}
        <div className="flex space-x-4 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-slate-700">
          {capsuleItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex-shrink-0 w-64 bg-slate-950/50 hover:bg-slate-950/80 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-4 transition-all duration-300 transform hover:-translate-y-1 shadow-lg group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-cyan-300 border border-white/10">
                  {item.category}
                </span>
                <span className="text-xs font-semibold text-slate-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                  Qty: {item.quantity || 1}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white mb-1 group-hover:text-cyan-200 transition-colors">
                {item.name}
              </h4>

              <div className="flex items-center space-x-1 text-xs text-slate-400 mb-2">
                <Tag className="w-3 h-3 text-cyan-400" />
                <span>Tone: {item.color}</span>
              </div>

              <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                💡 <span className="italic">{item.versatilityTip}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Outfit Combos Timeline Section */}
      <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-cyan-950/20">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Daily Pre-Configured Outfits</h3>
            <p className="text-xs text-slate-400">Engineered outfits assembled from your capsule pieces</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outfitCombos.map((combo, idx) => (
            <div
              key={combo.id || idx}
              className="bg-slate-950/40 border border-white/10 hover:border-violet-500/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-violet-300 bg-violet-950/80 px-2.5 py-1 rounded-lg border border-violet-800/40">
                    {combo.dayLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{combo.vibe}</span>
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>Included Pieces:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {combo.itemsIncluded.map((piece, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-xs bg-white/5 hover:bg-white/10 text-slate-200 px-2.5 py-1 rounded-xl border border-white/10 font-medium"
                      >
                        {piece}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 mt-2">
                <p className="text-xs text-slate-300 italic">"{combo.stylingNotes}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};