"use client";

import { PageHeader } from '@/components/ui/custom/page-header';
import { GlassCard } from '@/components/ui/custom/glass-card';
import { motion } from 'framer-motion';

import { useEmployees } from '@/hooks/useEmployees';
import { EmployeePredictionCell } from '@/components/employees/EmployeeAIComponents';

export default function EmployeePage() {
  const { data: employees, isLoading, error } = useEmployees(20, 0); // Limit to 20 for table view

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-destructive">
        <p>Failed to load employee records.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
      <PageHeader title='Employee Directory' description='Manage and view all employee records and individual risk profiles.' />
      
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-white/5 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Flight Risk (Actual)</th>
                <th className="px-6 py-4 font-medium">AI Risk Prediction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees?.map((emp: any) => (
                <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">Employee #{emp.employeeNumber}</div>
                    <div className="text-muted-foreground text-xs">{emp.id.split('-')[0]}...</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{emp.jobRole}</td>
                  <td className="px-6 py-4 text-muted-foreground">{emp.department?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      emp.attrition ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {emp.attrition ? 'High (Left)' : 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <EmployeePredictionCell employeeId={emp.id} employee={emp} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
