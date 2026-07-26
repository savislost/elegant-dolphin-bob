import { GeneratedPackingPlan, EssentialItem, CapsuleItem } from '@/types/trip';

// Session Cache Key helper
function getCacheKey(location: string, durationDays: number): string {
  return `packsmart_cache_${location.toLowerCase().trim()}_${durationDays}`;
}

// Sleep helper for backoff delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generatePackingPlanWithGemini(
  location: string,
  durationDays: number = 5
): Promise<GeneratedPackingPlan> {
  // 1. Check local session cache first
  const cacheKey = getCacheKey(location, durationDays);
  try {
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      console.log(`[PackSmart AI] Loaded "${location}" from session cache.`);
      return JSON.parse(cachedData) as GeneratedPackingPlan;
    }
  } catch (e) {
    console.warn('[PackSmart AI] Cache lookup failed:', e);
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    const err = new Error("VITE_GEMINI_API_KEY is missing in .env.local");
    console.error("Gemini Raw Error:", err);
    throw err;
  }

  const prompt = `
You are PackSmart AI, an ultra-luxurious minimalist travel stylist and destination expert.
The user is planning a ${durationDays}-day trip to: "${location}".

Analyze this location, predict typical forecast/climate for this place, local aesthetic vibe, and curate a minimal capsule wardrobe & packing checklist.

Return ONLY a valid JSON object matching this TypeScript structure:
{
  "city_info": {
    "weather_summary": "18°C • Breezy & Autumnal",
    "auto_vibe": "Minimalist Tailoring & Trench Coats",
    "local_highlights": [
      "Respect local etiquette: Keep voice low on public transit",
      "Must Visit: Independent third-wave espresso bar in central district",
      "Packing Tip: Lightweight layerable pieces for variable evening breezes"
    ]
  },
  "capsule_wardrobe": [
    {
      "category": "Top",
      "item": "Structured Crisp White Oxford Shirt",
      "reason": "Versatile base layer that transitions effortlessly from morning coffee to evening dining."
    },
    {
      "category": "Bottom",
      "item": "Tailored Pleated Trousers",
      "reason": "Comfortable for walking with an elevated silhouette."
    },
    {
      "category": "Outerwear",
      "item": "Unstructured Wool Trench Coat",
      "reason": "Essential outer defense against cooler city drafts."
    },
    {
      "category": "Shoes",
      "item": "Leather Minimalist Loafers",
      "reason": "High-mileage walking comfort with clean architectural lines."
    },
    {
      "category": "Accessories",
      "item": "Matte Black Acetate Sunglasses",
      "reason": "Protects against glare during daytime urban strolls."
    }
  ],
  "outfit_combinations": [
    {
      "title": "Day 1: Arrival & Architectural Exploration",
      "items": ["Structured Crisp White Oxford Shirt", "Tailored Pleated Trousers", "Leather Minimalist Loafers"]
    },
    {
      "title": "Day 2: Museum & Neighborhood Wandering",
      "items": ["Unstructured Wool Trench Coat", "Structured Crisp White Oxford Shirt", "Matte Black Acetate Sunglasses"]
    },
    {
      "title": "Day 3: Fine Dining & Evening Lounge",
      "items": ["Unstructured Wool Trench Coat", "Tailored Pleated Trousers", "Leather Minimalist Loafers"]
    }
  ],
  "essentials": {
    "skincare_sun": [
      "SPF 50 Mineral Broad-Spectrum Sunscreen",
      "Hydrating Barrier Cream",
      "Lip Moisture Balm"
    ],
    "tech_gear": [
      "Compact 10,000mAh Power Bank",
      "Universal Global Plug Adapter",
      "Noise-Canceling Wireless Earbuds",
      "Braided Fast-Charging USB-C Cable"
    ],
    "documents": [
      "Passport / Identity Card",
      "Slim RFID-Blocking Cardholder",
      "Digital Travel Insurance & Screenshots"
    ],
    "weather_extras": [
      "Automatic Compact Umbrella",
      "Stainless Vacuum Hydration Flask"
    ]
  }
}
`;

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
  const MAX_RETRIES = 2;
  let lastError: Error | null = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[PackSmart AI] Sending request for location "${location}" using model "${model}" (Attempt ${attempt}/${MAX_RETRIES})...`);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.3,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini Raw Error:", errorText);

          if (errorText.includes("limit: 0") || errorText.includes("limit:0") || errorText.includes("quotaExceeded")) {
            throw new Error("API Key Quota is 0. Please create a new key under a new Google AI Studio project.");
          }

          if (response.status === 429 || errorText.includes("429") || errorText.includes("RESOURCE_EXHAUSTED")) {
            if (attempt < MAX_RETRIES) {
              const delayMs = attempt * 3000;
              console.warn(`[PackSmart AI] HTTP 429 on attempt ${attempt}. Retrying in ${delayMs / 1000}s...`);
              await sleep(delayMs);
              continue;
            } else {
              throw new Error("Rate limit reached. Please wait 15-30 seconds.");
            }
          }

          throw new Error(`HTTP ${response.status} (${model}): ${errorText}`);
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          const emptyMsg = `Empty response content returned from model ${model}`;
          console.error("Gemini Raw Error:", emptyMsg);
          throw new Error(emptyMsg);
        }

        // Clean Markdown fences
        const cleanText = rawText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanText);

        const essentialsList: EssentialItem[] = [];
        let idx = 0;

        const skincareList = parsed.essentials?.skincare_sun || [];
        skincareList.forEach((item: string) => {
          essentialsList.push({ id: `e-${idx++}`, name: item, category: 'Skincare & Sun', packed: false });
        });

        const techList = parsed.essentials?.tech_gear || [];
        techList.forEach((item: string) => {
          essentialsList.push({ id: `e-${idx++}`, name: item, category: 'Tech & Gear', packed: false });
        });

        const docList = parsed.essentials?.documents || [];
        docList.forEach((item: string) => {
          essentialsList.push({ id: `e-${idx++}`, name: item, category: 'Documents & Carry', packed: false });
        });

        const weatherList = parsed.essentials?.weather_extras || [];
        weatherList.forEach((item: string) => {
          essentialsList.push({ id: `e-${idx++}`, name: item, category: 'Weather & Extras', packed: false });
        });

        const resultPlan: GeneratedPackingPlan = {
          location,
          durationDays,
          createdAt: new Date().toISOString(),
          city_info: {
            weather_summary: parsed.city_info?.weather_summary || '20°C • Temperate',
            auto_vibe: parsed.city_info?.auto_vibe || 'Minimalist Chic',
            local_highlights: parsed.city_info?.local_highlights || [
              'Stay hydrated with a refillable water bottle.',
              'Keep digital screenshots of your flight & lodging bookings offline.',
              'Pack versatile neutral layers for variable weather.'
            ],
          },
          capsule_wardrobe: (parsed.capsule_wardrobe || []).map((c: any, i: number) => ({
            id: `c-${i}`,
            category: c.category || 'Top',
            item: c.item || 'Cotton Crew Tee',
            reason: c.reason || 'Essential everyday base layer',
          })),
          outfit_combinations: (parsed.outfit_combinations || []).map((o: any, i: number) => ({
            id: `o-${i}`,
            title: o.title || `Day ${i + 1} Outfit`,
            items: o.items || [],
          })),
          essentialsChecklist: essentialsList,
        };

        // Cache in sessionStorage for remaining session
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(resultPlan));
        } catch (e) {
          console.warn('[PackSmart AI] Failed to save result to sessionStorage:', e);
        }

        console.log(`✅ Gemini API call succeeded for "${location}" using model "${model}"!`);
        return resultPlan;

      } catch (error: any) {
        console.error("Gemini Raw Error:", error);
        lastError = error;
        if (error?.message?.includes("API Key Quota is 0")) {
          throw error;
        }
      }
    }
  }

  throw lastError || new Error('Failed to generate packing plan with Gemini API');
}

export function generateFallbackPackingPlan(location: string, durationDays: number = 5): GeneratedPackingPlan {
  const isKyotoOrTokyo = location.toLowerCase().includes('japan') || location.toLowerCase().includes('tokyo') || location.toLowerCase().includes('kyoto');
  const isTropical = location.toLowerCase().includes('bali') || location.toLowerCase().includes('goa') || location.toLowerCase().includes('beach');

  const cityInfo = {
    weather_summary: isTropical ? '29°C • Sunny & Tropical' : '17°C • Cool & Clear',
    auto_vibe: isTropical ? 'Breezy Linen & Resort Minimalist' : 'Architectural Streetwear & Trench Layers',
    local_highlights: [
      isKyotoOrTokyo ? 'Etiquette: Maintain quiet tones on public train networks.' : 'Local Tip: Explore central district independent cafes in the morning.',
      'Navigation: Download offline vector map data before departing your hotel.',
      'Packing Insight: Stick to a 3-color palette for maximum capsule inter-matching.'
    ],
  };

  const capsule: CapsuleItem[] = [
    { id: 'c-1', category: 'Top', item: 'Oversized Poplin Cotton Shirt', reason: 'Unbutton over tees or button up for polished evening dining.' },
    { id: 'c-2', category: 'Top', item: 'Heavyweight Heavy Cotton Tee', reason: 'Structured silhouette that retains shape after full day wear.' },
    { id: 'c-3', category: 'Bottom', item: 'Relaxed Tapered Trousers', reason: 'Deep functional pockets and all-day movement comfort.' },
    { id: 'c-4', category: 'Outerwear', item: 'Water-Repellent Wind Shell Jacket', reason: 'Lightweight packable layer for evening wind chill.' },
    { id: 'c-5', category: 'Shoes', item: 'Architectural Minimalist Sneakers', reason: 'High cushioning for multi-mile city walks.' },
  ];

  const outfits = [
    { id: 'o-1', title: 'Day 1: Transit & Neighborhood Walk', items: ['Heavyweight Heavy Cotton Tee', 'Relaxed Tapered Trousers', 'Architectural Minimalist Sneakers'] },
    { id: 'o-2', title: 'Day 2: City Sightseeing & Galleries', items: ['Oversized Poplin Cotton Shirt', 'Relaxed Tapered Trousers', 'Architectural Minimalist Sneakers'] },
    { id: 'o-3', title: 'Day 3: Sunset Aperitif & Dinner', items: ['Water-Repellent Wind Shell Jacket', 'Oversized Poplin Cotton Shirt', 'Relaxed Tapered Trousers'] },
  ];

  const checklist: EssentialItem[] = [
    { id: 'e-1', name: 'SPF 50 Mineral Broad-Spectrum Sunscreen', category: 'Skincare & Sun', packed: false },
    { id: 'e-2', name: 'SPF Lip Protection Moisturizer', category: 'Skincare & Sun', packed: false },
    { id: 'e-3', name: 'TSA-Compliant Travel Toiletries Pouch', category: 'Skincare & Sun', packed: false },
    { id: 'e-4', name: '10,000mAh Magnetic Power Bank', category: 'Tech & Gear', packed: false },
    { id: 'e-5', name: 'Universal International Plug Adapter', category: 'Tech & Gear', packed: false },
    { id: 'e-6', name: 'Noise-Canceling Wireless Earbuds', category: 'Tech & Gear', packed: false },
    { id: 'e-7', name: 'Passport & Waterproof Document Sleeve', category: 'Documents & Carry', packed: false },
    { id: 'e-8', name: 'Slim RFID Cardholder & Emergency Cash', category: 'Documents & Carry', packed: false },
    { id: 'e-9', name: 'Automatic Pocket Umbrella', category: 'Weather & Extras', packed: false },
    { id: 'e-10', name: 'Double-Walled Insulated Water Flask', category: 'Weather & Extras', packed: false },
  ];

  return {
    location,
    durationDays,
    createdAt: new Date().toISOString(),
    city_info: cityInfo,
    capsule_wardrobe: capsule,
    outfit_combinations: outfits,
    essentialsChecklist: checklist,
  };
}