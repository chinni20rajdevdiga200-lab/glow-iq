"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { ProductScanner } from "@/components/features/scanner/ProductScanner";
import { useUserStore } from "@/store/userStore";

export default function ProductScanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const skinProfile = useUserStore((s) => s.skinProfile);

  const handleCapture = async (base64: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/products/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          skinTone: skinProfile?.skinTone,
          skinType: skinProfile?.skinType,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "Analysis failed");

      // Store result in sessionStorage keyed by scanId for the analysis page to read
      sessionStorage.setItem(`scan_${data.scanId}`, JSON.stringify(data));

      router.push(`/products/analysis?scanId=${data.scanId}`);
    } catch (err) {
      console.error(err);
      setError("Could not analyze the image. Please try again with a clearer photo of the ingredient label.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-5 pt-14 pb-8" style={{ background: "#0D1526" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/products">
          <X className="w-6 h-6 text-white" />
        </Link>
        <span className="text-white font-semibold">Scan Product</span>
        <div className="w-6" />
      </div>

      <p className="text-white/50 text-sm text-center mb-5">
        Point camera at the ingredient label or upload a photo of the product
      </p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-2xl text-sm text-red-300" style={{ background: "rgba(239,68,68,0.15)" }}>
          {error}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <ProductScanner onCapture={handleCapture} loading={loading} />
      </div>
    </div>
  );
}
