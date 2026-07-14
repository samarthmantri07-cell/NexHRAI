import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginInput, RegisterInput } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['me'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(['me'], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
    },
  });

  const useMe = () => {
    return useQuery({
      queryKey: ['me'],
      queryFn: async () => {
        try {
          const user = await authService.getMe();
          setUser(user);
          return user;
        } catch (error) {
          setUser(null);
          throw error;
        }
      },
      retry: false,
      staleTime: Infinity,
    });
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    useMe,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
