"use client";

import { PageHeader } from '@/components/ui/custom/page-header';
import { KpiCard } from '@/components/ui/custom/kpi-card';
import { ChartContainer } from '@/components/ui/custom/chart-container';
import { BarChart } from '@/components/charts/bar-chart';
import { UserPlus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRecruitmentAnalytics } from '@/hooks/useAnalytics';

export default function RecruitmentPage() {
  const { data, isLoading } = useRecruitmentAnalytics();

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
        <PageHeader title='Recruitment Pipeline' description='Monitor candidate flow, time-to-hire, and conversion rates.' />
        <div className="flex items-center justify-center min-h-[40vh] border border-dashed border-white/10 rounded-xl bg-white/5">
          <div className="text-center p-8">
            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">DATA UNAVAILABLE</h3>
            <p className="text-muted-foreground max-w-md mx-auto">{data.message}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const funnelData = data?.funnelData || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
      <PageHeader title='Recruitment Pipeline' description='Monitor candidate flow, time-to-hire, and conversion rates.' />
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <KpiCard delay={0.1} title="Active Applications" value={data?.activeApps ?? 0} format="raw" icon={<UserPlus className="w-5 h-5"/>} />
        <KpiCard delay={0.2} title="Time to Hire (Days)" value={data?.timeToHire ?? 0} format="raw" icon={<Clock className="w-5 h-5"/>} />
        <KpiCard delay={0.3} title="Offer Acceptance" value={data?.offerAccept ?? 0} format="percent" icon={<CheckCircle2 className="w-5 h-5"/>} />
        <KpiCard delay={0.4} title="Interview Drop-off" value={data?.dropOff ?? 0} format="percent" icon={<XCircle className="w-5 h-5"/>} />
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <ChartContainer delay={0.5} title="Recruitment Funnel Conversion">
          <BarChart data={funnelData} layout="vertical" xAxisKey="stage" dataKeys={["count"]} colors={["#3b82f6"]} />
        </ChartContainer>
      </div>
    </motion.div>
  );
}
