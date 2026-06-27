import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';

export function useExpenseReport(vehicleId: string, year?: number) {
  return useQuery({
    queryKey: ['reports-expenses', vehicleId, year],
    queryFn: () => reportsService.getExpenses(vehicleId, year),
    enabled: !!vehicleId,
  });
}

export function useHistory(vehicleId: string) {
  return useQuery({
    queryKey: ['reports-history', vehicleId],
    queryFn: () => reportsService.getHistory(vehicleId),
    enabled: !!vehicleId,
  });
}
