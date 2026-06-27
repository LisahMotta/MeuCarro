import { api } from '../../../lib/api';
import { Document, CreateDocumentPayload } from '../types/document.types';

export const documentsService = {
  async getAll(vehicleId: string): Promise<Document[]> {
    const { data } = await api.get(`/vehicles/${vehicleId}/documents`);
    return data.data;
  },
  async create(vehicleId: string, payload: CreateDocumentPayload): Promise<Document> {
    const { data } = await api.post(`/vehicles/${vehicleId}/documents`, payload);
    return data.data;
  },
  async update(vehicleId: string, id: string, payload: Partial<CreateDocumentPayload>): Promise<Document> {
    const { data } = await api.patch(`/vehicles/${vehicleId}/documents/${id}`, payload);
    return data.data;
  },
  async delete(vehicleId: string, id: string): Promise<void> {
    await api.delete(`/vehicles/${vehicleId}/documents/${id}`);
  },
};
