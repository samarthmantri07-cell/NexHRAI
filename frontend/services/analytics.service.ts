import api from './api';

export interface OverviewAnalytics {
  totalEmployees: number;
  attritionRate: number;
  averageSalary: number;
  averageTenure: number;
}

export interface DepartmentBreakdown {
  department: string;
  count: number;
}

export interface GenderDistribution {
  gender: string;
  count: number;
}

export interface AttritionBreakdown {
  department: string;
  attritionCount: number;
}

export const analyticsService = {
  getOverview: async (): Promise<OverviewAnalytics> => {
    const response = await api.get('/analytics/overview');
    return response.data.data;
  },
  getDepartmentBreakdown: async (): Promise<DepartmentBreakdown[]> => {
    const response = await api.get('/analytics/department-breakdown');
    return response.data.data;
  },
  getGenderDistribution: async (): Promise<GenderDistribution[]> => {
    const response = await api.get('/analytics/gender-distribution');
    return response.data.data;
  },
  getAttritionBreakdown: async (): Promise<AttritionBreakdown[]> => {
    const response = await api.get('/analytics/attrition-breakdown');
    return response.data.data;
  }
};
