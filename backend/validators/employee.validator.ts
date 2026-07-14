import { z } from 'zod';

// ==========================================
// Base Employee Schema
// ==========================================
const employeeBaseSchema = z.object({
  employeeNumber: z.number({ required_error: 'Employee Number is required' }).int().positive(),
  age: z.number({ required_error: 'Age is required' }).int().positive(),
  gender: z.string({ required_error: 'Gender is required' }).min(1),
  maritalStatus: z.string({ required_error: 'Marital Status is required' }).min(1),
  over18: z.boolean().optional(),
  departmentId: z.string({ required_error: 'Department ID is required' }).uuid('Invalid Department ID format'),
  jobRole: z.string({ required_error: 'Job Role is required' }).min(1),
  jobLevel: z.number({ required_error: 'Job Level is required' }).int().positive(),
  businessTravel: z.string({ required_error: 'Business Travel is required' }).min(1),
  overTime: z.boolean({ required_error: 'Overtime is required' }),
  education: z.number({ required_error: 'Education is required' }).int().positive(),
  educationField: z.string({ required_error: 'Education Field is required' }).min(1),
  monthlyIncome: z.number({ required_error: 'Monthly Income is required' }).int().positive(),
  monthlyRate: z.number({ required_error: 'Monthly Rate is required' }).int().positive(),
  dailyRate: z.number({ required_error: 'Daily Rate is required' }).int().positive(),
  hourlyRate: z.number({ required_error: 'Hourly Rate is required' }).int().positive(),
  percentSalaryHike: z.number({ required_error: 'Percent Salary Hike is required' }).int().positive(),
  stockOptionLevel: z.number({ required_error: 'Stock Option Level is required' }).int().nonnegative(),
  performanceRating: z.number({ required_error: 'Performance Rating is required' }).int().positive(),
  jobSatisfaction: z.number({ required_error: 'Job Satisfaction is required' }).int().positive(),
  environmentSatisfaction: z.number({ required_error: 'Environment Satisfaction is required' }).int().positive(),
  relationshipSatisfaction: z.number({ required_error: 'Relationship Satisfaction is required' }).int().positive(),
  workLifeBalance: z.number({ required_error: 'Work Life Balance is required' }).int().positive(),
  jobInvolvement: z.number({ required_error: 'Job Involvement is required' }).int().positive(),
  totalWorkingYears: z.number({ required_error: 'Total Working Years is required' }).int().nonnegative(),
  numCompaniesWorked: z.number({ required_error: 'Number of Companies Worked is required' }).int().nonnegative(),
  yearsAtCompany: z.number({ required_error: 'Years at Company is required' }).int().nonnegative(),
  yearsInCurrentRole: z.number({ required_error: 'Years in Current Role is required' }).int().nonnegative(),
  yearsSinceLastPromotion: z.number({ required_error: 'Years since Last Promotion is required' }).int().nonnegative(),
  yearsWithCurrManager: z.number({ required_error: 'Years with Current Manager is required' }).int().nonnegative(),
  distanceFromHome: z.number({ required_error: 'Distance from Home is required' }).int().nonnegative(),
  employeeCount: z.number().int().positive().optional(),
  standardHours: z.number().int().positive().optional(),
  trainingTimesLastYear: z.number({ required_error: 'Training Times Last Year is required' }).int().nonnegative(),
  attrition: z.boolean().optional(),
});

// ==========================================
// API Schemas
// ==========================================

export const createEmployeeSchema = z.object({
  body: employeeBaseSchema,
});

export const updateEmployeeSchema = z.object({
  body: employeeBaseSchema.partial(),
});

export const getEmployeesQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    department: z.string().optional(),
    jobRole: z.string().optional(),
    gender: z.string().optional(),
    attrition: z.enum(['true', 'false']).optional(),
    jobLevel: z.string().optional(),
    maritalStatus: z.string().optional(),
    sortBy: z.enum(['name', 'salary', 'hireDate', 'department']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

// ==========================================
// Types
// ==========================================

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>['body'];
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>['body'];
export type GetEmployeesQuery = z.infer<typeof getEmployeesQuerySchema>['query'];
