"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Droplets, Shield, Sun, Zap, Star, Sparkles } from "lucide-react";

interface FaceResult {
  scanId: string;
  skinTone: string;
  undertone: string;
  skinType: string;
  hexColor: string;
  overallScore: number;
  metrics: { hydration: number; oiliness: number; texture: number; sensitivity: number; sunDamage: number };
  concerns: string[];
  tips: string[];
  routineSuggestion: string;
  imageBase64?: string;
}

const DEMO: FaceResult = {
  scanId: "demo",
  skinTone: "medium", undertone: "warm", skinType: "combination", hexColor: "#E8A87C",
  overallScore: 78,
  metrics: { hydration: 62, oiliness: 38, texture: 71, sensitivity: 55, sunDamage: 28 },
  concerns: ["Slight dryness on cheeks", "Mild uneven texture"],
  tips: ["Add hyaluronic acid serum to morning routine", "Apply SPF 30+ every morning", "Use a gentle exfoliant 2x per week"],
  routineSuggestion: "Focus on hydration and barrier repair with ceramide-based products.",
};

const METRIC_CONFIG = [
  { key: "hydration", label: "Hydration", icon: Droplets, color: "#3B82F6" },
  { key: "oiliness", label: "Oiliness", icon: Zap, color: "#D97706" },
  { key: "texture", label: "Texture", icon: Star, color: "#8B5CF6" },
  { key: "sensitivity", label: "Sensitivity", icon: Shield, color: "#EC4899" },
  { key: "sunDamage", label: "Sun Protection", icon: Sun, color: "#F59E0B" },
];

export default function ScanResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<FaceResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`face_${id}`);
    if (stored) {
      try { setResult(JSON.parse(stored)); return; } catch {}
    }
    setResult(DEMO);
    setIsDemo(true);
  }, [id]);

  if (!result) return null;

  const score = result.overallScore ?? 78;
  const scoreLabel = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 55 ? "Fair" : "Needs Care";
  const skinToneLabel = `${result.undertone ?? "warm"} ${result.skinTone ?? "medium"}`.replace(/^\w/, c => c.toUpperCase());

  return (
    <div className="min-h-screen pb-28" style={{ background: "#F7F9FF" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <Link href="/scan" className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ChevronLeft className="w-5 h-5" style={{ color: "#0D1526" }} />
        </Link>
        <h1 className="text-xl font-semibold flex-1"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
          Skin Analysis Results
        </h1>
      </div>

      {isDemo && (
        <div className="mx-5 mb-4 px-4 py-3 rounded-2xl flex items-center gap-2"
          style={{ background: "#EFF4FF", border: "1px solid #BFDBFE" }}>
          <Sparkles className="w-4 h-4 flex-shrink-0 text-blue-500" />
          <p className="text-xs text-blue-700">
            Demo data shown. <Link href="/scan" className="font-semibold underline">Take a selfie</Link> for your real analysis.
          </p>
        </div>
      )}

      {/* Score Hero */}
      <div className="mx-5 mb-5 rounded-3xl p-6 text-white flex flex-col items-center"
        style={{ background: "linear-gradient(135deg,#1D4ED8,#2563EB)" }}>
        <div className="relative w-32 h-32 mb-3">
          <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="white" strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 50 * score / 100} ${2 * Math.PI * 50}`}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>{score}</span>
            <span className="text-xs opacity-70">/100</span>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
          {scoreLabel} Skin Health
        </h2>
        <p className="text-sm opacity-80 text-center">{result.routineSuggestion}</p>
      </div>

      {/* Skin Tone */}
      <div className="mx-5 mb-4 bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex-shrink-0 border-2 border-white shadow"
          style={{ background: result.hexColor ?? "#E8A87C" }} />
        <div>
          <p className="font-semibold text-sm" style={{ color: "#0D1526" }}>Detected Skin Tone</p>
          <p className="text-base font-bold mt-0.5" style={{ color: "#0D1526" }}>{skinToneLabel}</p>
          <p className="text-xs" style={{ color: "rgba(13,21,38,0.5)" }}>
            {result.skinType ? result.skinType.charAt(0).toUpperCase() + result.skinType.slice(1) : "Combination"} skin
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-5 mb-5">
        <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
          Skin Metrics
        </h3>
        <div className="space-y-3">
          {METRIC_CONFIG.map(m => {
            const val = result.metrics?.[m.key as keyof typeof result.metrics] ?? 50;
            return (
              <div key={m.key} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <m.icon className="w-4 h-4" style={{ color: m.color }} />
                    <span className="text-sm font-medium" style={{ color: "#0D1526" }}>{m.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: m.color }}>{val}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: "#EFF4FF" }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${val}%`, background: m.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Concerns */}
      {result.concerns?.length > 0 && (
        <div className="px-5 mb-5">
          <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
            Skin Concerns
          </h3>
          <div className="space-y-2">
            {result.concerns.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#D97706" }} />
                <p className="text-sm" style={{ color: "#0D1526" }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {result.tips?.length > 0 && (
        <div className="px-5 mb-6">
          <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
            Personalised Tips
          </h3>
          <div className="space-y-2">
            {result.tips.map((tip, i) => (
              <div key={i} className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: "linear-gradient(135deg,rgba(37,99,235,0.06),rgba(59,130,246,0.04))", border: "1px solid rgba(37,99,235,0.08)" }}>
                <span className="text-blue-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                <p className="text-sm leading-relaxed" style={{ color: "#0D1526" }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        <Link href="/products"
          className="py-3.5 rounded-2xl text-center font-semibold text-sm text-white flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#2563EB,#3B82F6)" }}>
          View For You
        </Link>
        <Link href="/products/scan"
          className="py-3.5 rounded-2xl text-center font-semibold text-sm flex items-center justify-center"
          style={{ background: "#EFF4FF", color: "#2563EB" }}>
          Scan Product
        </Link>
      </div>
    </div>
  );
}
