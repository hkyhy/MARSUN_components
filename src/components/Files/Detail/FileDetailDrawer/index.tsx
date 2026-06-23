import { fileHandlers } from '@/components/Files';
import {
  AiAssessmentTaskPanel,
  EffectStatsPanel,
  ExcellentCasePanel,
  PointBreakdownPanel,
} from '@/components/Files/Detail';
import { CommonDescriptions, FileTags, ReviewStatusTag } from '@/components/Common';
import ReviewFileStatusTag from '@/components/Review/List/ReviewFileStatusTag';
import { isReviewFileDeleted } from '@/constants';
import { useDepartmentPath } from '@/hooks/useDepartmentPath';
import { useAuthStore } from '@/stores/authStore';
import type { FileItem } from '@/types';
import { ReviewStatus, UserRole } from '@/types';
import { getFileIcon, getFileTypeName } from '@/utils/Files';
import { formatFileSize } from '@/utils/format';
import { CloudDownload } from '@/icons';
import { Button, Drawer } from 'antd';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface FileDetailDrawerProps {
  open: boolean;
  data: FileItem | null;
  loading: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

const SCORE_VISIBLE_STATUSES: ReviewStatus[] = [ReviewStatus.APPROVED, ReviewStatus.ARCHIVED];

const FileDetailDrawer: React.FC<FileDetailDrawerProps> = ({
  open,
  data,
  loading,
  onClose,
  onRefresh,
}) => {
  const { getDepartmentPath } = useDepartmentPath();
  const { hasAnyRole } = useAuthStore();
  const fileDeleted = data ? isReviewFileDeleted(data) : false;
  const isReviewerOrAdmin = hasAnyRole([UserRole.REVIEWER, UserRole.SYSTEM_ADMIN]);
  const showScoreSections =
    data && SCORE_VISIBLE_STATUSES.includes(data.reviewStatus as ReviewStatus);

  const content = data
    ? [
        { label: '名称', value: data.name },
        {
          label: '类型',
          value: (
            <>
              {getFileIcon(data)}
              <span className={classNames('file-detail-drawer-track', styles['file-detail-drawer-track'])}>
                {data.type === 'FOLDER' ? '文件夹' : getFileTypeName(data.extension)}
              </span>
            </>
          ),
        },
        ...(data.size != null ? [{ label: '大小', value: formatFileSize(data.size) }] : []),
        { label: '所属部门', value: getDepartmentPath(data.departmentId, data.departmentName) },
        { label: '上传者', value: data.uploaderName },
        { label: '审核状态', value: <ReviewStatusTag status={data.reviewStatus} /> },
        { label: '文件状态', value: <ReviewFileStatusTag deletedAt={data.deletedAt} /> },
        ...(fileDeleted && data.deletedAt
          ? [
              {
                label: '删除时间',
                value: new Date(data.deletedAt).toLocaleString('zh-CN'),
              },
              {
                label: '删除人',
                value: data.deletedByName || '-',
              },
            ]
          : []),
        ...(data.version > 1 ? [{ label: '版本', value: `v${data.version}` }] : []),
        ...(data.tags && data.tags.length > 0
          ? [{ label: '标签', value: <FileTags tags={data.tags} empty={null} /> }]
          : []),
        {
          label: '创建时间',
          value: data.createdAt ? new Date(data.createdAt).toLocaleString('zh-CN') : '-',
        },
        {
          label: '更新时间',
          value: data.updatedAt ? new Date(data.updatedAt).toLocaleString('zh-CN') : '-',
        },
      ]
    : [];

  return (
    <Drawer title="文件详情" open={open} onClose={onClose} width={640} loading={loading}>
      {data && (
        <>
          <CommonDescriptions content={content} column={1} />
          <AiAssessmentTaskPanel
            fileId={data.id}
            assessment={data.aiAssessment}
            reviewStatus={data.reviewStatus}
          />
          {showScoreSections && isReviewerOrAdmin && (
            <PointBreakdownPanel
              baseScore={data.baseScore}
              qualityScore={data.qualityScore}
              effectScore={data.effectScore}
              behaviorScore={data.behaviorScore}
              totalScore={data.totalScore}
            />
          )}
          {!showScoreSections && (data.qualityScore ?? 0) > 0 && isReviewerOrAdmin && (
            <PointBreakdownPanel
              qualityScore={data.qualityScore}
              totalScore={data.totalScore}
              isQualityPreview
            />
          )}
          {showScoreSections && (
            <ExcellentCasePanel
              fileId={data.id}
              isExcellentCase={data.isExcellentCase}
              editable={isReviewerOrAdmin}
              onUpdated={onRefresh}
            />
          )}
          {showScoreSections && (
            <EffectStatsPanel
              fileId={data.id}
              effectScore={data.effectScore}
              effectStats={data.effectStats}
              onUpdated={onRefresh}
            />
          )}
          {data.type === 'FILE' && !fileDeleted && (
            <div className={classNames('file-detail-drawer-banner', styles['file-detail-drawer-banner'])}>
              <Button
                type="primary"
                icon={<CloudDownload />}
                onClick={() => fileHandlers.handleDownloadFile(data)}
              >
                下载文件
              </Button>
            </div>
          )}
        </>
      )}
    </Drawer>
  );
};

export default FileDetailDrawer;
