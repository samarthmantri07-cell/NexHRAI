"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Loader2, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { NeuralNetwork } from "@/components/ui/neural-network";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn: isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        axiosErr?.response?.data?.message || axiosErr?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.08 0.015 265)" }}
    >
      {/* LEFT PANEL — AI visualization */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] p-12 relative overflow-hidden">
        {/* Aurora */}
        <div
          className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[100px] opacity-15 animate-float-slow"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.22 265), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[80px] opacity-10 animate-float"
          style={{ background: "radial-gradient(circle, oklch(0.68 0.22 300), transparent 70%)", animationDelay: "-3s" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
              boxShadow: "0 0 20px oklch(0.70 0.22 265 / 0.4)",
            }}
          >
            <Zap className="w-4.5 h-4.5 text-white" />
          </div>
          <span
            className="font-bold text-xl text-white"
            style={{ fontFamily: "Syne, system-ui" }}
          >
            NexHR
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              -AI
            </span>
          </span>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div
            className="w-full rounded-3xl p-8"
            style={{
              background: "oklch(1 0 0 / 0.03)",
              border: "1px solid oklch(1 0 0 / 0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4 text-center">
              Neural Network — Live
            </p>
            <NeuralNetwork isActive width={320} height={160} className="mx-auto" />
            <div className="flex justify-between mt-3 px-2">
              {["Input Layer", "Hidden 1", "Hidden 2", "Output"].map((l, i) => (
                <span key={i} className="text-[10px] text-muted-foreground">{l}</span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { value: "92%", label: "Accuracy" },
              { value: "1,470", label: "Monitored" },
              { value: "6mo", label: "Early Signal" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: "oklch(1 0 0 / 0.03)",
                  border: "1px solid oklch(1 0 0 / 0.07)",
                }}
              >
                <div
                  className="text-xl font-black"
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
                <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-xs text-muted-foreground">
            © 2025 NexHR-AI Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 relative">
        {/* Subtle right glow */}
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.68 0.22 300), transparent)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl"
              style={{ background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))" }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white" style={{ fontFamily: "Syne, system-ui" }}>
              NexHR-AI
            </span>
          </div>

          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "Syne, system-ui" }}
            >
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your workforce intelligence workspace
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "oklch(0.68 0.22 25 / 0.10)",
                  border: "1px solid oklch(0.68 0.22 25 / 0.25)",
                  color: "oklch(0.68 0.22 25)",
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium text-muted-foreground">
                Email address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 outline-none transition-all duration-200"
                  style={{
                    background: "oklch(1 0 0 / 0.05)",
                    border: `1px solid ${focusedField === "email" ? "oklch(0.70 0.22 265 / 0.5)" : "oklch(1 0 0 / 0.10)"}`,
                    boxShadow: focusedField === "email" ? "0 0 0 3px oklch(0.70 0.22 265 / 0.08)" : "none",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-muted-foreground/50 outline-none transition-all duration-200"
                  style={{
                    background: "oklch(1 0 0 / 0.05)",
                    border: `1px solid ${focusedField === "password" ? "oklch(0.70 0.22 265 / 0.5)" : "oklch(1 0 0 / 0.10)"}`,
                    boxShadow: focusedField === "password" ? "0 0 0 3px oklch(0.70 0.22 265 / 0.08)" : "none",
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 mt-2 relative overflow-hidden"
              style={{
                background: isLoading
                  ? "oklch(0.65 0.22 265 / 0.7)"
                  : "linear-gradient(135deg, oklch(0.65 0.22 265), oklch(0.60 0.22 300))",
                boxShadow: isLoading ? "none" : "0 0 30px oklch(0.70 0.22 265 / 0.3)",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium transition-colors"
              style={{ color: "oklch(0.75 0.15 265)" }}
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

