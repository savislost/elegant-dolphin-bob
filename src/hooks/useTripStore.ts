import { useState, useEffect } from 'react';
import { GeneratedPackingPlan, PackingItem } from '@/types/trip';

const STORAGE_KEY = 'packsmart_active_plan_v2';
const SAVED_TRIPS_KEY = 'packsmart_saved_trips_v2';

export function useTripStore() {
  const [currentPlan, setCurrentPlan] = useState<GeneratedPackingPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<GeneratedPackingPlan[]>([]);
  const [filter, setFilter] = useState<'all' | 'unpacked' | 'packed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial state
  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem(STORAGE_KEY);
      if (storedPlan) {
        setCurrentPlan(JSON.parse(storedPlan));
      }
      const storedSaved = localStorage.getItem(SAVED_TRIPS_KEY);
      if (storedSaved) {
        setSavedTrips(JSON.parse(storedSaved));
      }
    } catch (e) {
      console.error('Failed to parse saved trips from storage', e);
    }
  }, []);

  // Sync current plan to localStorage
  const savePlan = (plan: GeneratedPackingPlan) => {
    setCurrentPlan(plan);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      // Also add to saved trips history if not present
      setSavedTrips((prev) => {
        const exists = prev.some((p) => p.destination === plan.destination && p.createdAt === plan.createdAt);
        if (exists) {
          const updated = prev.map((p) => (p.destination === plan.destination && p.createdAt === plan.createdAt ? plan : p));
          localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(updated));
          return updated;
        } else {
          const updated = [plan, ...prev.slice(0, 9)];
          localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(updated));
          return updated;
        }
      });
    } catch (e) {
      console.error('Failed to save plan to localStorage', e);
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

  const addCustomItem = (name: string, category: PackingItem['category']) => {
    if (!currentPlan || !name.trim()) return;
    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      packed: false,
      isCustom: true,
      recommendationReason: 'Added manually by you',
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

  const deleteSavedTrip = (index: number) => {
    setSavedTrips((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Stats calculation
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
    deleteSavedTrip,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats: {
      totalItems,
      packedItemsCount,
      progressPercentage,
    },
  };
}