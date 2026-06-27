import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService } from '../services/vehicles.service';
import { CreateVehiclePayload, UpdateVehiclePayload } from '../types/vehicle.types';
import { useVehicleStore } from '../../../store/vehicleStore';

export const VEHICLES_KEY = ['vehicles'] as const;

export function useVehicles() {
  const setSelectedVehicle = useVehicleStore((s) => s.setSelectedVehicle);

  return useQuery({
    queryKey: VEHICLES_KEY,
    queryFn: async () => {
      const vehicles = await vehiclesService.getAll();
      if (vehicles.length > 0) {
        const store = useVehicleStore.getState();
        if (!store.selectedVehicle) {
          setSelectedVehicle(vehicles[0]);
        }
      }
      return vehicles;
    },
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: [...VEHICLES_KEY, id],
    queryFn: () => vehiclesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  const setSelectedVehicle = useVehicleStore((s) => s.setSelectedVehicle);
  return useMutation({
    mutationFn: (payload: CreateVehiclePayload) => vehiclesService.create(payload),
    onSuccess: (vehicle) => {
      qc.invalidateQueries({ queryKey: VEHICLES_KEY });
      setSelectedVehicle(vehicle);
    },
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVehiclePayload }) =>
      vehiclesService.update(id, payload),
    onSuccess: (vehicle) => {
      qc.invalidateQueries({ queryKey: VEHICLES_KEY });
      const store = useVehicleStore.getState();
      if (store.selectedVehicle?.id === vehicle.id) {
        store.setSelectedVehicle(vehicle);
      }
    },
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  const setSelectedVehicle = useVehicleStore((s) => s.setSelectedVehicle);
  return useMutation({
    mutationFn: (id: string) => vehiclesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VEHICLES_KEY });
      setSelectedVehicle(null);
    },
  });
}

export function useUploadVehiclePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      vehiclesService.uploadPhoto(id, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VEHICLES_KEY });
    },
  });
}
