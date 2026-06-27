export type MaintenanceCategory =
  | 'oil_change' | 'oil_filter' | 'air_filter' | 'fuel_filter'
  | 'brake_pads' | 'brake_disc' | 'brake_fluid' | 'suspension'
  | 'shock_absorber' | 'alignment' | 'balancing' | 'rotation'
  | 'tires' | 'clutch' | 'transmission' | 'steering' | 'battery'
  | 'timing_belt' | 'air_conditioning' | 'engine' | 'electrical'
  | 'body_repair' | 'washing' | 'general_revision' | 'other';

export type MaintenanceStatus = 'completed' | 'scheduled' | 'overdue';

export interface MaintenanceAttachment {
  id: string;
  maintenanceId: string;
  type: 'photo' | 'invoice' | 'other';
  url: string;
  filename?: string | null;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  category: MaintenanceCategory;
  shopName?: string | null;
  mechanicName?: string | null;
  laborCost: string;
  partsCost: string;
  totalCost: string;
  warrantyUntil?: string | null;
  nextServiceDate?: string | null;
  nextServiceKm?: number | null;
  notes?: string | null;
  status: MaintenanceStatus;
  attachments?: MaintenanceAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceStats {
  totalCost: string;
  totalLaborCost: string;
  totalPartsCost: string;
  count: number;
  byCategory: Array<{ category: MaintenanceCategory; totalCost: string; count: number }>;
}

export interface CreateMaintenancePayload {
  date: string;
  odometer: number;
  category: MaintenanceCategory;
  shopName?: string;
  mechanicName?: string;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  warrantyUntil?: string;
  nextServiceDate?: string;
  nextServiceKm?: number;
  notes?: string;
  status: MaintenanceStatus;
}
