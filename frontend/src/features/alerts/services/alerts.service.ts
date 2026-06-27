import { api } from '../../../lib/api';

export interface Alert {
  id: string;
  vehicleId: string;
  userId: string;
  type: string;
  title: string;
  description?: string | null;
  severity: 'info' | 'warning' | 'urgent' | 'critical';
  triggerDate?: string | null;
  triggerKm?: number | null;
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
}

export const alertsService = {
  async getAll(unreadOnly = false): Promise<Alert[]> {
    const { data } = await api.get('/alerts', { params: { unread: unreadOnly } });
    return data.data;
  },
  async markRead(id: string): Promise<Alert> {
    const { data } = await api.patch(`/alerts/${id}/read`);
    return data.data;
  },
  async markAllRead(): Promise<void> {
    await api.patch('/alerts/read-all');
  },
  async dismiss(id: string): Promise<Alert> {
    const { data } = await api.patch(`/alerts/${id}/dismiss`);
    return data.data;
  },
  async generate(): Promise<void> {
    await api.post('/alerts/generate');
  },
};
