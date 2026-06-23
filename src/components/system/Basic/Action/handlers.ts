import { settingsApi } from '@/api';
import { ALLOWED_FILE_TYPES } from '@/constants';
import { message } from 'antd';
import type { SystemSettings } from '@/stores/settingsStore';

interface SettingsFormValues {
  systemName: string;
  systemShortName: string;
  logo: string;
  themeColor: string;
  loginBg: string;
  footerText: string;
  allowedFileTypes: string[];
}

/** 将表单值转换为 API 提交数据 */
export function formatFormValues(values: SettingsFormValues): Record<string, string> {
  const submitData: Record<string, string> = {
    systemName: values.systemName,
    systemShortName: values.systemShortName,
    logo: values.logo,
    themeColor: values.themeColor,
    loginBg: values.loginBg,
    footerText: values.footerText,
  };
  // 从选中的扩展名反推类型映射
  const selectedExts = (values.allowedFileTypes || []).filter((v: string) => v.startsWith('.'));
  const allowedTypes: Record<string, string[]> = {};
  for (const [typeName, allExts] of Object.entries(ALLOWED_FILE_TYPES)) {
    const matched = allExts.filter((ext) => selectedExts.includes(ext));
    if (matched.length > 0) {
      allowedTypes[typeName] = matched;
    }
  }
  submitData.allowedFileTypes = JSON.stringify(allowedTypes);
  return submitData;
}

/** 将设置数据展平为表单值 */
export function settingsToFormValues(settings: SystemSettings): SettingsFormValues {
  return {
    systemName: settings.systemName || '',
    systemShortName: settings.systemShortName || '',
    logo: settings.logo || '',
    themeColor: settings.themeColor || '#1677ff',
    loginBg: settings.loginBg || '',
    footerText: settings.footerText || '',
    allowedFileTypes: Object.values(settings.allowedFileTypes || {}).flat() as string[],
  };
}

/** 保存设置 */
export async function handleSaveSettings(values: SettingsFormValues) {
  try {
    const submitData = formatFormValues(values);
    await settingsApi.update(submitData);
    message.success('保存成功');
    // 返回成功标记，页面可自行决定是否刷新
    return true;
  } catch {
    return false;
  }
}
