import { Response } from 'express';

interface ApiResponseData {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: unknown;
  meta?: Record<string, unknown>;
}

/**
 * Sends a standardized JSON API response.
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  payload: ApiResponseData
): void => {
  res.status(statusCode).json({
    status: payload.status,
    ...(payload.message && { message: payload.message }),
    ...(payload.data !== undefined && { data: payload.data }),
    ...(payload.meta && { meta: payload.meta }),
  });
};

export const sendSuccess = (
  res: Response,
  data: unknown,
  message?: string,
  statusCode = 200,
  meta?: Record<string, unknown>
): void => {
  sendResponse(res, statusCode, { status: 'success', message, data, meta });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500
): void => {
  sendResponse(res, statusCode, { status: 'error', message });
};
