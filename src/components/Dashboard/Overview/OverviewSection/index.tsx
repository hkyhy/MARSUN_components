import { StatPendingBreakdown } from '@/components/Common';
import CardTitleWithSubtitle from '@/components/Dashboard/common/CardTitleWithSubtitle';
import { getOverviewScopeText } from '@/components/Dashboard/constants/dataScopeDescriptions';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import { Card, Segmented } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import type { OverviewDataView, UseDashboardOverviewReturn } from '../hooks/useDashboardOverview';
import styles from './style.module.scss';
import classNames from 'classnames';

interface OverviewSectionProps {
  overview: UseDashboardOverviewReturn;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ overview }) => {
  const { hasAnyRole, hasPermissionKey, user } = useAuthStore();
  const isAdmin = hasAnyRole([UserRole.SYSTEM_ADMIN]);
  const isExecutive = hasAnyRole([UserRole.SENIOR_EXECUTIVE]);
  const isDeptLeader = hasAnyRole([UserRole.DEPT_LEADER]);
  const isReviewer = hasAnyRole([UserRole.REVIEWER]);
  const hasGlobalStats = hasPermissionKey('stats:global');

  const dataViewOptions = useMemo(() => {
    const options: { label: string; value: OverviewDataView }[] = [
      { label: '个人数据', value: 'personal' },
    ];
    if (isReviewer || isAdmin) {
      options.push({ label: '审核数据', value: 'review' });
    }
    if (isDeptLeader) {
      options.push({ label: '部门数据', value: 'department' });
    }
    if (hasGlobalStats) {
      options.push({ label: '全局数据', value: 'global' });
    }
    return options;
  }, [hasGlobalStats, isDeptLeader, isReviewer, isAdmin]);

  const [dataView, setDataView] = useState<OverviewDataView>('personal');

  useEffect(() => {
    if (!dataViewOptions.some((o) => o.value === dataView)) {
      setDataView(dataViewOptions[0]?.value ?? 'personal');
    }
  }, [dataView, dataViewOptions]);

  const reviewDetailItems = useMemo(
    () => [
      ...overview.reviewerPendingItems.map((item) => ({
        ...item,
        hidden: !isReviewer,
      })),
      ...overview.adminPendingItems.map((item) => ({
        ...item,
        hidden: !isAdmin,
      })),
    ],
    [overview.reviewerPendingItems, overview.adminPendingItems, isReviewer, isAdmin],
  );

  const overviewSubtitle = useMemo(
    () => (user?.role ? getOverviewScopeText(dataView, user.role, user.departmentName) : undefined),
    [dataView, user?.role, user?.departmentName],
  );

  const { summaryItems, detailItems } = useMemo(() => {
    switch (dataView) {
      case 'review':
        return { summaryItems: overview.reviewStatItems, detailItems: reviewDetailItems };
      case 'department':
        return { summaryItems: overview.deptItems, detailItems: overview.deptPendingItems };
      case 'global':
        return {
          summaryItems: overview.globalItems,
          detailItems: isExecutive ? [] : overview.adminPendingItems,
        };
      default:
        return {
          summaryItems: overview.myFileItems,
          detailItems: overview.personalInitiatedPendingItems,
        };
    }
  }, [dataView, overview, reviewDetailItems, isExecutive]);

  return (
    <Card
      className={classNames('overview-section-root', styles['overview-section-root'])}
      title={<CardTitleWithSubtitle title="数据概览" subtitle={overviewSubtitle} />}
      extra={
        dataViewOptions.length > 1 ? (
          <Segmented
            value={dataView}
            onChange={(v) => setDataView(v as OverviewDataView)}
            options={dataViewOptions}
          />
        ) : undefined
      }
    >
      <StatPendingBreakdown
        plain
        summaryItems={summaryItems}
        detailItems={detailItems}
        detailLabel="待审核明细"
      />
    </Card>
  );
};

export default OverviewSection;
