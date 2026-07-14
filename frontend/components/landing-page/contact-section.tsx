"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/custom/glass-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-background">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassCard className="p-10 md:p-16 text-center border-white/8 bg-white/[0.02] relative overflow-hidden">
            {/* Corner gradients */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full" />

            <div className="relative z-10">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm font-semibold tracking-widest uppercase text-primary mb-6"
              >
                Get Started
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
              >
                Ready to transform <br /> your workforce?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto"
              >
                Join 250+ enterprise teams using NexHR-AI to predict attrition and optimize compensation strategies.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="your@company.com"
                  className="flex-1 h-12 px-5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <MagneticButton>
                  <Button size="lg" className="h-12 px-8 rounded-xl font-semibold bg-white text-black hover:bg-white/90 whitespace-nowrap">
                    Start Free Trial
                  </Button>
                </MagneticButton>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-xs text-muted-foreground/60 mt-5"
              >
                14-day free trial · No credit card required · Cancel anytime
              </motion.p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
