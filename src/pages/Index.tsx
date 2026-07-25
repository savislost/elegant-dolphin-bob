import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TripBuilderModal } from '@/components/TripBuilderModal';
import { ProgressHeader } from '@/components/ProgressHeader';
import { CapsuleWardrobe } from '@/components/CapsuleWardrobe';
import { EssentialsChecklist } from '@/components/EssentialsChecklist';
import { useTripStore } from '@/hooks/useTripStore';
import { generatePackingPlanWithGemini, generateFallbackPackingPlan } from '@/services/gemini';
import { TripInput } from '@/types/trip';
import { showSuccess, showError } from '@/utils/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Shirt, CheckSquare, Sparkles } from 'lucide-react';

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
    searchQuery,
    stats,
  } = useTripStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // Initialize with a default Tokyo plan on first visit if empty
  useEffect(() => {
    if (!currentPlan && savedTrips.length === 0) {
      const initialInput: TripInput = {
        destination: 'Tokyo, Japan',
        durationDays: 5,
        vibe: 'Minimalist Streetwear',
        weather: 'Cool & Rainy',
      };
      const initialPlan = generateFallbackPackingPlan(initialInput);
      savePlan(initialPlan);
    }
  }, []);

  const handleGeneratePlan = async (input: TripInput) => {
    setIsLoading(true);
    try {
      const newPlan = await generatePackingPlanWithGemini(input);
      savePlan(newPlan);
      setShowBuilderModal(false);
      showSuccess(`PackSmart AI curated packing plan for ${input.destination}!`);
    } catch (err) {
      console.error(err);
      showError('Generating with AI encountered an issue. Loaded fallback smart list!');
      const fallback = generateFallbackPackingPlan(input);
      savePlan(fallback);
      setShowBuilderModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateCurrent = async () => {
    if (!currentPlan) return;
    await handleGeneratePlan({
      destination: currentPlan.destination,
      durationDays: currentPlan.durationDays,
      vibe: currentPlan.vibe,
      weather: currentPlan.weather,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F17] via-[#0F172A] to-[#111827] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 pb-12">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-violet-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Header
        onNewTripClick={() => setShowBuilderModal(true)}
        savedTrips={savedTrips}
        onSelectSavedTrip={(plan) => {
          loadSavedTrip(plan);
          setShowBuilderModal(false);
          showSuccess(`Loaded packing plan for ${plan.destination}`);
        }}
        activeDestination={currentPlan?.destination}
      />

      <main className="max-w-6xl mx-auto px-4">
        {/* If user clicked "Plan New Trip" or no active plan */}
        {showBuilderModal || !currentPlan ? (
          <TripBuilderModal onGenerate={handleGeneratePlan} isLoading={isLoading} />
        ) : (
          <div className="space-y-6">
            {/* Liquid Glass Progress Header */}
            <ProgressHeader
              plan={currentPlan}
              packedCount={stats.packedItemsCount}
              totalCount={stats.totalItems}
              percentage={stats.progressPercentage}
              onReset={resetCheckedState}
              onRegenerate={handleRegenerateCurrent}
              activeFilter={filter}
              onFilterChange={setFilter}
            />

            {/* Dashboard Tabs */}
            <Tabs defaultValue="outfits" className="w-full">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                <TabsList className="bg-slate-900/80 border border-white/10 p-1 rounded-2xl backdrop-blur-xl">
                  <TabsTrigger
                    value="outfits"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs font-semibold rounded-xl px-4 py-2 transition-all flex items-center space-x-2"
                  >
                    <Shirt className="w-4 h-4" />
                    <span>Smart Outfit Planner</span>
                    <span className="ml-1 bg-white/20 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                      {currentPlan.capsuleWardrobe.length}
                    </span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="checklist"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-xs font-semibold rounded-xl px-4 py-2 transition-all flex items-center space-x-2"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Essentials Checklist</span>
                    <span className="ml-1 bg-white/20 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                      {currentPlan.essentialsChecklist.length}
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* Quick trip re-customize button */}
                <button
                  onClick={() => setShowBuilderModal(true)}
                  className="hidden sm:flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Customize Trip Settings</span>
                </button>
              </div>

              {/* Tab 1: Outfit Planner */}
              <TabsContent value="outfits" className="focus-visible:outline-none">
                <CapsuleWardrobe
                  capsuleItems={currentPlan.capsuleWardrobe}
                  outfitCombos={currentPlan.outfitCombos}
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
                  searchQuery={searchQuery}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
        <p>PackSmart AI • Engineered for Liquid Glass Minimalist Travel</p>
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;