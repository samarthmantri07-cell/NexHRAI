import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictionService } from '../services/prediction.service';
import { PredictionResponse, PredictionDashboardStats } from '../types';

export const usePrediction = (employeeId: string) => {
  return useQuery<PredictionResponse, Error>({
    queryKey: ['prediction', employeeId],
    queryFn: () => predictionService.getLatestPrediction(employeeId),
    enabled: !!employeeId,
    retry: 1, // Only retry once, if it fails it might be 404 (not predicted yet)
  });
};

export const useGeneratePrediction = () => {
  const queryClient = useQueryClient();

  return useMutation<PredictionResponse, Error, string>({
    mutationFn: (employeeId: string) => predictionService.generatePrediction(employeeId),
    onSuccess: (data, employeeId) => {
      // Invalidate and refetch specific queries
      queryClient.invalidateQueries({ queryKey: ['prediction', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['predictionHistory', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['highRiskEmployees'] });
      queryClient.invalidateQueries({ queryKey: ['predictionDashboardStats'] });
    },
  });
};

export const usePredictionHistory = (employeeId: string) => {
  return useQuery<PredictionResponse[], Error>({
    queryKey: ['predictionHistory', employeeId],
    queryFn: () => predictionService.getPredictionHistory(employeeId),
    enabled: !!employeeId,
  });
};

export const useHighRiskEmployees = () => {
  return useQuery<(PredictionResponse & { employee: any })[], Error>({
    queryKey: ['highRiskEmployees'],
    queryFn: () => predictionService.getHighRiskEmployees(),
  });
};

export const usePredictionDashboard = () => {
  return useQuery<PredictionDashboardStats, Error>({
    queryKey: ['predictionDashboardStats'],
    queryFn: () => predictionService.getDashboardStats(),
  });
};
