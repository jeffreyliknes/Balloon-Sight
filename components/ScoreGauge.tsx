"use client";

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const radius = 80;
  const stroke = 20; // Thicker stroke for badge look
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-destructive"; // Fail
  if (score >= 80) colorClass = "text-secondary"; // Pass (Teal)
  else if (score >= 50) colorClass = "text-accent"; // Warning (Orange)

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Decorative Outer Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
      
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset: 0 }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-brand-primary/10"
        />
        {/* Progress Circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={colorClass}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className={`text-6xl font-black text-brand-primary`}
        >
          {score}
        </motion.span>
        <span className="text-xs font-bold text-brand-primary/60 uppercase tracking-widest mt-2">
          BalloonSight
        </span>
      </div>
    </div>
  );
}
