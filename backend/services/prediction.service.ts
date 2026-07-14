import { PrismaClient, Employee, Department } from '@prisma/client';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const prisma = new PrismaClient();

// Configure axios with retries for the ML service
const mlClient = axios.create({
  baseURL: process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000',
  timeout: 10000, // 10s timeout
});

axiosRetry(mlClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 503;
  },
});

export class PredictionService {
  /**
   * Generates a new prediction for the given employee ID and saves it to DB.
   */
  async generatePrediction(employeeId: string) {
    // 1. Fetch employee
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { department: true }
    });

    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }

    // 2. Map to ML Schema
    const mlInput = this.mapEmployeeToMLSchema(employee);

    try {
      // 3. Call ML API
      const response = await mlClient.post('/api/predict', mlInput);
      const mlData = response.data;

      // 4. Save to Database
      const savedPrediction = await this.savePrediction(employeeId, mlData);
      
      return savedPrediction;
    } catch (error: any) {
      console.error('ML Service Error:', error.message);
      throw new Error('Failed to generate prediction from ML service');
    }
  }

  /**
   * Retrieves the latest prediction for an employee.
   */
  async getLatestPrediction(employeeId: string) {
    return prisma.prediction.findUnique({
      where: { employeeId }
    });
  }

  /**
   * Retrieves the prediction history for an employee.
   */
  async getPredictionHistory(employeeId: string) {
    return prisma.predictionHistory.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Retrieves all high-risk employees.
   */
  async getHighRiskEmployees() {
    return prisma.prediction.findMany({
      where: { riskLevel: 'High' },
      include: { employee: true },
      orderBy: { probability: 'desc' }
    });
  }

  /**
   * Retrieves dashboard statistics.
   */
  async getDashboardStats() {
    const predictions = await prisma.prediction.findMany({
      select: { riskLevel: true }
    });

    const stats = {
      total: predictions.length,
      high: 0,
      medium: 0,
      low: 0
    };

    predictions.forEach(p => {
      if (p.riskLevel === 'High') stats.high++;
      else if (p.riskLevel === 'Medium') stats.medium++;
      else stats.low++;
    });

    return stats;
  }

  // Helper Methods

  private async savePrediction(employeeId: string, mlData: any) {
    const data = {
      employeeId,
      prediction: mlData.prediction,
      probability: mlData.probability,
      confidence: mlData.confidence,
      riskLevel: mlData.riskLevel,
      riskFactors: mlData.riskFactors || [],
      retentionFactors: mlData.retentionFactors || [],
      recommendations: mlData.recommendations || [],
      modelUsed: mlData.model
    };

    // Save history
    await prisma.predictionHistory.create({ data });

    // Upsert latest
    return prisma.prediction.upsert({
      where: { employeeId },
      create: data,
      update: {
        prediction: mlData.prediction,
        probability: mlData.probability,
        confidence: mlData.confidence,
        riskLevel: mlData.riskLevel,
        riskFactors: mlData.riskFactors || [],
        retentionFactors: mlData.retentionFactors || [],
        recommendations: mlData.recommendations || [],
        modelUsed: mlData.model
      }
    });
  }

  private mapEmployeeToMLSchema(employee: Employee & { department: Department }) {
    return {
      Age: employee.age,
      BusinessTravel: employee.businessTravel,
      DailyRate: employee.dailyRate,
      Department: employee.department.name,
      DistanceFromHome: employee.distanceFromHome,
      Education: employee.education,
      EducationField: employee.educationField,
      EnvironmentSatisfaction: employee.environmentSatisfaction,
      Gender: employee.gender,
      HourlyRate: employee.hourlyRate,
      JobInvolvement: employee.jobInvolvement,
      JobLevel: employee.jobLevel,
      JobRole: employee.jobRole,
      JobSatisfaction: employee.jobSatisfaction,
      MaritalStatus: employee.maritalStatus,
      MonthlyIncome: employee.monthlyIncome,
      MonthlyRate: employee.monthlyRate,
      NumCompaniesWorked: employee.numCompaniesWorked,
      OverTime: employee.overTime ? "Yes" : "No",
      PercentSalaryHike: employee.percentSalaryHike,
      PerformanceRating: employee.performanceRating,
      RelationshipSatisfaction: employee.relationshipSatisfaction,
      StockOptionLevel: employee.stockOptionLevel,
      TotalWorkingYears: employee.totalWorkingYears,
      TrainingTimesLastYear: employee.trainingTimesLastYear,
      WorkLifeBalance: employee.workLifeBalance,
      YearsAtCompany: employee.yearsAtCompany,
      YearsInCurrentRole: employee.yearsInCurrentRole,
      YearsSinceLastPromotion: employee.yearsSinceLastPromotion,
      YearsWithCurrManager: employee.yearsWithCurrManager
    };
  }
}
