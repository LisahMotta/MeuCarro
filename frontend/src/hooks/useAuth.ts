import { useAuthStore } from '../store/authStore';
import { useCallback } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const { user, accessToken, setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await api.delete('/auth/logout');
    } catch {}
    storeLogout();
    navigate('/login');
  }, [storeLogout, navigate]);

  return {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    setAuth,
    logout,
  };
}
