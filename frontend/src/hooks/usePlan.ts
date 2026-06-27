import { useAuthStore } from '../store/authStore';

export function usePlan() {
  const user = useAuthStore((s) => s.user);
  return {
    plan: user?.plan ?? 'free',
    isPremium: user?.plan === 'premium',
    isFree: user?.plan === 'free',
  };
}
