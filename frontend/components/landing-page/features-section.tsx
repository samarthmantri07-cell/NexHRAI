"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlassCard } from "@/components/ui/custom/glass-card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "@/hooks/use-gsap";
import { useRef } from "react";
import { Brain, LineChart, Users, Shield, Zap, Target, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Brain,
    title: "Predictive Attrition AI",
    desc: "XGBoost ML models identify flight risks 6 months in advance with 92% accuracy using SHAP explainability.",
    color: "oklch(0.68 0.22 300)",
    size: "large",
    stat: "92% accuracy",
  },
  {
    icon: LineChart,
    title: "Compensation Benchmarking",
    desc: "Real-time salary analytics and market alignment with automated pay equity analysis.",
    color: "oklch(0.70 0.22 265)",
    size: "normal",
    stat: "Live market data",
  },
  {
    icon: Users,
    title: "Diversity & Inclusion",
    desc: "Deep demographic insights across departments, roles, and pipelines.",
    color: "oklch(0.72 0.20 200)",
    size: "normal",
    stat: "14 dimensions",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    desc: "Instant predictive score updates as new employee data enters the system.",
    color: "oklch(0.76 0.18 75)",
    size: "normal",
    stat: "<2ms latency",
  },
  {
    icon: Target,
    title: "Automated Interventions",
    desc: "AI-tailored retention strategies specific to each employee's risk profile and work preferences.",
    color: "oklch(0.72 0.18 145)",
    size: "large",
    stat: "68% success rate",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "SOC2 compliant with field-level encryption for all sensitive PII data.",
    color: "oklch(0.68 0.22 25)",
    size: "normal",
    stat: "SOC2 + GDPR",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGsap(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll(".feature-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.70 0.22 265 / 0.05), transparent)",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="dot-pattern absolute inset-0 opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "oklch(0.70 0.22 265)" }}
          >
            Platform Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "Syne, system-ui" }}
          >
            Built for enterprise.{" "}
            <span className="text-muted-foreground font-normal">Designed for humans.</span>
          </motion.h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`feature-card opacity-0 ${f.size === "large" ? "lg:col-span-1" : ""}`}
              >
                <MagneticButton strength={0.12}>
                  <div
                    className="group relative h-full rounded-2xl p-7 overflow-hidden cursor-default transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: "oklch(1 0 0 / 0.03)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid oklch(1 0 0 / 0.07)",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `color-mix(in oklch, ${f.color} 30%, transparent)`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px color-mix(in oklch, ${f.color} 15%, transparent)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(1 0 0 / 0.07)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Background glow */}
                    <div
                      className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                      style={{ background: f.color }}
                    />

                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `color-mix(in oklch, ${f.color} 15%, transparent)`,
                        color: f.color,
                        border: `1px solid color-mix(in oklch, ${f.color} 25%, transparent)`,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Stat badge */}
                    <div
                      className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{
                        background: `color-mix(in oklch, ${f.color} 12%, transparent)`,
                        color: f.color,
                        border: `1px solid color-mix(in oklch, ${f.color} 20%, transparent)`,
                      }}
                    >
                      {f.stat}
                    </div>

                    <h3
                      className="text-lg font-bold text-white mb-3"
                      style={{ fontFamily: "Syne, system-ui" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>

                    {/* Arrow hover */}
                    <div className="flex items-center gap-1 mt-5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: f.color }}>
                      Learn more <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </MagneticButton>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
