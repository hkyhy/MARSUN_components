import type { OverviewDataView } from '@/components/Dashboard/Overview/hooks/useDashboardOverview';
import { UserRole } from '@/types';

function deptLabel(departmentName?: string): string {
  return departmentName ? `「${departmentName}」` : '您所在部门';
}

/** 快捷入口可见范围说明 */
export function getQuickEntryScopeText(role: string): string {
  const parts = ['展示文件上传与管理等基础功能入口'];
  if (role === UserRole.REVIEWER || role === UserRole.SYSTEM_ADMIN) {
    parts.push('含审核中心入口');
  }
  if (role === UserRole.SENIOR_EXECUTIVE) {
    parts.push('含审核监督入口');
  }
  if (role === UserRole.SYSTEM_ADMIN) {
    parts.push('含审计日志入口');
  }
  return `${parts.join('；')}。`;
}

/** 数据概览各视图可见范围说明 */
export function getOverviewScopeText(
  view: OverviewDataView,
  role: string,
  departmentName?: string,
): string {
  switch (view) {
    case 'personal':
      return '以下数据为您本人上传的文件及审核进度。';
    case 'review':
      if (role === UserRole.SYSTEM_ADMIN) {
        return '「待我审核」「已处理」为分配给您的审核任务；下方明细为全组织待审核状态分布。';
      }
      return '以下数据为您作为审核员被分配的待审及已处理文件。';
    case 'department':
      return `以下数据为${deptLabel(departmentName)}及其下属子部门范围内的统计。`;
    case 'global':
      if (role === UserRole.SENIOR_EXECUTIVE) {
        return '以下数据为全组织范围内的文件与用户统计（高层干部视角）。';
      }
      return '以下数据为全组织范围内的文件与用户统计。';
    default:
      return '';
  }
}

/** 统计分析可见范围说明 */
export function getAnalyticsScopeText(role: string, departmentName?: string): string {
  switch (role) {
    case UserRole.NORMAL_USER:
      return `以下数据仅包含${deptLabel(departmentName)}范围内的文件统计，筛选条件不可超出该范围。`;
    case UserRole.DEPT_LEADER:
      return `以下数据包含${deptLabel(departmentName)}及其下属子部门范围内的文件统计。`;
    case UserRole.REVIEWER:
    case UserRole.SYSTEM_ADMIN:
    case UserRole.SENIOR_EXECUTIVE:
      return '以下数据包含全组织范围内的文件统计，可通过日期、部门、姓名或工号进一步筛选。';
    default:
      return '';
  }
}
