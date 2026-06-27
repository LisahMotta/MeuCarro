import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vehicle } from '../features/vehicles/types/vehicle.types';

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
