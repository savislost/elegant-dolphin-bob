import { GeneratedPackingPlan, TripInput, CapsuleItem, OutfitCombo, PackingItem } from '@/types/trip';

const GEMINI_API_KEY = 'AQ.Ab8RN6KgS5orjIqnNnGxR0rX8qAMlqnHkF2oMqtiXOT372Yg6A';

export async function generatePackingPlanWithGemini(input: TripInput): Promise<GeneratedPackingPlan> {
  const prompt = `
You are PackSmart AI, an expert minimalist travel stylist and packing strategist.
Generate a tailored travel capsule wardrobe and essentials packing checklist for:
- Destination: ${input.destination}
- Duration: ${input.durationDays} days
- Vibe/Style: ${input.vibe}
- Weather Forecast: ${input.weather}

Return ONLY a valid JSON object strictly matching this TypeScript structure:
{
  "capsuleWardrobe": [
    {
      "id": "c1",
      "name": "White Linen Oversized Shirt",
      "category": "Tops",
      "color": "Crisp White",
      "versatilityTip": "Wear unbuttoned over tees or dressed up with trousers",
      "quantity": 2
    }
  ],
  "outfitCombos": [
    {
      "id": "o1",
      "dayLabel": "Day 1 - Arrival & Sightseeing",
      "vibe": "${input.vibe}",
      "itemsIncluded": ["White Linen Oversized Shirt", "Tailored Chino Shorts", "White Leather Sneakers"],
      "stylingNotes": "Keep it breezy for walking around the city upon check-in."
    }
  ],
  "essentialsChecklist": [
    {
      "id": "p1",
      "name": "Broad-spectrum SPF 50 Mineral Sunscreen",
      "category": "Skincare & Sun",
      "packed": false,
      "recommendationReason": "Essential for high UV protection in ${input.weather} conditions."
    }
  ]
}

Ensure:
1. "capsuleWardrobe" contains 5-8 highly versatile items across Tops, Bottoms, Outerwear, Shoes, Accessories tailored to ${input.vibe}.
2. "outfitCombos" contains ${Math.min(input.durationDays, 5)} distinct outfit ideas for different days using items from capsuleWardrobe.
3. "essentialsChecklist" contains 12-16 items categorized into:
   - "Skincare & Sun": Exact sunscreen SPF, lip balm, moisturizer, grooming kit based on ${input.weather}
   - "Tech & Gear": Power bank (e.g. 10,000mAh), universal travel adapter, charging cables, noise-canceling earbuds
   - "Documents & Carry": Passport, slim RFID wallet, digital copy, local cash/card
   - "Weather & Extras": Compact UV umbrella or packable rain jacket, sunglasses, reusable water bottle.
Do NOT output markdown formatting around JSON like \`\`\`json. Return raw JSON string.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn('Gemini API request failed with status:', response.status);
      return generateFallbackPackingPlan(input);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return generateFallbackPackingPlan(input);
    }

    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    return {
      destination: input.destination,
      durationDays: input.durationDays,
      vibe: input.vibe,
      weather: input.weather,
      createdAt: new Date().toISOString(),
      capsuleWardrobe: parsed.capsuleWardrobe || [],
      outfitCombos: parsed.outfitCombos || [],
      essentialsChecklist: (parsed.essentialsChecklist || []).map((item: Partial<PackingItem>, idx: number) => ({
        id: item.id || `gen-${idx}-${Date.now()}`,
        name: item.name || 'Essential Item',
        category: item.category || 'Weather & Extras',
        packed: false,
        recommendationReason: item.recommendationReason || 'Recommended for your trip',
      })),
    };
  } catch (error) {
    console.error('Error fetching from Gemini Flash:', error);
    return generateFallbackPackingPlan(input);
  }
}

// Fallback intelligent generator for fast offline reliability
export function generateFallbackPackingPlan(input: TripInput): GeneratedPackingPlan {
  const isHot = input.weather.includes('Sunny') || input.weather.includes('Humid');
  const isRainy = input.weather.includes('Rainy');
  const isCold = input.weather.includes('Cold');

  const capsule: CapsuleItem[] = [];
  const outfits: OutfitCombo[] = [];
  const items: PackingItem[] = [];

  // 1. Capsule Wardrobe
  if (input.vibe === 'Beach Casual' || isHot) {
    capsule.push(
      { id: 'c1', name: 'Breezy Linen Shirt', category: 'Tops', color: 'Sand Beige', versatilityTip: 'Great for day walks or beach lounges', quantity: 2 },
      { id: 'c2', name: 'Organic Cotton Crew Tee', category: 'Tops', color: 'White / Navy', versatilityTip: 'Layerable base layer', quantity: 3 },
      { id: 'c3', name: 'Quick-Dry Chino Shorts', category: 'Bottoms', color: 'Olive Green', versatilityTip: 'Comfortable stretch for walking', quantity: 2 },
      { id: 'c4', name: 'Lightweight Linen Trousers', category: 'Bottoms', color: 'Off-White', versatilityTip: 'Evening dinners and casual outings', quantity: 1 },
      { id: 'c5', name: 'Breathable Knit Sneakers', category: 'Shoes', color: 'White', versatilityTip: 'All-day comfort sightseeing shoes', quantity: 1 },
      { id: 'c6', name: 'Polarized UV Sunglasses', category: 'Accessories', color: 'Matte Black', versatilityTip: 'Daily eye protection', quantity: 1 }
    );
  } else if (input.vibe === 'Formal/Business') {
    capsule.push(
      { id: 'c1', name: 'Wrinkle-Free Oxford Shirt', category: 'Tops', color: 'Sky Blue & White', versatilityTip: 'Pairs with suits or dark denim', quantity: 3 },
      { id: 'c2', name: 'Tailored Unstructured Blazer', category: 'Outerwear', color: 'Charcoal Navy', versatilityTip: 'Instant elevate for meetings and dinners', quantity: 1 },
      { id: 'c3', name: 'Slim Stretch Dress Trousers', category: 'Bottoms', color: 'Dark Grey', versatilityTip: 'Comfortable for flights and meetings', quantity: 2 },
      { id: 'c4', name: 'Italian Leather Loafers', category: 'Shoes', color: 'Espresso Brown', versatilityTip: 'Easy slip-on security check', quantity: 1 },
      { id: 'c5', name: 'Minimalist Leather Belt', category: 'Accessories', color: 'Black/Brown Dual', versatilityTip: 'Reversible versatility', quantity: 1 }
    );
  } else {
    capsule.push(
      { id: 'c1', name: 'Heavyweight Graphic Tee', category: 'Tops', color: 'Washed Black', versatilityTip: 'Core streetwear top', quantity: 2 },
      { id: 'c2', name: 'Over-sized Oxford Overshirt', category: 'Tops', color: 'Khaki', versatilityTip: 'Layer over tees or wear solo', quantity: 1 },
      { id: 'c3', name: 'Relaxed Tapered Cargo Pants', category: 'Bottoms', color: 'Charcoal', versatilityTip: 'Deep pockets for travel tech', quantity: 2 },
      { id: 'c4', name: isCold ? 'Puffer Shell Jacket' : 'Water-Resistant Windbreaker', category: 'Outerwear', color: 'Slate Grey', versatilityTip: 'Weather defense layer', quantity: 1 },
      { id: 'c5', name: 'Retro Runner Sneakers', category: 'Shoes', color: 'Multi Neutral', versatilityTip: 'High support for multi-mile walks', quantity: 1 }
    );
  }

  // 2. Outfits
  outfits.push(
    {
      id: 'o1',
      dayLabel: 'Day 1 - Departure & Exploration',
      vibe: input.vibe,
      itemsIncluded: [capsule[1]?.name || 'Cotton Tee', capsule[2]?.name || 'Pants', capsule[4]?.name || 'Sneakers'],
      stylingNotes: 'Comfortable layers for transit with quick access to essentials.',
    },
    {
      id: 'o2',
      dayLabel: 'Day 2 - Main Destination Highlights',
      vibe: input.vibe,
      itemsIncluded: [capsule[0]?.name || 'Shirt', capsule[2]?.name || 'Bottoms', capsule[4]?.name || 'Shoes'],
      stylingNotes: 'Crisp styling for photos, cafe stops, and city walking.',
    },
    {
      id: 'o3',
      dayLabel: 'Day 3 - Sunset & Dinner Vibe',
      vibe: input.vibe,
      itemsIncluded: [capsule[0]?.name || 'Shirt', capsule[3]?.name || 'Trousers', capsule[capsule.length - 1]?.name || 'Accessories'],
      stylingNotes: 'Elevated clean aesthetic tailored for evening atmosphere.',
    }
  );

  // 3. Essentials Checklist
  items.push(
    // Skincare
    { id: 'e1', name: isHot ? 'SPF 50 Water-Resistant Sunscreen' : 'Hydrating Daily Facial Moisturizer', category: 'Skincare & Sun', packed: false, recommendationReason: `Tailored for ${input.weather} weather.` },
    { id: 'e2', name: 'SPF 15 Hydrating Lip Balm', category: 'Skincare & Sun', packed: false, recommendationReason: 'Prevents dry lips during flights.' },
    { id: 'e3', name: 'Travel TSA Grooming Kit (Toothbrush, Paste, Floss)', category: 'Skincare & Sun', packed: false, recommendationReason: 'TSA 3-1-1 compliant size.' },
    // Tech
    { id: 'e4', name: '10,000mAh Magnetic Power Bank', category: 'Tech & Gear', packed: false, recommendationReason: 'Keep phone charged during full day navigation.' },
    { id: 'e5', name: 'Universal Travel Adapter (Global Plugs)', category: 'Tech & Gear', packed: false, recommendationReason: 'Crucial for destination electrical sockets.' },
    { id: 'e6', name: 'Noise-Canceling Wireless Earbuds', category: 'Tech & Gear', packed: false, recommendationReason: 'In-flight isolation and commute focus.' },
    { id: 'e7', name: 'Multi-Cable Braided Charger (USB-C & Lightning)', category: 'Tech & Gear', packed: false, recommendationReason: 'Fast charges all devices simultaneously.' },
    // Docs
    { id: 'e8', name: 'Passport / National ID & Cover', category: 'Documents & Carry', packed: false, recommendationReason: 'Core identification essential.' },
    { id: 'e9', name: 'Slim RFID Blocking Wallet & Backup Cards', category: 'Documents & Carry', packed: false, recommendationReason: 'Protects contact-less payment cards.' },
    { id: 'e10', name: 'Digital Travel Insurance & Boarding Pass Backup', category: 'Documents & Carry', packed: false, recommendationReason: 'Offline phone screenshot ready.' },
    // Weather & Extras
    { id: 'e11', name: isRainy ? 'Ultralight Automatic Rain Umbrella' : isHot ? 'Polarized UV Sunglasses' : 'Thermal Neck Gaiter', category: 'Weather & Extras', packed: false, recommendationReason: `Engineered for ${input.weather} conditions.` },
    { id: 'e12', name: 'Vacuum Insulated Stainless Water Bottle (500ml)', category: 'Weather & Extras', packed: false, recommendationReason: 'Eco hydration at airport refilling stations.' },
    { id: 'e13', name: 'Compact Microfiber Quick-Dry Towel', category: 'Weather & Extras', packed: false, recommendationReason: 'Versatile emergency wipe or beach mat.' }
  );

  return {
    destination: input.destination,
    durationDays: input.durationDays,
    vibe: input.vibe,
    weather: input.weather,
    createdAt: new Date().toISOString(),
    capsuleWardrobe: capsule,
    outfitCombos: outfits,
    essentialsChecklist: items,
  };
}