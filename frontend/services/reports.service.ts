import api from './api';

export interface ReportData {
  title: string;
  generatedAt: string;
  format: string;
  summary: string;
  downloadUrl: string;
}

export const reportsService = {
  generateReport: async (type: string, format: string): Promise<Blob> => {
    const response = await api.post('/reports/generate', { type, format }, {
      responseType: 'blob'
    });
    return response.data;
  }
};
