import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
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

app.use(errorHandler);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });
}

export { app };
