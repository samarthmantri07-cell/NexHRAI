"use client";

import { motion, useSpring, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  format?: "number" | "currency" | "percent" | "raw";
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  format = "number",
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.5,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(val) {
        setDisplayValue(val);
      },
    });

    return () => controls.stop();
  }, [inView, value, duration]);

  const formatted = (() => {
    if (format === "currency") {
      if (displayValue >= 1_000_000) return `$${(displayValue / 1_000_000).toFixed(1)}M`;
      if (displayValue >= 1_000) return `$${(displayValue / 1_000).toFixed(1)}K`;
      return `$${Math.floor(displayValue).toLocaleString()}`;
    }
    if (format === "percent") return `${displayValue.toFixed(decimals || 1)}%`;
    if (format === "raw") return `${displayValue.toFixed(decimals)}`;
    return Math.floor(displayValue).toLocaleString();
  })();

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
