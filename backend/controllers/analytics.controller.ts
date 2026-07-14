import { Request, Response } from 'express';
import * as analyticsService from '../services/analytics.service';
import catchAsync from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';

// ==========================================
// 1. EXECUTIVE DASHBOARD
// ==========================================
export const getOverview = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getOverview();
  sendSuccess(res, data);
});

export const getDepartmentPerformance = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getDepartmentPerformance();
  sendSuccess(res, data);
});

export const getEmployeeDistribution = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getEmployeeDistribution();
  sendSuccess(res, data);
});

export const getWorkforceGrowth = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getWorkforceGrowth();
  sendSuccess(res, data);
});

// ==========================================
// 2. SALARY DASHBOARD
// ==========================================
export const getSalaryOverview = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getSalaryOverview();
  sendSuccess(res, data);
});

export const getSalaryBands = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getSalaryBands();
  sendSuccess(res, data);
});

export const getSalaryByDepartment = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getSalaryByDepartment();
  sendSuccess(res, data);
});

export const getSalaryByRole = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getSalaryByRole();
  sendSuccess(res, data);
});

// ==========================================
// 3. WORKFORCE DASHBOARD
// ==========================================
export const getGenderDistribution = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getGenderDistribution();
  sendSuccess(res, data);
});

export const getEducationDistribution = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getEducationDistribution();
  sendSuccess(res, data);
});

export const getAgeGroups = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getAgeGroups();
  sendSuccess(res, data);
});

export const getJobLevels = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getJobLevels();
  sendSuccess(res, data);
});

export const getMaritalStatus = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getMaritalStatus();
  sendSuccess(res, data);
});

// ==========================================
// 4. ATTRITION DASHBOARD
// ==========================================
export const getAttritionByDepartment = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getAttritionByDepartment();
  sendSuccess(res, data);
});

export const getAttritionByRole = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getAttritionByRole();
  sendSuccess(res, data);
});

export const getAttritionByOvertime = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getAttritionByOvertime();
  sendSuccess(res, data);
});

export const getAttritionByEducation = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getAttritionByEducation();
  sendSuccess(res, data);
});

export const getAttritionByAge = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getAttritionByAge();
  sendSuccess(res, data);
});

export const getAttritionTrends = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getAttritionTrends();
  sendSuccess(res, data);
});

// ==========================================
// 5. EMPLOYEE DASHBOARD
// ==========================================
export const getEmployeeStats = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getEmployeeStats();
  sendSuccess(res, data);
});

export const getRecentEmployees = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getRecentEmployees();
  sendSuccess(res, data);
});

export const getExperienceDistribution = catchAsync(async (_req: Request, res: Response) => {
  const data = await analyticsService.getExperienceDistribution();
  sendSuccess(res, data);
});
