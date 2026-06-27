import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate?: string | null;
  photoUrl?: string | null;
  currentKm: number;
}

interface VehicleState {
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      selectedVehicle: null,
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
    }),
    { name: 'meucarro-vehicle' }
  )
);
