"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles, Camera, ShieldCheck, Palette, Star, ChevronRight,
  Zap, Heart, Globe, ArrowRight, Check
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  { icon: Camera, title: "AI Face Scanner", desc: "Analyze skin tone, detect 10+ concerns, get your beauty score in seconds.", color: "from-gold-400/20 to-gold-200/10" },
  { icon: ShieldCheck, title: "Ingredient Analyzer", desc: "Scan any product. Know exactly what's safe, harmful, or pregnancy-risky.", color: "from-blush-300/20 to-blush-100/10" },
  { icon: Palette, title: "Skin Tone Matching", desc: "Find your perfect foundation, concealer, and lip shades instantly.", color: "from-emerald-400/20 to-emerald-200/10" },
  { icon: Sparkles, title: "AR Makeup Try-On", desc: "Try lipstick, foundation, blush and more — live on your face.", color: "from-purple-400/20 to-purple-200/10" },
  { icon: Heart, title: "Daily Routines", desc: "AI-curated AM & PM skincare routines tailored to your skin profile.", color: "from-rose-400/20 to-rose-200/10" },
  { icon: Zap, title: "Skin Journey Tracker", desc: "Weekly progress photos + AI-predicted improvement timeline.", color: "from-blue-400/20 to-blue-200/10" },
];

const plans = [
  { name: "Free", price: 0, desc: "Get started with basic beauty insights.", features: ["3 face scans / month", "Basic skin tone detection", "Ingredient scanner (5/month)", "Beauty chatbot (10 msgs)"], cta: "Start Free", highlight: false },
  { name: "Premium", price: 9.99, desc: "Full access for serious beauty enthusiasts.", features: ["Unlimited face scans", "Advanced skin concern analysis", "Unlimited ingredient scanning", "AR Makeup Try-On", "AI Beauty Chatbot (unlimited)", "Skin journey tracker", "Personalized routines"], cta: "Start Premium", highlight: true },
  { name: "Pro", price: 19.99, desc: "For beauty professionals & creators.", features: ["Everything in Premium", "Client management dashboard", "Branded reports", "API access", "Priority support", "Early feature access"], cta: "Start Pro", highlight: false },
];

