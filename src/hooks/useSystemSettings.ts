import { useCallback, useEffect, useState } from 'react';

import {
  systemSettingsApi,
  type SystemSettingsDto,
} from '../pages/github-app/types';

export type SystemSettings = SystemSettingsDto;

const DEFAULT_SETTINGS: SystemSettings = {
  githubAppEnabled: false,
};

let cachedSettings: SystemSettings | null = null;

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>(
    cachedSettings ?? DEFAULT_SETTINGS,
  );
  const [loading, setLoading] = useState(!cachedSettings);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await systemSettingsApi.getSettings();
      cachedSettings = response.data;
      setSettings(response.data);
    } catch (error) {
      console.warn('Failed to fetch system settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cachedSettings) {
      fetchSettings();
    }
  }, [fetchSettings]);

  return { settings, loading };
};
