"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  delay?: number;
  className?: string;
  actions?: React.ReactNode;
  minHeight?: number;
}

export function ChartContainer({
  children,
  title,
  subtitle,
  delay = 0,
  className,
  actions,
  minHeight = 300,
}: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative rounded-2xl overflow-hidden glass-card group", className)}
    >
      {/* Top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.70 0.22 265 / 0.4), oklch(0.68 0.22 300 / 0.3), transparent)",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="space-y-0.5">
          <h3
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "Syne, system-ui" }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Decorative separator */}
      <div
        className="mx-6 h-px mb-4"
        style={{
          background: "linear-gradient(90deg, oklch(1 0 0 / 0.08), transparent)",
        }}
      />

      {/* Chart area */}
      <div className="px-2 pb-4" style={{ minHeight }}>
        {children}
      </div>
    </motion.div>
  );
}
