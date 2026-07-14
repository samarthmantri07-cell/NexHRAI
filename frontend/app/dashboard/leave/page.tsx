"use client";

import { PageHeader } from '@/components/ui/custom/page-header';
import { KpiCard } from '@/components/ui/custom/kpi-card';
import { ChartContainer } from '@/components/ui/custom/chart-container';
import { BarChart } from '@/components/charts/bar-chart';
import { AreaChart } from '@/components/charts/area-chart';
import { Calendar, Thermometer, Clock, Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';

const leaveByDept = [
  { dept: "Engineering", sick: 45, vacation: 120, other: 15 },
  { dept: "Sales", sick: 32, vacation: 85, other: 10 },
  { dept: "Marketing", sick: 28, vacation: 65, other: 8 },
  { dept: "Product", sick: 15, vacation: 45, other: 5 },
  { dept: "HR", sick: 12, vacation: 35, other: 4 }
];

const leaveTrend = [
  { month: "Jan", days: 320 }, { month: "Feb", days: 280 }, 
  { month: "Mar", days: 310 }, { month: "Apr", days: 290 }, 
  { month: "May", days: 340 }, { month: "Jun", days: 410 }
];

export default function LeavePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
      <PageHeader title='Leave & Absence Analytics' description='Track time-off trends and identify potential burnout patterns.' />
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <KpiCard delay={0.1} title="Total Leave Days YTD" value={1950} format="raw" trend={12.5} icon={<Calendar className="w-5 h-5"/>} />
        <KpiCard delay={0.2} title="Avg. Sick Days" value={4.2} format="raw" trend={-0.5} icon={<Thermometer className="w-5 h-5"/>} />
        <KpiCard delay={0.3} title="High Overtime Risk" value={86} format="raw" trend={5} icon={<Clock className="w-5 h-5"/>} />
        <KpiCard delay={0.4} title="Untaken Vacation Days" value={4200} format="raw" icon={<Umbrella className="w-5 h-5"/>} />
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
