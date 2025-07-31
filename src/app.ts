import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import benefitRouter from './presentation/routes/benefitRoutes';
import { initializeDatabase } from './infrastructure/database/config';

config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/', benefitRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

export default app;
