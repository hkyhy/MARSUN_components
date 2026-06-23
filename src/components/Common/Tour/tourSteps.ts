import type { TourStepProps } from 'antd';
import { UserRole } from '@/types';
import type { TourAccessContext } from './tourAccess';
import { TOUR_MENU_KEYS, type TourMenuKey } from './tourTargets';

export type TourRefKey = 'quickUpload' | 'userMenu' | 'content';

export interface TourStepConfig {
  id: string;
  title: string;
  getDescription: (access: TourAccessContext) => string;
  menuKey?: TourMenuKey;
  refKey?: TourRefKey;
  placement?: TourStepProps['placement'];
  isVisible?: (access: TourAccessContext) => boolean;
}

function getWelcomeDescription(access: TourAccessContext): string {
  const suffix = '本导览将按您的权限介绍各功能模块；如需再次查看，可点击顶部栏的 ? 按钮。';
  const { user, hasAnyRole } = access;

  if (hasAnyRole([UserRole.SYSTEM_ADMIN])) {
    return `欢迎，${user.displayName}。作为系统管理员，您可管理组织与用户、处理审核任务，并查看全平台审计与统计。${suffix}`;
  }
  if (hasAnyRole([UserRole.SENIOR_EXECUTIVE])) {
    return `欢迎，${user.displayName}。您可查看全组织范围的统计报表${access.canSeeReviewManage ? '，并在审核中心监督审核进度' : ''}。${suffix}`;
  }
  if (hasAnyRole([UserRole.DEPT_LEADER])) {
    return `欢迎，${user.displayName}。作为部门负责人，您可在工作台查看部门数据，并管理本部门文件与审核。${suffix}`;
  }
  if (hasAnyRole([UserRole.REVIEWER])) {
    return `欢迎，${user.displayName}。除上传与管理文件外，您还可在审核中心处理分配给您的待审任务。${suffix}`;
  }
  return `欢迎，${user.displayName}。您可上传资产文件、提交审核，并在审核中心跟踪进度。${suffix}`;
}

function getDashboardDescription(access: TourAccessContext): string {
  const parts = ['登录后默认进入工作台，查看个人文件数量与审核进度概览'];
  if (access.canSeeReviewPending) {
    parts.push('可切换至「审核数据」查看待审与已处理任务');
  }
  if (access.hasAnyRole([UserRole.DEPT_LEADER])) {
    parts.push('可切换至「部门数据」查看本部门及下属部门统计');
  }
  if (access.canSeeGlobalStats) {
    parts.push('可切换至「全局数据」查看全组织统计，并按日期、部门、姓名或工号筛选导出 Excel');
  } else if (access.hasAnyRole([UserRole.NORMAL_USER])) {
    parts.push('统计分析按您所在部门范围展示');
  }
  return parts.join('；') + '。';
}

function getFilesDescription(access: TourAccessContext): string {
  const parts = [
    '在「文件管理」中维护已上传资产，支持批量提交审核、编辑元信息与查看详情',
  ];
  if (access.canSeeFolderManage) {
    parts.push('「文件夹管理」可用于组织目录结构');
  }
  return parts.join('；') + '。';
}

function getReviewDescription(access: TourAccessContext): string {
  const parts: string[] = [];

  if (access.canSeeReviewPending) {
    parts.push('「待我处理」处理分配给您的审核任务');
    parts.push('「我已处理」「我收到的」查看历史与抄送');
  }
  if (access.canSeeReviewManage && !access.hasAnyRole([UserRole.REVIEWER])) {
    parts.push('「全部审核」监督全组织审核进度');
  } else if (access.canSeeReviewManage) {
    parts.push('「全部审核」可监督全组织审核进度');
  }
  parts.push('「我发起的」跟踪本人提交的审核进度');

  return `审核中心按职责划分：${parts.join('；')}。`;
}

