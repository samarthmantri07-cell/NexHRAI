"use client";

import { PageHeader } from '@/components/ui/custom/page-header';
import { KpiCard } from '@/components/ui/custom/kpi-card';
import { ChartContainer } from '@/components/ui/custom/chart-container';
import { AreaChart } from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { TrendingUp, AlertTriangle, Briefcase, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOverviewAnalytics, useAttritionBreakdown } from '@/hooks/useAnalytics';

const revenuePerEmployee = [
  { quarter: "Q1", value: 125000 }, { quarter: "Q2", value: 132000 }, 
  { quarter: "Q3", value: 128000 }, { quarter: "Q4", value: 141000 }
];

export default function ExecutivePage() {
  const { data: overview } = useOverviewAnalytics();
  const { data: attritionBreakdown } = useAttritionBreakdown();

  const attritionRiskByLevel = attritionBreakdown?.map(d => ({
    level: d.department,
    risk: d.attritionCount
  })) || [
    { level: "Entry", risk: 24 }, { level: "Mid", risk: 18 }, 
    { level: "Senior", risk: 12 }, { level: "Executive", risk: 5 }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
      <PageHeader title='Executive Summary' description='High-level strategic insights for leadership.' />
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <KpiCard delay={0.1} title="Revenue per Employee" value={141000} format="currency" trend={4.2} icon={<TrendingUp className="w-5 h-5"/>} />
        <KpiCard delay={0.2} title="Current Attrition Rate" value={overview?.attritionRate ?? 16.1} format="percent" trend={-0.4} icon={<AlertTriangle className="w-5 h-5"/>} />
        <KpiCard delay={0.3} title="Total Active Employees" value={overview?.totalEmployees ?? 1470} format="raw" icon={<Briefcase className="w-5 h-5"/>} />
        <KpiCard delay={0.4} title="Org Health Score" value={86} format="raw" suffix="/100" trend={1.5} icon={<Activity className="w-5 h-5"/>} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ChartContainer delay={0.5} title="Revenue per Employee Trend">
          <AreaChart data={revenuePerEmployee} xAxisKey="quarter" dataKeys={["value"]} colors={["#10b981"]} />
        </ChartContainer>
        <ChartContainer delay={0.6} title="Attrition Count by Department">
          <BarChart data={attritionRiskByLevel} xAxisKey="level" dataKeys={["risk"]} colors={["#f59e0b"]} />
        </ChartContainer>
      </div>
    </motion.div>
  );
}

