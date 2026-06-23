import { statsApi } from '@/api';
import type { StatItem } from '@/components/Common';
import { useAuthStore } from '@/stores/authStore';
import type { StatisticsOverview } from '@/types';
import { ReviewStatus } from '@/types';
import {
  CircleCheck,
  Clock,
  CircleX,
  CloudUpload,
  File,
  Folder,
  Users,
  User,
} from '@/icons';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type OverviewDataView = 'personal' | 'review' | 'department' | 'global';

export function useDashboardOverview() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatisticsOverview | null>(null);

  useEffect(() => {
    statsApi
      .overview()
      .then((res) => setStats((res as unknown as { data: StatisticsOverview }).data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const goFiles = useCallback(
    (params?: {
      status?: string;
      uploaderId?: string;
      departmentId?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set('status', params.status);
      if (params?.uploaderId) searchParams.set('uploaderId', params.uploaderId);
      if (params?.departmentId) searchParams.set('departmentId', params.departmentId);
      if (params?.startDate) searchParams.set('startDate', params.startDate);
      if (params?.endDate) searchParams.set('endDate', params.endDate);
      const search = searchParams.toString();
      navigate(`/files/list${search ? `?${search}` : ''}`);
    },
    [navigate],
  );

  const goReview = useCallback(
    (path: string, status?: string) => {
      const search = status ? `?status=${status}` : '';
      navigate(`/review/${path}${search}`);
    },
    [navigate],
  );

  const todayRange = useCallback(() => {
    const d = dayjs().format('YYYY-MM-DD');
    return { startDate: `${d} 00:00:00`, endDate: `${d} 23:59:59` };
  }, []);

  const myFileItems: StatItem[] = [
    {
      title: '我的文件',
      value: stats?.myFiles ?? 0,
      prefix: <User />,
      color: '#1677ff',
      onClick: () => goFiles({ uploaderId: user?.id }),
    },
    {
      title: '今日上传',
      value: stats?.myTodayUploads ?? 0,
      prefix: <CloudUpload />,
      color: '#52c41a',
      onClick: () => goFiles({ ...todayRange(), uploaderId: user?.id }),
    },
    {
      title: '审核通过',
      value: stats?.myApprovedFiles ?? 0,
      prefix: <CircleCheck />,
      color: '#52c41a',
      onClick: () => goFiles({ status: ReviewStatus.APPROVED, uploaderId: user?.id }),
    },
    {
      title: '被驳回',
      value: stats?.myRejectedFiles ?? 0,
      prefix: <CircleX />,
      color: '#ff4d4f',
      onClick: () => goFiles({ status: ReviewStatus.REJECTED, uploaderId: user?.id }),
    },
  ];

  const personalInitiatedPendingItems: StatItem[] = [
    {
      title: '待初审',
      value: stats?.myPendingReviewer ?? 0,
      prefix: <Clock />,
      color: '#faad14',
      onClick: () => goReview('initiated', ReviewStatus.PENDING_REVIEWER),
    },
    {
      title: '初审中',
      value: stats?.myReviewingReviewer ?? 0,
      prefix: <Clock />,
      color: '#1890ff',
      onClick: () => goReview('initiated', ReviewStatus.REVIEWING_REVIEWER),
    },
    {
      title: '待复审',
      value: stats?.myPendingSecondReviewer ?? 0,
      prefix: <Clock />,
      color: '#fa8c16',
      onClick: () => goReview('initiated', ReviewStatus.PENDING_SECOND_REVIEWER),
    },
    {
      title: '复审中',
      value: stats?.myReviewingSecondReviewer ?? 0,
      prefix: <Clock />,
      color: '#2f54eb',
      onClick: () => goReview('initiated', ReviewStatus.REVIEWING_SECOND_REVIEWER),
    },
  ];

  const reviewStatItems: StatItem[] = [
    {
      title: '待我审核',
      value: stats?.myPendingReviews ?? 0,
      prefix: <Clock />,
      color: '#faad14',
      onClick: () => goReview('pending'),
    },
    {
      title: '已处理',
      value: stats?.myProcessedReviews ?? 0,
      prefix: <CircleCheck />,
      color: '#52c41a',
      onClick: () => goReview('processed'),
    },
  ];

  const reviewerPendingItems: StatItem[] = [
    {
      title: '待初审',
      value: stats?.myReviewPendingReviewer ?? 0,
      prefix: <Clock />,
      color: '#faad14',
      onClick: () => goReview('pending', ReviewStatus.PENDING_REVIEWER),
    },
    {
      title: '初审中',
      value: stats?.myReviewReviewingReviewer ?? 0,
      prefix: <Clock />,
      color: '#1890ff',
      onClick: () => goReview('pending', ReviewStatus.REVIEWING_REVIEWER),
    },
  ];

  const adminPendingItems: StatItem[] = [
    {
      title: '待初审',
      value: stats?.pendingReviewer ?? 0,
      prefix: <Clock />,
      color: '#faad14',
      onClick: () => goReview('all', ReviewStatus.PENDING_REVIEWER),
    },
    {
      title: '初审中',
      value: stats?.reviewingReviewer ?? 0,
      prefix: <Clock />,
      color: '#1890ff',
      onClick: () => goReview('all', ReviewStatus.REVIEWING_REVIEWER),
    },
    {
      title: '待复审',
      value: stats?.pendingSecondReviewer ?? 0,
      prefix: <Clock />,
      color: '#fa8c16',
      onClick: () => goReview('all', ReviewStatus.PENDING_SECOND_REVIEWER),
    },
    {
      title: '复审中',
      value: stats?.reviewingSecondReviewer ?? 0,
      prefix: <Clock />,
      color: '#2f54eb',
      onClick: () => goReview('all', ReviewStatus.REVIEWING_SECOND_REVIEWER),
    },
  ];

  const deptItems: StatItem[] = [
    {
      title: '部门文件',
      value: stats?.deptFiles ?? 0,
      prefix: <Folder />,
      color: '#13c2c2',
      onClick: () => goFiles({ departmentId: user?.departmentId }),
    },
    {
      title: '今日上传',
      value: stats?.deptTodayUploads ?? 0,
      prefix: <CloudUpload />,
      color: '#52c41a',
      onClick: () => goFiles({ ...todayRange(), departmentId: user?.departmentId }),
    },
    {
      title: '部门成员',
      value: stats?.deptMembers ?? 0,
      prefix: <Users />,
      color: '#722ed1',
      onClick: () => navigate('/system/users'),
    },
    {
      title: '已通过',
      value: stats?.deptApprovedFiles ?? 0,
      prefix: <CircleCheck />,
      color: '#52c41a',
      onClick: () => goFiles({ status: ReviewStatus.APPROVED, departmentId: user?.departmentId }),
    },
  ];

  const deptPendingItems: StatItem[] = [
    {
      title: '待初审',
      value: stats?.deptPendingReviewer ?? 0,
      prefix: <Clock />,
      color: '#faad14',
      onClick: () =>
        goFiles({ status: ReviewStatus.PENDING_REVIEWER, departmentId: user?.departmentId }),
    },
    {
      title: '初审中',
      value: stats?.deptReviewingReviewer ?? 0,
      prefix: <Clock />,
      color: '#1890ff',
      onClick: () =>
        goFiles({ status: ReviewStatus.REVIEWING_REVIEWER, departmentId: user?.departmentId }),
    },
    {
      title: '待复审',
      value: stats?.deptPendingSecondReviewer ?? 0,
      prefix: <Clock />,
      color: '#fa8c16',
      onClick: () =>
        goFiles({ status: ReviewStatus.PENDING_SECOND_REVIEWER, departmentId: user?.departmentId }),
    },
    {
      title: '复审中',
      value: stats?.deptReviewingSecondReviewer ?? 0,
      prefix: <Clock />,
      color: '#2f54eb',
      onClick: () =>
        goFiles({
          status: ReviewStatus.REVIEWING_SECOND_REVIEWER,
          departmentId: user?.departmentId,
        }),
    },
  ];

  const globalItems: StatItem[] = [
    {
      title: '文件总数',
      value: stats?.totalFiles ?? 0,
      prefix: <File />,
      color: '#1677ff',
      onClick: () => goFiles(),
    },
    {
      title: '今日上传',
      value: stats?.todayUploads ?? 0,
      prefix: <CloudUpload />,
      color: '#52c41a',
      onClick: () => goFiles(todayRange()),
    },
    {
      title: '用户总数',
      value: stats?.totalUsers ?? 0,
      prefix: <Users />,
      color: '#722ed1',
      onClick: () => navigate('/system/users'),
    },
    {
      title: '部门总数',
      value: stats?.totalDepartments ?? 0,
      prefix: <Folder />,
      color: '#13c2c2',
      onClick: () => navigate('/system/department'),
    },
  ];

  return {
    loading,
    stats,
    myFileItems,
    personalInitiatedPendingItems,
    reviewStatItems,
    reviewerPendingItems,
    adminPendingItems,
    deptItems,
    deptPendingItems,
    globalItems,
    goReview,
    goFiles,
  };
}

export type UseDashboardOverviewReturn = ReturnType<typeof useDashboardOverview>;
