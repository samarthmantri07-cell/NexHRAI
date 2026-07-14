'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { useMe } = useAuth();
  
  // This hook will fire on mount and fetch the user based on httpOnly cookie.
  // It handles setting the user in the Zustand store.
  const { isLoading } = useMe();

  // If you want to block rendering the app until auth is known, you could do it here.
  // But usually it's better to let pages handle loading states so layout can render.
  
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
