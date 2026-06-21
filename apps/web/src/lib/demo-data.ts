export const DEMO_USER = {
  id: "demo_user_001",
  name: "Sophia Chen",
  email: "sophia@beautyiq.ai",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia&backgroundColor=b6e3f4",
  plan: "PREMIUM" as const,
};

export const DEMO_SKIN_PROFILE = {
  skinTone: "Medium",
  undertone: "Warm",
  skinType: "Combination",
  beautyScore: 87,
  healthScore: 82,
  grade: "A",
  concerns: [
    { name: "Hyperpigmentation", severity: "Moderate", score: 65 },
    { name: "Fine Lines", severity: "Mild", score: 78 },
    { name: "Uneven Texture", severity: "Mild", score: 80 },
    { name: "Dehydration", severity: "Low", score: 88 },
  ],
  foundationShades: [
    { brand: "Fenty Beauty", shade: "235N", hex: "#C8956C" },
    { brand: "MAC", shade: "NC35", hex: "#C4875A" },
    { brand: "NARS", shade: "Syracuse", hex: "#C99A73" },
  ],
};

export const DEMO_SCANS = [
  {
    id: "scan_001",
    date: "2026-06-15",
    beautyScore: 87,
    healthScore: 82,
    grade: "A",
    thumbnail: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
  },
  {
    id: "scan_002",
    date: "2026-06-08",
    beautyScore: 84,
    healthScore: 79,
    grade: "B+",
    thumbnail: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
  },
  {
    id: "scan_003",
    date: "2026-06-01",
    beautyScore: 81,
    healthScore: 76,
    grade: "B",
    thumbnail: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80",
  },
];

export const DEMO_PRODUCTS = [
  {
    id: "prod_001",
    name: "Hydra-Boost Serum",
    brand: "CeraVe",
    category: "Serum",
    safetyScore: 95,
    rating: 4.8,
    price: 18.99,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    tags: ["Hydrating", "Fragrance-Free", "Dermatologist Tested"],
  },
  {
    id: "prod_002",
    name: "Vitamin C Brightening Cream",
    brand: "La Roche-Posay",
    category: "Moisturizer",
    safetyScore: 91,
    rating: 4.6,
    price: 34.99,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80",
    tags: ["Brightening", "SPF 30", "Anti-Aging"],
  },
  {
    id: "prod_003",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "Serum",
    safetyScore: 98,
    rating: 4.7,
    price: 6.99,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=300&q=80",
    tags: ["Pore Minimizing", "Oil Control", "Cruelty-Free"],
  },
  {
    id: "prod_004",
    name: "Barrier Repair Moisturizer",
    brand: "Cetaphil",
    category: "Moisturizer",
    safetyScore: 94,
    rating: 4.5,
    price: 15.99,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80",
    tags: ["Sensitive Skin", "Fragrance-Free", "24hr Hydration"],
  },
  {
    id: "prod_005",
    name: "SPF 50 Mineral Sunscreen",
    brand: "EltaMD",
    category: "Sunscreen",
    safetyScore: 97,
    rating: 4.9,
    price: 42.00,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    tags: ["Mineral", "Broad Spectrum", "Non-Comedogenic"],
  },
  {
    id: "prod_006",
    name: "Retinol 0.5% Serum",
    brand: "Paula's Choice",
    category: "Treatment",
    safetyScore: 85,
    rating: 4.4,
    price: 52.00,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=300&q=80",
    tags: ["Anti-Aging", "Resurfacing", "Night Use"],
  },
];

