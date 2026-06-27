import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export function useDashboard(vehicleId: string) {
  return useQuery({
    queryKey: ['dashboard', vehicleId],
    queryFn: () => dashboardService.get(vehicleId),
    enabled: !!vehicleId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMonthlyExpenses(vehicleId: string, year?: number) {
  return useQuery({
    queryKey: ['dashboard-monthly', vehicleId, year],
    queryFn: () => dashboardService.getMonthlyExpenses(vehicleId, year),
    enabled: !!vehicleId,
  });
}
