import { collectDefaultMetrics, Registry, Counter, Histogram } from 'prom-client';

const register = new Registry();
collectDefaultMetrics({ register });

export const httpRequestDuration = new Histogram({
   name: 'http_request_duration_seconds',
   help: 'Duration of HTTP requests in seconds',
   labelNames: ['method', 'route', 'status_code'],
   buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
   registers: [register],
});

export const benefitOperations = new Counter({
   name: 'benefit_operations_total',
   help: 'Number of benefit operations',
   labelNames: ['operation'],
   registers: [register],
});

export { register };
