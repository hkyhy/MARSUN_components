import { UserRole } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OverviewSection from '../OverviewSection';
import type { UseDashboardOverviewReturn } from '../hooks/useDashboardOverview';

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/components/Common', () => ({
  StatPendingBreakdown: ({
    summaryItems,
  }: {
    summaryItems?: { title: string }[];
    detailItems: unknown[];
  }) => (
    <div data-testid="overview-stats">
      {summaryItems?.map((item) => (
        <span key={item.title}>{item.title}</span>
      ))}
    </div>
  ),
}));

import { useAuthStore } from '@/stores/authStore';

const mockUseAuthStore = vi.mocked(useAuthStore);

const baseOverview: UseDashboardOverviewReturn = {
  loading: false,
  stats: null,
  myFileItems: [{ title: '我的文件', value: 1 }],
  personalInitiatedPendingItems: [{ title: '待初审', value: 0 }],
  reviewStatItems: [{ title: '待我审核', value: 2 }],
  reviewerPendingItems: [{ title: '初审中', value: 1 }],
  adminPendingItems: [{ title: '待复审', value: 3 }],
  deptItems: [{ title: '部门文件', value: 4 }],
  deptPendingItems: [{ title: '部门待初审', value: 0 }],
  globalItems: [{ title: '文件总数', value: 100 }],
  goReview: vi.fn(),
  goFiles: vi.fn(),
};

describe('OverviewSection', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      hasAnyRole: vi.fn().mockReturnValue(false),
      hasPermissionKey: vi.fn().mockReturnValue(false),
      user: { role: UserRole.NORMAL_USER, departmentName: '技术部' },
    } as never);
  });

  it('hides Segmented for normal user with only personal view', () => {
    render(<OverviewSection overview={baseOverview} />);
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(screen.getByText('我的文件')).toBeInTheDocument();
  });

  it('shows personal scope subtitle under card title for normal user', () => {
    render(<OverviewSection overview={baseOverview} />);
    expect(screen.getByText('数据概览')).toBeInTheDocument();
    expect(screen.getByText(/本人上传/)).toBeInTheDocument();
  });

  it('shows multiple Segmented options for system admin', () => {
    mockUseAuthStore.mockReturnValue({
      hasAnyRole: (roles: UserRole[]) =>
        roles.includes(UserRole.SYSTEM_ADMIN) || roles.includes(UserRole.REVIEWER),
      hasPermissionKey: (perm: string) => perm === 'stats:global',
      user: { role: UserRole.SYSTEM_ADMIN, departmentName: '总部' },
    } as never);

    render(<OverviewSection overview={baseOverview} />);
    expect(screen.getByText('个人数据')).toBeInTheDocument();
    expect(screen.getByText('审核数据')).toBeInTheDocument();
    expect(screen.getByText('全局数据')).toBeInTheDocument();
  });

  it('switches to global view when Segmented clicked', () => {
    mockUseAuthStore.mockReturnValue({
      hasAnyRole: (roles: UserRole[]) => roles.includes(UserRole.SYSTEM_ADMIN),
      hasPermissionKey: (perm: string) => perm === 'stats:global',
      user: { role: UserRole.SYSTEM_ADMIN, departmentName: '总部' },
    } as never);

    render(<OverviewSection overview={baseOverview} />);
    fireEvent.click(screen.getByText('全局数据'));
    expect(screen.getByText('文件总数')).toBeInTheDocument();
    expect(screen.getByText(/全组织/)).toBeInTheDocument();
  });

  it('updates subtitle when switching to review view as admin', () => {
    mockUseAuthStore.mockReturnValue({
      hasAnyRole: (roles: UserRole[]) => roles.includes(UserRole.SYSTEM_ADMIN),
      hasPermissionKey: vi.fn().mockReturnValue(false),
      user: { role: UserRole.SYSTEM_ADMIN, departmentName: '总部' },
    } as never);

    render(<OverviewSection overview={baseOverview} />);
    fireEvent.click(screen.getByText('审核数据'));
    expect(screen.getByText('待我审核')).toBeInTheDocument();
    expect(screen.getByText(/分配给您的审核任务/)).toBeInTheDocument();
  });

  it('shows department option for dept leader', () => {
    mockUseAuthStore.mockReturnValue({
      hasAnyRole: (roles: UserRole[]) => roles.includes(UserRole.DEPT_LEADER),
      hasPermissionKey: vi.fn().mockReturnValue(false),
      user: { role: UserRole.DEPT_LEADER, departmentName: '市场部' },
    } as never);

    render(<OverviewSection overview={baseOverview} />);
    fireEvent.click(screen.getByText('部门数据'));
    expect(screen.getByText('部门文件')).toBeInTheDocument();
  });

  it('shows global option for senior executive without review option', () => {
    mockUseAuthStore.mockReturnValue({
      hasAnyRole: (roles: UserRole[]) => roles.includes(UserRole.SENIOR_EXECUTIVE),
      hasPermissionKey: (perm: string) =>
        perm === 'stats:global' || perm === 'review:manage',
      user: { role: UserRole.SENIOR_EXECUTIVE, departmentName: '总部' },
    } as never);

    render(<OverviewSection overview={baseOverview} />);
    expect(screen.getByText('个人数据')).toBeInTheDocument();
    expect(screen.getByText('全局数据')).toBeInTheDocument();
    expect(screen.queryByText('审核数据')).not.toBeInTheDocument();
  });
});
