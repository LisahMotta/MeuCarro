import { api } from '../../../lib/api';
import { Maintenance, MaintenanceStats, CreateMaintenancePayload } from '../types/maintenance.types';

export const maintenancesService = {
  async getAll(vehicleId: string): Promise<Maintenance[]> {
    const { data } = await api.get(`/vehicles/${vehicleId}/maintenances`);
    return data.data;
  },

  async getById(vehicleId: string, id: string): Promise<Maintenance> {
    const { data } = await api.get(`/vehicles/${vehicleId}/maintenances/${id}`);
    return data.data;
  },

  async create(vehicleId: string, payload: CreateMaintenancePayload): Promise<Maintenance> {
    const { data } = await api.post(`/vehicles/${vehicleId}/maintenances`, payload);
    return data.data;
  },

  async update(vehicleId: string, id: string, payload: Partial<CreateMaintenancePayload>): Promise<Maintenance> {
    const { data } = await api.patch(`/vehicles/${vehicleId}/maintenances/${id}`, payload);
    return data.data;
  },

  async delete(vehicleId: string, id: string): Promise<void> {
    await api.delete(`/vehicles/${vehicleId}/maintenances/${id}`);
  },

  async getStats(vehicleId: string): Promise<MaintenanceStats> {
    const { data } = await api.get(`/vehicles/${vehicleId}/maintenances/stats`);
    return data.data;
  },
};
