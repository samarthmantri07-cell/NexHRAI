import { Router } from 'express';
import healthRoute from './health.route';
import authRoute from './auth.route';
import employeeRoute from './employee.route';
import analyticsRoute from './analytics.route';
import predictionRoute from './prediction.route';
import { authenticate } from '../middleware/authenticate.middleware';

const router = Router();

// Public routes
router.use('/health', healthRoute);
router.use('/auth', authRoute);

import settingsRoute from './settings.route';
import reportsRoute from './reports.route';

// Protected routes — require valid JWT
router.use('/employees', authenticate, employeeRoute);
router.use('/analytics', authenticate, analyticsRoute);
router.use('/predictions', authenticate, predictionRoute);
router.use('/settings', authenticate, settingsRoute);
router.use('/reports', authenticate, reportsRoute);

export default router;
