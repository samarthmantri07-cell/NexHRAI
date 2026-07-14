"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Zap, Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  ["#features", "Features"],
  ["#analytics", "Analytics"],
  ["#about", "About"],
  ["#preview", "Product"],
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 flex justify-center pt-4 px-4"
      >
        <motion.nav
          animate={{
            backdropFilter: scrolled ? "blur(24px)" : "blur(0px)",
            backgroundColor: scrolled
              ? "oklch(0.09 0.015 265 / 0.85)"
              : "transparent",
            borderColor: scrolled ? "oklch(1 0 0 / 0.10)" : "transparent",
            boxShadow: scrolled
              ? "0 8px 40px oklch(0 0 0 / 0.4), 0 1px 0 oklch(1 0 0 / 0.06) inset"
              : "none",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full max-w-5xl flex items-center justify-between h-14 px-5 rounded-2xl border"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                boxShadow: "0 0 16px oklch(0.70 0.22 265 / 0.4)",
              }}
            >
              <Zap className="w-3.5 h-3.5 text-white" />
            </motion.div>
            <span
              className="font-bold text-base text-white tracking-tight"
              style={{ fontFamily: "Syne, system-ui" }}
            >
              NexHR
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                -AI
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(([href, label]) => (
              <motion.a
                key={href}
                href={href}
                className="relative px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 group"
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15 }}
              >
                {label}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-primary group-hover:w-full transition-all duration-300"
                  style={{ background: "oklch(0.70 0.22 265)" }}
                />
              </motion.a>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-white text-sm h-8"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <MagneticButton strength={0.25}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 h-8 px-4 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.22 265), oklch(0.62 0.22 300))",
                    boxShadow: "0 0 20px oklch(0.70 0.22 265 / 0.3)",
                  }}
                >
                  Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </MagneticButton>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.nav>
      </motion.header>

      {/* Mobile dropdown */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.95, pointerEvents: "none" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-20 left-4 right-4 z-50 rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.10 0.015 265 / 0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid oklch(1 0 0 / 0.10)",
          boxShadow: "0 20px 60px oklch(0 0 0 / 0.5)",
        }}
      >
        <div className="p-4 space-y-1">
          {navLinks.map(([href, label], i) => (
            <motion.a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, x: -12 }}
              animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
            >
              {label}
            </motion.a>
          ))}
          <div className="pt-3 border-t border-white/8 flex gap-2">
            <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full border-white/10 text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1" onClick={() => setMobileOpen(false)}>
              <button
                className="w-full h-9 px-4 rounded-xl text-sm font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.22 265), oklch(0.62 0.22 300))",
                }}
              >
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
