"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlassCard } from "@/components/ui/custom/glass-card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "@/hooks/use-gsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    title: "Unified Data Command",
    sub: "All workforce signals in one place",
    desc: "Connect HRIS, performance, payroll, and engagement tools. NexHR-AI unifies every data stream into a single intelligence layer.",
  },
  {
    title: "Predictive Risk Scoring",
    sub: "AI identifies flight risks 6 months ahead",
    desc: "XGBoost models continuously score every employee on attrition likelihood, factoring in 34 behavioral and compensation signals.",
  },
  {
    title: "Automated Intervention",
    sub: "One-click retention action plans",
    desc: "When risk is detected, NexHR-AI generates a tailored intervention checklist for managers — complete with compensation adjustments and career path nudges.",
  },
  {
    title: "Boardroom-Ready Reporting",
    sub: "Export any view as a polished PDF",
    desc: "Generate equity, compliance, and performance reports in seconds, formatted for executives and regulators alike.",
  },
];

export function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (!sectionRef.current) return;

    const featureItems = sectionRef.current.querySelectorAll(".feature-item");

    featureItems.forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Parallax on the mock window itself
    if (stickyRef.current) {
      gsap.fromTo(
        stickyRef.current,
        { scale: 0.92, opacity: 0.6 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} id="preview" className="py-32 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-sm font-semibold tracking-widest uppercase text-primary mb-4"
          >
            The Command Center
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white"
          >
            Every answer, <br />
            <span className="text-muted-foreground">one dashboard.</span>
          </motion.h2>
        </div>

        {/* Sticky layout: mock on left, features scroll on right */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Sticky mock browser */}
          <div className="lg:sticky lg:top-28">
            <div
              ref={stickyRef}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden aspect-[16/10]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-blue-500/10" />
              {/* Traffic lights */}
              <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <div className="ml-4 flex-1 h-5 bg-white/5 rounded-sm max-w-xs" />
              </div>
              {/* App chrome */}
              <div className="flex h-full pt-10">
                <div className="w-14 bg-white/[0.02] border-r border-white/5 p-2 space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-white/5 rounded-lg mx-auto" />
                  ))}
                </div>
                <div className="flex-1 p-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5 flex items-end p-3">
                        <div className="w-full h-2 bg-primary/30 rounded-full">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${[72, 45, 88][i]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="col-span-3 h-32 bg-white/5 rounded-xl border border-white/5 p-3">
                      <div className="h-2 w-20 bg-white/10 rounded mb-3" />
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-2 mb-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary/50 mt-0.5 shrink-0" />
                          <div className="h-2 bg-white/5 rounded flex-1" />
                        </div>
                      ))}
                    </div>
                    <div className="col-span-2 h-32 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-4 border-primary/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-primary/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable features */}
          <div className="space-y-16 py-8">
            {features.map((f, i) => (
              <div key={i} className="feature-item opacity-0">
                <GlassCard className="border-white/5 hover:border-white/15">
                  <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-primary/80 font-medium mb-4">{f.sub}</p>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
