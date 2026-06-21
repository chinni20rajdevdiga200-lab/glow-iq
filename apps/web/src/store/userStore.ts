import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SkinProfile, SubscriptionPlan } from "@/types";

interface UserStore {
  skinProfile: SkinProfile | null;
  plan: SubscriptionPlan;
  theme: "light" | "dark";

  setSkinProfile: (profile: SkinProfile | null) => void;
  setPlan: (plan: SubscriptionPlan) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      skinProfile: null,
      plan: "free",
      theme: "light",

      setSkinProfile: (profile) => set({ skinProfile: profile }),
      setPlan: (plan) => set({ plan }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "beautyiq-user" }
  )
);
