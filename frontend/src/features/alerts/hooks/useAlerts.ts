import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsService } from '../services/alerts.service';

export const alertsKey = ['alerts'] as const;

export function useAlerts() {
  return useQuery({ queryKey: alertsKey, queryFn: () => alertsService.getAll() });
}

export function useMarkAlertRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: alertsKey }),
  });
}

export function useMarkAllAlertsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => alertsService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: alertsKey }),
  });
}

export function useDismissAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsService.dismiss(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: alertsKey }),
  });
}

export function useGenerateAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => alertsService.generate(),
    onSuccess: () => qc.invalidateQueries({ queryKey: alertsKey }),
  });
}
