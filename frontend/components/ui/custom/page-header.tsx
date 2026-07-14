"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  badge?: string;
}

export function PageHeader({ title, description, className, actions, badge }: PageHeaderProps) {
  // Split title to highlight last word with gradient
  const words = title.split(" ");
  const mainWords = words.slice(0, -1).join(" ");
  const lastWord = words[words.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8", className)}
    >
      <div className="space-y-1.5">
        {badge && (
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {badge}
            </span>
          </motion.div>
        )}
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "Syne, system-ui" }}
        >
          {words.length > 1 ? (
            <>
              <span className="text-foreground">{mainWords} </span>
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {lastWord}
              </span>
            </>
          ) : (
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </span>
          )}
        </h1>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-sm text-muted-foreground max-w-xl"
          >
            {description}
          </motion.p>
        )}
      </div>

      {actions && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-2 shrink-0"
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  );
}
