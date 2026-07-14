"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/config/nav";
import { LogOut, User, ChevronRight, Zap } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-y-0 left-0 z-40 hidden lg:flex flex-col"
      style={{
        background: "oklch(0.09 0.015 265)",
        borderRight: "1px solid oklch(1 0 0 / 0.07)",
        boxShadow: "4px 0 24px oklch(0 0 0 / 0.3)",
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.70 0.22 265 / 0.04) 0%, transparent 40%)",
        }}
      />

      <div className="flex flex-col h-full overflow-hidden relative z-10">
        {/* Logo + Toggle */}
        <div className="h-16 flex items-center px-4 gap-3 shrink-0">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
              boxShadow: "0 0 20px oklch(0.70 0.22 265 / 0.4)",
            }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <span
                  className="font-bold text-base text-white tracking-tight whitespace-nowrap"
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
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                  Workforce Intelligence
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "ml-auto p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-200",
              collapsed && "mx-auto ml-0"
            )}
          >
            <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </button>
        </div>

        {/* Separator */}
        <div
          className="mx-3 h-px shrink-0"
          style={{ background: "oklch(1 0 0 / 0.07)" }}
        />

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link key={link.href} href={link.href} className="block">
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 3, transition: { duration: 0.15 } }}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-white"
                  )}
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.70 0.22 265 / 0.15), oklch(0.68 0.22 300 / 0.08))",
                          border: "1px solid oklch(0.70 0.22 265 / 0.2)",
                        }
                      : {
                          border: "1px solid transparent",
                        }
                  }
                >
                  {/* Active left bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                      style={{
                        background:
                          "linear-gradient(180deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                        boxShadow: "0 0 8px oklch(0.70 0.22 265 / 0.6)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-lg shrink-0 transition-all duration-200",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-white"
                    )}
                    style={
                      isActive
                        ? {
                            color: "oklch(0.70 0.22 265)",
                            filter: "drop-shadow(0 0 6px oklch(0.70 0.22 265 / 0.6))",
                          }
                        : {}
                    }
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div
          className="mx-3 h-px shrink-0"
          style={{ background: "oklch(1 0 0 / 0.07)" }}
        />

        {/* User info + logout */}
        <div className="p-3 space-y-2 shrink-0">
          {user && !collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{
                background: "oklch(1 0 0 / 0.04)",
                border: "1px solid oklch(1 0 0 / 0.07)",
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-xs font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                }}
              >
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {user.role?.toLowerCase()}
                </p>
              </div>
            </motion.div>
          )}

          {user && collapsed && (
            <div className="flex items-center justify-center">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                }}
              >
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            </div>
          )}

          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/8 transition-all duration-200",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Sign out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
