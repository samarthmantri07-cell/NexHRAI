import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.config';

export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName: string;
}

/**
 * Signs a JWT token with the given payload.
 */
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws if invalid or expired.
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
