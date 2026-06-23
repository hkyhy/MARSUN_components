import { statsApi } from '@/api';
import type { StatsFilterParams } from '@/types';

export async function downloadPointsExport(
  type: 'department' | 'personal',
  params: StatsFilterParams,
) {
  const blob = await statsApi.exportPoints({ ...params, type });
  const dateStr = (new Date().toISOString().split('T')[0] ?? '').replace(/-/g, '');
  const filename =
    type === 'department' ? `积分部门统计_${dateStr}.xlsx` : `积分个人统计_${dateStr}.xlsx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
