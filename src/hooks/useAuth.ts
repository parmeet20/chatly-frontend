import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, usePathname } from 'next/navigation';

export const useAuth = (requireAuth = true) => {
  const { user, isAuthenticated, fetchCurrentUser, token, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Basic route protection
    if (requireAuth && !isAuthenticated && !isLoading && pathname !== '/login' && pathname !== '/register' && pathname !== '/') {
      router.push('/login');
    }
  }, [requireAuth, isAuthenticated, isLoading, router, pathname]);

  useEffect(() => {
    if (isAuthenticated && !user && token && !isLoading) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, token, isLoading, fetchCurrentUser]);

  return { user, isAuthenticated, isLoading };
};
