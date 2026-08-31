import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';

const prisma = new PrismaClient();

export const getSettings = catchAsync(async (_req: Request, res: Response) => {
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = await prisma.settings.create({ data: {} });
  }
  sendSuccess(res, settings);
});

export const updateSettings = catchAsync(async (req: Request, res: Response) => {
  let settings = await prisma.settings.findFirst();
  
  const allowedData = {
    workspaceName: req.body.workspaceName,
    emailAlertsEnabled: req.body.emailAlertsEnabled,
    weeklyDigestEnabled: req.body.weeklyDigestEnabled
  };
  
  if (!settings) {
    settings = await prisma.settings.create({ data: allowedData });
  } else {
    settings = await prisma.settings.update({
      where: { id: settings.id },
      data: allowedData
    });
  }
  
  sendSuccess(res, settings);
});
