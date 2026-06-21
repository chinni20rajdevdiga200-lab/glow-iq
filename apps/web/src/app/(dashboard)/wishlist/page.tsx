"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2, ShoppingCart, Star } from "lucide-react";

const INITIAL = [
  { id: 1, name: "Hyaluronic Acid Serum", brand: "The Ordinary", price: "$8.90", rating: 4.9, img: "💧", safe: true },
  { id: 2, name: "Ultra Facial Cream", brand: "Kiehl's", price: "$34.00", rating: 4.6, img: "🌿", safe: true },
  { id: 3, name: "Vitamin C Suspension", brand: "The Ordinary", price: "$7.20", rating: 4.5, img: "🍊", safe: true },
];

export default function WishlistPage() {
  const [items, setItems] = useState(INITIAL);

  return (
    <div className="min-h-screen" style={{ background: "#F7F9FF" }}>
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
              Saved Products
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(13,21,38,0.58)" }}>{items.length} items saved</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#EFF4FF" }}>
            <Bookmark className="w-5 h-5" style={{ color: "#2563EB" }} />
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-20">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#EFF4FF" }}>
            <Bookmark className="w-10 h-10" style={{ color: "#2563EB" }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
            Nothing saved yet
          </h3>
          <p className="text-sm text-center mb-6" style={{ color: "rgba(13,21,38,0.58)" }}>
            Save products you love to find them easily later
          </p>
          <Link href="/products" className="px-6 py-3 rounded-2xl text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="px-5 space-y-3 pb-6">
          {items.map(item => (
            <div key={item.id} className="glow-card p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "#EFF4FF" }}>{item.img}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: "#0D1526" }}>{item.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(13,21,38,0.58)" }}>{item.brand}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium" style={{ color: "#0D1526" }}>{item.rating}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#F0FDF4", color: "#16A34A" }}>Safe</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="font-bold text-sm" style={{ color: "#0D1526" }}>{item.price}</p>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "#EFF4FF" }}>
                    <ShoppingCart className="w-4 h-4" style={{ color: "#2563EB" }} />
                  </button>
                  <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "#FEF2F2" }}>
                    <Trash2 className="w-4 h-4" style={{ color: "#DC2626" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
