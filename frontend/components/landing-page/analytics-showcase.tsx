"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "@/hooks/use-gsap";
import { NeuralNetwork } from "@/components/ui/neural-network";
import { Terminal } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const capabilities = [
  {
    step: "01",
    title: "Anomaly Detection",
    desc: "Automatically flags unusual patterns in overtime, absenteeism, and compensation using isolation forest algorithms.",
    color: "oklch(0.68 0.22 25)",
  },
  {
    step: "02",
    title: "Scenario Modeling",
    desc: "Run 'what-if' simulations: test compensation adjustments or team restructures and see projected attrition impact instantly.",
    color: "oklch(0.70 0.22 265)",
  },
  {
    step: "03",
    title: "Automated Reporting",
    desc: "Generate compliance-ready EEOC, pay equity, and performance reports formatted for auditors and boards in seconds.",
    color: "oklch(0.72 0.18 145)",
  },
];

const streamLogs = [
  { msg: "Attrition model scored employee #1247", time: "2ms", color: "oklch(0.70 0.22 265)" },
  { msg: "Salary anomaly detected — Engineering", time: "14ms", color: "oklch(0.76 0.18 75)" },
  { msg: "High-risk alert generated × 3 employees", time: "1ms", color: "oklch(0.68 0.22 25)" },
  { msg: "Retention report compiled", time: "38ms", color: "oklch(0.72 0.18 145)" },
  { msg: "SHAP explanations processed", time: "7ms", color: "oklch(0.72 0.20 200)" },
];

export function AnalyticsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (!sectionRef.current) return;
    const steps = sectionRef.current.querySelectorAll(".step-item");

    if (orbRef.current) {
      gsap.fromTo(
        orbRef.current,
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: orbRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 1.5,
          },
        }
      );
    }

    steps.forEach((step) => {
      gsap.fromTo(
        step,
        { opacity: 0, y: 40, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="analytics"
      className="py-32 relative overflow-hidden"
      style={{ background: "oklch(0.08 0.015 265)" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.70 0.22 265 / 0.05), transparent)",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "oklch(0.70 0.22 265)" }}
          >
            AI Intelligence Engine
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
            style={{ fontFamily: "Syne, system-ui" }}
          >
            Insight, automated.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Three powerful AI systems working in parallel — always on, always learning.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left: Neural network + data stream */}
          <div ref={orbRef} className="lg:sticky lg:top-32 flex flex-col items-center gap-8">
            {/* Neural network visualization */}
            <div
              className="w-full rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: "oklch(1 0 0 / 0.03)",
                border: "1px solid oklch(1 0 0 / 0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.70 0.22 265 / 0.08), transparent)",
                }}
              />
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6 text-center">
                Neural Network — Active
              </p>
              <div className="flex justify-center">
                <NeuralNetwork isActive width={320} height={160} className="mx-auto" />
              </div>
              {/* Layer labels */}
              <div className="flex justify-between mt-4 px-4">
                {["Input", "Hidden 1", "Hidden 2", "Output"].map((label, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground">{label}</span>
                ))}
              </div>
            </div>

            {/* Terminal data stream */}
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.07 0.01 265)",
                border: "1px solid oklch(1 0 0 / 0.08)",
              }}
            >
              {/* Terminal header */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: "oklch(1 0 0 / 0.07)" }}
              >
                <div className="flex gap-1.5">
                  {["oklch(0.68 0.22 25)", "oklch(0.76 0.18 75)", "oklch(0.72 0.18 145)"].map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 ml-2">
                  <Terminal className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground font-mono">nexhr-ai — live feed</span>
                </div>
              </div>
              <div className="p-4 space-y-2 font-mono">
                {streamLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="flex items-start gap-3 text-xs"
                  >
                    <span style={{ color: log.color }}>›</span>
                    <span className="text-muted-foreground flex-1">{log.msg}</span>
                    <span
                      className="shrink-0 px-1.5 py-0.5 rounded text-[10px]"
                      style={{
                        background: `color-mix(in oklch, ${log.color} 10%, transparent)`,
                        color: log.color,
                      }}
                    >
                      {log.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Step reveals */}
          <div className="space-y-14">
            {capabilities.map((c, i) => (
              <div key={i} className="step-item opacity-0">
                <div className="flex gap-8">
                  {/* Step number */}
                  <div
                    className="text-6xl font-black shrink-0 leading-none select-none tabular-nums"
                    style={{
                      fontFamily: "Syne, system-ui",
                      color: `color-mix(in oklch, ${c.color} 20%, transparent)`,
                    }}
                  >
                    {c.step}
                  </div>
                  <div className="pt-2">
                    <h3
                      className="text-2xl font-bold mb-4"
                      style={{ color: c.color, fontFamily: "Syne, system-ui" }}
                    >
                      {c.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{c.desc}</p>
                    <div
                      className="mt-6 h-px"
                      style={{
                        background: `linear-gradient(90deg, color-mix(in oklch, ${c.color} 30%, transparent), transparent)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
