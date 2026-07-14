import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';

// Extend Express Request to include the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware that reads the JWT from the `token` HTTP-only cookie,
 * verifies it, and attaches the decoded payload to `req.user`.
 * Returns 401 if no token or invalid token.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Support both cookie and Bearer header (for API clients)
    let token: string | undefined = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      sendError(res, 'You are not logged in. Please sign in to access this resource.', 401);
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Invalid or expired token. Please sign in again.', 401);
  }
};
