import express from 'express';
import * as reportsController from '../controllers/reports.controller';

const router = express.Router();

router.post('/generate', reportsController.generateReport);

export default router;
