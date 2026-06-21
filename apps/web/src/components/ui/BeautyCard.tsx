"use client";

import { Star, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface BeautyCardProps {
  rec: {
    id: string;
    category: string;
    name: string;
    brand: string;
    safetyScore: number;
    rating: number;
    imageUrl?: string;
    price?: number;
  };
}

const categoryEmoji: Record<string, string> = {
  cleanser: "🧴", serum: "💧", moisturizer: "🫧", sunscreen: "☀️",
  foundation: "✨", lipstick: "💄", blush: "🌸", treatment: "⚗️",
  toner: "🌿", eye_cream: "👁️", mask: "🎭", hair: "💆",
};

export function BeautyCard({ rec }: BeautyCardProps) {
  return (
    <Link href={`/products/${rec.id}`}>
      <div className="glass-card p-4 flex items-center gap-4 hover:shadow-gold hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/10 to-cream-200 dark:from-gold-400/10 dark:to-beauty-charcoal flex items-center justify-center text-2xl flex-shrink-0 border border-gold-400/10">
          {categoryEmoji[rec.category] ?? "✨"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold text-gold-400 uppercase tracking-wide mb-0.5 capitalize">{rec.category}</div>
          <div className="text-sm font-semibold text-beauty-dark dark:text-cream-100 truncate">{rec.name}</div>
          <div className="text-xs text-beauty-muted mb-2">{rec.brand}</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <span className="font-medium text-beauty-dark dark:text-cream-200">{rec.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">{rec.safetyScore}% safe</span>
            </div>
          </div>
        </div>
        {rec.price && (
          <div className="text-sm font-bold text-beauty-dark dark:text-cream-100 flex-shrink-0">
            ${rec.price}
          </div>
        )}
      </div>
    </Link>
  );
}
