"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const stats = [
  { val: "500M+", label: "Data Points Processed Daily" },
  { val: "250+", label: "Enterprise Clients" },
  { val: "94.2%", label: "Prediction Accuracy" },
  { val: "3.2×", label: "Average ROI within 6 Months" },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-5%", "15%"]);

  return (
    <section ref={sectionRef} id="about" className="py-32 relative overflow-hidden bg-background">
      {/* Parallax orbs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none"
      />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold tracking-widest uppercase text-primary mb-6"
            >
              Our Belief
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-tight"
            >
              HR is fundamentally <br /> a data science problem.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground leading-relaxed mb-6"
            >
              In an era of constant disruption, relying on intuition for workforce decisions is no longer viable. NexHR-AI bridges the gap between machine learning and human leadership.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              We put immense predictive power directly into the hands of HR leaders — without requiring a data science team.
            </motion.p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-8 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-white/15 transition-colors text-center"
              >
                <div className="text-4xl font-black text-white mb-3 tracking-tight">{stat.val}</div>
                <div className="text-sm text-muted-foreground font-medium leading-tight">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
