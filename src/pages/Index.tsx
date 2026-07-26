import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { TripSearch } from '@/components/TripSearch';
import { CityHighlights } from '@/components/CityHighlights';
import { ProgressHeader } from '@/components/ProgressHeader';
import { CapsuleWardrobe } from '@/components/CapsuleWardrobe';
import { EssentialsChecklist } from '@/components/EssentialsChecklist';
import { SkeletonLoadingState } from '@/components/SkeletonLoader';
import { useTripStore } from '@/hooks/useTripStore';
import { generatePackingPlanWithGroq } from '@/services/groq';
import { showSuccess, showError } from '@/utils/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Shirt, SquareCheck as CheckSquare, Sparkles, TriangleAlert as AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Index: React.FC = () => {
  const {
    currentPlan,
    savePlan,
    clearCurrentPlan,
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearchClick = () => {
    clearCurrentPlan();
    setErrorMessage(null);
  };

  const handleSearchLocation = async (location: string, duration: number) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const newPlan = await generatePackingPlanWithGroq(location, duration);
      savePlan(newPlan);
      showSuccess(`PackSmart AI plan loaded for ${location}!`);
    } catch (err: any) {
      console.error("Groq Raw Error:", err);
      const userMsg = "Please check your VITE_GROQ_API_KEY in .env.local and try again.";
      setErrorMessage(userMsg);
      showError("Could not fetch travel plan. Please check your Groq API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-900 pb-16 transition-colors duration-500">
      <Header
        onNewTripClick={handleSearchClick}
        savedTrips={savedTrips}
        onSelectSavedTrip={(plan) => {
          loadSavedTrip(plan);
          setErrorMessage(null);
          showSuccess(`Loaded travel plan for ${plan.location}`);
        }}
        activeLocation={currentPlan?.location}
      />

      <main className="max-w-5xl mx-auto px-4">
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-3xl border border-red-200/80 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 backdrop-blur-md text-red-900 dark:text-red-200 shadow-sm flex items-start justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-700 dark:text-red-400">
                    Groq API Notice
                  </h4>
                  <p className="font-mono text-xs mt-1 leading-relaxed text-red-800 dark:text-red-300">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 rounded-lg text-red-500 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!currentPlan ? (
            <motion.div
              key="search-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <TripSearch onSearch={handleSearchLocation} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="plan-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <CityHighlights
                cityInfo={currentPlan.city_info}
                location={currentPlan.location}
                durationDays={currentPlan.durationDays}
              />

              <ProgressHeader
                plan={currentPlan}
                packedCount={stats.packedItemsCount}
                totalCount={stats.totalItems}
                percentage={stats.progressPercentage}
                onReset={resetCheckedState}
                activeFilter={filter}
                onFilterChange={setFilter}
              />

              <Tabs defaultValue="outfits" className="w-full">
                <div className="flex justify-between items-center mb-6 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
                  <TabsList className="bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 p-1 rounded-full backdrop-blur-md">
                    <TabsTrigger
                      value="outfits"
                      className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white dark:data-[state=active]:bg-neutral-100 dark:data-[state=active]:text-neutral-900 text-xs font-sans font-medium rounded-full px-5 py-2 transition-all flex items-center space-x-2 data-[state=active]:shadow-sm"
                    >
                      <Shirt className="w-4 h-4" />
                      <span>Capsule Wardrobe</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="checklist"
                      className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white dark:data-[state=active]:bg-neutral-100 dark:data-[state=active]:text-neutral-900 text-xs font-sans font-medium rounded-full px-5 py-2 transition-all flex items-center space-x-2 data-[state=active]:shadow-sm"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>Essentials Checklist</span>
                    </TabsTrigger>
                  </TabsList>

                  <button
                    onClick={handleSearchClick}
                    className="font-mono text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Change Location</span>
                  </button>
                </div>

                <TabsContent value="outfits" className="focus-visible:outline-none">
                  <CapsuleWardrobe
                    capsuleItems={currentPlan.capsule_wardrobe}
                    outfitCombos={currentPlan.outfit_combinations}
                  />
                </TabsContent>

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
        </AnimatePresence>
      </main>

      <footer className="mt-20 pt-8 border-t border-neutral-200/80 dark:border-neutral-800 text-center font-mono text-xs text-neutral-400 dark:text-neutral-500">
        <p>PackSmart AI • Editorial Monochrome Travel & Wardrobe Stylist</p>
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;
