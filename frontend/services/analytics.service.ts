import api from './api';

export interface OverviewAnalytics {
  totalEmployees: number;
  attritionRate: number;
  averageSalary: number;
  averageTenure: number;
}

export interface DepartmentBreakdown {
  name: string;
  count: number;
}

export interface GenderDistribution {
  group: string;
  count: number;
}

export interface AttritionBreakdown {
  factor: string;
  count: number;
}

export interface WorkforceGrowth {
  year: string;
  count: number;
}

export interface EmployeeStats {
  totalEmployees: number;
  averageAge: number;
  averageExperience: number;
}

export interface EducationDistribution {
  level: string;
  count: number;
}

export interface AttritionTrend {
  month: string;
  rate: number;
}

export interface SalaryBand {
  role: string;
  median: number;
  count: number;
}

export interface LeaveAnalytics {
  unavailable?: boolean;
  message?: string;
  leaveByDept?: { dept: string; sick: number; vacation: number; other: number }[];
  leaveTrend?: { month: string; days: number }[];
  totalDays?: number;
  avgSick?: number;
  overtimeRisk?: number;
  untaken?: number;
}

export interface RecruitmentAnalytics {
  unavailable?: boolean;
  message?: string;
  funnelData?: { stage: string; count: number }[];
  activeApps?: number;
  timeToHire?: number;
  offerAccept?: number;
  dropOff?: number;
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
  },
  getWorkforceGrowth: async (): Promise<WorkforceGrowth[]> => {
    const response = await api.get('/analytics/workforce-growth');
    return response.data.data;
  },
  getEmployeeStats: async (): Promise<EmployeeStats> => {
    const response = await api.get('/analytics/employee/stats');
    return response.data.data;
  },
  getEducationDistribution: async (): Promise<EducationDistribution[]> => {
    const response = await api.get('/analytics/workforce/education');
    return response.data.data;
  },
  getAttritionTrends: async (): Promise<AttritionTrend[]> => {
    const response = await api.get('/analytics/attrition/trends');
    return response.data.data;
  },
  getSalaryBands: async (): Promise<SalaryBand[]> => {
    const response = await api.get('/analytics/salary/bands');
    return response.data.data;
  },
  getLeaveAnalytics: async (): Promise<LeaveAnalytics> => {
    const response = await api.get('/analytics/leave/analytics');
    return response.data.data;
  },
  getRecruitmentAnalytics: async (): Promise<RecruitmentAnalytics> => {
    const response = await api.get('/analytics/recruitment/analytics');
    return response.data.data;
  }
};
