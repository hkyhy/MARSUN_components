import { ReviewStatusTag, SEMANTIC_COLORS, SemanticTag } from '@/components/Common/Tag';
import { useAuthStore } from '@/stores/authStore';
import {
  CircleCheck,
  Clock,
  CircleX,
  Download,
  Undo2,
  Send,
  ArrowLeftRight,
  Upload as UploadIcon,
} from '@/icons';
import { Card, Empty, Image, Timeline, Upload } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

export interface ReviewTimelineItem {
  id: string;
  action: string;
  status: string;
  version: number;
  reviewerName: string | null;
  transferToName: string | null;
  baseScore: number | null;
  qualityScore: number | null;
  totalScore: number | null;
  dimensionScores: Record<string, number> | null;
  comment: string | null;
  reason: string | null;
  meta: {
    storagePath?: string;
    fileName?: string;
    previousStoragePath?: string;
    previousFileName?: string;
    currentStoragePath?: string;
    currentFileName?: string;
  } | null;
  createdAt: string;
}

export const ACTION_CONFIG: Record<
  string,
  { label: string; color: string; timelineColor: string; icon: React.ReactNode }
> = {
  SUBMIT: { label: '提交审核', color: SEMANTIC_COLORS.INFO, timelineColor: 'blue', icon: <Send /> },
  REVOKE: { label: '撤销审核', color: SEMANTIC_COLORS.DEFAULT, timelineColor: 'gray', icon: <Undo2 /> },
  APPROVE: { label: '通过', color: SEMANTIC_COLORS.SUCCESS, timelineColor: 'green', icon: <CircleCheck /> },
  REJECT: { label: '驳回', color: SEMANTIC_COLORS.DANGER, timelineColor: 'red', icon: <CircleX /> },
  RETURN: { label: '退回修改', color: SEMANTIC_COLORS.WARNING, timelineColor: 'orange', icon: <Undo2 /> },
  TRANSFER: { label: '转审', color: SEMANTIC_COLORS.PROCESSING, timelineColor: 'blue', icon: <ArrowLeftRight /> },
  REUPLOAD: { label: '重新上传', color: SEMANTIC_COLORS.CYAN, timelineColor: 'cyan', icon: <UploadIcon /> },
  ARCHIVE: { label: '归档', color: SEMANTIC_COLORS.DEFAULT, timelineColor: 'gray', icon: <CircleCheck /> },
};

export function getRecordDownloadUrl(recordId: string, type: 'current' | 'previous') {
  const token = useAuthStore.getState().token || '';
  return `/api/reviews/record/${recordId}/download/${type}?token=${encodeURIComponent(token)}`;
}

export function canPreviewAsImage(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
}

function hasFileLink(item: ReviewTimelineItem) {
  if (item.action === 'REUPLOAD') return true;
  if (['SUBMIT', 'REVOKE'].includes(item.action) && item.meta?.storagePath) return true;
  return false;
}

interface ReviewTimelineProps {
  timeline: ReviewTimelineItem[];
  emptyText?: string;
}

// 审核时间线
const ReviewTimeline: React.FC<ReviewTimelineProps> = ({
  timeline,
  emptyText = '暂无审核记录',
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  return (
    <Card
      title="审核流程"
      size="small"
      styles={{ body: { height: 'calc(100vh - 210px)', overflowY: 'auto', padding: '24px 12px' } }}
    >
      {timeline.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
      ) : (
        <>
          <Timeline
            items={timeline.map((item) => {
              const cfg = ACTION_CONFIG[item.action] || {
                label: item.action,
                color: SEMANTIC_COLORS.DEFAULT,
                timelineColor: 'gray',
                icon: <Clock />,
              };
              return {
                color: cfg.timelineColor,
                dot: cfg.icon,
                children: (
                  <div className={classNames('review-timeline-timeline-item', styles['review-timeline-timeline-item'])}>
                    <div className={classNames('review-timeline-timeline-header', styles['review-timeline-timeline-header'])}>
                      <SemanticTag color={cfg.color}>{cfg.label}</SemanticTag>
                      <span className={classNames('review-timeline-timeline-time', styles['review-timeline-timeline-time'])}>
                        {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                      {item.version > 0 && (
                        <SemanticTag className={classNames('review-timeline-timeline-status-change-small', styles['review-timeline-timeline-status-change-small'])}>
                          V{item.version}
                        </SemanticTag>
                      )}
                    </div>
                    <div className={classNames('review-timeline-timeline-operator', styles['review-timeline-timeline-operator'])}>
                      <span>
                        {['SUBMIT', 'REVOKE', 'REUPLOAD'].includes(item.action)
                          ? '操作人'
                          : '审核人'}
                        ：{item.reviewerName || '-'}
                      </span>
                      {item.action === 'TRANSFER' && item.transferToName && (
                        <span> → 转审给：{item.transferToName}</span>
                      )}
                    </div>
                    {item.comment && (
                      <div className={classNames('review-timeline-timeline-comment', styles['review-timeline-timeline-comment'])}>意见：{item.comment}</div>
                    )}
                    {item.reason && (
                      <div className={classNames('review-timeline-timeline-comment', styles['review-timeline-timeline-comment'])}>原因：{item.reason}</div>
                    )}

                    {/* 文件版本链接 */}
                    {hasFileLink(item) && (
                      <div className={classNames('review-timeline-timeline-file-links', styles['review-timeline-timeline-file-links'])}>
                        {item.action === 'REUPLOAD' && (
                          <Upload
                            listType="picture-card"
                            action=""
                            fileList={[
                              {
                                uid: `prev-${item.id}`,
                                name: `修改前 - ${item.meta?.previousFileName || '文件'}`,
                                status: 'done',
                                url: getRecordDownloadUrl(item.id, 'previous'),
                                thumbUrl: canPreviewAsImage(item.meta?.previousFileName || '')
                                  ? getRecordDownloadUrl(item.id, 'previous')
                                  : undefined,
                              },
                              {
                                uid: `curr-${item.id}`,
                                name: `修改后 - ${item.meta?.currentFileName || '文件'}`,
                                status: 'done',
                                url: getRecordDownloadUrl(item.id, 'current'),
                                thumbUrl: canPreviewAsImage(item.meta?.currentFileName || '')
                                  ? getRecordDownloadUrl(item.id, 'current')
                                  : undefined,
                              },
                            ]}
                            onPreview={(file) => {
                              if (canPreviewAsImage(file.name)) {
                                setPreviewImage(file.url || '');
                                setPreviewOpen(true);
                              } else {
                                window.open(file.url, '_blank');
                              }
                            }}
                            onDownload={(file) => {
                              window.open(file.url, '_blank');
                            }}
                            showUploadList={{
                              showPreviewIcon: true,
                              showDownloadIcon: true,
                              showRemoveIcon: false,
                            }}
                          />
                        )}
                        {item.action !== 'REUPLOAD' && item.meta?.storagePath && (
                          <a
                            href={getRecordDownloadUrl(item.id, 'current')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classNames('review-timeline-download-link', styles['review-timeline-download-link'])}
                          >
                            <Download /> 查看文件
                          </a>
                        )}
                      </div>
                    )}

                    <div className={classNames('review-timeline-timeline-status-change', styles['review-timeline-timeline-status-change'])}>
                      状态变更为 <ReviewStatusTag status={item.status} />
                    </div>
                  </div>
                ),
              };
            })}
          />
          <Image
            style={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
            }}
            src={previewImage}
          />
        </>
      )}
    </Card>
  );
};

export default ReviewTimeline;
