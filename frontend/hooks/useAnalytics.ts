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
