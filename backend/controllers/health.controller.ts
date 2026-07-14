import { Request, Response } from 'express';
import { checkHealth } from '../services/health.service';
import catchAsync from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';

export const getHealth = catchAsync(async (_req: Request, res: Response) => {
  const healthData = await checkHealth();

  const statusCode = healthData.database === 'connected' ? 200 : 503;

  sendSuccess(res, healthData, undefined, statusCode);
});
