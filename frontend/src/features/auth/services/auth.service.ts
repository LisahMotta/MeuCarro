import { api } from '../../../lib/api';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { name: string; email: string; password: string; }

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post('/auth/login', payload);
    return data.data as { user: any; accessToken: string };
  },

  async register(payload: RegisterPayload) {
    const { data } = await api.post('/auth/register', payload);
    return data.data as { user: any; accessToken: string };
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
};
