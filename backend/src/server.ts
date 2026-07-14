import app from './app';
import { env } from '../config/env.config';
import prisma from '../config/database';

const PORT = env.PORT;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
