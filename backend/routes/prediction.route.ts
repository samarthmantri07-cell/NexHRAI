import { Router } from 'express';
import { PredictionController } from '../controllers/prediction.controller';
import { authenticate } from '../middleware/authenticate.middleware';

const router = Router();
const predictionController = new PredictionController();

// Use authentication middleware for all prediction routes
// (Assuming standard JWT auth middleware exists in the project)
router.use(authenticate);

// Endpoints
router.get('/dashboard', (req, res) => predictionController.getDashboardStats(req, res));
router.get('/high-risk', (req, res) => predictionController.getHighRiskEmployees(req, res));
router.get('/history/:employeeId', (req, res) => predictionController.getPredictionHistory(req, res));
router.get('/:employeeId', (req, res) => predictionController.getLatestPrediction(req, res));
router.post('/:employeeId', (req, res) => predictionController.generatePrediction(req, res));

export default router;
