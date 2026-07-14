import api from './api';
import { PredictionResponse, PredictionDashboardStats } from '../types';

export const predictionService = {
  /**
   * Generates a new prediction for the given employee ID
   */
  generatePrediction: async (employeeId: string): Promise<PredictionResponse> => {
    const response = await api.post(`/predictions/${employeeId}`);
    return response.data.data;
  },

  /**
   * Retrieves the latest prediction for an employee
   */
  getLatestPrediction: async (employeeId: string): Promise<PredictionResponse> => {
    const response = await api.get(`/predictions/${employeeId}`);
    return response.data.data;
  },

  /**
   * Retrieves the prediction history for an employee
   */
  getPredictionHistory: async (employeeId: string): Promise<PredictionResponse[]> => {
    const response = await api.get(`/predictions/history/${employeeId}`);
    return response.data.data;
  },

  /**
   * Retrieves all high-risk employees
   */
  getHighRiskEmployees: async (): Promise<(PredictionResponse & { employee: any })[]> => {
    const response = await api.get(`/predictions/high-risk`);
    return response.data.data;
  },

  /**
   * Retrieves dashboard statistics
   */
  getDashboardStats: async (): Promise<PredictionDashboardStats> => {
    const response = await api.get(`/predictions/dashboard`);
    return response.data.data;
  }
};
