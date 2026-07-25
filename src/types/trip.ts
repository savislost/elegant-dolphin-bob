export interface CityInfo {
  weather_summary: string; // e.g. "18°C • Breezy & Autumnal"
  auto_vibe: string;       // e.g. "Minimalist Tailoring & Trench Coats"
  local_highlights: string[]; // 3 concise, curated city tips
}

export interface CapsuleItem {
  id: string;
  category: 'Top' | 'Bottom' | 'Outerwear' | 'Shoes' | 'Accessories';
  item: string;
  reason: string;
}

export interface OutfitCombo {
  id: string;
  title: string;
  items: string[];
}

export interface EssentialItem {
  id: string;
  name: string;
  category: 'Skincare & Sun' | 'Tech & Gear' | 'Documents & Carry' | 'Weather & Extras';
  packed: boolean;
  isCustom?: boolean;
}

export interface GeneratedPackingPlan {
  location: string;
  durationDays: number;
  createdAt: string;
  city_info: CityInfo;
  capsule_wardrobe: CapsuleItem[];
  outfit_combinations: OutfitCombo[];
  essentialsChecklist: EssentialItem[];
}