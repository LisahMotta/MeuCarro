export type FuelType = 'gasoline' | 'ethanol' | 'flex' | 'diesel' | 'electric' | 'hybrid';

export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  version?: string | null;
  plate?: string | null;
  chassis?: string | null;
  renavam?: string | null;
  color?: string | null;
  currentKm: number;
  fuelType: FuelType;
  tankCapacity?: string | null;
  oilType?: string | null;
  oilQuantity?: string | null;
  tireSize?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehiclePayload {
  brand: string;
  model: string;
  year: number;
  version?: string;
  plate?: string;
  chassis?: string;
  renavam?: string;
  color?: string;
  currentKm: number;
  fuelType: FuelType;
  tankCapacity?: number;
  oilType?: string;
  oilQuantity?: number;
  tireSize?: string;
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;
