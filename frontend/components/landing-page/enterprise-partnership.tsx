"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/custom/glass-card";
import { Building2, Handshake, TrendingUp, Mail, Phone, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
} as any;

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
} as any;

export function EnterprisePartnership() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("samarthmantri07@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText("+918626068304");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.08 0.015 265)" }}>
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
            style={{ fontFamily: "Syne, system-ui" }}
          >
            Partner With NexHR-AI
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            We help organizations transform workforce management through AI-powered employee analytics, retention intelligence, and workforce insights. If you're interested in enterprise deployment, strategic partnerships, HR digital transformation, or investment opportunities, we'd love to connect.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {/* Card 1 */}
          <motion.div variants={cardVariant}>
            <GlassCard className="h-full p-8 border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, oklch(0.70 0.22 265 / 0.2), transparent)", border: "1px solid oklch(0.70 0.22 265 / 0.3)" }}>
                <Building2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "Syne, system-ui" }}>Enterprise Deployment</h3>
              <p className="text-muted-foreground">Deploy NexHR-AI within your organization.</p>
            </GlassCard>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={cardVariant}>
            <GlassCard className="h-full p-8 border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, oklch(0.68 0.22 300 / 0.2), transparent)", border: "1px solid oklch(0.68 0.22 300 / 0.3)" }}>
                <Handshake className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "Syne, system-ui" }}>Strategic Partnership</h3>
              <p className="text-muted-foreground">Let's collaborate to build the future of intelligent HR.</p>
            </GlassCard>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={cardVariant}>
            <GlassCard className="h-full p-8 border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(135deg, oklch(0.72 0.18 145 / 0.2), transparent)", border: "1px solid oklch(0.72 0.18 145 / 0.3)" }}>
                <TrendingUp className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "Syne, system-ui" }}>Investment Opportunities</h3>
              <p className="text-muted-foreground">Interested in supporting the future of AI-powered HR technology? Let's start a conversation.</p>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Founder Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <GlassCard className="p-8 md:p-10 border-white/10 bg-white/[0.03] overflow-hidden relative group">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/15 transition-colors duration-500" />
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Syne, system-ui" }}>Contact the Founder</h3>
                <p className="text-sm text-primary font-semibold tracking-wide uppercase mb-6">Samarth Mantri</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                    <span className="w-20 text-sm font-medium opacity-70">Role</span>
                    <span className="text-white font-medium">Founder & AI/ML Engineer</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                    <span className="w-20 text-sm font-medium opacity-70">Email</span>
                    <span className="text-white font-medium">samarthmantri07@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
                    <span className="w-20 text-sm font-medium opacity-70">Phone</span>
                    <span className="text-white font-medium">+91 86260 68304</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 justify-center">
                <div className="flex gap-2">
                  <a href="mailto:samarthmantri07@gmail.com" className={cn(buttonVariants({ variant: "default" }), "flex-1 md:w-40 bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-300 cursor-pointer")}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email Me
                  </a>
                  <Button variant="outline" size="icon" onClick={copyEmail} className="border-white/10 hover:bg-white/10 transition-colors bg-white/5" title="Copy Email">
                    {copiedEmail ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <a href="tel:+918626068304" className={cn(buttonVariants({ variant: "secondary" }), "flex-1 md:w-40 bg-white/10 text-white hover:bg-white/20 font-medium border border-white/5 transition-all duration-300 cursor-pointer")}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Me
                  </a>
                  <Button variant="outline" size="icon" onClick={copyPhone} className="border-white/10 hover:bg-white/10 transition-colors bg-white/5" title="Copy Phone">
                    {copiedPhone ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
