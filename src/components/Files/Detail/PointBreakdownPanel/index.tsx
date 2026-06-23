import { Card, Descriptions } from 'antd';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface PointBreakdownPanelProps {
  baseScore?: number;
  qualityScore?: number;
  effectScore?: number;
  behaviorScore?: number;
  totalScore?: number;
  /** 审核前质量分预览 */
  isQualityPreview?: boolean;
}

const PointBreakdownPanel: React.FC<PointBreakdownPanelProps> = ({
  baseScore = 0,
  qualityScore = 0,
  effectScore = 0,
  behaviorScore = 0,
  totalScore = 0,
  isQualityPreview = false,
}) => {
  if (isQualityPreview) {
    return (
      <Card size="small" title="积分详情（预览）" className={classNames('point-breakdown-panel-panel-card', styles['point-breakdown-panel-panel-card'])}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="质量分（预估）">{qualityScore} 分</Descriptions.Item>
          <Descriptions.Item label="总积分">
            <span className={classNames('point-breakdown-panel-muted-score', styles['point-breakdown-panel-muted-score'])}>{totalScore} 分（审核通过后正式计分）</span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }

  return (
    <Card size="small" title="积分详情" className={classNames('point-breakdown-panel-panel-card', styles['point-breakdown-panel-panel-card'])}>
      <Descriptions column={2} size="small">
        <Descriptions.Item label="基础分">{baseScore} 分</Descriptions.Item>
        <Descriptions.Item label="质量分">{qualityScore} 分</Descriptions.Item>
        <Descriptions.Item label="效果分">{effectScore} 分</Descriptions.Item>
        <Descriptions.Item label="行为分">{behaviorScore} 分</Descriptions.Item>
        <Descriptions.Item label="总积分" span={2}>
          <span className={classNames('point-breakdown-panel-total-score', styles['point-breakdown-panel-total-score'])}>{totalScore} 分</span>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default PointBreakdownPanel;
