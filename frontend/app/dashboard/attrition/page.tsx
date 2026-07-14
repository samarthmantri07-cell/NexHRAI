"use client";

import { PageHeader } from "@/components/ui/custom/page-header";
import { KpiCard } from "@/components/ui/custom/kpi-card";
import { ChartContainer } from "@/components/ui/custom/chart-container";
import { AreaChart } from "@/components/charts/area-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { AlertOctagon, BrainCircuit, Target, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useAttritionBreakdown } from "@/hooks/useAnalytics";
import { useHighRiskEmployees } from "@/hooks/usePredictions";
import { EmployeePredictionCell } from "@/components/employees/EmployeeAIComponents";

const attritionHistory = [
  { month: "Jan", rate: 18.2 },
  { month: "Feb", rate: 17.5 },
  { month: "Mar", rate: 17.8 },
  { month: "Apr", rate: 16.9 },
  { month: "May", rate: 16.5 },
  { month: "Jun", rate: 16.1 },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl h-32 shimmer" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.07)" }} />
        ))}
      </div>
    </div>
  );
}

export default function AttritionPage() {
  const { data: attritionBreakdown, isLoading: breakdownLoading } = useAttritionBreakdown();
  const { data: highRiskEmployees, isLoading: highRiskLoading } = useHighRiskEmployees();

  if (breakdownLoading) return <LoadingSkeleton />;

  const breakdownData =
    attritionBreakdown?.map((d) => ({ factor: d.department, count: d.attritionCount })) || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Attrition Intelligence"
        description="AI-driven flight risk predictions and retention insights."
        badge="AI Active"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard delay={0.1} title="Current Attrition Rate" value={16.1} format="percent" trend={-0.4} icon={<AlertOctagon className="w-4 h-4" />} iconColor="oklch(0.68 0.22 25)" />
        <KpiCard delay={0.2} title="Predicted Attrition (Q3)" value={15.5} format="percent" trend={-0.6} icon={<BrainCircuit className="w-4 h-4" />} iconColor="oklch(0.70 0.22 265)" />
        <KpiCard delay={0.3} title="High-Risk Employees" value={highRiskEmployees?.length || 0} format="raw" icon={<ShieldAlert className="w-4 h-4" />} iconColor="oklch(0.76 0.18 75)" />
        <KpiCard delay={0.4} title="Intervention Success Rate" value={68} format="percent" trend={5.2} icon={<Target className="w-4 h-4" />} iconColor="oklch(0.72 0.18 145)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer delay={0.5} title="Attrition Rate Trend" subtitle="6-month historical">
          <AreaChart data={attritionHistory} xAxisKey="month" dataKeys={["rate"]} colors={["oklch(0.68 0.22 25)"]} />
        </ChartContainer>
        <ChartContainer delay={0.6} title="Attrition by Department" subtitle="Count by department">
          <BarChart data={breakdownData} layout="vertical" xAxisKey="factor" dataKeys={["count"]} colors={["oklch(0.76 0.18 75)"]} />
        </ChartContainer>
      </div>

      {/* High risk table */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(180deg, oklch(0.68 0.22 25), oklch(0.76 0.18 75))" }} />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Top High Flight Risk Employees
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(1 0 0 / 0.03)",
            border: "1px solid oklch(1 0 0 / 0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Table top gradient border */}
          <div
            className="h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.68 0.22 25 / 0.4), transparent)" }}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "oklch(1 0 0 / 0.03)", borderBottom: "1px solid oklch(1 0 0 / 0.07)" }}>
                  {["Employee", "Role", "Department", "AI Risk Prediction"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highRiskLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 rounded shimmer" style={{ background: "oklch(1 0 0 / 0.05)", width: j === 0 ? "120px" : "80px" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  highRiskEmployees?.slice(0, 10).map((pred, i) => (
                    <motion.tr
                      key={pred.employeeId}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="group transition-colors"
                      style={{ borderBottom: "1px solid oklch(1 0 0 / 0.05)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "oklch(1 0 0 / 0.03)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: "linear-gradient(135deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))" }}
                          >
                            {pred.employee.employeeNumber?.toString().slice(-2)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">
                              Employee #{pred.employee.employeeNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {pred.employeeId.split("-")[0]}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{pred.employee.jobRole}</td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {pred.employee.department?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <EmployeePredictionCell employeeId={pred.employeeId} employee={pred.employee} />
                      </td>
                    </motion.tr>
                  ))
                )}
                {!highRiskLoading && (!highRiskEmployees || highRiskEmployees.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      No high risk employees detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
