"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, X, Star, ShoppingCart, Bookmark, Info,
  AlertTriangle, CheckCircle, Scan,
} from "lucide-react";

type Safety = "safe" | "moderate" | "avoid";
type RiskLevel = "safe" | "moderate" | "high";

interface Ingredient {
  name: string;
  inci?: string;
  function?: string;
  purpose?: string;
  riskLevel?: RiskLevel;
  safety?: Safety;
  ewg?: number;
  common?: number;
  preg?: string;
  desc?: string;
  description?: string;
  concerns?: string[];
  isHarmful?: boolean;
}

interface HarmfulChem {
  name: string;
  inci?: string;
  riskLevel: RiskLevel;
  concerns: string[];
  description: string;
}

interface ScanResult {
  scanId: string;
  ingredientText?: string;
  ingredients: Ingredient[];
  safetyScore: number;
  pregnancySafetyScore: number;
  sensitiveSkinScore: number;
  harmfulChemicals: HarmfulChem[];
  skinToneMatch: { score: number; message: string } | null;
  summary: string;
}

// Demo data shown when no scan is available
const DEMO_INGREDIENTS: Ingredient[] = [
  { name: "Aqua / Water", function: "Solvent", riskLevel: "safe", ewg: 1, common: 99, preg: "Safe", description: "Universal solvent, base of most formulas." },
  { name: "Glycerin", function: "Humectant", riskLevel: "safe", ewg: 1, common: 82, preg: "Safe", description: "Draws moisture into skin." },
  { name: "Niacinamide", function: "Active", riskLevel: "safe", ewg: 1, common: 45, preg: "Safe", description: "Vitamin B3 — minimizes pores, evens tone." },
  { name: "Sodium Hyaluronate", function: "Humectant", riskLevel: "safe", ewg: 1, common: 58, preg: "Safe", description: "Deep hydration." },
  { name: "Dimethicone", function: "Silicone", riskLevel: "moderate", ewg: 3, common: 73, preg: "Caution", description: "Creates smooth barrier; may trap debris." },
  { name: "Phenoxyethanol", function: "Preservative", riskLevel: "high", ewg: 4, common: 61, preg: "⚠ Avoid", description: "Synthetic preservative under investigation.", isHarmful: true, concerns: ["Skin irritant", "Under review for nervous system effects"] },
  { name: "Methylparaben", function: "Preservative", riskLevel: "high", ewg: 4, common: 42, preg: "⚠ Avoid", description: "Potential endocrine disruptor.", isHarmful: true, concerns: ["Endocrine disruption", "Estrogenic activity"] },
  { name: "Synthetic Fragrance", function: "Fragrance", riskLevel: "high", ewg: 8, common: 78, preg: "⚠ Avoid", description: "Hundreds of unlisted chemicals.", isHarmful: true, concerns: ["Allergic reactions", "Hidden ingredients", "Sensitizer"] },
];

const DEMO_RESULT: ScanResult = {
  scanId: "demo",
  ingredients: DEMO_INGREDIENTS,
  safetyScore: 72,
  pregnancySafetyScore: 55,
  sensitiveSkinScore: 60,
  harmfulChemicals: DEMO_INGREDIENTS.filter((i) => i.isHarmful).map((i) => ({
    name: i.name,
    riskLevel: "high" as RiskLevel,
    concerns: i.concerns ?? [],
    description: i.description ?? "",
  })),
  skinToneMatch: null,
  summary: "This product contains mostly safe ingredients with a few preservatives of concern.",
};

const riskToSafety = (r?: RiskLevel): Safety =>
  r === "high" ? "avoid" : r === "moderate" ? "moderate" : "safe";

const SAFETY_CONFIG = {
  safe: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0", label: "Safe" },
  moderate: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", label: "Moderate" },
  avoid: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", label: "Avoid" },
};

function EWGDots({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full"
          style={{
            background: i < score
              ? score <= 2 ? "#16A34A" : score <= 6 ? "#D97706" : "#DC2626"
              : "#E5E7EB",
          }} />
      ))}
    </div>
  );
}

