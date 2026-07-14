"use client";

import { PageHeader } from "@/components/ui/custom/page-header";
import { KpiCard } from "@/components/ui/custom/kpi-card";
import { ChartContainer } from "@/components/ui/custom/chart-container";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Users, Globe, GraduationCap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useGenderDistribution } from "@/hooks/useAnalytics";
import { useHighRiskEmployees } from "@/hooks/usePredictions";

const educationLevel = [
  { level: "Bachelor's", count: 850 },
  { level: "Master's", count: 420 },
  { level: "PhD", count: 85 },
  { level: "Other", count: 115 },
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

export default function WorkforcePage() {
  const { data: genderDist, isLoading: genderLoading } = useGenderDistribution();
  const { data: highRiskEmployees, isLoading: highRiskLoading } = useHighRiskEmployees();

  if (genderLoading || highRiskLoading) return <LoadingSkeleton />;

  const genderData = genderDist?.map((g) => ({ group: g.gender, count: g.count })) || [];

  const roleRiskMap: Record<string, number> = {};
  if (highRiskEmployees) {
    highRiskEmployees.forEach((pred) => {
      const role = pred.employee.jobRole;
      roleRiskMap[role] = (roleRiskMap[role] || 0) + 1;
    });
  }
  const roleRiskData = Object.entries(roleRiskMap)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Workforce Demographics"
        description="Analyze diversity, education levels, and geographic distribution."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard delay={0.1} title="Total Headcount" value={1470} trend={2.3} icon={<Users className="w-4 h-4" />} iconColor="oklch(0.70 0.22 265)" />
        <KpiCard delay={0.2} title="Female Representation" value={46.2} format="percent" trend={1.5} icon={<TrendingUp className="w-4 h-4" />} iconColor="oklch(0.68 0.22 300)" />
        <KpiCard delay={0.3} title="Remote Workers" value={62} format="percent" trend={8.4} icon={<Globe className="w-4 h-4" />} iconColor="oklch(0.72 0.20 200)" />
        <KpiCard delay={0.4} title="Avg. Education Level" value={3.2} format="raw" icon={<GraduationCap className="w-4 h-4" />} iconColor="oklch(0.72 0.18 145)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer delay={0.5} title="Gender Diversity" subtitle="Distribution across workforce">
          <DonutChart data={genderData} nameKey="group" dataKey="count" colors={["oklch(0.68 0.22 300)", "oklch(0.70 0.22 265)", "oklch(0.72 0.18 145)"]} />
        </ChartContainer>
        <ChartContainer delay={0.6} title="Education Distribution" subtitle="Level breakdown">
          <BarChart data={educationLevel} xAxisKey="level" dataKeys={["count"]} colors={["oklch(0.68 0.22 300)"]} />
        </ChartContainer>
        <ChartContainer delay={0.7} title="High Risk by Role (AI)" subtitle="Top 5 at-risk roles">
          <DonutChart data={roleRiskData} nameKey="role" dataKey="count" colors={["oklch(0.68 0.22 25)", "oklch(0.76 0.18 75)", "oklch(0.72 0.18 145)", "oklch(0.70 0.22 265)", "oklch(0.68 0.22 300)"]} />
        </ChartContainer>
      </div>
    </div>
  );
}
