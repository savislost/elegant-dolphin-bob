import { useState, useEffect } from 'react';
import { GeneratedPackingPlan, EssentialItem } from '@/types/trip';

const STORAGE_KEY = 'packsmart_mono_plan_v3';
const HISTORY_KEY = 'packsmart_saved_history_v3';

export function useTripStore() {
  const [currentPlan, setCurrentPlan] = useState<GeneratedPackingPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<GeneratedPackingPlan[]>([]);
  const [filter, setFilter] = useState<'all' | 'unpacked' | 'packed'>('all');

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem(STORAGE_KEY);
      if (storedPlan) {
        setCurrentPlan(JSON.parse(storedPlan));
      }
      const storedSaved = localStorage.getItem(HISTORY_KEY);
      if (storedSaved) {
        setSavedTrips(JSON.parse(storedSaved));
      }
    } catch (e) {
      console.error('Failed to parse saved trips', e);
    }
  }, []);

  const savePlan = (plan: GeneratedPackingPlan) => {
    setCurrentPlan(plan);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      setSavedTrips((prev) => {
        const filtered = prev.filter((p) => p.location.toLowerCase() !== plan.location.toLowerCase());
        const updated = [plan, ...filtered.slice(0, 8)];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Failed to save plan', e);
    }
  };

  const toggleItemPacked = (itemId: string) => {
    if (!currentPlan) return;
    const updatedChecklist = currentPlan.essentialsChecklist.map((item) =>
      item.id === itemId ? { ...item, packed: !item.packed } : item
    );
    const updatedPlan = { ...currentPlan, essentialsChecklist: updatedChecklist };
    savePlan(updatedPlan);
  };

  const addCustomItem = (name: string, category: EssentialItem['category']) => {
    if (!currentPlan || !name.trim()) return;
    const newItem: EssentialItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      packed: false,
      isCustom: true,
    };
    const updatedPlan = {
      ...currentPlan,
      essentialsChecklist: [...currentPlan.essentialsChecklist, newItem],
    };
    savePlan(updatedPlan);
  };

  const deleteCustomItem = (itemId: string) => {
    if (!currentPlan) return;
    const updatedChecklist = currentPlan.essentialsChecklist.filter((item) => item.id !== itemId);
    const updatedPlan = { ...currentPlan, essentialsChecklist: updatedChecklist };
    savePlan(updatedPlan);
  };

  const resetCheckedState = () => {
    if (!currentPlan) return;
    const updatedChecklist = currentPlan.essentialsChecklist.map((item) => ({ ...item, packed: false }));
    const updatedPlan = { ...currentPlan, essentialsChecklist: updatedChecklist };
    savePlan(updatedPlan);
  };

  const loadSavedTrip = (plan: GeneratedPackingPlan) => {
    setCurrentPlan(plan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  };

  const totalItems = currentPlan?.essentialsChecklist.length || 0;
  const packedItemsCount = currentPlan?.essentialsChecklist.filter((i) => i.packed).length || 0;
  const progressPercentage = totalItems > 0 ? Math.round((packedItemsCount / totalItems) * 100) : 0;

  return {
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
    stats: {
      totalItems,
      packedItemsCount,
      progressPercentage,
    },
  };
}