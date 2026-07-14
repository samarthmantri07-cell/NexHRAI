"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
  tilt?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  delay = 0,
  hover = true,
  glow = false,
  glowColor = "oklch(0.70 0.22 265 / 0.2)",
  tilt = false,
  onClick,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={hover ? { y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } } : {}}
      onMouseMove={tilt ? handleMouseMove : undefined}
      onMouseLeave={tilt ? handleMouseLeave : undefined}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl overflow-hidden transition-shadow duration-300",
        "glass-card",
        glow && "hover:shadow-[0_0_40px_oklch(0.70_0.22_265_/_0.2)]",
        className
      )}
    >
      {/* Inner highlight (top edge) */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.12), transparent)",
        }}
      />

      {/* Shimmer sweep on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.04) 50%, transparent 60%)",
        }}
      />

      {children}
    </motion.div>
  );
}
