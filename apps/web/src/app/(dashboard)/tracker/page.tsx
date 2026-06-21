"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DEMO_TRACKER } from "@/lib/demo-data";

export default function TrackerPage() {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-playfair font-bold text-dark dark:text-white">Skin Tracker</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Your beauty journey over time</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {DEMO_TRACKER.metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">{m.label}</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-playfair font-bold text-dark dark:text-white">{m.value}</span>
              <span className="text-sm text-gray-400 mb-0.5">{m.unit}</span>
            </div>
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${m.change > 0 ? "text-emerald-600 dark:text-emerald-400" : m.change < 0 ? "text-red-500" : "text-gray-400"}`}>
              {m.change > 0 ? <TrendingUp className="w-3 h-3" /> : m.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              {m.change > 0 ? "+" : ""}{m.change} this month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-dark dark:text-white mb-4">Progress Chart</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={DEMO_TRACKER.chartData}>
            <defs>
              <linearGradient id="beauty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="health" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8B4B8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E8B4B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="beauty" stroke="#D4AF37" strokeWidth={2} fill="url(#beauty)" name="Beauty" />
            <Area type="monotone" dataKey="health" stroke="#E8B4B8" strokeWidth={2} fill="url(#health)" name="Health" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gold-500" /><span className="text-xs text-gray-500">Beauty Score</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blush-400" /><span className="text-xs text-gray-500">Health Score</span></div>
        </div>
      </motion.div>

      {/* AI Prediction */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-dark dark:text-white">AI Predictions</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Based on your current routine and progress:</p>
        {[
          { label: "Projected score in 30 days", value: "92/100", color: "text-gold-600 dark:text-gold-400" },
          { label: "Hyperpigmentation improvement", value: "+15%", color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Hydration level", value: "Optimal", color: "text-blue-600 dark:text-blue-400" },
        ].map((p) => (
          <div key={p.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <span className="text-sm text-gray-600 dark:text-gray-300">{p.label}</span>
            <span className={`text-sm font-bold ${p.color}`}>{p.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
