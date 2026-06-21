"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Clock } from "lucide-react";
import { DEMO_ROUTINE } from "@/lib/demo-data";

export default function RoutinePage() {
  const [tab, setTab] = useState<"morning" | "evening">("morning");
  const steps = DEMO_ROUTINE[tab];

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-playfair font-bold text-dark dark:text-white">My Routine</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Your personalized skincare routine</p>
      </div>

      {/* Toggle */}
      <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-1 border border-gray-200 dark:border-gray-700">
        <button onClick={() => setTab("morning")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${tab === "morning" ? "bg-gold-500 text-dark shadow-gold" : "text-gray-500 dark:text-gray-400"}`}>
          <Sun className="w-4 h-4" /> Morning
        </button>
        <button onClick={() => setTab("evening")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${tab === "evening" ? "bg-dark text-white shadow-lg" : "text-gray-500 dark:text-gray-400"}`}>
          <Moon className="w-4 h-4" /> Evening
        </button>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.step} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 ${tab === "morning" ? "bg-gold-100 dark:bg-gold-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                  {step.emoji}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1 mb-1 min-h-6" />
                )}
              </div>

              {/* Content */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-2xl p-4 flex-1 ${i < steps.length - 1 ? "mb-3" : ""}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gold-600 dark:text-gold-400 font-semibold uppercase tracking-wide">Step {step.step}</p>
                    <p className="font-semibold text-dark dark:text-white mt-0.5">{step.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{step.product}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-cream-100 dark:bg-gray-700 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{step.duration}</span>
                  </div>
                </div>
                <div className="mt-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl p-3">
                  <p className="text-xs text-gold-700 dark:text-gold-300">💡 {step.tip}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
