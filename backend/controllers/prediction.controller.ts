import { Request, Response } from 'express';
import { PredictionService } from '../services/prediction.service';

const predictionService = new PredictionService();

export class PredictionController {
  
  async generatePrediction(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const prediction = await predictionService.generatePrediction(employeeId);
      return res.status(200).json({ success: true, data: prediction });
    } catch (error: any) {
      console.error('generatePrediction Error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async getLatestPrediction(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const prediction = await predictionService.getLatestPrediction(employeeId);
      if (!prediction) {
        return res.status(404).json({ success: false, message: 'Prediction not found for this employee' });
      }
      return res.status(200).json({ success: true, data: prediction });
    } catch (error: any) {
      console.error('getLatestPrediction Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getPredictionHistory(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const history = await predictionService.getPredictionHistory(employeeId);
      return res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      console.error('getPredictionHistory Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getHighRiskEmployees(_req: Request, res: Response) {
    try {
      const employees = await predictionService.getHighRiskEmployees();
      return res.status(200).json({ success: true, data: employees });
    } catch (error: any) {
      console.error('getHighRiskEmployees Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  async getDashboardStats(_req: Request, res: Response) {
    try {
      const stats = await predictionService.getDashboardStats();
      return res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      console.error('getDashboardStats Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}
