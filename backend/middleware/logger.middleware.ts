import morgan from 'morgan';

// Setup morgan request logging format based on environment
export const requestLogger = morgan(
  process.env.NODE_ENV === 'development' ? 'dev' : 'combined'
);
