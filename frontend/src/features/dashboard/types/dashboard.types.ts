import { Vehicle } from '../../vehicles/types/vehicle.types';

export interface DashboardStats {
  monthTotal: string;
  yearTotal: string;
  allTimeTotal: string;
  monthFueling: string;
  monthMaintenance: string;
  avgConsumption: string;
  costPerKm: string;
  currentKm: number;
}

export interface NextServices {
  oilChange: { nextServiceKm?: number | null; nextServiceDate?: string | null; odometer: number } | null;
  rotation: { nextServiceKm?: number | null; nextServiceDate?: string | null; odometer: number } | null;
  revision: { nextServiceKm?: number | null; nextServiceDate?: string | null; odometer: number } | null;
}

export interface DashboardData {
  vehicle: Vehicle;
  stats: DashboardStats;
  nextServices: NextServices;
  upcomingDocuments: Array<{
    id: string; title: string; type: string; expiryDate: string; daysUntilExpiry?: number | null;
  }>;
  recentAlerts: Array<{
    id: string; title: string; severity: string; type: string; createdAt: string;
  }>;
  lastFueling: { consumption?: string | null; odometer: number; date: string } | null;
}

export interface MonthlyExpense {
  month: number;
  fuel: number;
  maintenance: number;
  total: number;
}
