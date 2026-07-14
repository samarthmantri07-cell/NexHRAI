import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from '../config/env.config';
import { requestLogger } from '../middleware/logger.middleware';
import { errorHandler } from '../middleware/error.middleware';
import routes from '../routes';

const app: Application = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration — credentials must be true for cookie auth
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser (required for HTTP-only JWT cookies)
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Mount routes
app.use(env.API_PREFIX, routes);

// Handle unknown routes
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  (err as any).statusCode = 404;
  next(err);
});

// Global error handling middleware
app.use(errorHandler);

export default app;
