import { FuelType } from '../../vehicles/types/vehicle.types';

export interface Fueling {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  stationName?: string | null;
  city?: string | null;
  fuelType: FuelType;
  liters: string;
  pricePerLiter: string;
  totalCost: string;
  fullTank: boolean;
  partialTank: boolean;
  consumption?: string | null;
  autonomy?: string | null;
  costPerKm?: string | null;
  notes?: string | null;
  receiptUrl?: string | null;
  createdAt: string;
}

export interface FuelingStats {
  totalCost: string;
  totalLiters: string;
  count: number;
  avgConsumption: string;
  minConsumption: string;
  maxConsumption: string;
  avgPricePerLiter: string;
  total: number;
}

export interface FuelingMonthStat {
  month: number;
  totalCost: string;
  totalLiters: string;
  count: number;
}

export interface CreateFuelingPayload {
  date: string;
  odometer: number;
  stationName?: string;
  city?: string;
  fuelType: FuelType;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fullTank: boolean;
  partialTank: boolean;
  notes?: string;
}
