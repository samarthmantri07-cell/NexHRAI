import api from './api';

export interface SettingsData {
  workspaceName: string;
  emailAlertsEnabled: boolean;
  weeklyDigestEnabled: boolean;
}

export const settingsService = {
  getSettings: async (): Promise<SettingsData> => {
    const response = await api.get('/settings');
    return response.data.data;
  },
  updateSettings: async (data: SettingsData): Promise<SettingsData> => {
    const response = await api.put('/settings', data);
    return response.data.data;
  }
};
