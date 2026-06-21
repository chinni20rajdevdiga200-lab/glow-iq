"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Users, Scan, Package, Crown, TrendingUp, TrendingDown,
  DollarSign, BarChart2, Search
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { useState } from "react";

const mockStats = {
  totalUsers: 524891,
  totalScans: 2134567,
  totalProducts: 8432,
  activeSubscriptions: 42310,
  newUsersThisWeek: 3842,
  scansThisWeek: 28945,
  mrr: 423100,
  planDistribution: { FREE: 482581, PREMIUM: 38210, PRO: 4100 },
  recentUsers: [],
};

const mockDaily = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  count: Math.floor(800 + Math.random() * 400 + i * 15),
}));

export default function AdminPage() {
  const [userSearch, setUserSearch] = useState("");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data),
  });

  const { data: analytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => api.get("/admin/analytics").then((r) => r.data),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users", userSearch],
    queryFn: () => api.get(`/admin/users?search=${userSearch}`).then((r) => r.data),
  });

  const s = stats ?? mockStats;
  const dailyData = analytics?.dailyScans ?? mockDaily;

  const statCards = [
    { label: "Total Users", value: s.totalUsers?.toLocaleString(), icon: Users, change: `+${s.newUsersThisWeek?.toLocaleString()} this week`, up: true, color: "from-blue-400/20 to-blue-200/10", iconColor: "text-blue-500" },
    { label: "Total Scans", value: s.totalScans?.toLocaleString(), icon: Scan, change: `+${s.scansThisWeek?.toLocaleString()} this week`, up: true, color: "from-gold-400/20 to-gold-200/10", iconColor: "text-gold-500" },
    { label: "Products DB", value: s.totalProducts?.toLocaleString(), icon: Package, change: "+124 this month", up: true, color: "from-emerald-400/20 to-emerald-200/10", iconColor: "text-emerald-500" },
    { label: "Active Subs", value: s.activeSubscriptions?.toLocaleString(), icon: Crown, change: "+892 this week", up: true, color: "from-purple-400/20 to-purple-200/10", iconColor: "text-purple-500" },
    { label: "MRR", value: `$${(s.mrr / 1000).toFixed(1)}K`, icon: DollarSign, change: "+12.4% vs last month", up: true, color: "from-blush-400/20 to-blush-200/10", iconColor: "text-blush-500" },
    { label: "Conversion Rate", value: "8.1%", icon: BarChart2, change: "+0.3% vs last month", up: true, color: "from-cyan-400/20 to-cyan-200/10", iconColor: "text-cyan-500" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-beauty-dark dark:text-cream-100 mb-1">Admin Dashboard</h1>
          <p className="text-beauty-muted">Platform overview and analytics</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center border border-white/20`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                {card.up ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="font-display text-2xl font-bold text-beauty-dark dark:text-cream-100 mb-0.5">
                {isLoading ? <div className="h-8 w-20 skeleton rounded-xl" /> : card.value}
              </div>
              <div className="text-xs text-beauty-muted mb-1">{card.label}</div>
              <div className={`text-[11px] font-medium ${card.up ? "text-emerald-500" : "text-red-500"}`}>{card.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Plan distribution */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {Object.entries(s.planDistribution ?? {}).map(([plan, count], i) => (
            <motion.div
              key={plan}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`text-sm font-bold uppercase tracking-wide ${plan === "FREE" ? "text-beauty-muted" : plan === "PREMIUM" ? "text-gold-400" : "text-purple-400"}`}>{plan}</div>
                {plan !== "FREE" && <Crown className={`w-4 h-4 ${plan === "PRO" ? "text-purple-400" : "text-gold-400"}`} />}
              </div>
              <div className="font-display text-3xl font-bold text-beauty-dark dark:text-cream-100 mb-1">
                {(count as number).toLocaleString()}
              </div>
              <div className="text-xs text-beauty-muted">
                {((count as number / s.totalUsers) * 100).toFixed(1)}% of users
              </div>
              <div className="mt-3 w-full bg-gray-100 dark:bg-white/5 rounded-full h-1.5">
                <div
                  className={`h-full rounded-full ${plan === "FREE" ? "bg-beauty-muted/30" : plan === "PREMIUM" ? "bg-gold-gradient" : "bg-purple-500"}`}
                  style={{ width: `${(count as number / s.totalUsers) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="font-display font-semibold text-lg text-beauty-dark dark:text-cream-100 mb-6">Daily Scans (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "12px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="count" stroke="#D4AF37" strokeWidth={2} fill="url(#scanGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Users table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-beauty-dark dark:text-cream-100">User Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beauty-muted" />
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gold-400/20 bg-white dark:bg-beauty-charcoal text-sm focus:outline-none focus:border-gold-400 w-48"
              />
            </div>
          </div>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-400/10">
                  {["Name", "Email", "Plan", "Scans", "Joined"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-beauty-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-beauty-muted text-sm">Loading...</td></tr>
                ) : (users?.data ?? mockAdminUsers).map((u: { id: string; name: string; email: string; plan: string; _count?: { scans: number }; createdAt: string }) => (
                  <tr key={u.id} className="border-b border-gold-400/5 hover:bg-gold-400/5 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-beauty-dark dark:text-cream-100">{u.name}</td>
                    <td className="px-5 py-3 text-sm text-beauty-muted">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-xl capitalize ${
                        u.plan === "PREMIUM" ? "bg-gold-400/10 text-gold-400" :
                        u.plan === "PRO" ? "bg-purple-400/10 text-purple-400" :
                        "bg-gray-100 dark:bg-white/5 text-beauty-muted"
                      }`}>
                        {u.plan?.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-beauty-muted">{u._count?.scans ?? 0}</td>
                    <td className="px-5 py-3 text-sm text-beauty-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

const mockAdminUsers = [
  { id: "1", name: "Sarah Chen", email: "sarah@example.com", plan: "PREMIUM", _count: { scans: 24 }, createdAt: "2024-01-15" },
  { id: "2", name: "Amara Osei", email: "amara@example.com", plan: "PRO", _count: { scans: 87 }, createdAt: "2024-02-03" },
  { id: "3", name: "Mei Lin", email: "mei@example.com", plan: "FREE", _count: { scans: 3 }, createdAt: "2024-03-20" },
  { id: "4", name: "Priya Sharma", email: "priya@example.com", plan: "PREMIUM", _count: { scans: 41 }, createdAt: "2024-01-28" },
  { id: "5", name: "Alex Johnson", email: "alex@example.com", plan: "FREE", _count: { scans: 1 }, createdAt: "2024-06-01" },
];
