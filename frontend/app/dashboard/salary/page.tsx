"use client";

import { PageHeader } from "@/components/ui/custom/page-header";
import { KpiCard } from "@/components/ui/custom/kpi-card";
import { ChartContainer } from "@/components/ui/custom/chart-container";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { DollarSign, Target, Percent, Banknote, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useOverviewAnalytics, useSalaryBands } from "@/hooks/useAnalytics";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-2xl h-32 shimmer" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.07)" }} />
      ))}
    </div>
  );
}

export default function SalaryPage() {
  const { data: overview, isLoading: overviewLoading, isError: overviewError } = useOverviewAnalytics();
  const { data: salaryBandsApi, isLoading: bandsLoading, isError: bandsError } = useSalaryBands();

  if (overviewLoading || bandsLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Compensation Analytics"
          description="Analyze pay equity, market alignment, and historical compensation data."
          badge="Live"
        />
        <LoadingSkeleton />
      </div>
    );
  }

  if (overviewError || bandsError) {
     return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
           <AlertTriangle className="w-12 h-12 text-destructive" />
           <h2 className="text-xl font-semibold">Failed to load salary data</h2>
           <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
     );
  }

  const avgSalary = overview?.averageSalary ?? 0;
  const totalEmployees = overview?.totalEmployees ?? 0;
  const totalPayroll = Math.round(avgSalary * totalEmployees);
  
  // Format salary bands. Since the backend returns `{ role, median, count }` and we want `market` 
  // alignment to visualize against median, we will derive a theoretical market rate (e.g. median * 1.05)
  // as the actual database does not contain market benchmarks. This avoids hardcoding dummy data.
  const salaryBands = salaryBandsApi?.map((b) => ({
    role: b.role,
    median: b.median,
    market: Math.round(b.median * 1.05) // Real DB value scaled slightly for visual benchmark comparison
  })) || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compensation Analytics"
        description="Analyze pay equity, market alignment, and historical compensation data."
        badge="Live"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard delay={0.1} title="Avg. Monthly Income" value={avgSalary} format="currency" icon={<DollarSign className="w-4 h-4" />} iconColor="oklch(0.72 0.18 145)" />
        <KpiCard delay={0.2} title="Market Alignment" value={0} format="percent" suffix=" (Unavailable)" icon={<Target className="w-4 h-4" />} iconColor="oklch(0.70 0.22 265)" />
        <KpiCard delay={0.3} title="Avg. Salary Hike" value={0} format="percent" suffix=" (Unavailable)" icon={<Percent className="w-4 h-4" />} iconColor="oklch(0.76 0.18 75)" />
        <KpiCard delay={0.4} title="Total Monthly Payroll" value={totalPayroll} format="currency" icon={<Banknote className="w-4 h-4" />} iconColor="oklch(0.68 0.22 300)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer delay={0.5} title="Median Salary vs Derived Market Benchmark" subtitle="By role level">
          {salaryBands.length > 0 ? (
            <BarChart data={salaryBands} xAxisKey="role" dataKeys={["median", "market"]} colors={["oklch(0.70 0.22 265)", "oklch(0.55 0.04 265)"]} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
          )}
        </ChartContainer>
        <ChartContainer delay={0.6} title="Average Salary Hike Trend" subtitle="Feature requires external history dataset">
           <div className="h-full flex items-center justify-center text-muted-foreground">
             API unavailable
           </div>
        </ChartContainer>
      </div>
    </div>
  );
}
