"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Star, ChevronRight, Lightbulb, ShieldCheck, Leaf, Zap, Droplets, Sun } from "lucide-react";

const CATS = ["All", "Cleanser", "Serum", "Moisturizer", "SPF", "Toner"];

const RECOMMENDATIONS = [
  {
    id: 1,
    name: "Gentle Foaming Cleanser",
    brand: "CeraVe",
    price: "$14.99",
    rating: 4.8,
    match: 96,
    cat: "Cleanser",
    img: "🧴",
    safe: true,
    badge: "Best Match",
    badgeColor: "#16A34A",
    badgeBg: "#F0FDF4",
    tip: "Use twice daily — morning and night. Massage onto damp skin for 30 seconds, then rinse with lukewarm water. Avoid hot water as it strips natural oils.",
    whyGood: "Fragrance-free, non-comedogenic, and packed with ceramides to restore your skin barrier.",
    keyIngredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
    skinBenefit: "Barrier Repair",
    benefitIcon: ShieldCheck,
  },
  {
    id: 2,
    name: "Hyaluronic Acid Serum",
    brand: "The Ordinary",
    price: "$8.90",
    rating: 4.9,
    match: 94,
    cat: "Serum",
    img: "💧",
    safe: true,
    badge: "Top Rated",
    badgeColor: "#2563EB",
    badgeBg: "#EFF4FF",
    tip: "Apply on damp skin right after cleansing. Layer it before your moisturizer to lock in hydration. Use morning and night for best results.",
    whyGood: "Multi-weight hyaluronic acid molecules hydrate at every skin layer — surface to deep.",
    keyIngredients: ["Hyaluronic Acid", "Sodium Hyaluronate", "Vitamin B5"],
    skinBenefit: "Deep Hydration",
    benefitIcon: Droplets,
  },
  {
    id: 3,
    name: "Moisturizing Cream SPF 30",
    brand: "La Roche-Posay",
    price: "$19.99",
    rating: 4.7,
    match: 91,
    cat: "SPF",
    img: "☀️",
    safe: true,
    badge: "Sun Essential",
    badgeColor: "#D97706",
    badgeBg: "#FFFBEB",
    tip: "Apply as the last step of your morning routine. Use a full teaspoon for your face. Reapply every 2 hours when outdoors — this is the #1 anti-aging step you can take.",
    whyGood: "Broad-spectrum SPF 30 with thermal spring water. Lightweight, non-greasy, and safe for sensitive skin.",
    keyIngredients: ["Mexoryl SX", "Titanium Dioxide", "Thermal Spring Water"],
    skinBenefit: "UV Protection",
    benefitIcon: Sun,
  },
  {
    id: 4,
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    price: "$6.50",
    rating: 4.8,
    match: 89,
    cat: "Serum",
    img: "✨",
    safe: true,
    badge: "Pore Minimizer",
    badgeColor: "#7C3AED",
    badgeBg: "#F5F3FF",
    tip: "Apply 2–3 drops after cleansing, before heavier serums. Don't mix with Vitamin C in the same routine — use Vit C in the morning, niacinamide at night.",
    whyGood: "Reduces pore appearance, controls sebum, fades dark spots, and strengthens the skin barrier — four benefits in one bottle.",
    keyIngredients: ["Niacinamide", "Zinc PCA", "Tamarind Seed Extract"],
    skinBenefit: "Pore Control",
    benefitIcon: Zap,
  },
  {
    id: 5,
    name: "Centella Green Level Buffet Serum",
    brand: "SOME BY MI",
    price: "$22.00",
    rating: 4.6,
    match: 85,
    cat: "Serum",
    img: "🌿",
    safe: true,
    badge: "Calming",
    badgeColor: "#059669",
    badgeBg: "#ECFDF5",
    tip: "Perfect for evenings after actives. Apply 2–3 drops and gently pat (don't rub) into skin. Great for reducing redness after exfoliation days.",
    whyGood: "Centella Asiatica is clinically proven to reduce inflammation and speed up skin healing. Zero harsh additives.",
    keyIngredients: ["Centella Asiatica", "Madecassoside", "Panthenol"],
    skinBenefit: "Soothing",
    benefitIcon: Leaf,
  },
  {
    id: 6,
    name: "BHA Liquid Exfoliant 2%",
    brand: "Paula's Choice",
    price: "$32.00",
    rating: 4.9,
    match: 80,
    cat: "Toner",
    img: "🔬",
    safe: true,
    badge: "Exfoliant",
    badgeColor: "#DC2626",
    badgeBg: "#FEF2F2",
    tip: "Use only 2–3 times per week to start — not every day. Apply after cleansing with a cotton pad, leave on (don't rinse). Always follow with SPF in the morning.",
    whyGood: "Salicylic acid goes deep into pores to dissolve blackheads and congestion. The gold standard for oily and acne-prone skin.",
    keyIngredients: ["Salicylic Acid 2%", "Green Tea Extract", "Methylpropanediol"],
    skinBenefit: "Exfoliation",
    benefitIcon: Zap,
  },
];

