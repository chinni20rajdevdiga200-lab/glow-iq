"use client";

import Link from "next/link";
import { Settings, ChevronRight, Star, Droplets, Shield, Bell, LogOut, HelpCircle } from "lucide-react";

const STATS = [
  { label: "Skin Score", value: "78", sub: "+5 this month" },
  { label: "Scans Done", value: "12", sub: "last 30 days" },
  { label: "Products Saved", value: "24", sub: "in wishlist" },
];

const JOURNEY = [62, 65, 68, 71, 73, 75, 74, 76, 78];

const MENU = [
  { label: "Notifications", icon: Bell, href: "#" },
  { label: "Help & Support", icon: HelpCircle, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen" style={{ background: "#F7F9FF" }}>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
          Profile
        </h1>
        <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Settings className="w-4 h-4" style={{ color: "#2563EB" }} />
        </button>
      </div>

      {/* User Card */}
      <div className="mx-5 mb-5 rounded-3xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #1D4ED8, #2563EB)" }}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30"
            style={{ background: "rgba(255,255,255,0.2)" }}>S</div>
          <div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>Sarah Johnson</h2>
            <p className="text-sm opacity-80">sarah@example.com</p>
            <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ background: "rgba(255,255,255,0.2)" }}>✨ Premium Member</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {STATS.map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>{s.value}</p>
              <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
              <p className="text-xs opacity-60">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skin Journey Chart */}
      <div className="mx-5 mb-5 glow-card p-4">
        <h3 className="font-semibold mb-3" style={{ color: "#0D1526" }}>Skin Score Journey</h3>
        <div className="flex items-end gap-1.5 h-20">
          {JOURNEY.map((v, i) => (
            <div key={i} className="flex-1 rounded-t-lg"
              style={{
                height: `${((v - 55) / 30) * 100}%`,
                background: i === JOURNEY.length - 1
                  ? "linear-gradient(135deg, #2563EB, #3B82F6)"
                  : "#DBEAFE",
              }} />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: "rgba(13,21,38,0.36)" }}>9 weeks ago</span>
          <span className="text-xs font-medium" style={{ color: "#2563EB" }}>↑ +16 pts</span>
          <span className="text-xs" style={{ color: "rgba(13,21,38,0.36)" }}>Today</span>
        </div>
      </div>

      {/* Skin Profile */}
      <div className="mx-5 mb-5 glow-card p-4">
        <h3 className="font-semibold mb-3" style={{ color: "#0D1526" }}>Your Skin Profile</h3>
        <div className="space-y-2">
          {[
            { label: "Skin Type", value: "Combination" },
            { label: "Skin Tone", value: "Warm Medium (III)" },
            { label: "Top Concern", value: "Hydration" },
            { label: "Sensitivity", value: "Moderate" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-1.5 border-b last:border-0"
              style={{ borderColor: "rgba(37,99,235,0.06)" }}>
              <span className="text-sm" style={{ color: "rgba(13,21,38,0.58)" }}>{item.label}</span>
              <span className="text-sm font-medium" style={{ color: "#0D1526" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="mx-5 mb-5 glow-card overflow-hidden">
        {MENU.map((item, i) => (
          <a key={item.label} href={item.href}
            className="flex items-center gap-3 px-4 py-3.5 border-b last:border-0"
            style={{ borderColor: "rgba(37,99,235,0.06)" }}>
            <item.icon className="w-4 h-4" style={{ color: "#2563EB" }} />
            <span className="text-sm font-medium flex-1" style={{ color: "#0D1526" }}>{item.label}</span>
            <ChevronRight className="w-4 h-4" style={{ color: "rgba(13,21,38,0.25)" }} />
          </a>
        ))}
      </div>

      <div className="px-5 pb-8">
        <button className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm"
          style={{ background: "#FEF2F2", color: "#DC2626" }}>
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
