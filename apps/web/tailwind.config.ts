import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GlowIQ Blue Palette
        blue: {
          DEFAULT: "#2563EB",
          medium: "#3B82F6",
          light: "#DBEAFE",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        safe: "#16A34A",
        warn: "#D97706",
        risk: "#DC2626",
        // GlowIQ Light theme
        app: {
          bg: "#F7F9FF",
          card: "#FFFFFF",
          surface: "#EFF4FF",
          text: "#0D1526",
          sub: "rgba(13,21,38,0.58)",
          muted: "rgba(13,21,38,0.36)",
          border: "rgba(37,99,235,0.10)",
        },
        // Legacy gold/cream kept for compatibility
        gold: {
          DEFAULT: "#D4AF37",
          400: "#D4AF37",
          500: "#B8941F",
        },
        cream: { DEFAULT: "#F8F4EC", 50: "#FDFCF9", 100: "#F8F4EC" },
        blush: { DEFAULT: "#E8B4B8", 400: "#DB9299" },
        dark: "#0F0F0F",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        cormorant: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        playfair: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        mono: ["monospace"],
      },
      backgroundImage: {
        "blue-gradient": "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F5E089 50%, #D4AF37 100%)",
      },
      boxShadow: {
        "blue": "0 4px 24px rgba(37,99,235,0.25)",
        "blue-lg": "0 8px 40px rgba(37,99,235,0.35)",
        "gold": "0 4px 24px rgba(212,175,55,0.25)",
        "card": "0 2px 16px rgba(37,99,235,0.08)",
      },
      borderRadius: { "4xl": "2rem", "5xl": "2.5rem" },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease infinite",
        "dot-bounce": "dotBounce 1.2s ease infinite",
        "scan-line": "scanLine 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(37,99,235,0.28)" },
          "50%": { boxShadow: "0 0 42px rgba(37,99,235,0.65)" },
        },
        dotBounce: {
          "0%, 100%": { opacity: "0.28", transform: "scale(0.75)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        scanLine: {
          "0%, 100%": { top: "18%" },
          "50%": { top: "82%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
