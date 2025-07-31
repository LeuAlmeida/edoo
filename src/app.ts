import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import * as swaggerUi from 'swagger-ui-express';
import benefitRouter from './presentation/routes/benefitRoutes';
import { initializeDatabase } from './infrastructure/database/config';
import { swaggerSpec } from './infrastructure/swagger/config';

config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Edoo Node.js API Documentation'
};

// @ts-ignore - Ignoring type issues with swagger-ui-express
app.use('/api/v1/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

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
      console.log(`Swagger documentation available at http://localhost:${port}/api/v1/swagger`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

export default app;
