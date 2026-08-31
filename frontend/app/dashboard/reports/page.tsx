"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/ui/custom/page-header';
import { GlassCard } from '@/components/ui/custom/glass-card';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenerateReport } from '@/hooks/useReports';

export default function ReportsPage() {
  const { mutateAsync: generateReport, isPending } = useGenerateReport();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (type: string, format: string) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const blob = await generateReport({ type, format });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NexHR_${type.replace(/\s+/g, '_')}_Report.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccessMessage(`${type} ${format} successfully downloaded.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError("Failed to generate report.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6 max-w-4xl'>
      <PageHeader title='Automated Reports' description='Generate and export workforce analytics and attrition insights.' />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        <GlassCard delay={0.1} className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <h3 className="text-xl font-semibold text-white">Workforce Summary Report</h3>
              <p className="text-muted-foreground">Comprehensive overview of current workforce distribution and metrics.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => handleGenerate('Workforce Summary', 'PDF')} disabled={isPending} className="bg-primary hover:bg-primary/90 text-white">
              {isPending ? 'Generating...' : 'Generate PDF'}
            </Button>
            <Button onClick={() => handleGenerate('Workforce Summary', 'CSV')} disabled={isPending} variant="secondary">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Generate CSV
            </Button>
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <h3 className="text-xl font-semibold text-white">Attrition Risk Report</h3>
              <p className="text-muted-foreground">Detailed breakdown of high-risk employees and recommended retention strategies.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => handleGenerate('Attrition Risk', 'PDF')} disabled={isPending} className="bg-primary hover:bg-primary/90 text-white">
              {isPending ? 'Generating...' : 'Generate PDF'}
            </Button>
            <Button onClick={() => handleGenerate('Attrition Risk', 'CSV')} disabled={isPending} variant="secondary">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Generate CSV
            </Button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