function AnalysisContent() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId");

  const [result, setResult] = useState<ScanResult | null>(null);
  const [modal, setModal] = useState<Ingredient | null>(null);
  const [filter, setFilter] = useState<"all" | Safety>("all");
  const [saved, setSaved] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (scanId) {
      const stored = sessionStorage.getItem(`scan_${scanId}`);
      if (stored) {
        try {
          setResult(JSON.parse(stored));
          return;
        } catch {}
      }
    }
    setResult(DEMO_RESULT);
    setIsDemo(true);
  }, [scanId]);

  if (!result) return null;

  const ingredients = result.ingredients.map((ing) => ({
    ...ing,
    safety: riskToSafety(ing.riskLevel),
    ewg: ing.ewg ?? (ing.riskLevel === "high" ? 7 : ing.riskLevel === "moderate" ? 3 : 1),
    preg: ing.preg ?? (ing.riskLevel === "high" ? "⚠ Avoid" : "Safe"),
  }));

  const safe = ingredients.filter((i) => i.safety === "safe");
  const moderate = ingredients.filter((i) => i.safety === "moderate");
  const avoid = ingredients.filter((i) => i.safety === "avoid");
  const displayed = filter === "all" ? ingredients : ingredients.filter((i) => i.safety === filter);

  const scoreColor = result.safetyScore >= 80 ? "#16A34A" : result.safetyScore >= 60 ? "#D97706" : "#DC2626";
  const scoreLabel = result.safetyScore >= 80 ? "Excellent" : result.safetyScore >= 60 ? "Good" : "Caution";

  return (
    <div className="min-h-screen pb-36" style={{ background: "#F7F9FF" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <Link href="/products" className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ChevronLeft className="w-5 h-5" style={{ color: "#0D1526" }} />
        </Link>
        <h1 className="text-xl font-semibold flex-1"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
          Ingredient Analysis
        </h1>
        <button onClick={() => setSaved((s) => !s)}>
          <Bookmark className={`w-5 h-5 ${saved ? "fill-blue-600 text-blue-600" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Demo banner */}
      {isDemo && (
        <div className="mx-5 mb-4 px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{ background: "#EFF4FF", border: "1px solid #BFDBFE" }}>
          <Scan className="w-4 h-4 flex-shrink-0" style={{ color: "#2563EB" }} />
          <p className="text-xs" style={{ color: "#2563EB" }}>
            Showing demo data.{" "}
            <Link href="/products/scan" className="font-semibold underline">
              Scan a product
            </Link>{" "}
            to get real results.
          </p>
        </div>
      )}

      {/* Safety Score Hero */}
      <div className="mx-5 mb-5 rounded-3xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #1D4ED8, #2563EB)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80 mb-1">Safety Score</p>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
                {result.safetyScore}
              </span>
              <span className="text-sm opacity-70 pb-2">/100</span>
            </div>
            <p className="text-sm opacity-80 mt-1">{scoreLabel} — {result.summary}</p>
          </div>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 88 88" className="w-24 h-24 -rotate-90">
              <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
              <circle cx="44" cy="44" r="36" fill="none" stroke="white" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 36 * result.safetyScore / 100} ${2 * Math.PI * 36}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold opacity-80">{scoreLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Safe", count: safe.length, color: "#BBF7D0", bg: "rgba(22,163,74,0.2)" },
            { label: "Moderate", count: moderate.length, color: "#FDE68A", bg: "rgba(217,119,6,0.2)" },
            { label: "Avoid", count: avoid.length, color: "#FECACA", bg: "rgba(220,38,38,0.2)" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: s.bg }}>
              <p className="text-xl font-bold">{s.count}</p>
              <p className="text-xs opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ⚠ Harmful Chemicals — shown prominently when present */}
      {result.harmfulChemicals.length > 0 && (
        <div className="mx-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" style={{ color: "#DC2626" }} />
            <h3 className="text-base font-semibold" style={{ color: "#0D1526" }}>
              Harmful Chemicals ({result.harmfulChemicals.length})
            </h3>
          </div>
          <div className="space-y-2">
            {result.harmfulChemicals.map((chem) => (
              <div key={chem.name} className="rounded-2xl p-4 border"
                style={{ background: "#FEF2F2", borderColor: "#FECACA" }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm" style={{ color: "#991B1B" }}>{chem.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                    style={{ background: "#DC2626", color: "#fff" }}>HIGH RISK</span>
                </div>
                <p className="text-xs mb-2" style={{ color: "#7F1D1D" }}>{chem.description}</p>
                {chem.concerns.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {chem.concerns.map((c) => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(220,38,38,0.1)", color: "#DC2626" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skin Tone Match */}
      {result.skinToneMatch && (
        <div className="mx-5 mb-5 rounded-2xl p-4 flex items-center gap-4"
          style={{
            background: result.skinToneMatch.score >= 70 ? "#F0FDF4" : "#FFFBEB",
            border: `1px solid ${result.skinToneMatch.score >= 70 ? "#BBF7D0" : "#FDE68A"}`,
          }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
            style={{ background: result.skinToneMatch.score >= 70 ? "#16A34A" : "#D97706" }}>
            {result.skinToneMatch.score}%
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#0D1526" }}>Skin Compatibility</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(13,21,38,0.58)" }}>
              {result.skinToneMatch.message}
            </p>
          </div>
          {result.skinToneMatch.score >= 70
            ? <CheckCircle className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: "#16A34A" }} />
            : <AlertTriangle className="w-5 h-5 ml-auto flex-shrink-0" style={{ color: "#D97706" }} />
          }
        </div>
      )}

      {/* Additional scores */}
      <div className="mx-5 mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 bg-white shadow-sm">
          <p className="text-xs mb-1" style={{ color: "rgba(13,21,38,0.58)" }}>Pregnancy Safe</p>
          <p className="text-2xl font-bold" style={{ color: result.pregnancySafetyScore >= 70 ? "#16A34A" : "#DC2626" }}>
            {result.pregnancySafetyScore}%
          </p>
        </div>
        <div className="rounded-2xl p-4 bg-white shadow-sm">
          <p className="text-xs mb-1" style={{ color: "rgba(13,21,38,0.58)" }}>Sensitive Skin</p>
          <p className="text-2xl font-bold" style={{ color: result.sensitiveSkinScore >= 70 ? "#16A34A" : "#DC2626" }}>
            {result.sensitiveSkinScore}%
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {(["all", "safe", "moderate", "avoid"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium capitalize flex-shrink-0"
            style={{
              background: filter === f ? "#2563EB" : "#fff",
              color: filter === f ? "#fff" : "rgba(13,21,38,0.58)",
              border: filter === f ? "none" : "1px solid rgba(37,99,235,0.10)",
            }}>
            {f === "all" ? `All (${ingredients.length})`
              : f === "safe" ? `Safe (${safe.length})`
              : f === "moderate" ? `Moderate (${moderate.length})`
              : `Avoid (${avoid.length})`}
          </button>
        ))}
      </div>

      {/* Ingredient List */}
      <div className="px-5 mb-5 space-y-2">
        {displayed.map((ing) => {
          const safety = ing.safety ?? "safe";
          const cfg = SAFETY_CONFIG[safety];
          return (
            <button key={ing.name} onClick={() => setModal(ing)}
              className="w-full bg-white rounded-2xl p-4 text-left flex items-center gap-3 shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm" style={{ color: "#0D1526" }}>{ing.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0"
                    style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs mb-1.5" style={{ color: "rgba(13,21,38,0.58)" }}>
                  {ing.function ?? ing.purpose ?? ""}
                </p>
                <EWGDots score={ing.ewg ?? 1} />
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-medium" style={{ color: "rgba(13,21,38,0.36)" }}>EWG</p>
                <p className="text-lg font-bold" style={{
                  color: (ing.ewg ?? 1) <= 2 ? "#16A34A" : (ing.ewg ?? 1) <= 6 ? "#D97706" : "#DC2626",
                }}>{ing.ewg ?? 1}</p>
                <p className="text-xs" style={{ color: "rgba(13,21,38,0.36)" }}>{ing.preg}</p>
              </div>
              <Info className="w-4 h-4 flex-shrink-0 ml-1" style={{ color: "rgba(13,21,38,0.25)" }} />
            </button>
          );
        })}
      </div>

      {/* Scan another */}
      <div className="px-5 mb-6">
        <Link href="/products/scan"
          className="w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 block text-center"
          style={{ background: "#EFF4FF", color: "#2563EB" }}>
          <Scan className="w-4 h-4" /> Scan Another Product
        </Link>
      </div>

      {/* Buy Bar */}
      <div className="fixed bottom-20 inset-x-0 px-5 pb-2">
        <div className="bg-white rounded-3xl p-4 flex items-center gap-3 shadow-lg">
          <div className="flex-1">
            <p className="text-xs" style={{ color: "rgba(13,21,38,0.58)" }}>Overall Safety</p>
            <p className="font-bold" style={{ color: scoreColor }}>{scoreLabel}</p>
          </div>
          <Link href="/products/scan"
            className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #2563EB, #3B82F6)" }}>
            <ShoppingCart className="w-4 h-4" /> Scan to Compare
          </Link>
        </div>
      </div>

      {/* Ingredient Detail Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="w-full rounded-t-3xl p-6 bg-white" style={{ maxHeight: "75vh", overflowY: "auto" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "#0D1526" }}>
                  {modal.name}
                </h3>
                <p className="text-sm" style={{ color: "rgba(13,21,38,0.58)" }}>
                  {modal.function ?? modal.purpose}
                </p>
              </div>
              <button onClick={() => setModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#F3F4F6" }}>
                <X className="w-4 h-4" style={{ color: "#0D1526" }} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Safety", value: SAFETY_CONFIG[modal.safety ?? "safe"].label, color: SAFETY_CONFIG[modal.safety ?? "safe"].color, bg: SAFETY_CONFIG[modal.safety ?? "safe"].bg },
                { label: "EWG Score", value: `${modal.ewg ?? 1}/10`, color: (modal.ewg ?? 1) <= 2 ? "#16A34A" : (modal.ewg ?? 1) <= 6 ? "#D97706" : "#DC2626", bg: "#EFF4FF" },
                { label: "Common", value: `${modal.common ?? "—"}%`, color: "#0D1526", bg: "#EFF4FF" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-3 text-center" style={{ background: item.bg }}>
                  <p className="text-xs mb-1" style={{ color: "rgba(13,21,38,0.58)" }}>{item.label}</p>
                  <p className="font-bold text-sm" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <EWGDots score={modal.ewg ?? 1} />
              <p className="text-xs mt-1" style={{ color: "rgba(13,21,38,0.36)" }}>
                EWG Hazard Score (1=Low, 10=High)
              </p>
            </div>

            <div className="rounded-2xl p-4 mb-4" style={{ background: "#F7F9FF" }}>
              <p className="text-sm leading-relaxed" style={{ color: "#0D1526" }}>
                {modal.description ?? modal.desc}
              </p>
            </div>

            {modal.concerns && modal.concerns.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium mb-2" style={{ color: "#0D1526" }}>Known Concerns</p>
                <div className="flex flex-wrap gap-1.5">
                  {modal.concerns.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "#FEF2F2", color: "#DC2626" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 rounded-2xl"
              style={{ background: (modal.preg ?? "").includes("⚠") ? "#FEF2F2" : "#F0FDF4" }}>
              <span className="text-lg">{(modal.preg ?? "").includes("⚠") ? "⚠️" : "✅"}</span>
              <div>
                <p className="text-xs font-medium" style={{ color: "#0D1526" }}>Pregnancy Safety</p>
                <p className="text-xs" style={{ color: "rgba(13,21,38,0.58)" }}>
                  {modal.preg ?? "Consult doctor"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F9FF" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm" style={{ color: "rgba(13,21,38,0.58)" }}>Loading analysis…</p>
        </div>
      </div>
    }>
      <AnalysisContent />
    </Suspense>
  );
}
