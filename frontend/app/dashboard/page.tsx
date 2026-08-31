"use client";

import { PageHeader } from "@/components/ui/custom/page-header";
import { KpiCard } from "@/components/ui/custom/kpi-card";
import { ChartContainer } from "@/components/ui/custom/chart-container";
import { LineChart } from "@/components/charts/line-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { Users, UserMinus, DollarSign, Clock, Brain, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useOverviewAnalytics, useDepartmentBreakdown, useWorkforceGrowth } from "@/hooks/useAnalytics";
import { usePredictionDashboard } from "@/hooks/usePredictions";

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl h-32 shimmer"
            style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.07)" }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-2xl h-80 shimmer"
          style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.07)" }}
        />
        <div
          className="rounded-2xl h-80 shimmer"
          style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.07)" }}
        />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { data: overview, isLoading: overviewLoading, isError: overviewError } = useOverviewAnalytics();
  const { data: deptBreakdown, isLoading: deptLoading, isError: deptError } = useDepartmentBreakdown();
  const { data: workforceGrowth, isLoading: growthLoading, isError: growthError } = useWorkforceGrowth();
  const { data: aiStats } = usePredictionDashboard();

  if (overviewLoading || deptLoading || growthLoading) return <LoadingSkeleton />;

  // Display minimal generic error state if something fundamentally failed to load
  if (overviewError || deptError || growthError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load analytics</h2>
        <p className="text-muted-foreground">Please check your connection and try again.</p>
      </div>
    );
  }

  const deptData = deptBreakdown?.map((d) => ({ name: d.name, count: d.count })) || [];
  const headcountData = workforceGrowth?.map((g) => ({ year: g.year, count: g.count })) || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Executive Overview"
        description="Real-time organizational health and AI-driven workforce intelligence."
        badge="Live"
      />

      {/* Workforce KPIs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1 h-4 rounded-full"
            style={{ background: "linear-gradient(180deg, oklch(0.70 0.22 265), oklch(0.68 0.22 300))" }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Workforce Health
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard 
            delay={0.1} title="Total Employees" value={overview?.totalEmployees || 0} 
            icon={<Users className="w-4 h-4" />} 
            iconColor="oklch(0.70 0.22 265)" 
        />
          <KpiCard 
            delay={0.2} title="Attrition Rate" value={overview?.attritionRate || 0} 
            format="percent" icon={<UserMinus className="w-4 h-4" />} 
            iconColor="oklch(0.68 0.22 25)" 
        />
          <KpiCard 
            delay={0.3} title="Avg. Monthly Income" value={overview?.averageSalary || 0} 
            format="currency" icon={<DollarSign className="w-4 h-4" />} 
            iconColor="oklch(0.72 0.18 145)" 
        />
          <KpiCard 
            delay={0.4} title="Avg. Tenure (Years)" value={overview?.averageTenure || 0} 
            format="raw" icon={<Clock className="w-4 h-4" />} 
            iconColor="oklch(0.76 0.18 75)" 
        />
        </div>
      </div>

      {/* AI Predictive Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1 h-4 rounded-full"
            style={{ background: "linear-gradient(180deg, oklch(0.68 0.22 300), oklch(0.72 0.20 200))" }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            AI Predictive Insights
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            delay={0.5} title="Total AI Predictions" value={aiStats?.total || 0}
            format="raw" icon={<Brain className="w-4 h-4" />}
            iconColor="oklch(0.68 0.22 300)"
          />
          <KpiCard
            delay={0.6} title="High Flight Risk" value={aiStats?.high || 0}
            format="raw" icon={<AlertTriangle className="w-4 h-4" />}
            iconColor="oklch(0.68 0.22 25)"
          />
          <KpiCard
            delay={0.7} title="Medium Flight Risk" value={aiStats?.medium || 0}
            format="raw" icon={<TrendingUp className="w-4 h-4" />}
            iconColor="oklch(0.76 0.18 75)"
          />
          <KpiCard
            delay={0.8} title="Low Flight Risk" value={aiStats?.low || 0}
            format="raw" icon={<Shield className="w-4 h-4" />}
            iconColor="oklch(0.72 0.18 145)"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            delay={0.5}
            title="Headcount Trend"
            subtitle="Historical headcount growth"
          >
            {headcountData.length > 0 ? (
              <LineChart data={headcountData} xAxisKey="year" dataKeys={["count"]} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </ChartContainer>
        </div>
        <div className="lg:col-span-1">
          <ChartContainer
            delay={0.6}
            title="Department Distribution"
            subtitle="By headcount"
          >
             {deptData.length > 0 ? (
                <DonutChart data={deptData} nameKey="name" dataKey="count" />
             ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
             )}
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
