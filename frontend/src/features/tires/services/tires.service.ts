import { api } from '../../../lib/api';
import { Tire, TireEvent, CreateTirePayload, CreateTireEventPayload } from '../types/tire.types';

export const tiresService = {
  async getAll(vehicleId: string): Promise<Tire[]> {
    const { data } = await api.get(`/vehicles/${vehicleId}/tires`);
    return data.data;
  },
  async create(vehicleId: string, payload: CreateTirePayload): Promise<Tire> {
    const { data } = await api.post(`/vehicles/${vehicleId}/tires`, payload);
    return data.data;
  },
  async update(vehicleId: string, id: string, payload: Partial<CreateTirePayload>): Promise<Tire> {
    const { data } = await api.patch(`/vehicles/${vehicleId}/tires/${id}`, payload);
    return data.data;
  },
  async delete(vehicleId: string, id: string): Promise<void> {
    await api.delete(`/vehicles/${vehicleId}/tires/${id}`);
  },
  async getEvents(vehicleId: string): Promise<TireEvent[]> {
    const { data } = await api.get(`/vehicles/${vehicleId}/tires/events`);
    return data.data;
  },
  async createEvent(vehicleId: string, payload: CreateTireEventPayload): Promise<TireEvent> {
    const { data } = await api.post(`/vehicles/${vehicleId}/tires/events`, payload);
    return data.data;
  },
};
