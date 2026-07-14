"use client";

import { Sidebar } from "@/components/navigation/sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div
      className="flex h-screen"
      style={{ background: "oklch(0.08 0.015 265)" }}
    >
      {/* Sidebar — fixed position, 240px wide on lg+ */}
      <Sidebar />

      {/* Main content area — offset by sidebar width */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        {/* Mobile header */}
        <header
          className="h-14 flex items-center px-4 justify-between lg:hidden z-30 relative shrink-0"
          style={{
            background: "oklch(0.09 0.015 265 / 0.90)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid oklch(1 0 0 / 0.07)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                boxShadow: "0 0 16px oklch(0.70 0.22 265 / 0.4)",
              }}
            >
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span
              className="font-bold text-base text-white"
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
          </div>
          <MobileNav />
        </header>

        {/* Animated page content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 md:p-8 min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
