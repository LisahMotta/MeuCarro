import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelingsService } from '../services/fuelings.service';
import { CreateFuelingPayload } from '../types/fueling.types';
import { VEHICLES_KEY } from '../../vehicles/hooks/useVehicles';

export const fuelingsKey = (vehicleId: string) => ['fuelings', vehicleId] as const;
export const fuelingsStatsKey = (vehicleId: string) => ['fuelings-stats', vehicleId] as const;

export function useFuelings(vehicleId: string) {
  return useQuery({
    queryKey: fuelingsKey(vehicleId),
    queryFn: () => fuelingsService.getAll(vehicleId),
    enabled: !!vehicleId,
  });
}

export function useFuelingStats(vehicleId: string) {
  return useQuery({
    queryKey: fuelingsStatsKey(vehicleId),
    queryFn: () => fuelingsService.getStats(vehicleId),
    enabled: !!vehicleId,
  });
}

export function useFuelingMonthlyStats(vehicleId: string, year?: number) {
  return useQuery({
    queryKey: ['fuelings-monthly', vehicleId, year],
    queryFn: () => fuelingsService.getMonthlyStats(vehicleId, year),
    enabled: !!vehicleId,
  });
}

export function useCreateFueling(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFuelingPayload) => fuelingsService.create(vehicleId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fuelingsKey(vehicleId) });
      qc.invalidateQueries({ queryKey: fuelingsStatsKey(vehicleId) });
      qc.invalidateQueries({ queryKey: VEHICLES_KEY });
    },
  });
}

export function useDeleteFueling(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fuelingsService.delete(vehicleId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fuelingsKey(vehicleId) });
      qc.invalidateQueries({ queryKey: fuelingsStatsKey(vehicleId) });
    },
  });
}
