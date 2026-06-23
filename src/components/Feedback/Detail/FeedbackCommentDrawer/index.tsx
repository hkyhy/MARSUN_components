import { feedbackApi } from '@/api';
import type { FeedbackItem } from '@/types';
import { Drawer, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import FeedbackComments from '../FeedbackComments';
import styles from './style.module.scss';
import classNames from 'classnames';

interface FeedbackCommentDrawerProps {
  open: boolean;
  record: FeedbackItem | null;
  onClose: () => void;
  onRefresh?: () => void;
}

/** 列表页评论抽屉：查看与发表评论 */
const FeedbackCommentDrawer: React.FC<FeedbackCommentDrawerProps> = ({
  open,
  record,
  onClose,
  onRefresh,
}) => {
  const [detail, setDetail] = useState<FeedbackItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!record?.id) return;
    setLoading(true);
    try {
      const res = (await feedbackApi.get(record.id)) as unknown as { data: FeedbackItem };
      setDetail(res.data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [record?.id]);

  useEffect(() => {
    if (open && record) {
      fetchDetail();
    } else if (!open) {
      setDetail(null);
    }
  }, [open, record, fetchDetail]);

  const handleRefresh = () => {
    fetchDetail();
    onRefresh?.();
  };

  return (
    <Drawer
      title={record ? `评论 · ${record.title}` : '评论'}
      open={open}
      onClose={onClose}
      width={480}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {detail ? (
          <FeedbackComments detail={detail} onRefresh={handleRefresh} />
        ) : (
          !loading && <div className={classNames('feedback-comment-drawer-empty-state', styles['feedback-comment-drawer-empty-state'])}>暂无数据</div>
        )}
      </Spin>
    </Drawer>
  );
};

export default FeedbackCommentDrawer;
