import { REVIEW_STATUS_LABEL_MAP } from '@/constants';
import { useDepartmentPath } from '@/hooks/useDepartmentPath';
import { Send } from '@/icons';
import { Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';
import type { BroadcastItem } from '../types';

interface RealtimeBroadcastProps {
  data: BroadcastItem[];
}

const RealtimeBroadcast: React.FC<RealtimeBroadcastProps> = ({ data }) => {
  const { getDepartmentPath } = useDepartmentPath();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 自动轮播
  useEffect(() => {
    if (data.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [data.length]);

  const current = data[currentIndex];

  if (!current || data.length === 0) {
    return (
      <div className={classNames('realtime-broadcast-root', styles['realtime-broadcast-root'])}>
        <div className={classNames('realtime-broadcast-container', styles['realtime-broadcast-container'], 'broadcast-title-accent', styles['realtime-broadcast-broadcast-title-accent'])}>
          <Send />
          【实时投递动态播报】
        </div>
        <span className={classNames('realtime-broadcast-main', styles['realtime-broadcast-main'])}>暂无最新投递记录</span>
      </div>
    );
  }

  return (
    <div className={classNames('realtime-broadcast-root', styles['realtime-broadcast-root'])}>
      {/* 左侧标题 */}
      <div className={classNames('realtime-broadcast-container', styles['realtime-broadcast-container'])}>
        <Send className={classNames('realtime-broadcast-wrapper', styles['realtime-broadcast-wrapper'])} />
        <span className={classNames('realtime-broadcast-inner', styles['realtime-broadcast-inner'])}>【实时投递动态播报】</span>
      </div>

      {/* 中间内容轮播区 */}
      <div className={classNames('realtime-broadcast-header', styles['realtime-broadcast-header'])}>
        <Spin spinning={false}>
          <div key={current.id} className={classNames('realtime-broadcast-body', styles['realtime-broadcast-body'])}>
            <span className={classNames('realtime-broadcast-footer', styles['realtime-broadcast-footer'])}>→ </span>
            {getDepartmentPath(current.departmentId, current.departmentName)}{' '}
            <span className={classNames('realtime-broadcast-row', styles['realtime-broadcast-row'])}>{current.uploaderName}</span> 提报了：
            <span className={classNames('realtime-broadcast-col', styles['realtime-broadcast-col'])} title={current.fileName}>
              《{current.fileName}》
            </span>
          </div>
        </Spin>
      </div>

      {/* 右侧流程状态 */}
      <Tag
        color={
          current.reviewStatus?.includes('PENDING')
            ? 'processing'
            : current.reviewStatus?.includes('REVIEWING')
              ? 'blue'
              : current.reviewStatus === 'APPROVED'
                ? 'success'
                : current.reviewStatus?.includes('REJECT')
                  ? 'error'
                  : 'warning'
        }
        icon={<Send />}
        className={classNames('realtime-broadcast-wrap', styles['realtime-broadcast-wrap'])}
      >
        流程：
        {REVIEW_STATUS_LABEL_MAP[current.reviewStatus as keyof typeof REVIEW_STATUS_LABEL_MAP] ??
          '流转中'}
      </Tag>

      {/* 指示器 */}
      {data.length > 1 && (
        <div className={classNames('realtime-broadcast-panel', styles['realtime-broadcast-panel'])}>
          {data.map((_, i) => (
            <span
              key={i}
              className={classNames('realtime-broadcast-cell', styles['realtime-broadcast-cell'],
                i === currentIndex && 'realtime-broadcast-cell-active',
                i === currentIndex && styles['realtime-broadcast-cell-active'],
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RealtimeBroadcast;