const DAILY_TIP = {
  title: "Today's Skin Tip",
  tip: "Always apply your skincare from thinnest to thickest consistency — toner → serum → moisturizer → SPF. This lets each product absorb properly before the next layer.",
};

export default function ForYouPage() {
  const [cat, setCat] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = RECOMMENDATIONS.filter((p) => cat === "All" || p.cat === cat);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#F7F9FF" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" style={{ color: "#2563EB" }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
            For You
          </h1>
        </div>
        <p className="text-sm" style={{ color: "rgba(13,21,38,0.58)" }}>
          Personalised picks based on your skin profile
        </p>
      </div>

      {/* Daily Tip Banner */}
      <div className="mx-5 mb-5 rounded-3xl p-4 flex items-start gap-3"
        style={{ background: "linear-gradient(135deg, #1D4ED8, #2563EB)" }}>
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white/70 mb-0.5 uppercase tracking-wide">{DAILY_TIP.title}</p>
          <p className="text-white text-sm leading-relaxed">{DAILY_TIP.tip}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0"
            style={{
              background: cat === c ? "#2563EB" : "#fff",
              color: cat === c ? "#fff" : "rgba(13,21,38,0.58)",
              border: cat === c ? "none" : "1px solid rgba(37,99,235,0.10)",
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Recommendation Cards */}
      <div className="px-5 space-y-4">
        {filtered.map((p, idx) => {
          const BenefitIcon = p.benefitIcon;
          const isExpanded = expanded === p.id;
          return (
            <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm"
              style={{ border: "1px solid rgba(37,99,235,0.06)" }}>
              {/* Top section */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Rank + emoji */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: "#EFF4FF" }}>{p.img}</div>
                    {idx === 0 && (
                      <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: "#F59E0B" }}>1</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className="font-semibold text-sm leading-tight" style={{ color: "#0D1526" }}>{p.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                        style={{ background: p.badgeBg, color: p.badgeColor }}>
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: "rgba(13,21,38,0.58)" }}>{p.brand}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium" style={{ color: "#0D1526" }}>{p.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BenefitIcon className="w-3 h-3" style={{ color: p.badgeColor }} />
                        <span className="text-xs font-medium" style={{ color: p.badgeColor }}>{p.skinBenefit}</span>
                      </div>
                      <span className="text-xs font-semibold ml-auto" style={{ color: "#0D1526" }}>{p.price}</span>
                    </div>
                  </div>
                </div>

                {/* Match bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: "rgba(13,21,38,0.58)" }}>Skin Match</span>
                    <span className="text-xs font-bold" style={{ color: "#2563EB" }}>{p.match}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#EFF4FF" }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${p.match}%`, background: "linear-gradient(90deg, #2563EB, #3B82F6)" }} />
                  </div>
                </div>

                {/* Why it's good */}
                <div className="mt-3 rounded-2xl px-3 py-2.5" style={{ background: "#F7F9FF" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(13,21,38,0.7)" }}>
                    <span className="font-semibold" style={{ color: "#0D1526" }}>Why it works: </span>
                    {p.whyGood}
                  </p>
                </div>

                {/* Key ingredients */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.keyIngredients.map((ing) => (
                    <span key={ing} className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: "#EFF4FF", color: "#2563EB" }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expandable tip */}
              <button
                onClick={() => setExpanded(isExpanded ? null : p.id)}
                className="w-full flex items-center justify-between px-4 py-3 border-t transition-colors"
                style={{ borderColor: "rgba(37,99,235,0.08)", background: isExpanded ? "#EFF4FF" : "transparent" }}>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" style={{ color: "#F59E0B" }} />
                  <span className="text-xs font-semibold" style={{ color: "#0D1526" }}>
                    {isExpanded ? "Hide Tip" : "How to use it"}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 transition-transform" style={{
                  color: "rgba(13,21,38,0.36)",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                }} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2" style={{ background: "#EFF4FF" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "#1e3a8a" }}>
                    💡 {p.tip}
                  </p>
                  <Link href="/products/scan"
                    className="mt-3 w-full py-2.5 rounded-2xl text-white text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)", display: "flex" }}>
                    Scan to check ingredients →
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
