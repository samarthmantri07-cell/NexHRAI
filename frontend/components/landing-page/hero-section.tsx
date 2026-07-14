"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import { MagneticButton } from "@/components/ui/magnetic-button";

const HeroScene = dynamic(
  () => import("@/components/canvas/hero-scene").then((m) => m.HeroScene),
  { ssr: false }
);

const HEADLINE = "Predict Attrition Before It Happens.";
const WORDS = HEADLINE.split(" ");

// Floating stat chip
function StatChip({
  value,
  label,
  delay,
  x,
  y,
}: {
  value: string;
  label: string;
  delay: number;
  x: string;
  y: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="absolute hidden xl:block animate-float"
      style={{ left: x, top: y, animationDelay: `${delay}s` }}
    >
      <div
        className="px-4 py-2.5 rounded-2xl"
        style={{
          background: "oklch(0.11 0.015 265 / 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid oklch(1 0 0 / 0.10)",
          boxShadow: "0 8px 32px oklch(0 0 0 / 0.3)",
        }}
      >
        <div
          className="text-lg font-bold"
          style={{
            fontFamily: "Syne, system-ui",
            background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {value}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">{label}</div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Mouse spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const spotY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "oklch(0.08 0.015 265)" }}
    >
      {/* 3D Particle Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Aurora backgrounds */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute top-[-20%] left-[10%] w-[55vw] h-[55vw] rounded-full opacity-[0.12] blur-[100px] animate-float-slow"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.22 265), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[5%] w-[40vw] h-[40vw] rounded-full opacity-[0.10] blur-[80px] animate-float"
          style={{
            background: "radial-gradient(circle, oklch(0.68 0.22 300), transparent 70%)",
            animationDelay: "-3s",
          }}
        />
        <div
          className="absolute top-[30%] right-[20%] w-[25vw] h-[25vw] rounded-full opacity-[0.07] blur-[60px]"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.20 200), transparent 70%)" }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-[1] dot-pattern opacity-40 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Mouse spotlight */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: "radial-gradient(circle 400px at var(--x) var(--y), oklch(0.70 0.22 265 / 0.06), transparent 70%)",
          // @ts-ignore
          "--x": spotX,
          "--y": spotY,
        }}
      />

      {/* Gradient overlay fades */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-[oklch(0.08_0.015_265)] pointer-events-none" />

      {/* Floating stat chips */}
      <StatChip value="92%" label="Attrition Accuracy" delay={2.0} x="8%" y="30%" />
      <StatChip value="6mo" label="Early Warning" delay={2.3} x="80%" y="25%" />
      <StatChip value="$2.4M" label="Avg. Retention Savings" delay={2.6} x="78%" y="62%" />

      {/* Main content */}
      <motion.div
        style={{ y: yParallax, opacity: opacityFade }}
        className="relative z-10 text-center max-w-5xl mx-auto px-4 md:px-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
            style={{
              background: "oklch(0.70 0.22 265 / 0.10)",
              border: "1px solid oklch(0.70 0.22 265 / 0.25)",
              color: "oklch(0.80 0.15 265)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Next-Generation AI Workforce Intelligence
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "oklch(0.72 0.18 145)" }}
            />
          </span>
        </motion.div>

        {/* Headline — word by word */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8"
          style={{ fontFamily: "Syne, system-ui" }}
        >
          <span className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {WORDS.map((word, i) => {
              const isAccent = word === "Happens.";
              return (
                <motion.span
                  key={`${word}-${i}`}
                  initial={{ opacity: 0, y: 60, rotateX: -30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                  style={{
                    transformOrigin: "bottom center",
                    ...(isAccent
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : { color: "oklch(0.97 0.005 265)" }),
                  }}
                >
                  {word}
                </motion.span>
              );
            })}
          </span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Transform your workforce data into actionable intelligence. Predict
          flight risks{" "}
          <span className="text-foreground font-medium">6 months in advance</span>, optimize
          compensation, and power your people strategy with enterprise-grade AI.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <MagneticButton strength={0.25}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 h-12 px-8 rounded-2xl text-base font-semibold text-white relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.22 265), oklch(0.60 0.22 300))",
                  boxShadow:
                    "0 0 30px oklch(0.70 0.22 265 / 0.4), 0 1px 0 oklch(1 0 0 / 0.15) inset",
                }}
              >
                <span className="relative z-10">View Demo Dashboard</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
                {/* Shimmer sweep */}
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.15) 50%, transparent 60%)",
                  }}
                />
              </motion.button>
            </MagneticButton>
          </Link>

          <MagneticButton strength={0.2}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 h-12 px-8 rounded-2xl text-base font-medium text-white"
              style={{
                background: "oklch(1 0 0 / 0.04)",
                border: "1px solid oklch(1 0 0 / 0.12)",
                backdropFilter: "blur(12px)",
              }}
            >
              Book a Demo
            </motion.button>
          </MagneticButton>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          {["SOC2 Compliant", "GDPR Ready", "99.9% Uptime", "Enterprise SSO"].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: "oklch(0.72 0.18 145)" }}
              />
              {item}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
