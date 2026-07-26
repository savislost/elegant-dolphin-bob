import { GeneratedPackingPlan, EssentialItem } from '@/types/trip';

function getCacheKey(location: string, durationDays: number): string {
  return `packsmart_groq_cache_${location.toLowerCase().trim()}_${durationDays}`;
}

export async function generatePackingPlanWithGroq(
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

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    const err = new Error("Please check your VITE_GROQ_API_KEY in .env.local and try again.");
    console.error("Groq Raw Error:", err);
    throw err;
  }

  const prompt = `
You are PackSmart AI, an ultra-luxurious minimalist travel stylist and destination expert.
Analyze the location: "${location}" for a ${durationDays}-day trip.

Predict typical weather forecast, local aesthetic vibe, local packing tips, a capsule wardrobe, daily outfit combinations, and essential packing list.

Return ONLY a valid JSON object matching this exact TypeScript structure:
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
      "title": "Day 1: Arrival & Exploration",
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

  try {
    console.log(`[PackSmart AI] Sending request for "${location}" to Groq API (llama-3.3-70b-versatile)...`);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are PackSmart AI, an ultra-luxurious minimalist travel stylist and destination expert. Return ONLY valid JSON adhering strictly to the user's requested JSON structure."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq Raw Error:", response.status, errorText);
      throw new Error("Please check your VITE_GROQ_API_KEY in .env.local and try again.");
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty response content returned from Groq API.");
    }

    const parsed = JSON.parse(rawContent);

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

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(resultPlan));
    } catch (e) {
      console.warn('[PackSmart AI] Failed to save result to sessionStorage:', e);
    }

    console.log(`✅ Groq API call succeeded for "${location}"!`);
    return resultPlan;
  } catch (error: any) {
    console.error("Groq Raw Error:", error);
    throw new Error("Please check your VITE_GROQ_API_KEY in .env.local and try again.");
  }
}