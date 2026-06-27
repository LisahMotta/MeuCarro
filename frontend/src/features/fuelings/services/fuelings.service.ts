import { api } from '../../../lib/api';
import { Fueling, FuelingStats, FuelingMonthStat, CreateFuelingPayload } from '../types/fueling.types';

export const fuelingsService = {
  async getAll(vehicleId: string, page = 1, limit = 20): Promise<Fueling[]> {
    const { data } = await api.get(`/vehicles/${vehicleId}/fuelings`, { params: { page, limit } });
    return data.data;
  },

  async getById(vehicleId: string, id: string): Promise<Fueling> {
    const { data } = await api.get(`/vehicles/${vehicleId}/fuelings/${id}`);
    return data.data;
  },

  async create(vehicleId: string, payload: CreateFuelingPayload): Promise<Fueling> {
    const { data } = await api.post(`/vehicles/${vehicleId}/fuelings`, payload);
    return data.data;
  },

  async update(vehicleId: string, id: string, payload: Partial<CreateFuelingPayload>): Promise<Fueling> {
    const { data } = await api.patch(`/vehicles/${vehicleId}/fuelings/${id}`, payload);
    return data.data;
  },

  async delete(vehicleId: string, id: string): Promise<void> {
    await api.delete(`/vehicles/${vehicleId}/fuelings/${id}`);
  },

  async getStats(vehicleId: string): Promise<FuelingStats> {
    const { data } = await api.get(`/vehicles/${vehicleId}/fuelings/stats`);
    return data.data;
  },

  async getMonthlyStats(vehicleId: string, year?: number): Promise<FuelingMonthStat[]> {
    const { data } = await api.get(`/vehicles/${vehicleId}/fuelings/stats/monthly`, {
      params: { year: year ?? new Date().getFullYear() },
    });
    return data.data;
  },
};
