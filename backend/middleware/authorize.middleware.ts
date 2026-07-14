import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

/**
 * Role-based authorization middleware factory.
 * Must be used AFTER the `authenticate` middleware.
 * @param roles - Allowed role names (e.g., 'Admin', 'HR Manager')
 */
export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    if (roles.length > 0 && !roles.includes(req.user.roleName)) {
      sendError(
        res,
        `Access denied. Required roles: ${roles.join(', ')}.`,
        403
      );
      return;
    }

    next();
  };
