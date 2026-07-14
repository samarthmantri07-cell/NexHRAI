"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  value: number; // 0-100
  riskLevel: "High" | "Medium" | "Low";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const RISK_CONFIG = {
  High: {
    color: "oklch(0.68 0.22 25)",
    gradientStart: "oklch(0.76 0.18 75)",
    gradientEnd: "oklch(0.68 0.22 25)",
    label: "High Risk",
    glow: "0 0 30px oklch(0.68 0.22 25 / 0.4)",
  },
  Medium: {
    color: "oklch(0.76 0.18 75)",
    gradientStart: "oklch(0.72 0.18 145)",
    gradientEnd: "oklch(0.76 0.18 75)",
    label: "Medium Risk",
    glow: "0 0 30px oklch(0.76 0.18 75 / 0.4)",
  },
  Low: {
    color: "oklch(0.72 0.18 145)",
    gradientStart: "oklch(0.72 0.20 200)",
    gradientEnd: "oklch(0.72 0.18 145)",
    label: "Low Risk",
    glow: "0 0 30px oklch(0.72 0.18 145 / 0.4)",
  },
};

const SIZE_CONFIG = {
  sm: { svgSize: 120, strokeWidth: 8, cx: 60, cy: 60, r: 48, fontSize: "text-xl" },
  md: { svgSize: 180, strokeWidth: 10, cx: 90, cy: 90, r: 72, fontSize: "text-3xl" },
  lg: { svgSize: 240, strokeWidth: 12, cx: 120, cy: 120, r: 96, fontSize: "text-4xl" },
};

export function RiskGauge({
  value,
  riskLevel,
  size = "md",
  showLabel = true,
  animated = true,
}: RiskGaugeProps) {
  const config = RISK_CONFIG[riskLevel];
  const sizeConfig = SIZE_CONFIG[size];
  const { svgSize, strokeWidth, cx, cy, r } = sizeConfig;

  // Semicircle: 180 degrees of arc
  const circumference = Math.PI * r;
  const dashOffset = circumference - (circumference * value) / 100;

  // SVG arc path for the semicircle (bottom half as gauge)
  const startAngle = -180;
  const endAngle = 0;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const bgStart = polarToCartesian(cx, cy, r, -180);
  const bgEnd = polarToCartesian(cx, cy, r, 0);
  const bgPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`;

  const filledDegrees = -180 + (value / 100) * 180;
  const fillEnd = polarToCartesian(cx, cy, r, filledDegrees);
  const largeArc = filledDegrees - (-180) > 180 ? 1 : 0;
  const fillPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`;

  const gaugePathLength = Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize / 2 + strokeWidth }}>
        <svg
          width={svgSize}
          height={svgSize / 2 + strokeWidth}
          viewBox={`0 0 ${svgSize} ${svgSize / 2 + strokeWidth}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id={`gauge-grad-${riskLevel}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={config.gradientStart} />
              <stop offset="100%" stopColor={config.gradientEnd} />
            </linearGradient>
            <filter id="gauge-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <path
            d={bgPath}
            fill="none"
            stroke="oklch(1 0 0 / 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated fill */}
          <motion.path
            d={fillPath}
            fill="none"
            stroke={`url(#gauge-grad-${riskLevel})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#gauge-glow)"
            initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: value / 100, opacity: 1 }}
            animate={{ pathLength: value / 100, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />

          {/* Center value */}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={size === "lg" ? 28 : size === "md" ? 22 : 16}
            fontWeight="700"
            fontFamily="Syne, system-ui"
          >
            {value.toFixed(1)}%
          </text>
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            fill={config.color}
            fontSize={size === "lg" ? 12 : 10}
            fontWeight="600"
            letterSpacing="0.05em"
            fontFamily="system-ui"
          >
            PROBABILITY
          </text>
        </svg>
      </div>

      {showLabel && (
        <motion.div
          initial={animated ? { opacity: 0, scale: 0.8 } : {}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
          className="px-4 py-1.5 rounded-full text-sm font-semibold border"
          style={{
            color: config.color,
            backgroundColor: `color-mix(in oklch, ${config.color} 15%, transparent)`,
            borderColor: `color-mix(in oklch, ${config.color} 30%, transparent)`,
            boxShadow: config.glow,
          }}
        >
          {config.label}
        </motion.div>
      )}
    </div>
  );
}
