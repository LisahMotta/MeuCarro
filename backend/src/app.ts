import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { authRoutes } from './modules/auth/auth.routes';
import { vehiclesRoutes } from './modules/vehicles/vehicles.routes';
import { fuelingsRoutes } from './modules/fuelings/fuelings.routes';
import { maintenancesRoutes } from './modules/maintenances/maintenances.routes';
import { tiresRoutes } from './modules/tires/tires.routes';
import { documentsRoutes } from './modules/documents/documents.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { alertsRoutes } from './modules/alerts/alerts.routes';
import { reportsRoutes } from './modules/reports/reports.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/vehicles/:vehicleId/fuelings', fuelingsRoutes);
app.use('/api/vehicles/:vehicleId/maintenances', maintenancesRoutes);
app.use('/api/vehicles/:vehicleId/tires', tiresRoutes);
app.use('/api/vehicles/:vehicleId/documents', documentsRoutes);
app.use('/api/vehicles/:vehicleId/dashboard', dashboardRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/vehicles/:vehicleId/reports', reportsRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

app.use(errorHandler);

const frontendBuildPath = [
  path.resolve(process.cwd(), 'public'),
  path.resolve(__dirname, '../../public'),
  path.resolve(__dirname, '../public'),
].find((candidate) => fs.existsSync(path.join(candidate, 'index.html')));

if (frontendBuildPath) {
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    // Requests for static assets (paths with a file extension) that reached
    // this point don't exist in the build — return 404 instead of index.html,
    // otherwise browsers receive HTML when expecting images/scripts.
    if (path.extname(req.path)) {
      return res.status(404).end();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

export { app };
