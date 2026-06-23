import { UserRole } from '@/types';
import { describe, expect, it } from 'vitest';
import {
  getAnalyticsScopeText,
  getOverviewScopeText,
  getQuickEntryScopeText,
} from '../dataScopeDescriptions';

describe('getQuickEntryScopeText', () => {
  it('returns basic text for normal user', () => {
    expect(getQuickEntryScopeText(UserRole.NORMAL_USER)).toBe(
      '展示文件上传与管理等基础功能入口。',
    );
  });

  it('includes review center for reviewer', () => {
    expect(getQuickEntryScopeText(UserRole.REVIEWER)).toContain('含审核中心入口');
  });

  it('includes audit log for system admin', () => {
    const text = getQuickEntryScopeText(UserRole.SYSTEM_ADMIN);
    expect(text).toContain('含审核中心入口');
    expect(text).toContain('含审计日志入口');
  });

  it('includes review supervision for senior executive', () => {
    expect(getQuickEntryScopeText(UserRole.SENIOR_EXECUTIVE)).toContain('含审核监督入口');
  });
});

describe('getOverviewScopeText', () => {
  it('returns personal scope text', () => {
    expect(getOverviewScopeText('personal', UserRole.NORMAL_USER)).toContain('本人上传');
  });

  it('returns reviewer scope text', () => {
    expect(getOverviewScopeText('review', UserRole.REVIEWER)).toContain('审核员');
  });

  it('returns mixed scope text for system admin review view', () => {
    const text = getOverviewScopeText('review', UserRole.SYSTEM_ADMIN);
    expect(text).toContain('分配给您的审核任务');
    expect(text).toContain('全组织待审核状态分布');
  });

  it('returns department scope text with department name', () => {
    expect(getOverviewScopeText('department', UserRole.DEPT_LEADER, '技术部')).toContain(
      '「技术部」',
    );
  });

  it('returns global scope text', () => {
    expect(getOverviewScopeText('global', UserRole.SYSTEM_ADMIN)).toContain('全组织');
  });

  it('returns executive-specific global scope text', () => {
    expect(getOverviewScopeText('global', UserRole.SENIOR_EXECUTIVE)).toContain('高层干部视角');
  });
});

describe('getAnalyticsScopeText', () => {
  it('returns dept-only scope for normal user', () => {
    const text = getAnalyticsScopeText(UserRole.NORMAL_USER, '产品部');
    expect(text).toContain('「产品部」');
    expect(text).toContain('不可超出该范围');
  });

  it('returns dept subtree scope for dept leader', () => {
    const text = getAnalyticsScopeText(UserRole.DEPT_LEADER, '市场部');
    expect(text).toContain('下属子部门');
  });

  it('returns org-wide scope for system admin', () => {
    const text = getAnalyticsScopeText(UserRole.SYSTEM_ADMIN);
    expect(text).toContain('全组织');
    expect(text).toContain('筛选');
  });

  it('returns org-wide scope for senior executive', () => {
    const text = getAnalyticsScopeText(UserRole.SENIOR_EXECUTIVE);
    expect(text).toContain('全组织');
    expect(text).toContain('筛选');
  });
});
