import SemanticTag, { SEMANTIC_COLORS } from '@/components/Common/Tag/SemanticTag';
import type { AiAssessment, AssessmentTaskStatus } from '@/types';
import { Loader2 } from '@/icons';
import { Card, Spin, Typography } from 'antd';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

const { Text, Paragraph } = Typography;

const LEVEL_MAP: Record<
  AiAssessment['level'],
  { label: string; color: (typeof SEMANTIC_COLORS)[keyof typeof SEMANTIC_COLORS] }
> = {
  high: { label: '极高质量', color: SEMANTIC_COLORS.SUCCESS },
  medium: { label: '高质量', color: SEMANTIC_COLORS.INFO },
  low: { label: '中等质量', color: SEMANTIC_COLORS.WARNING },
};

interface AiAssessmentPanelProps {
  assessment?: AiAssessment | null;
  taskStatus?: AssessmentTaskStatus | null;
  /** 草稿/已撤销：提示提交后评估 */
  pendingHint?: 'pending_submit';
  title?: string;
}

const AiAssessmentPanel: React.FC<AiAssessmentPanelProps> = ({
  assessment,
  taskStatus,
  pendingHint,
  title = 'AI 评估（质量评估）',
}) => {
  if (!assessment) {
    if (taskStatus === 'PENDING' || taskStatus === 'RUNNING') {
      return (
        <Card size="small" title={title} className={classNames('ai-assessment-panel-panel-card', styles['ai-assessment-panel-panel-card'])}>
          <div className={classNames('ai-assessment-panel-loading-row', styles['ai-assessment-panel-loading-row'])}>
            <Spin indicator={<Loader2 spin />} size="small" />
            <Text>AI 质量评估进行中，请稍候…</Text>
          </div>
        </Card>
      );
    }

    if (taskStatus === 'FAILED') {
      return (
        <Card size="small" title={title} className={classNames('ai-assessment-panel-panel-card', styles['ai-assessment-panel-panel-card'])}>
          <SemanticTag color={SEMANTIC_COLORS.DANGER}>评估失败</SemanticTag>
          <Paragraph type="secondary" className={classNames('ai-assessment-panel-fail-hint', styles['ai-assessment-panel-fail-hint'])}>
            请联系管理员在「任务管理」中重新运行评估任务。
          </Paragraph>
        </Card>
      );
    }

    if (pendingHint === 'pending_submit') {
      return (
        <Card size="small" title={title} className={classNames('ai-assessment-panel-panel-card', styles['ai-assessment-panel-panel-card'])}>
          <Text type="secondary">提交审核后将自动进行 AI 质量评估</Text>
        </Card>
      );
    }

    return (
      <Card size="small" title={title} className={classNames('ai-assessment-panel-panel-card', styles['ai-assessment-panel-panel-card'])}>
        <Text type="secondary">暂无 AI 质量评估结果</Text>
      </Card>
    );
  }

  const isContentUnavailable = assessment.contentUnavailable === true;
  const levelInfo = isContentUnavailable ? null : LEVEL_MAP[assessment.level];

  return (
    <Card size="small" title={title} className={classNames('ai-assessment-panel-panel-card', styles['ai-assessment-panel-panel-card'])}>
      <div className={classNames('ai-assessment-panel-level-row', styles['ai-assessment-panel-level-row'])}>
        <Text type="secondary">质量等级：</Text>
        {levelInfo ? (
          <SemanticTag color={levelInfo.color}>{levelInfo.label}</SemanticTag>
        ) : (
          <SemanticTag color={SEMANTIC_COLORS.WARNING}>待人工评估</SemanticTag>
        )}
        {assessment.fallback && <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>默认评估</SemanticTag>}
      </div>
      <Paragraph className={classNames('ai-assessment-panel-summary-paragraph', styles['ai-assessment-panel-summary-paragraph'])}>{assessment.summary}</Paragraph>
      {assessment.dimensions && (
        <div className={classNames('ai-assessment-panel-dimension-list', styles['ai-assessment-panel-dimension-list'])}>
          {assessment.dimensions.completeness && (
            <div>
              <Text type="secondary">完整性：</Text>
              {assessment.dimensions.completeness}
            </div>
          )}
          {assessment.dimensions.clarity && (
            <div>
              <Text type="secondary">逻辑清晰度：</Text>
              {assessment.dimensions.clarity}
            </div>
          )}
          {assessment.dimensions.practicalValue && (
            <div>
              <Text type="secondary">实践价值：</Text>
              {assessment.dimensions.practicalValue}
            </div>
          )}
          {assessment.dimensions.formatting && (
            <div>
              <Text type="secondary">格式规范性：</Text>
              {assessment.dimensions.formatting}
            </div>
          )}
        </div>
      )}
      <Text type="secondary" className={classNames('ai-assessment-panel-assessed-at', styles['ai-assessment-panel-assessed-at'])}>
        评估时间：{new Date(assessment.assessedAt).toLocaleString('zh-CN')}
      </Text>
    </Card>
  );
};

export default AiAssessmentPanel;
