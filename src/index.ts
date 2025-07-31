import { startServer } from './app';

startServer().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
