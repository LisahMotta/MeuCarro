import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tiresService } from '../services/tires.service';
import { CreateTirePayload, CreateTireEventPayload } from '../types/tire.types';

export const tiresKey = (vehicleId: string) => ['tires', vehicleId] as const;
export const tireEventsKey = (vehicleId: string) => ['tire-events', vehicleId] as const;

export function useTires(vehicleId: string) {
  return useQuery({ queryKey: tiresKey(vehicleId), queryFn: () => tiresService.getAll(vehicleId), enabled: !!vehicleId });
}

export function useTireEvents(vehicleId: string) {
  return useQuery({ queryKey: tireEventsKey(vehicleId), queryFn: () => tiresService.getEvents(vehicleId), enabled: !!vehicleId });
}

export function useCreateTire(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateTirePayload) => tiresService.create(vehicleId, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: tiresKey(vehicleId) }),
  });
}

export function useDeleteTire(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tiresService.delete(vehicleId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tiresKey(vehicleId) }),
  });
}

export function useCreateTireEvent(vehicleId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateTireEventPayload) => tiresService.createEvent(vehicleId, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: tireEventsKey(vehicleId) }),
  });
}
