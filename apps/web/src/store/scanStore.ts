import { create } from "zustand";
import type { Scan } from "@/types";

interface ScanStore {
  currentScan: Scan | null;
  recentScans: Scan[];
  isAnalyzing: boolean;
  analysisProgress: number;

  setCurrentScan: (scan: Scan | null) => void;
  setRecentScans: (scans: Scan[]) => void;
  setIsAnalyzing: (v: boolean) => void;
  setAnalysisProgress: (v: number) => void;
  reset: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  currentScan: null,
  recentScans: [],
  isAnalyzing: false,
  analysisProgress: 0,

  setCurrentScan: (scan) => set({ currentScan: scan }),
  setRecentScans: (scans) => set({ recentScans: scans }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setAnalysisProgress: (v) => set({ analysisProgress: v }),
  reset: () => set({ currentScan: null, isAnalyzing: false, analysisProgress: 0 }),
}));
