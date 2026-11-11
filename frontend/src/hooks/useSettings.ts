import { useCallback, useState } from 'react';
import { readJSON, writeJSON } from '../services/storage';

export interface AppSettings {
  /** Hiện cảnh báo dịch bệnh theo thời tiết trên Dashboard */
  diseaseAlerts: boolean;
  /** Lưu ảnh chất lượng cao (1024px) thay vì ảnh nén (640px) trong lịch sử */
  highQualityImages: boolean;
  language: 'vi' | 'en';
}

const STORAGE_KEY = 'apd.settings.v1';

export const defaultSettings: AppSettings = {
  diseaseAlerts: true,
  highQualityImages: false,
  language: 'vi'
};

export function readSettings(): AppSettings {
  return { ...defaultSettings, ...readJSON<Partial<AppSettings>>(STORAGE_KEY, {}) };
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(readSettings);

  const update = useCallback(<K extends keyof AppSettings,>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      writeJSON(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    writeJSON(STORAGE_KEY, defaultSettings);
    setSettings(defaultSettings);
  }, []);

  return { settings, update, reset };
}