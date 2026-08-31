import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';

export const useOverviewAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsService.getOverview,
  });
};

export const useDepartmentBreakdown = () => {
  return useQuery({
    queryKey: ['analytics', 'department-breakdown'],
    queryFn: analyticsService.getDepartmentBreakdown,
  });
};

export const useGenderDistribution = () => {
  return useQuery({
    queryKey: ['analytics', 'gender-distribution'],
    queryFn: analyticsService.getGenderDistribution,
  });
};

export const useAttritionBreakdown = () => {
  return useQuery({
    queryKey: ['analytics', 'attrition-breakdown'],
    queryFn: analyticsService.getAttritionBreakdown,
  });
};

export const useWorkforceGrowth = () => {
  return useQuery({
    queryKey: ['analytics', 'workforce-growth'],
    queryFn: analyticsService.getWorkforceGrowth,
  });
};

export const useEmployeeStats = () => {
  return useQuery({
    queryKey: ['analytics', 'employee-stats'],
    queryFn: analyticsService.getEmployeeStats,
  });
};

export const useEducationDistribution = () => {
  return useQuery({
    queryKey: ['analytics', 'education-distribution'],
    queryFn: analyticsService.getEducationDistribution,
  });
};

export const useAttritionTrends = () => {
  return useQuery({
    queryKey: ['analytics', 'attrition-trends'],
    queryFn: analyticsService.getAttritionTrends,
  });
};

export const useSalaryBands = () => {
  return useQuery({
    queryKey: ['analytics', 'salary-bands'],
    queryFn: analyticsService.getSalaryBands,
  });
};

export const useLeaveAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'leave'],
    queryFn: analyticsService.getLeaveAnalytics,
  });
};

export const useRecruitmentAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'recruitment'],
    queryFn: analyticsService.getRecruitmentAnalytics,
  });
};
