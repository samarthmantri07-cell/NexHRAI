"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const stats = [
  {
    value: 92,
    format: "percent" as const,
    label: "Attrition Prediction Accuracy",
    sublabel: "Validated on 1,500+ employees",
    color: "oklch(0.70 0.22 265)",
  },
  {
    value: 6,
    format: "raw" as const,
    suffix: " months",
    label: "Early Warning Signal",
    sublabel: "Before flight risk materializes",
    color: "oklch(0.68 0.22 300)",
  },
  {
    value: 1470,
    format: "number" as const,
    label: "Employees Monitored",
    sublabel: "Across 5 departments",
    color: "oklch(0.72 0.20 200)",
  },
  {
    value: 2.4,
    format: "raw" as const,
    prefix: "$",
    suffix: "M",
    label: "Retention Savings",
    sublabel: "Average annual per enterprise",
    color: "oklch(0.72 0.18 145)",
  },
];

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.70 0.22 265 / 0.06), transparent)",
        }}
      />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            By the Numbers
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "Syne, system-ui" }}
          >
            Results that{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              speak for themselves
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative group"
            >
              <div
                className="rounded-2xl p-6 text-center h-full flex flex-col items-center justify-center gap-3"
                style={{
                  background: "oklch(1 0 0 / 0.03)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid oklch(1 0 0 / 0.07)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Glow background */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${stat.color}10, transparent)`,
                  }}
                />

                <div
                  className="text-4xl md:text-5xl font-bold tabular-nums"
                  style={{
                    fontFamily: "Syne, system-ui",
                    color: stat.color,
                    textShadow: `0 0 40px ${stat.color}50`,
                  }}
                >
                  {inView && (
                    <AnimatedCounter
                      value={stat.value}
                      format={stat.format}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.value % 1 !== 0 ? 1 : 0}
                      duration={1.8}
                    />
                  )}
                </div>

                <p className="font-semibold text-white text-sm leading-tight">{stat.label}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{stat.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
