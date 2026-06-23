import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/Common', () => ({
  CommonFilter: ({ children, label }: { children: React.ReactNode; label: string }) => (
    <div data-testid="common-filter">
      <span>{label}</span>
      {children}
    </div>
  ),
  FilterTreeSelect: () => <div data-testid="filter-dept">部门筛选</div>,
  FilterDateRange: () => <div data-testid="filter-date">日期筛选</div>,
  FilterInput: ({ label }: { label: string }) => <div data-testid="filter-keyword">{label}</div>,
}));

import AnalyticsFilterBar from '../AnalyticsFilterBar';

const mockFilters = {
  filterState: { dateRange: null, keyword: '' },
  filterParams: {},
  dateRange: null,
  setDateRange: vi.fn(),
  departmentId: undefined,
  setDepartmentId: vi.fn(),
  keyword: '',
  setKeyword: vi.fn(),
  resetFilters: vi.fn(),
};

describe('AnalyticsFilterBar', () => {
  it('renders date, department and keyword filters', () => {
    render(<AnalyticsFilterBar filters={mockFilters} />);
    expect(screen.getByTestId('filter-date')).toBeInTheDocument();
    expect(screen.getByTestId('filter-dept')).toBeInTheDocument();
    expect(screen.getByText('姓名/工号')).toBeInTheDocument();
  });
});
