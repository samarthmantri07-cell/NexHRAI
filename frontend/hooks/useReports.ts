import { useMutation } from '@tanstack/react-query';
import { reportsService, ReportData } from '@/services/reports.service';

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: ({ type, format }: { type: string; format: string }) => 
      reportsService.generateReport(type, format)
  });
};
