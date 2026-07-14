"use client";

import { PageHeader } from '@/components/ui/custom/page-header';
import { KpiCard } from '@/components/ui/custom/kpi-card';
import { ChartContainer } from '@/components/ui/custom/chart-container';
import { BarChart } from '@/components/charts/bar-chart';
import { UserPlus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const funnelData = [
  { stage: "Applied", count: 1250 },
  { stage: "Screened", count: 450 },
  { stage: "Interviewed", count: 180 },
  { stage: "Offered", count: 45 },
  { stage: "Hired", count: 32 }
];

export default function RecruitmentPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
      <PageHeader title='Recruitment Pipeline' description='Monitor candidate flow, time-to-hire, and conversion rates.' />
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <KpiCard delay={0.1} title="Active Applications" value={1250} format="raw" trend={15} icon={<UserPlus className="w-5 h-5"/>} />
        <KpiCard delay={0.2} title="Time to Hire (Days)" value={42} format="raw" trend={-3} icon={<Clock className="w-5 h-5"/>} />
        <KpiCard delay={0.3} title="Offer Acceptance" value={71.1} format="percent" trend={4.2} icon={<CheckCircle2 className="w-5 h-5"/>} />
        <KpiCard delay={0.4} title="Interview Drop-off" value={22} format="percent" trend={-1.5} icon={<XCircle className="w-5 h-5"/>} />
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <ChartContainer delay={0.5} title="Recruitment Funnel Conversion">
          <BarChart data={funnelData} layout="vertical" xAxisKey="stage" dataKeys={["count"]} colors={["#3b82f6"]} />
        </ChartContainer>
      </div>
    </motion.div>
  );
}
