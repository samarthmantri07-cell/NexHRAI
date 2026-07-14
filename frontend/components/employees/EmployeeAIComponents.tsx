"use client";

import React, { useState, useEffect } from "react";
import { usePrediction, useGeneratePrediction, usePredictionHistory } from "@/hooks/usePredictions";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertTriangle, TrendingUp, CheckCircle, ShieldAlert, History, X, Zap, Activity } from "lucide-react";
import { RiskGauge } from "@/components/ui/risk-gauge";
import { NeuralNetwork } from "@/components/ui/neural-network";
import { animate } from "framer-motion";

// ─── Utilities ───────────────────────────────────────────
const formatPercent = (val: number) => `${(val * 100).toFixed(1)}%`;
const formatImpact = (val: number) => (val > 0 ? `+${val.toFixed(3)}` : val.toFixed(3));

// ─── AI Prediction Sequence States ───────────────────────
type PredictStep =
  | "idle"
  | "scanning"
  | "neural"
  | "thinking"
  | "counting"
  | "revealing"
  | "done";

// ─── Animated SHAP Bar ────────────────────────────────────
function ShapBar({
  feature,
  impact,
  color,
  delay,
}: {
  feature: string;
  impact: number;
  color: string;
  delay: number;
}) {
  const maxImpact = 0.3;
  const pct = Math.min(Math.abs(impact) / maxImpact, 1) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground truncate pr-3 max-w-[65%]">{feature}</span>
        <span className="font-mono font-semibold shrink-0" style={{ color }}>
          {formatImpact(impact)}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "oklch(1 0 0 / 0.06)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─── Animated Probability Counter ────────────────────────
function ProbabilityCounter({
  target,
  onDone,
}: {
  target: number;
  onDone: () => void;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target * 100, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
      onComplete: onDone,
    });
    return () => controls.stop();
  }, [target]);

  return (
    <div className="text-center py-8">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
        Calculating Probability...
      </p>
      <div
        className="text-6xl font-black tabular-nums"
        style={{
          fontFamily: "Syne, system-ui",
          background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {value.toFixed(1)}
        <span className="text-4xl">%</span>
      </div>
    </div>
  );
}

// ─── Thinking Animation ───────────────────────────────────
function ThinkingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <NeuralNetwork isActive width={280} height={120} />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Analyzing patterns</span>
        <div className="flex gap-1">
          <span className="dot-1 inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="dot-2 inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="dot-3 inline-block w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

// ─── Predict Button (table cell) ──────────────────────────
export function EmployeePredictionCell({
  employeeId,
  employee,
}: {
  employeeId: string;
  employee: any;
}) {
  const { data: prediction, isLoading, error } = usePrediction(employeeId);
  const generateMutation = useGeneratePrediction();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [step, setStep] = useState<PredictStep>("idle");

  const handlePredict = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Start theatrical sequence
    setStep("scanning");
    generateMutation.mutate(employeeId, {
      onSuccess: () => {
        setTimeout(() => setStep("neural"), 800);
        setTimeout(() => setStep("thinking"), 2000);
        setTimeout(() => setStep("counting"), 3800);
      },
    });
  };

  if (isLoading) {
    return (
      <div
        className="h-7 w-28 rounded-full shimmer"
        style={{ background: "oklch(1 0 0 / 0.06)" }}
      />
    );
  }

  if (error || !prediction) {
    const isScanning = step === "scanning";
    const isNeural = step === "neural";
    const isThinking = step === "thinking";

    if (isScanning || isNeural || isThinking) {
      return (
        <motion.div
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl overflow-hidden text-xs font-semibold"
          style={{
            background: "oklch(0.70 0.22 265 / 0.10)",
            border: "1px solid oklch(0.70 0.22 265 / 0.25)",
            color: "oklch(0.70 0.22 265)",
            minWidth: 120,
          }}
          animate={{ boxShadow: ["0 0 0px oklch(0.70 0.22 265 / 0)", "0 0 20px oklch(0.70 0.22 265 / 0.3)", "0 0 0px oklch(0.70 0.22 265 / 0)"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {/* Scan beam */}
          {isScanning && (
            <div
              className="animate-scan-beam absolute inset-0 z-10"
              style={{ background: "linear-gradient(90deg, transparent, oklch(0.70 0.22 265 / 0.3), transparent)", width: "30%" }}
            />
          )}
          <Activity className="w-3 h-3 animate-pulse" />
          {isScanning ? "Scanning..." : isNeural ? "Processing..." : "Analyzing..."}
        </motion.div>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-1.5 h-7 px-3 rounded-xl text-xs font-semibold transition-all"
        style={{
          background: "oklch(0.70 0.22 265 / 0.10)",
          border: "1px solid oklch(0.70 0.22 265 / 0.25)",
          color: "oklch(0.70 0.22 265)",
        }}
        onClick={handlePredict}
        disabled={generateMutation.isPending}
      >
        <Brain className="w-3 h-3" />
        Predict Risk
      </motion.button>
    );
  }

  const riskColors = {
    High: "oklch(0.68 0.22 25)",
    Medium: "oklch(0.76 0.18 75)",
    Low: "oklch(0.72 0.18 145)",
  };
  const color = riskColors[prediction.riskLevel as keyof typeof riskColors] || riskColors.Low;

  return (
    <>
      <motion.div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setIsSheetOpen(true)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
          style={{
            color,
            background: `color-mix(in oklch, ${color} 12%, transparent)`,
            borderColor: `color-mix(in oklch, ${color} 25%, transparent)`,
          }}
        >
          {prediction.riskLevel === "High" && <AlertTriangle className="w-3 h-3" />}
          {prediction.riskLevel === "Medium" && <TrendingUp className="w-3 h-3" />}
          {prediction.riskLevel === "Low" && <CheckCircle className="w-3 h-3" />}
          {prediction.riskLevel} Risk
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
          {formatPercent(prediction.probability)}
        </span>
      </motion.div>

      <EmployeeDetailsPanel
        employee={employee}
        prediction={prediction}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  );
}

// ─── Employee Details Panel ───────────────────────────────
export function EmployeeDetailsPanel({
  employee,
  prediction,
  isOpen,
  onClose,
}: {
  employee: any;
  prediction: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: history } = usePredictionHistory(employee.id);
  const [activeTab, setActiveTab] = useState<"overview" | "factors" | "recs" | "history">(
    "overview"
  );

  if (!prediction) return null;

  const riskColors = {
    High: "oklch(0.68 0.22 25)",
    Medium: "oklch(0.76 0.18 75)",
    Low: "oklch(0.72 0.18 145)",
  };
  const riskColor = riskColors[prediction.riskLevel as keyof typeof riskColors] || riskColors.Low;

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "factors", label: "Risk Factors" },
    { id: "recs", label: "Recommendations" },
    { id: "history", label: "History" },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: "oklch(0 0 0 / 0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-xl overflow-y-auto"
            style={{
              background: "oklch(0.09 0.015 265)",
              borderLeft: "1px solid oklch(1 0 0 / 0.10)",
              boxShadow: "-20px 0 80px oklch(0 0 0 / 0.5)",
            }}
          >
            {/* Panel top gradient */}
            <div
              className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, color-mix(in oklch, ${riskColor} 8%, transparent), transparent)`,
              }}
            />

            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in oklch, ${riskColor} 60%, oklch(0.70 0.22 265)), ${riskColor})`,
                    }}
                  >
                    {employee.firstName?.[0] || "#"}
                    {employee.lastName?.[0] || ""}
                  </div>
                  <div>
                    <h2
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: "Syne, system-ui" }}
                    >
                      {employee.firstName || `Employee #${employee.employeeNumber}`}{" "}
                      {employee.lastName || ""}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      #{employee.employeeNumber} · {employee.jobRole}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Risk gauge */}
              <div
                className="rounded-2xl p-6 mb-6 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, color-mix(in oklch, ${riskColor} 8%, oklch(1 0 0 / 0.03)), oklch(1 0 0 / 0.02))`,
                  border: `1px solid color-mix(in oklch, ${riskColor} 20%, transparent)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">AI Risk Assessment</p>
                    <p
                      className="text-2xl font-black"
                      style={{ fontFamily: "Syne, system-ui", color: riskColor }}
                    >
                      {prediction.riskLevel} Risk
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Confidence: {formatPercent(prediction.confidence)}
                    </p>
                  </div>
                  <RiskGauge
                    value={Math.round(prediction.probability * 100)}
                    riskLevel={prediction.riskLevel as "High" | "Medium" | "Low"}
                    size="sm"
                    showLabel={false}
                  />
                </div>
              </div>

              {/* Tabs */}
              <div
                className="flex rounded-xl p-1 mb-6"
                style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.07)" }}
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 relative"
                    style={{
                      color:
                        activeTab === tab.id
                          ? "white"
                          : "oklch(0.55 0.04 265)",
                    }}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: "oklch(1 0 0 / 0.08)",
                          border: "1px solid oklch(1 0 0 / 0.10)",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {[
                      { label: "Risk Level", value: prediction.riskLevel, color: riskColor },
                      { label: "Probability", value: formatPercent(prediction.probability), color: "white" },
                      { label: "Confidence", value: formatPercent(prediction.confidence), color: "white" },
                      { label: "Model", value: prediction.modelUsed, color: "oklch(0.55 0.04 265)" },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="rounded-xl p-4"
                        style={{
                          background: "oklch(1 0 0 / 0.04)",
                          border: "1px solid oklch(1 0 0 / 0.07)",
                        }}
                      >
                        <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
                        <p
                          className="text-base font-bold truncate"
                          style={{ color, fontFamily: "Syne, system-ui" }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "factors" && (
                  <motion.div
                    key="factors"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {prediction.riskFactors?.length > 0 && (
                      <div className="space-y-3">
                        <h3
                          className="text-sm font-semibold flex items-center gap-2"
                          style={{ color: "oklch(0.68 0.22 25)" }}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Top Risk Factors (SHAP)
                        </h3>
                        <div className="space-y-3">
                          {prediction.riskFactors.map((f: any, i: number) => (
                            <ShapBar
                              key={i}
                              feature={f.feature}
                              impact={f.impact}
                              color="oklch(0.68 0.22 25)"
                              delay={i * 0.08}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {prediction.retentionFactors?.length > 0 && (
                      <div className="space-y-3">
                        <h3
                          className="text-sm font-semibold flex items-center gap-2"
                          style={{ color: "oklch(0.72 0.18 145)" }}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Top Retention Factors (SHAP)
                        </h3>
                        <div className="space-y-3">
                          {prediction.retentionFactors.map((f: any, i: number) => (
                            <ShapBar
                              key={i}
                              feature={f.feature}
                              impact={f.impact}
                              color="oklch(0.72 0.18 145)"
                              delay={i * 0.08}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "recs" && (
                  <motion.div
                    key="recs"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4" style={{ color: "oklch(0.70 0.22 265)" }} />
                      <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
                    </div>
                    {prediction.recommendations?.map((rec: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="flex items-start gap-3 rounded-xl p-4"
                        style={{
                          background: "oklch(0.70 0.22 265 / 0.06)",
                          border: "1px solid oklch(0.70 0.22 265 / 0.15)",
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                          style={{
                            background: "oklch(0.70 0.22 265 / 0.2)",
                            color: "oklch(0.70 0.22 265)",
                          }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{rec}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "history" && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-white">Prediction History</h3>
                    </div>
                    {!history || history.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No previous predictions
                      </p>
                    ) : (
                      history.slice(0, 8).map((h: any, i: number) => {
                        const hColor =
                          h.riskLevel === "High"
                            ? "oklch(0.68 0.22 25)"
                            : h.riskLevel === "Medium"
                            ? "oklch(0.76 0.18 75)"
                            : "oklch(0.72 0.18 145)";
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center justify-between rounded-xl p-3"
                            style={{
                              background: "oklch(1 0 0 / 0.03)",
                              border: "1px solid oklch(1 0 0 / 0.06)",
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: hColor }}
                              />
                              <span className="text-xs text-muted-foreground">
                                {new Date(h.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono" style={{ color: hColor }}>
                                {formatPercent(h.probability)}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{
                                  color: hColor,
                                  background: `color-mix(in oklch, ${hColor} 12%, transparent)`,
                                }}
                              >
                                {h.riskLevel}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
