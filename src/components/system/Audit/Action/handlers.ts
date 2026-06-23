import { auditApi } from '@/api';
import { message } from 'antd';
import dayjs from 'dayjs';

/** 导出审计日志 CSV */
export async function exportAuditLogs(params: Record<string, string>) {
  try {
    const blob = await auditApi.exportCsv(params);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `audit-logs-${dayjs().format('YYYYMMDD-HHmmss')}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    message.success('导出成功');
  } catch {
    message.error('导出失败');
  }
}
