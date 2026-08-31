import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, SettingsData } from '@/services/settings.service';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings
  });

  const updateMutation = useMutation({
    mutationFn: (data: SettingsData) => settingsService.updateSettings(data),
    onSuccess: (newData) => {
      queryClient.setQueryData(['settings'], newData);
    }
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending
  };
};