function getSystemDescription(access: TourAccessContext): string {
  const parts: string[] = [];
  if (access.canSeeDept) parts.push('「组织架构」维护部门结构');
  if (access.canSeeUsers) parts.push('「用户管理」维护账号与角色');
  if (access.canSeePermissionAdmin) parts.push('「权限管理」配置角色权限');
  if (access.canSeeBasicSettings) parts.push('「基础设置」调整系统参数');
  return `系统设置模块：${parts.join('；')}。`;
}

function getWorkAreaDescription(access: TourAccessContext): string {
  const parts = ['右侧是主要操作区，各功能页在此展示列表、详情与表单'];
  if (access.canSeeReviewPending) {
    parts.push('审核页可批量通过、驳回或退回');
  }
  if (access.canSeeGlobalStats || access.hasAnyRole([UserRole.DEPT_LEADER])) {
    parts.push('统计页支持筛选与 Excel 导出');
  }
  return parts.join('；') + '。';
}

export const TOUR_STEP_CONFIG: TourStepConfig[] = [
  {
    id: 'welcome',
    title: '欢迎使用数据资产管理系统',
    getDescription: getWelcomeDescription,
  },
  {
    id: 'dashboard',
    title: '工作台',
    getDescription: getDashboardDescription,
    menuKey: TOUR_MENU_KEYS.dashboard,
    placement: 'right',
  },
  {
    id: 'files',
    title: '文件管理',
    getDescription: getFilesDescription,
    menuKey: TOUR_MENU_KEYS.files,
    placement: 'right',
  },
  {
    id: 'review',
    title: '审核中心',
    getDescription: getReviewDescription,
    menuKey: TOUR_MENU_KEYS.review,
    placement: 'right',
  },
  {
    id: 'system',
    title: '系统设置',
    getDescription: getSystemDescription,
    menuKey: TOUR_MENU_KEYS.system,
    placement: 'right',
    isVisible: (access) => access.canSeeSystem,
  },
  {
    id: 'feedback',
    title: '反馈管理',
    getDescription: () =>
      '在「反馈管理」中提交系统问题或建议，查看处理进度与回复，便于与管理员沟通。',
    menuKey: TOUR_MENU_KEYS.feedback,
    placement: 'right',
  },
  {
    id: 'audit',
    title: '审计日志',
    getDescription: () =>
      '「审计日志」记录用户关键操作，便于追溯文件变更、审核动作与权限调整等管理行为。',
    menuKey: TOUR_MENU_KEYS.audit,
    placement: 'right',
    isVisible: (access) => access.canSeeAudit,
  },
  {
    id: 'tasks',
    title: '任务管理',
    getDescription: () =>
      '「任务管理」查看后台异步任务（如批量导入、导出）的执行状态与结果，便于排查异常。',
    menuKey: TOUR_MENU_KEYS.tasks,
    placement: 'right',
    isVisible: (access) => access.canSeeTasks,
  },
  {
    id: 'quickUpload',
    title: '快速上传',
    getDescription: () =>
      '需要提交新资产时，可随时点击此处直接上传，无需先进入文件管理。上传完成后，在「文件管理」中补充信息并提交审核即可进入流转。',
    refKey: 'quickUpload',
    placement: 'bottom',
  },
  {
    id: 'workArea',
    title: '工作区域',
    getDescription: getWorkAreaDescription,
    refKey: 'content',
    placement: 'top',
  },
  {
    id: 'userMenu',
    title: '个人菜单',
    getDescription: () =>
      '点击头像区域可进入「个人设置」（查看工号、部门、修改密码等），或安全退出系统。顶部左侧按钮可折叠菜单，获得更大的工作区。',
    refKey: 'userMenu',
    placement: 'bottomLeft',
  },
];

export function getVisibleTourSteps(access: TourAccessContext): TourStepConfig[] {
  return TOUR_STEP_CONFIG.filter((step) => !step.isVisible || step.isVisible(access));
}
