"use client";

import { motion } from "framer-motion";
import { getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function ScoreRing({ score, label, size = 80, color, strokeWidth = 6 }: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const ringColor = color ?? getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gold-400/10"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display font-bold leading-none"
            style={{ fontSize: size * 0.24, color: ringColor }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-xs font-medium text-beauty-muted text-center">{label}</span>
    </div>
  );
}
