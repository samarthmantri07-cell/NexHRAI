import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import catchAsync from '../utils/catchAsync';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { env } from '../config/env.config';

// ─── Cookie Helper ───────────────────────────────────────────────────────────

const COOKIE_NAME = 'token';

const attachCookie = (res: Response, token: string): void => {
  const expiresInDays = parseInt(env.JWT_COOKIE_EXPIRES_IN, 10);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,                                  // Not accessible via JS
    secure: env.NODE_ENV === 'production',           // HTTPS only in production
    sameSite: 'lax',
    maxAge: expiresInDays * 24 * 60 * 60 * 1000,    // ms
    path: '/',
  });
};

const clearCookie = (res: Response): void => {
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/register
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const { token, user } = await authService.registerUser(req.body);
  attachCookie(res, token);
  sendSuccess(res, { user }, 'Account created successfully.', 201);
});

/**
 * POST /api/v1/auth/login
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { token, user } = await authService.loginUser(req.body);
  attachCookie(res, token);
  sendSuccess(res, { user }, 'Logged in successfully.');
});

/**
 * POST /api/v1/auth/logout
 */
export const logout = catchAsync(async (_req: Request, res: Response) => {
  clearCookie(res);
  sendSuccess(res, null, 'Logged out successfully.');
});

/**
 * GET /api/v1/auth/me
 * Requires authenticate middleware.
 */
export const me = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    sendError(res, 'Not authenticated.', 401);
    return;
  }
  const user = await authService.getMe(req.user.userId);
  sendSuccess(res, { user });
});
