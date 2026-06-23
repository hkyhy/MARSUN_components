/** 菜单项导览锚点，与 MainLayout menuItems 的 key 一致 */
export const TOUR_MENU_KEYS = {
  dashboard: '/dashboard',
  files: '/files',
  review: '/review',
  system: '/system',
  feedback: '/feedback',
  audit: '/audit',
  tasks: '/tasks',
} as const;

export type TourMenuKey = (typeof TOUR_MENU_KEYS)[keyof typeof TOUR_MENU_KEYS];

/** 解析侧边栏中指定 menu key 对应的 DOM 节点（menu item 或 submenu title） */
export function getMenuTourTarget(menuKey: string): HTMLElement | null {
  const marker = document.querySelector(`[data-tour-menu="${menuKey}"]`);
  if (!marker) return null;

  const target = (marker.closest('.ant-menu-item') ??
    marker.closest('.ant-menu-submenu-title')) as HTMLElement | null;

  target?.scrollIntoView({ block: 'nearest' });
  return target;
}