const stats = [
  { value: "2M+", label: "Skin Analyses" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "500K+", label: "Happy Users" },
  { value: "150+", label: "Countries" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gold-400/10 bg-cream-50/80 dark:bg-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-gold">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-playfair font-bold text-xl text-dark dark:text-white">
              Beauty<span className="text-gold-500">IQ</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <a href="#features" className="hover:text-gold-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gold-400 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-sm font-medium text-gray-500 hover:text-gold-400 transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/home" className="beauty-btn text-sm px-5 py-2.5 rounded-xl">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 text-xs font-semibold text-gold-500 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Powered by GPT-4o Vision + MediaPipe
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-playfair text-5xl md:text-7xl font-bold text-dark dark:text-white leading-tight mb-6">
            Your AI{" "}<span className="text-gold-500">Beauty</span><br />Expert, Always On.
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Scan your face. Analyze ingredients. Match your skin tone. Get personalized routines. All powered by advanced AI — in seconds.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/scan" className="beauty-btn flex items-center gap-2 text-base px-8 py-4">
              <Camera className="w-5 h-5" /> Scan Your Skin Free
            </Link>
            <a href="#features" className="flex items-center gap-2 text-base font-medium text-gray-500 hover:text-gold-400 transition-colors">
              See how it works <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Hero visual */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mt-16 relative">
            <div className="relative mx-auto max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-gold-400/10">
              <div className="bg-gradient-to-br from-cream-100 to-blush-50 dark:from-gray-900 dark:to-dark aspect-video flex items-center justify-center">
                <AppPreviewMockup />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-gold-400/10 bg-white/40 dark:bg-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="text-center">
              <div className="font-playfair text-4xl font-bold text-gold-500 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark dark:text-white mb-4">
              Everything you need for <span className="text-gold-500">flawless skin</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              12+ AI-powered features designed to transform your beauty routine with personalized insights.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
                className="glass-card p-6 group hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 border border-white/20`}>
                  <f.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="font-playfair font-semibold text-lg text-dark dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-cream-100/50 dark:bg-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-dark dark:text-white mb-4">
              Simple, transparent <span className="text-gold-500">pricing</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Start free. Upgrade when you're ready.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.2}
                className={`relative rounded-3xl p-8 border transition-all duration-300 ${plan.highlight ? "bg-dark dark:bg-gold-400/10 border-gold-400 shadow-gold scale-105" : "bg-white dark:bg-gray-900 border-gold-400/10 hover:border-gold-400/30"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className={`text-sm font-semibold mb-2 ${plan.highlight ? "text-gold-400" : "text-gray-500"}`}>{plan.name}</div>
                <div className={`font-playfair text-4xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-dark dark:text-white"}`}>
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                  {plan.price > 0 && <span className="text-base font-normal text-gray-400">/mo</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? "text-gray-300" : "text-gray-500"}`}>{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-gold-400" : "text-emerald-500"}`} />
                      <span className={plan.highlight ? "text-gray-200" : "text-gray-500 dark:text-gray-400"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/home" className={`block w-full py-3 rounded-2xl font-semibold text-sm text-center transition-all ${plan.highlight ? "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-gold hover:shadow-gold-lg" : "border border-gold-400/30 text-gold-500 hover:bg-gold-400/10"}`}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card p-12">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-gold-500 to-gold-600 mx-auto mb-6 flex items-center justify-center shadow-gold">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">Ready to glow up?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Join 500,000+ users getting AI-powered beauty insights every day.</p>
            <Link href="/scan" className="beauty-btn inline-block text-base px-10 py-4">
              Start Your Free Scan
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold-400/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-playfair font-bold text-dark dark:text-white">Beauty<span className="text-gold-500">IQ</span> AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Support</a>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Available worldwide</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 BeautyIQ AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function AppPreviewMockup() {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center gap-6 p-8">
      <div className="relative w-48 h-96 bg-dark rounded-[2.5rem] border-4 border-gray-800 shadow-2xl overflow-hidden">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-800 rounded-full z-10" />
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-dark flex flex-col">
          <div className="p-4 pt-10">
            <div className="text-white text-xs font-semibold mb-1">Beauty Score</div>
            <div className="text-gold-400 text-3xl font-playfair font-bold">87</div>
            <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-gold-500 to-gold-600 h-full rounded-full w-[87%]" />
            </div>
          </div>
          <div className="px-4 space-y-2">
            {["Skin Tone: Medium", "Undertone: Warm", "Acne: Mild", "Hydration: 72%"].map((item) => (
              <div key={item} className="bg-white/5 rounded-xl px-3 py-2 text-[10px] text-gray-200 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" /> {item}
              </div>
            ))}
          </div>
          <div className="mt-auto p-4">
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl py-2 text-center text-xs font-bold text-white">View Full Report</div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col gap-4 w-56">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm font-semibold text-dark dark:text-white">Ingredient Check</div>
          </div>
          <div className="space-y-1.5">
            {[{ name: "Hyaluronic Acid", safe: true }, { name: "Paraben", safe: false }, { name: "Niacinamide", safe: true }].map((ing) => (
              <div key={ing.name} className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{ing.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ing.safe ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                  {ing.safe ? "safe" : "avoid"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm font-semibold text-dark dark:text-white mb-3">Skin Tone Palette</div>
          <div className="flex gap-2">
            {["#FDDBB4", "#F5C89A", "#E8A97E", "#C68B59", "#A67C52"].map((hex) => (
              <div key={hex} className="flex-1 h-8 rounded-lg border-2 border-white/50 shadow-sm" style={{ backgroundColor: hex }} />
            ))}
          </div>
          <div className="mt-2 text-[10px] text-gray-400">Medium Warm • #E8A97E</div>
        </div>
      </div>
      <div className="absolute top-6 right-6 glass-card px-3 py-2 flex items-center gap-2">
        <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
        <span className="text-xs font-semibold text-dark dark:text-white">98% Accuracy</span>
      </div>
      <div className="absolute bottom-6 left-6 glass-card px-3 py-2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-dark dark:text-white">AI Analysis Live</span>
      </div>
    </div>
  );
}
