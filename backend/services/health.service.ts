import prisma from '../config/database';

export const checkHealth = async () => {
  try {
    // Perform a lightweight database query to verify connection
    await prisma.$queryRaw`SELECT 1`;
    return {
      server: 'healthy',
      database: 'connected',
    };
  } catch (error) {
    console.error('Health Check DB Error:', error);
    return {
      server: 'healthy',
      database: 'disconnected',
    };
  }
};
