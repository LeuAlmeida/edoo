import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration } from './config';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration / 1000); // Convert to seconds
  });

  next();
};
