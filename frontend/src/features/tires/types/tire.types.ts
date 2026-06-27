export type TirePosition = 'FL' | 'FR' | 'RL' | 'RR' | 'spare';
export type TireStatus = 'active' | 'replaced' | 'spare';
export type TireEventType = 'rotation' | 'calibration' | 'repair' | 'replacement';

export interface Tire {
  id: string;
  vehicleId: string;
  brand?: string | null;
  model?: string | null;
  size?: string | null;
  dot?: string | null;
  purchasePrice?: string | null;
  purchaseDate?: string | null;
  installKm?: number | null;
  position?: TirePosition | null;
  estimatedLifeKm?: number | null;
  status: TireStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TireEvent {
  id: string;
  tireId?: string | null;
  vehicleId: string;
  date: string;
  odometer?: number | null;
  type: TireEventType;
  pressureFL?: string | null;
  pressureFR?: string | null;
  pressureRL?: string | null;
  pressureRR?: string | null;
  cost?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface CreateTirePayload {
  brand?: string;
  model?: string;
  size?: string;
  dot?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  installKm?: number;
  position?: TirePosition;
  estimatedLifeKm?: number;
  status?: TireStatus;
}

export interface CreateTireEventPayload {
  tireId?: string;
  date: string;
  odometer?: number;
  type: TireEventType;
  pressureFL?: number;
  pressureFR?: number;
  pressureRL?: number;
  pressureRR?: number;
  cost?: number;
  notes?: string;
}