export const DEMO_ROUTINE = {
  morning: [
    { step: 1, name: "Gentle Cleanser", product: "CeraVe Hydrating Cleanser", duration: "60s", emoji: "🧴", tip: "Use lukewarm water to avoid stripping natural oils." },
    { step: 2, name: "Vitamin C Serum", product: "TruSkin Vitamin C Serum", duration: "30s", emoji: "✨", tip: "Apply to damp skin for better absorption." },
    { step: 3, name: "Niacinamide", product: "The Ordinary Niacinamide 10%", duration: "30s", emoji: "💧", tip: "Great for pore minimizing and oil control." },
    { step: 4, name: "Moisturizer", product: "CeraVe AM Moisturizer", duration: "60s", emoji: "🌿", tip: "Lock in all your serums with a good moisturizer." },
    { step: 5, name: "SPF 50", product: "EltaMD UV Clear", duration: "60s", emoji: "☀️", tip: "The most important step — never skip sunscreen!" },
  ],
  evening: [
    { step: 1, name: "Oil Cleanser", product: "DHC Deep Cleansing Oil", duration: "90s", emoji: "🫧", tip: "Double cleanse to remove SPF and makeup fully." },
    { step: 2, name: "Gel Cleanser", product: "COSRX Low pH Good Morning Gel", duration: "60s", emoji: "🧼", tip: "Second cleanse removes remaining impurities." },
    { step: 3, name: "Exfoliant (2x/week)", product: "Paula's Choice BHA", duration: "30s", emoji: "🔬", tip: "Don't over-exfoliate — 2–3 times per week max." },
    { step: 4, name: "Retinol Serum", product: "Paula's Choice Retinol 0.5%", duration: "30s", emoji: "🌙", tip: "Start slow — 2x/week and build up tolerance." },
    { step: 5, name: "Night Cream", product: "La Roche-Posay Cicaplast Baume", duration: "60s", emoji: "💤", tip: "Rich overnight repair while you sleep." },
  ],
};

export const DEMO_TRACKER = {
  metrics: [
    { label: "Beauty Score", value: 87, change: +6, unit: "/100" },
    { label: "Hydration", value: 74, change: +12, unit: "%" },
    { label: "Texture", value: 81, change: +8, unit: "/100" },
    { label: "Brightness", value: 79, change: +5, unit: "/100" },
  ],
  chartData: [
    { date: "May 1", beauty: 74, health: 70 },
    { date: "May 8", beauty: 76, health: 72 },
    { date: "May 15", beauty: 79, health: 75 },
    { date: "May 22", beauty: 81, health: 77 },
    { date: "Jun 1", beauty: 83, health: 79 },
    { date: "Jun 8", beauty: 84, health: 80 },
    { date: "Jun 15", beauty: 87, health: 82 },
  ],
};

export const DEMO_POSTS = [
  {
    id: "post_001",
    author: "Maya Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
    time: "2h ago",
    content: "Finally found my HG moisturizer after months of searching! The CeraVe Moisturizing Cream completely transformed my dry skin. My BeautyIQ score went from 71 to 85 in just 3 weeks! 🌿",
    tags: ["CeraVe", "DrySkintips", "SkincareWins"],
    likes: 142,
    comments: 28,
  },
  {
    id: "post_002",
    author: "Aisha Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha",
    time: "5h ago",
    content: "PSA: Always check ingredients before buying! BeautyIQ AI flagged a serum I almost bought for having oxybenzone AND fragrance. Saved me from a breakout for sure 🙏",
    tags: ["IngredientCheck", "SkincareEducation", "BeautyIQSaved"],
    likes: 287,
    comments: 54,
  },
  {
    id: "post_003",
    author: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    time: "1d ago",
    content: "6-month skin journey update! The AI routine suggestions have been spot-on. Hyperpigmentation is fading and my texture has improved so much. Consistency is key! ✨",
    tags: ["SkinJourney", "6MonthUpdate", "Consistency"],
    likes: 431,
    comments: 87,
  },
];

export const DEMO_CHAT_RESPONSES: Record<string, string> = {
  default: "Based on your skin profile, I'd recommend focusing on hydration and gentle exfoliation. Your combination skin does best with a balanced routine — not too heavy, not too light. Would you like specific product recommendations?",
  ingredients: "I can analyze any ingredient list for you! Common ones to watch out for include: **Fragrance/Parfum** (irritant), **Oxybenzone** (hormone disruptor), **Formaldehyde releasers** (carcinogen concern), and **Parabens** (preservatives with controversy). Safe favorites include Hyaluronic Acid, Niacinamide, Ceramides, and Centella Asiatica.",
  routine: "For your skin type (combination, warm undertone), here's what I recommend: Morning → Gentle cleanser → Vitamin C → Niacinamide → Moisturizer → SPF 50. Evening → Double cleanse → Chemical exfoliant (2x/week) → Retinol (start slow) → Rich moisturizer. Keep it simple and consistent!",
  score: "Your current BeautyIQ score is **87/100** — that's excellent! 🌟 The score is calculated from your skin health indicators, hydration levels, texture consistency, and overall skin clarity. You've improved 6 points since last month, mainly from improved hydration.",
};
