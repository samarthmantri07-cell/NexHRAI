"use client";

import { PageHeader } from '@/components/ui/custom/page-header';
import { KpiCard } from '@/components/ui/custom/kpi-card';
import { ChartContainer } from '@/components/ui/custom/chart-container';
import { BarChart } from '@/components/charts/bar-chart';
import { AreaChart } from '@/components/charts/area-chart';
import { Calendar, Thermometer, Clock, Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLeaveAnalytics } from '@/hooks/useAnalytics';

export default function LeavePage() {
  const { data, isLoading } = useLeaveAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data?.unavailable) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
        <PageHeader title='Leave & Absence Analytics' description='Track time-off trends and identify potential burnout patterns.' />
        <div className="flex items-center justify-center min-h-[40vh] border border-dashed border-white/10 rounded-xl bg-white/5">
          <div className="text-center p-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">DATA UNAVAILABLE</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{data.message}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const leaveByDept = data?.leaveByDept || [];
  const leaveTrend = data?.leaveTrend || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
      <PageHeader title='Leave & Absence Analytics' description='Track time-off trends and identify potential burnout patterns.' />
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <KpiCard delay={0.1} title="Total Leave Days YTD" value={data?.totalDays ?? 0} format="raw" icon={<Calendar className="w-5 h-5"/>} />
        <KpiCard delay={0.2} title="Avg. Sick Days" value={data?.avgSick ?? 0} format="raw" icon={<Thermometer className="w-5 h-5"/>} />
        <KpiCard delay={0.3} title="High Overtime Risk" value={data?.overtimeRisk ?? 0} format="raw" icon={<Clock className="w-5 h-5"/>} />
        <KpiCard delay={0.4} title="Untaken Vacation Days" value={data?.untaken ?? 0} format="raw" icon={<Umbrella className="w-5 h-5"/>} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <ChartContainer delay={0.5} title="Leave Type by Department">
          <BarChart data={leaveByDept} xAxisKey="dept" dataKeys={["sick", "vacation", "other"]} colors={["#ef4444", "#3b82f6", "#9ca3af"]} />
        </ChartContainer>
        <ChartContainer delay={0.6} title="Total Leave Days Trend">
          <AreaChart data={leaveTrend} xAxisKey="month" dataKeys={["days"]} colors={["#8b5cf6"]} />
        </ChartContainer>
      </div>
    </motion.div>
  );
}
