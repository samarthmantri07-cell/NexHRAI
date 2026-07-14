import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

// ==========================================
// 1. EXECUTIVE DASHBOARD
// ==========================================
router.get('/overview', analyticsController.getOverview);
router.get('/department-performance', analyticsController.getDepartmentPerformance);
router.get('/employee-distribution', analyticsController.getEmployeeDistribution);
router.get('/workforce-growth', analyticsController.getWorkforceGrowth);
// Legacy compatibility
router.get('/department-breakdown', analyticsController.getEmployeeDistribution); 

// ==========================================
// 2. SALARY DASHBOARD
// ==========================================
router.get('/salary/overview', analyticsController.getSalaryOverview);
router.get('/salary/bands', analyticsController.getSalaryBands);
router.get('/salary/department', analyticsController.getSalaryByDepartment);
router.get('/salary/role', analyticsController.getSalaryByRole);

// ==========================================
// 3. WORKFORCE DASHBOARD
// ==========================================
router.get('/workforce/gender', analyticsController.getGenderDistribution);
router.get('/workforce/education', analyticsController.getEducationDistribution);
router.get('/workforce/age', analyticsController.getAgeGroups);
router.get('/workforce/level', analyticsController.getJobLevels);
router.get('/workforce/marital', analyticsController.getMaritalStatus);
// Legacy compatibility
router.get('/gender-distribution', analyticsController.getGenderDistribution);

// ==========================================
// 4. ATTRITION DASHBOARD
// ==========================================
router.get('/attrition/department', analyticsController.getAttritionByDepartment);
router.get('/attrition/role', analyticsController.getAttritionByRole);
router.get('/attrition/overtime', analyticsController.getAttritionByOvertime);
router.get('/attrition/education', analyticsController.getAttritionByEducation);
router.get('/attrition/age', analyticsController.getAttritionByAge);
router.get('/attrition/trends', analyticsController.getAttritionTrends);
// Legacy compatibility
router.get('/attrition-breakdown', analyticsController.getAttritionByDepartment);

// ==========================================
// 5. EMPLOYEE DASHBOARD
// ==========================================
router.get('/employee/stats', analyticsController.getEmployeeStats);
router.get('/employee/recent', analyticsController.getRecentEmployees);
router.get('/employee/experience', analyticsController.getExperienceDistribution);

export default router;
