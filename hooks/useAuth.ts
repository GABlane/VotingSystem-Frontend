import { useAuthStore } from '@/store/auth';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, checkAuth } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };
};
