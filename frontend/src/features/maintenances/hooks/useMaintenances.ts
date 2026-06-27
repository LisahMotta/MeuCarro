import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenancesService } from '../services/maintenances.service';
import { CreateMaintenancePayload } from '../types/maintenance.types';
import { VEHICLES_KEY } from '../../vehicles/hooks/useVehicles';

export const maintenancesKey = (vehicleId: string) => ['maintenances', vehicleId] as const;
export const maintenancesStatsKey = (vehicleId: string) => ['maintenances-stats', vehicleId] as const;

export function useMaintenances(vehicleId: string) {
  return useQuery({
    queryKey: maintenancesKey(vehicleId),
    queryFn: () => maintenancesService.getAll(vehicleId),
    enabled: !!vehicleId,
  });
}

export function useMaintenanceStats(vehicleId: string) {
  return useQuery({
    queryKey: maintenancesStatsKey(vehicleId),
    queryFn: () => maintenancesService.getStats(vehicleId),
    enabled: !!vehicleId,
  });
}

export function useCreateMaintenance(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMaintenancePayload) => maintenancesService.create(vehicleId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: maintenancesKey(vehicleId) });
      qc.invalidateQueries({ queryKey: maintenancesStatsKey(vehicleId) });
      qc.invalidateQueries({ queryKey: VEHICLES_KEY });
    },
  });
}

export function useDeleteMaintenance(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => maintenancesService.delete(vehicleId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: maintenancesKey(vehicleId) });
      qc.invalidateQueries({ queryKey: maintenancesStatsKey(vehicleId) });
    },
  });
}
