import { CommonDescriptions, FileTags, SEMANTIC_COLORS, SemanticTag } from '@/components/Common';
import { ReviewStatusTag } from '@/components/Common/Tag';
import { AiAssessmentTaskPanel } from '@/components/Files/Detail';
import ReviewFileStatusTag from '@/components/Review/List/ReviewFileStatusTag';
import { isReviewFileDeleted } from '@/constants';
import { getFileIconByExtension, getFileTypeName } from '@/utils/Files';
import { formatFileSize } from '@/utils/format';
import dayjs from 'dayjs';
import React from 'react';
import type { ReviewTimelineItem } from '../ReviewTimeline';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ReviewDetailData {
  file: {
    id: string;
    name: string;
    extension?: string | null;
    size?: number | null;
    mimeType?: string | null;
    departmentId: string;
    departmentName: string;
    uploaderId?: string;
    uploaderName: string;
    reviewStatus: string;
    fileScope?: 'DEPARTMENT' | 'PUBLIC';
    version: number;
    tags?: string[];
    description?: string | null;
    isImportant?: boolean;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string | null;
    deletedByName?: string | null;
    aiAssessment?: import('@/types').AiAssessment | null;
  };
  timeline: ReviewTimelineItem[];
}

export { type ReviewDetailData };

interface ReviewDetailContentProps {
  detail: ReviewDetailData;
  getDepartmentPath?: (departmentId?: string | null, fallback?: string) => string;
}

const formatDateTime = (value?: string | null) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-';

// 文件基本信息
const ReviewDetailContent: React.FC<ReviewDetailContentProps> = ({ detail, getDepartmentPath }) => {
  const { file } = detail;
  const fileDeleted = isReviewFileDeleted(file);

  return (
    <div className={classNames('review-detail-content-detail-section', styles['review-detail-content-detail-section'])}>
      <CommonDescriptions
        column={2}
        content={[
          {
            label: '文件名',
            value: (
              <span
                className={classNames('review-detail-content-file-name-row', styles['review-detail-content-file-name-row'],
                  fileDeleted && 'review-detail-content-file-name-deleted',
                  fileDeleted && styles['review-detail-content-file-name-deleted'],
                )}
              >
                {getFileIconByExtension(file.extension ?? undefined)}
                {file.name}
              </span>
            ),
            span: 2,
          },
          { label: '文件类型', value: getFileTypeName(file.extension ?? undefined) },
          ...(file.size != null ? [{ label: '文件大小', value: formatFileSize(file.size) }] : []),
          {
            label: '所属部门',
            value:
              getDepartmentPath?.(file.departmentId, file.departmentName) ||
              file.departmentName ||
              '-',
            span: file.size == null ? 2 : 1,
          },
          { label: '上传者', value: file.uploaderName },
          { label: '审核状态', value: <ReviewStatusTag status={file.reviewStatus} /> },
          {
            label: '文件状态',
            value: (
              <ReviewFileStatusTag deletedAt={file.deletedAt} deletedByName={file.deletedByName} />
            ),
          },
          ...(fileDeleted && file.deletedAt
            ? [
                { label: '删除时间', value: formatDateTime(file.deletedAt) },
                { label: '删除人', value: file.deletedByName || '-' },
              ]
            : []),
          { label: '版本', value: `V${file.version}` },
          ...(file.isImportant
            ? [
                {
                  label: '重要文件',
                  value: <SemanticTag color={SEMANTIC_COLORS.WARNING}>是</SemanticTag>,
                },
              ]
            : []),
          {
            label: '标签',
            value: <FileTags tags={file.tags} />,
            span: 2,
          },
          ...(file.description ? [{ label: '描述', value: file.description, span: 2 }] : []),
          { label: '创建时间', value: formatDateTime(file.createdAt) },
          { label: '更新时间', value: formatDateTime(file.updatedAt) },
        ]}
      />
      <AiAssessmentTaskPanel
        fileId={file.id}
        assessment={file.aiAssessment}
        reviewStatus={file.reviewStatus}
      />
    </div>
  );
};

export default ReviewDetailContent;
