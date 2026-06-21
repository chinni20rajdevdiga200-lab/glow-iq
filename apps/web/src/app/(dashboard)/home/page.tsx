"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bell, ChevronRight, Camera, ShoppingBag, Bookmark, Star, Droplets, Sun, Shield } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Gentle Foaming Cleanser", brand: "CeraVe", price: "$14.99", rating: 4.8, match: 96, category: "Cleanser", img: "🧴" },
  { id: 2, name: "Hyaluronic Acid Serum", brand: "The Ordinary", price: "$8.90", rating: 4.9, match: 94, category: "Serum", img: "💧" },
  { id: 3, name: "Moisturizing Cream SPF30", brand: "La Roche-Posay", price: "$19.99", rating: 4.7, match: 91, category: "Moisturizer", img: "☀️" },
];

const CONCERNS = [
  { icon: Droplets, label: "Hydration", score: 62 },
  { icon: Shield, label: "Barrier", score: 74 },
  { icon: Sun, label: "UV Guard", score: 45 },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen" style={{ background: "#F7F9FF" }}>
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm" style={{ color: "rgba(13,21,38,0.58)" }}>Good morning,</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
              Sarah ✨
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm relative">
              <Bell className="w-5 h-5" style={{ color: "#2563EB" }} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}>S</div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(13,21,38,0.36)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products, ingredients..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: "#fff", border: "1px solid rgba(37,99,235,0.10)", color: "#0D1526" }} />
        </div>
      </div>

      {/* Skin Score Hero */}
      <div className="mx-5 mb-5 rounded-3xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80 mb-1">Your Skin Score</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>78</span>
              <span className="text-sm opacity-70 pb-2">/100</span>
            </div>
            <p className="text-sm opacity-80 mt-1">Good — keep it up! 🌟</p>
          </div>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 88 88" className="w-24 h-24 -rotate-90">
              <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
              <circle cx="44" cy="44" r="36" fill="none" stroke="white" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 36 * 0.78} ${2 * Math.PI * 36}`}
                strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CONCERNS.map(c => (
            <div key={c.label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <c.icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <p className="text-xs opacity-70 mb-0.5">{c.label}</p>
              <p className="text-base font-bold">{c.score}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          <Link href="/scan" className="glow-card p-4 flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "#EFF4FF" }}>
              <Camera className="w-5 h-5" style={{ color: "#2563EB" }} />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: "#0D1526" }}>Skin Scan</span>
          </Link>
          <Link href="/products/scan" className="glow-card p-4 flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "#EFF4FF" }}>
              <ShoppingBag className="w-5 h-5" style={{ color: "#2563EB" }} />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: "#0D1526" }}>Product Scan</span>
          </Link>
          <Link href="/wishlist" className="glow-card p-4 flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "#EFF4FF" }}>
              <Bookmark className="w-5 h-5" style={{ color: "#2563EB" }} />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: "#0D1526" }}>Wishlist</span>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
            Top Matches For You
          </h2>
          <Link href="/products" className="text-sm font-medium flex items-center gap-1" style={{ color: "#2563EB" }}>
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {PRODUCTS.map(p => (
            <Link key={p.id} href={`/products/analysis`}
              className="glow-card p-4 flex items-center gap-4 block">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "#EFF4FF" }}>{p.img}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "#0D1526" }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(13,21,38,0.58)" }}>{p.brand} • {p.category}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium" style={{ color: "#0D1526" }}>{p.rating}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "#DBEAFE", color: "#2563EB" }}>{p.match}% match</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm" style={{ color: "#0D1526" }}>{p.price}</p>
                <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background: "#F0FDF4", color: "#16A34A" }}>Safe</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
