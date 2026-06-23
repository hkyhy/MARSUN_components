import { useAuthStore } from '@/stores/authStore';
import { BarChart3 } from '@/icons';
import ButtonGroup from '@kne/button-group';
import { Card, Tabs, message } from 'antd';
import React, { useState } from 'react';
import CardTitleWithSubtitle from '../../common/CardTitleWithSubtitle';
import { getAnalyticsScopeText } from '../../constants/dataScopeDescriptions';
import AnalyticsFilterBar from '../AnalyticsFilterBar';
import ContributionBoardSection from '../ContributionBoard/ContributionBoardSection';
import { useAnalyticsFilters } from '../hooks/useAnalyticsFilters';
import { useDashboardAnalytics } from '../hooks/useDashboardAnalytics';
import ContributionPieChart from '../PointsReport/ContributionPieChart';
import DeptPointsTable from '../PointsReport/DeptPointsTable';
import PersonalPointsTable from '../PointsReport/PersonalPointsTable';
import FileTypePieChart from '../TrendAnalysis/FileTypePieChart';
import UploadTrendChart from '../TrendAnalysis/UploadTrendChart';
import { downloadPointsExport } from '../utils/exportPoints';
import styles from './style.module.scss';
import classNames from 'classnames';

const AnalyticsSection: React.FC = () => {
  const { user } = useAuthStore();
  const filters = useAnalyticsFilters();
  const analytics = useDashboardAnalytics(filters.filterParams);
  const [exporting, setExporting] = useState(false);
  const hasCustomDateRange = !!filters.filterParams.startDate;

  const handleExport = async (type: 'department' | 'personal') => {
    setExporting(true);
    try {
      await downloadPointsExport(type, filters.filterParams);
      message.success('导出成功');
    } catch {
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const exportActions: Record<string, unknown>[] = [
    {
      children: '导出部门报表',
      loading: exporting,
      onClick: () => handleExport('department'),
    },
    {
      children: '导出个人报表',
      loading: exporting,
      onClick: () => handleExport('personal'),
    },
  ];

  const tabItems = [
    {
      key: 'trend',
      label: '趋势分析',
      children: (
        <div className={classNames('analytics-section-root', styles['analytics-section-root'])}>
          <UploadTrendChart
            data={analytics.trendData}
            loading={analytics.trendLoading}
            trendDays={analytics.trendDays}
            onTrendDaysChange={analytics.setTrendDays}
            hasCustomDateRange={hasCustomDateRange}
          />
          <FileTypePieChart data={analytics.typeData} loading={analytics.typeLoading} />
        </div>
      ),
    },
    {
      key: 'points',
      label: '积分报表',
      children: (
        <div className={classNames('analytics-section-container', styles['analytics-section-container'])}>
          <ContributionPieChart data={analytics.deptPoints} loading={analytics.deptPointsLoading} />
          <DeptPointsTable data={analytics.deptPoints} loading={analytics.deptPointsLoading} />
          <PersonalPointsTable
            data={analytics.personalPoints}
            total={analytics.personalTotal}
            page={analytics.personalPage}
            loading={analytics.personalLoading}
            filterParams={filters.filterParams}
            onPageChange={analytics.setPersonalPage}
          />
        </div>
      ),
    },
    {
      key: 'contribution',
      label: '资产贡献榜',
      children: <ContributionBoardSection filterParams={filters.filterParams} />,
    },
  ];

  return (
    <Card
      title={
        <CardTitleWithSubtitle
          title="统计分析"
          icon={<BarChart3 />}
          subtitle={user?.role ? getAnalyticsScopeText(user.role, user.departmentName) : undefined}
        />
      }
      className={classNames('analytics-section-wrapper', styles['analytics-section-wrapper'])}
      extra={<ButtonGroup list={exportActions} />}
    >
      <AnalyticsFilterBar filters={filters} />
      <Tabs destroyInactiveTabPane items={tabItems} />
    </Card>
  );
};

export default AnalyticsSection;
