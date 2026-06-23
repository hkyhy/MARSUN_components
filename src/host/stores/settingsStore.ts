import { settingsApi } from '@/api';
import { ALLOWED_FILE_TYPES } from '@/constants';
import { create } from 'zustand';

const SETTINGS_CACHE_KEY = 'maoyang_settings';

export interface SystemSettings {
  systemName: string;
  systemShortName: string;
  logo: string;
  themeColor: string;
  loginBg: string;
  footerText: string;
  /** 可上传文件类型（类型名 → 扩展名列表），如 { Word: ['.doc', '.docx'] } */
  allowedFileTypes: Record<string, string[]>;
}

const DEFAULT_SETTINGS: SystemSettings = {
  systemName: '华茂文件资产库',
  systemShortName: '华茂',
  logo: '',
  themeColor: '#1677ff',
  loginBg: '',
  footerText: '© 华茂集团',
  allowedFileTypes: ALLOWED_FILE_TYPES,
};

function loadCached(): SystemSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function cacheSettings(settings: SystemSettings) {
  localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
}

interface SettingsState {
  settings: SystemSettings;
  loaded: boolean;
  fetchSettings: () => Promise<SystemSettings>;
  updateSettings: (settings: Partial<SystemSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: loadCached(),
  loaded: false,

  fetchSettings: async () => {
    try {
      const res = await settingsApi.get();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = (res as any).data?.data || (res as any).data || res;
      const data = typeof raw === 'object' ? (raw as Record<string, string>) : {};
      const settings: SystemSettings = {
        systemName: data.systemName || DEFAULT_SETTINGS.systemName,
        systemShortName: data.systemShortName || DEFAULT_SETTINGS.systemShortName,
        logo: data.logo || '',
        themeColor: data.themeColor || DEFAULT_SETTINGS.themeColor,
        loginBg: data.loginBg || '',
        footerText: data.footerText || DEFAULT_SETTINGS.footerText,
        allowedFileTypes: data.allowedFileTypes
          ? typeof data.allowedFileTypes === 'string'
            ? JSON.parse(data.allowedFileTypes)
            : data.allowedFileTypes
          : DEFAULT_SETTINGS.allowedFileTypes,
      };
      cacheSettings(settings);
      set({ settings, loaded: true });
      return settings;
    } catch {
      // 接口失败时使用缓存值
      set({ loaded: true });
      return get().settings;
    }
  },

  updateSettings: (partial) => {
    const settings = { ...get().settings, ...partial };
    cacheSettings(settings);
    set({ settings });
  },
}));
