import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TripSearch } from '@/components/TripSearch';
import { CityHighlights } from '@/components/CityHighlights';
import { ProgressHeader } from '@/components/ProgressHeader';
import { CapsuleWardrobe } from '@/components/CapsuleWardrobe';
import { EssentialsChecklist } from '@/components/EssentialsChecklist';
import { useTripStore } from '@/hooks/useTripStore';
import { generatePackingPlanWithGemini, generateFallbackPackingPlan } from '@/services/gemini';
import { showSuccess, showError } from '@/utils/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Shirt, CheckSquare, Sparkles, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Index: React.FC = () => {
  const {
    currentPlan,
    savePlan,
    toggleItemPacked,
    addCustomItem,
    deleteCustomItem,
    resetCheckedState,
    savedTrips,
    loadSavedTrip,
    filter,
    setFilter,
    stats,
  } = useTripStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize with Kyoto plan on initial load if no plan saved
  useEffect(() => {
    if (!currentPlan && savedTrips.length === 0) {
      const fallback = generateFallbackPackingPlan('Kyoto, Japan', 5);
      savePlan(fallback);
    }
  }, []);

  const handleSearchLocation = async (location: string, duration: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const newPlan = await generatePackingPlanWithGemini(location, duration);
      savePlan(newPlan);
      setShowSearch(false);
      showSuccess(`PackSmart AI curated plan for ${location}!`);
    } catch (err: any) {
      console.error(err);
      const rawMessage = err?.message || 'An unknown error occurred while calling the Gemini API.';
      setErrorMessage(rawMessage);
      showError('Failed to generate packing plan. Check error banner above.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans selection:bg-black selection:text-white pb-16">
      {/* Navigation Header */}
      <Header
        onNewTripClick={() => {
          setShowSearch(true);
          setErrorMessage(null);
        }}
        savedTrips={savedTrips}
        onSelectSavedTrip={(plan) => {
          loadSavedTrip(plan);
          setShowSearch(false);
          setErrorMessage(null);
          showSuccess(`Loaded travel plan for ${plan.location}`);
        }}
        activeLocation={currentPlan?.location}
      />

      <main className="max-w-5xl mx-auto px-4">
        {/* On-screen Raw Error Alert Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 shadow-sm flex items-start justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-red-700">
                    Gemini API Error
                  </h4>
                  <p className="font-mono text-xs mt-1 leading-relaxed break-all text-red-800">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-500 hover:text-red-800 p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Modal or Direct Search View */}
        <AnimatePresence>
          {(showSearch || !currentPlan) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <TripSearch onSearch={handleSearchLocation} isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render Travel Plan Dashboard when plan exists and search is inactive */}
        {currentPlan && !showSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Auto-Detected City & Climate Highlights */}
            <CityHighlights
              cityInfo={currentPlan.city_info}
              location={currentPlan.location}
              durationDays={currentPlan.durationDays}
            />

            {/* Progress Header & Filter */}
            <ProgressHeader
              plan={currentPlan}
              packedCount={stats.packedItemsCount}
              totalCount={stats.totalItems}
              percentage={stats.progressPercentage}
              onReset={resetCheckedState}
              activeFilter={filter}
              onFilterChange={setFilter}
            />

            {/* Dashboard Tabs */}
            <Tabs defaultValue="outfits" className="w-full">
              <div className="flex justify-between items-center mb-6 border-b border-black/10 pb-4">
                <TabsList className="bg-black/5 border border-black/10 p-1 rounded-full">
                  <TabsTrigger
                    value="outfits"
                    className="data-[state=active]:bg-black data-[state=active]:text-white text-xs font-sans font-medium rounded-full px-5 py-2 transition-all flex items-center space-x-2"
                  >
                    <Shirt className="w-4 h-4" />
                    <span>Capsule Wardrobe</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="checklist"
                    className="data-[state=active]:bg-black data-[state=active]:text-white text-xs font-sans font-medium rounded-full px-5 py-2 transition-all flex items-center space-x-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Essentials Checklist</span>
                  </TabsTrigger>
                </TabsList>

                <button
                  onClick={() => {
                    setShowSearch(true);
                    setErrorMessage(null);
                  }}
                  className="font-mono text-xs text-black/60 hover:text-black transition-colors flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Change Location</span>
                </button>
              </div>

              {/* Tab 1: Wardrobe */}
              <TabsContent value="outfits" className="focus-visible:outline-none">
                <CapsuleWardrobe
                  capsuleItems={currentPlan.capsule_wardrobe}
                  outfitCombos={currentPlan.outfit_combinations}
                />
              </TabsContent>

              {/* Tab 2: Checklist */}
              <TabsContent value="checklist" className="focus-visible:outline-none">
                <EssentialsChecklist
                  items={currentPlan.essentialsChecklist}
                  onToggleItem={toggleItemPacked}
                  onAddItem={addCustomItem}
                  onDeleteItem={deleteCustomItem}
                  filter={filter}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-black/5 text-center font-mono text-xs text-black/40">
        <p>PackSmart AI • Editorial Monochrome Travel & Wardrobe Stylist</p>
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;