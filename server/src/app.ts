import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';
import { pointsRouter } from './modules/points/points.routes';
import { reportsRouter } from './modules/reports/reports.routes';
import { schedulingRouter } from './modules/scheduling/scheduling.routes';
import { reportingRouter } from './modules/reporting/reporting.routes';
import { mapRouter } from './modules/map/map.routes';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRouter); // M1
  app.use('/api/users', usersRouter); // M1
  app.use('/api/points', pointsRouter); // M2
  app.use('/api/reports', reportsRouter); // M3 + OPT-01
  app.use('/api/scheduling', schedulingRouter); // M4 + OPT-04
  app.use('/api/reporting', reportingRouter); // M5 + OPT-03
  app.use('/api/map', mapRouter); // OPT-02

  return app;
}
