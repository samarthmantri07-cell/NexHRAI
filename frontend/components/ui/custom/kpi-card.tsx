"use client";

import { motion, useInView, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  format?: "number" | "currency" | "percent" | "raw";
  prefix?: string;
  suffix?: string;
  trend?: number;
  icon?: React.ReactNode;
  iconColor?: string;
  className?: string;
  delay?: number;
  description?: string;
}

function useAnimatedValue(target: number, shouldStart: boolean, duration = 1.5) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [target, shouldStart, duration]);
  return display;
}

export function KpiCard({
  title,
  value,
  format = "number",
  prefix = "",
  suffix = "",
  trend,
  icon,
  iconColor = "oklch(0.70 0.22 265)",
  className,
  delay = 0,
  description,
}: KpiCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const displayValue = useAnimatedValue(value, inView);

  const formatted = (() => {
    if (format === "currency") {
      if (displayValue >= 1_000_000) return `$${(displayValue / 1_000_000).toFixed(2)}M`;
      if (displayValue >= 1_000) return `$${(displayValue / 1_000).toFixed(1)}K`;
      return `$${Math.floor(displayValue).toLocaleString()}`;
    }
    if (format === "percent") return `${displayValue.toFixed(1)}%`;
    if (format === "raw") return value < 10 ? displayValue.toFixed(1) : Math.floor(displayValue).toLocaleString();
    return Math.floor(displayValue).toLocaleString();
  })();

  const trendPositive = trend !== undefined && trend >= 0;
  const trendNeutral = trend === 0;
  const TrendIcon = trendNeutral ? Minus : trendPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      className={cn(
        "relative rounded-2xl p-6 overflow-hidden group cursor-default",
        "glass-card",
        className
      )}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{ background: iconColor }}
      />

      {/* Top border highlight */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${iconColor}40, transparent)`,
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <p className="text-sm font-medium text-muted-foreground leading-tight pr-2">{title}</p>
        {icon && (
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `color-mix(in oklch, ${iconColor} 15%, transparent)`,
              color: iconColor,
              border: `1px solid color-mix(in oklch, ${iconColor} 25%, transparent)`,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value row */}
      <div className="flex items-end justify-between relative z-10">
        <div>
          <div
            className="text-3xl font-bold tracking-tight text-white tabular-nums"
            style={{ fontFamily: "Syne, system-ui" }}
          >
            {prefix}{formatted}{suffix}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {trend !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: delay + 0.6, duration: 0.3, type: "spring" }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
            style={{
              color: trendNeutral
                ? "oklch(0.55 0.04 265)"
                : trendPositive
                ? "oklch(0.72 0.18 145)"
                : "oklch(0.68 0.22 25)",
              background: trendNeutral
                ? "oklch(0.55 0.04 265 / 0.12)"
                : trendPositive
                ? "oklch(0.72 0.18 145 / 0.12)"
                : "oklch(0.68 0.22 25 / 0.12)",
            }}
          >
            <TrendIcon className="w-3 h-3" />
            {trendPositive && !trendNeutral && "+"}
            {trend.toFixed(1)}%
          </motion.div>
        )}
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full"
        style={{ background: `linear-gradient(90deg, ${iconColor}, transparent)` }}
        initial={{ width: "0%" }}
        animate={inView ? { width: "40%" } : {}}
        transition={{ delay: delay + 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
