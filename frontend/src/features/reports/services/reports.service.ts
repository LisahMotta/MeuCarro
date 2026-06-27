import { api } from '../../../lib/api';
import { ExpenseReport, HistoryEvent } from '../types/reports.types';

export const reportsService = {
  async getExpenses(vehicleId: string, year?: number): Promise<ExpenseReport> {
    const { data } = await api.get(`/vehicles/${vehicleId}/reports/expenses`, {
      params: { year: year ?? new Date().getFullYear() },
    });
    return data.data;
  },
  async getHistory(vehicleId: string, limit = 50, offset = 0): Promise<HistoryEvent[]> {
    const { data } = await api.get(`/vehicles/${vehicleId}/reports/history`, {
      params: { limit, offset },
    });
    return data.data;
  },
};
