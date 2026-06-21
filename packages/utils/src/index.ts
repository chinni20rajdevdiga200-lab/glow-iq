import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel, SkinTone, Severity } from "../../types/src";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getRiskColor(risk: RiskLevel): string {
  const colors = {
    safe: "text-emerald-600",
    moderate: "text-amber-500",
    high: "text-red-500",
  };
  return colors[risk];
}

export function getRiskBg(risk: RiskLevel): string {
  const colors = {
    safe: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
    moderate: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    high: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  };
  return colors[risk];
}

export function getRiskEmoji(risk: RiskLevel): string {
  return { safe: "✅", moderate: "⚠️", high: "🚫" }[risk];
}

export function getSeverityColor(severity: Severity): string {
  const colors = {
    none: "text-emerald-500",
    mild: "text-blue-500",
    moderate: "text-amber-500",
    severe: "text-red-500",
  };
  return colors[severity];
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 60) return "C+";
  if (score >= 55) return "C";
  return "D";
}

export function skinToneToLabel(tone: SkinTone): string {
  const labels: Record<SkinTone, string> = {
    fair: "Fair",
    light: "Light",
    medium: "Medium",
    olive: "Olive",
    tan: "Tan",
    deep: "Deep",
  };
  return labels[tone];
}

export function skinToneToHex(tone: SkinTone): string {
  const hexes: Record<SkinTone, string> = {
    fair: "#FDDBB4",
    light: "#F5C89A",
    medium: "#E8A97E",
    olive: "#C68B59",
    tan: "#A67C52",
    deep: "#5C3D2E",
  };
  return hexes[tone];
}

export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#D4AF37";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
