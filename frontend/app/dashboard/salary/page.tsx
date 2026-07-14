"use client";

import { PageHeader } from "@/components/ui/custom/page-header";
import { KpiCard } from "@/components/ui/custom/kpi-card";
import { ChartContainer } from "@/components/ui/custom/chart-container";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { DollarSign, Target, Percent, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { useOverviewAnalytics } from "@/hooks/useAnalytics";

const salaryBands = [
  { role: "Junior", median: 65000, market: 62000 },
  { role: "Mid-Level", median: 95000, market: 98000 },
  { role: "Senior", median: 135000, market: 140000 },
  { role: "Lead", median: 165000, market: 160000 },
  { role: "Principal", median: 210000, market: 205000 },
];

const salaryHikeHistory = [
  { year: "2020", avgHike: 3.2 },
  { year: "2021", avgHike: 4.1 },
  { year: "2022", avgHike: 6.5 },
  { year: "2023", avgHike: 5.2 },
  { year: "2024", avgHike: 4.8 },
];

export default function SalaryPage() {
  const { data: overview, isLoading, error } = useOverviewAnalytics();
  const avgSalary = overview?.averageSalary ?? 6503;
  const totalEmployees = overview?.totalEmployees ?? 1470;
  const totalPayroll = Math.round(avgSalary * totalEmployees);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compensation Analytics"
        description="Analyze pay equity, market alignment, and historical compensation data."
        badge="Live"
      />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl h-32 shimmer" style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.07)" }} />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard delay={0.1} title="Avg. Monthly Income" value={avgSalary} format="currency" trend={1.2} icon={<DollarSign className="w-4 h-4" />} iconColor="oklch(0.72 0.18 145)" />
          <KpiCard delay={0.2} title="Market Alignment" value={98} format="percent" trend={2.5} icon={<Target className="w-4 h-4" />} iconColor="oklch(0.70 0.22 265)" />
          <KpiCard delay={0.3} title="Avg. Salary Hike" value={4.8} format="percent" trend={-0.4} icon={<Percent className="w-4 h-4" />} iconColor="oklch(0.76 0.18 75)" />
          <KpiCard delay={0.4} title="Total Monthly Payroll" value={totalPayroll} format="currency" trend={3.1} icon={<Banknote className="w-4 h-4" />} iconColor="oklch(0.68 0.22 300)" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer delay={0.5} title="Median Salary vs Market Benchmark" subtitle="By role level">
          <BarChart data={salaryBands} xAxisKey="role" dataKeys={["median", "market"]} colors={["oklch(0.70 0.22 265)", "oklch(0.55 0.04 265)"]} />
        </ChartContainer>
        <ChartContainer delay={0.6} title="Average Salary Hike Trend" subtitle="5-year history">
          <LineChart data={salaryHikeHistory} xAxisKey="year" dataKeys={["avgHike"]} colors={["oklch(0.72 0.18 145)"]} />
        </ChartContainer>
      </div>
    </div>
  );
}
