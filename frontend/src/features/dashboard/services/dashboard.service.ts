import { api } from '../../../lib/api';
import { DashboardData, MonthlyExpense } from '../types/dashboard.types';

export const dashboardService = {
  async get(vehicleId: string): Promise<DashboardData> {
    const { data } = await api.get(`/vehicles/${vehicleId}/dashboard`);
    return data.data;
  },
  async getMonthlyExpenses(vehicleId: string, year?: number): Promise<MonthlyExpense[]> {
    const { data } = await api.get(`/vehicles/${vehicleId}/dashboard/monthly-expenses`, {
      params: { year: year ?? new Date().getFullYear() },
    });
    return data.data;
  },
};
