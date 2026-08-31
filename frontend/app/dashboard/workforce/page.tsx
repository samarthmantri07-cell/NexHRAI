"use client";

import { PageHeader } from "@/components/ui/custom/page-header";
import { KpiCard } from "@/components/ui/custom/kpi-card";
import { ChartContainer } from "@/components/ui/custom/chart-container";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Users, Globe, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useGenderDistribution, useEmployeeStats, useEducationDistribution } from "@/hooks/useAnalytics";
import { useHighRiskEmployees } from "@/hooks/usePredictions";

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
  const { data: genderDist, isLoading: genderLoading, isError: genderError } = useGenderDistribution();
  const { data: highRiskEmployees, isLoading: highRiskLoading, isError: highRiskError } = useHighRiskEmployees();
  const { data: employeeStats, isLoading: statsLoading, isError: statsError } = useEmployeeStats();
  const { data: educationDataAPI, isLoading: eduLoading, isError: eduError } = useEducationDistribution();

  if (genderLoading || highRiskLoading || statsLoading || eduLoading) return <LoadingSkeleton />;

  if (genderError || highRiskError || statsError || eduError) {
     return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
           <AlertTriangle className="w-12 h-12 text-destructive" />
           <h2 className="text-xl font-semibold">Failed to load workforce data</h2>
           <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
     );
  }

  const genderData = genderDist?.map((g) => ({ group: g.group, count: g.count })) || [];
  const educationLevel = educationDataAPI?.map((e) => ({ level: e.level, count: e.count })) || [];

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
    
  // Using generic "remote worker" metric based on logic if absent from real DB
  // Because 'remote' isn't explicitly in the standard IBM dataset, we leave a placeholder or map it.
  // We'll calculate a proxy or use average Experience for now since the prompt said no mock data.
  // Let's replace "Remote Workers" with "Avg Experience" since we fetch averageExperience from employeeStats.
  const totalEmployees = employeeStats?.totalEmployees || 0;
  const avgAge = employeeStats?.averageAge || 0;
  const avgExp = employeeStats?.averageExperience || 0;
  
  // For female representation, let's dynamically calculate from genderData
  const femaleCount = genderData.find(g => g.group.toLowerCase() === 'female')?.count || 0;
  const femaleRep = totalEmployees > 0 ? (femaleCount / totalEmployees) * 100 : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Workforce Demographics"
        description="Analyze diversity, education levels, and geographic distribution."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard delay={0.1} title="Total Headcount" value={totalEmployees} icon={<Users className="w-4 h-4" />} iconColor="oklch(0.70 0.22 265)" />
        <KpiCard delay={0.2} title="Female Representation" value={femaleRep} format="percent" icon={<TrendingUp className="w-4 h-4" />} iconColor="oklch(0.68 0.22 300)" />
        <KpiCard delay={0.3} title="Avg. Experience (Yrs)" value={avgExp} format="raw" icon={<Globe className="w-4 h-4" />} iconColor="oklch(0.72 0.20 200)" />
        <KpiCard delay={0.4} title="Avg. Age" value={avgAge} format="raw" icon={<GraduationCap className="w-4 h-4" />} iconColor="oklch(0.72 0.18 145)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer delay={0.5} title="Gender Diversity" subtitle="Distribution across workforce">
           {genderData.length > 0 ? (
              <DonutChart data={genderData} nameKey="group" dataKey="count" colors={["oklch(0.68 0.22 300)", "oklch(0.70 0.22 265)", "oklch(0.72 0.18 145)"]} />
           ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
           )}
        </ChartContainer>
        <ChartContainer delay={0.6} title="Education Distribution" subtitle="Level breakdown">
           {educationLevel.length > 0 ? (
              <BarChart data={educationLevel} xAxisKey="level" dataKeys={["count"]} colors={["oklch(0.68 0.22 300)"]} />
           ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
           )}
        </ChartContainer>
        <ChartContainer delay={0.7} title="High Risk by Role (AI)" subtitle="Top 5 at-risk roles">
           {roleRiskData.length > 0 ? (
              <DonutChart data={roleRiskData} nameKey="role" dataKey="count" colors={["oklch(0.68 0.22 25)", "oklch(0.76 0.18 75)", "oklch(0.72 0.18 145)", "oklch(0.70 0.22 265)", "oklch(0.68 0.22 300)"]} />
           ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
           )}
        </ChartContainer>
      </div>
    </div>
  );
}
