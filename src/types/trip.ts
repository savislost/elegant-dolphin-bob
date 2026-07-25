export type TripVibe = 'Minimalist Streetwear' | 'Beach Casual' | 'Formal/Business' | 'Outdoor/Adventure' | 'Nightlife & Glam';

export type WeatherForecast = 'Sunny & Hot' | 'Cool & Rainy' | 'Cold & Snowy' | 'Mild & Humid';

export interface TripInput {
  destination: string;
  durationDays: number;
  vibe: TripVibe;
  weather: WeatherForecast;
}

export interface CapsuleItem {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Shoes' | 'Accessories';
  color: string;
  versatilityTip: string;
  quantity: number;
}

export interface OutfitCombo {
  id: string;
  dayLabel: string; // e.g. "Day 1 - Sightseeing & Arrival"
  vibe: string;
  itemsIncluded: string[]; // item names or IDs
  stylingNotes: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Skincare & Sun' | 'Tech & Gear' | 'Documents & Carry' | 'Weather & Extras' | 'Clothing';
  packed: boolean;
  recommendationReason?: string;
  isCustom?: boolean;
}

export interface GeneratedPackingPlan {
  destination: string;
  durationDays: number;
  vibe: TripVibe;
  weather: WeatherForecast;
  createdAt: string;
  capsuleWardrobe: CapsuleItem[];
  outfitCombos: OutfitCombo[];
  essentialsChecklist: PackingItem[];
}