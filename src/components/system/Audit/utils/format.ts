import { AUDIT_ACTION_LABEL_MAP, AUDIT_TARGET_TYPE_LABEL_MAP } from '@/constants';

/** 规范化 IP 展示（IPv6 本地回环转为 127.0.0.1） */
export function formatIp(ip?: string | null): string {
  if (!ip) return '-';
  if (ip === '::1' || ip === '::ffff:127.0.0.1') return '127.0.0.1';
  if (ip.startsWith('::ffff:')) return ip.slice(7);
  return ip;
}

export function getAuditActionLabel(action: string): string {
  return AUDIT_ACTION_LABEL_MAP[action] ?? action;
}

export function getAuditTargetTypeLabel(targetType: string): string {
  return AUDIT_TARGET_TYPE_LABEL_MAP[targetType] ?? targetType;
}

export interface AuditDetailPayload {
  method?: string;
  path?: string;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

/** 解析审计详情 JSON */
export function parseAuditDetail(detail: string): AuditDetailPayload | null {
  if (!detail) return null;
  try {
    return JSON.parse(detail) as AuditDetailPayload;
  } catch {
    return null;
  }
}

/** 格式化 JSON 对象为可读文本 */
export function formatJsonText(value: unknown): string {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}
