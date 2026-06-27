import { api } from '../../../lib/api';
import { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../types/vehicle.types';

export const vehiclesService = {
  async getAll(): Promise<Vehicle[]> {
    const { data } = await api.get('/vehicles');
    return data.data;
  },

  async getById(id: string): Promise<Vehicle> {
    const { data } = await api.get(`/vehicles/${id}`);
    return data.data;
  },

  async create(payload: CreateVehiclePayload): Promise<Vehicle> {
    const { data } = await api.post('/vehicles', payload);
    return data.data;
  },

  async update(id: string, payload: UpdateVehiclePayload): Promise<Vehicle> {
    const { data } = await api.patch(`/vehicles/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },

  async uploadPhoto(id: string, file: File): Promise<Vehicle> {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await api.post(`/vehicles/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};
