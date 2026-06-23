import { SemanticTag } from '@/components/Common';
import type { FeedbackRecord } from '@/types';
import {
  CircleCheck,
  Clock,
  CircleX,
  Flag,
  CirclePlay,
  ArrowLeftRight,
  Undo2,
  UserPlus,
} from '@/icons';
import { Card, Empty, Timeline } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { FEEDBACK_ACTION_MAP, FEEDBACK_STATUS_MAP } from '../../constants';
import styles from './style.module.scss';
import classNames from 'classnames';

const ACTION_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PROCESS: {
    label: '开始处理',
    color: FEEDBACK_ACTION_MAP.PROCESS!.color,
    icon: <CirclePlay />,
  },
  PROCESSED: {
    label: '处理完成',
    color: FEEDBACK_ACTION_MAP.PROCESSED!.color,
    icon: <CircleCheck />,
  },
  CLOSE: { label: '关闭', color: FEEDBACK_ACTION_MAP.CLOSE!.color, icon: <CircleX /> },
  REOPEN: { label: '重新打开', color: FEEDBACK_ACTION_MAP.REOPEN!.color, icon: <Undo2 /> },
  ASSIGN: {
    label: '指定负责人',
    color: FEEDBACK_ACTION_MAP.ASSIGN!.color,
    icon: <UserPlus />,
  },
  TRANSFER: { label: '转交', color: FEEDBACK_ACTION_MAP.TRANSFER!.color, icon: <ArrowLeftRight /> },
  PRIORITY_CHANGE: {
    label: '修改优先级',
    color: FEEDBACK_ACTION_MAP.PRIORITY_CHANGE!.color,
    icon: <Flag />,
  },
};

interface FeedbackTimelineProps {
  records: FeedbackRecord[];
}

const FeedbackTimeline: React.FC<FeedbackTimelineProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <Card
        title="处理流程"
        size="small"
        styles={{ body: { height: 'calc(100vh - 210px)', overflowY: 'auto' } }}
      >
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无处理记录" />
      </Card>
    );
  }

  return (
    <Card
      title="处理流程"
      size="small"
      styles={{ body: { height: 'calc(100vh - 210px)', overflowY: 'auto', padding: '24px 12px' } }}
    >
      <Timeline
        items={records.map((item) => {
          const cfg = ACTION_CONFIG[item.action] || {
            label: item.action,
            color: 'default' as const,
            icon: <Clock />,
          };
          return {
            color: cfg.color,
            dot: cfg.icon,
            children: (
              <div className={classNames('feedback-timeline-timeline-item', styles['feedback-timeline-timeline-item'])}>
                <div className={classNames('feedback-timeline-timeline-header', styles['feedback-timeline-timeline-header'])}>
                  <SemanticTag color={cfg.color}>{cfg.label}</SemanticTag>
                  <span className={classNames('feedback-timeline-timeline-time', styles['feedback-timeline-timeline-time'])}>
                    {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                  </span>
                </div>
                <div className={classNames('feedback-timeline-timeline-operator', styles['feedback-timeline-timeline-operator'])}>操作人：{item.operatorName || '-'}</div>
                {item.toStatus && (
                  <div className={classNames('feedback-timeline-timeline-status-change', styles['feedback-timeline-timeline-status-change'])}>
                    状态变更为{' '}
                    <SemanticTag
                      color={FEEDBACK_STATUS_MAP[item.toStatus]?.color}
                      className={classNames('feedback-timeline-tag-small', styles['feedback-timeline-tag-small'])}
                    >
                      {FEEDBACK_STATUS_MAP[item.toStatus]?.label || item.toStatus}
                    </SemanticTag>
                  </div>
                )}
                {(item.action === 'ASSIGN' || item.action === 'TRANSFER') &&
                  item.toAssigneeName && (
                    <div className={classNames('feedback-timeline-timeline-status-change', styles['feedback-timeline-timeline-status-change'])}>
                      {item.action === 'ASSIGN' ? '指定' : '转交'}给：{item.toAssigneeName}
                    </div>
                  )}
                {item.comment && (
                  <div className={classNames('feedback-timeline-timeline-comment', styles['feedback-timeline-timeline-comment'])}>
                    {item.comment}
                  </div>
                )}
              </div>
            ),
          };
        })}
      />
    </Card>
  );
};

export default FeedbackTimeline;
