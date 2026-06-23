import SemanticTag, { SEMANTIC_COLORS } from '@/components/Common/Tag/SemanticTag';
import type { AiAssessment } from '@/types';
import { isAiAssessmentFailed } from '@/utils/points/assessment';
import { RefreshCw } from '@/icons';
import { Button, Collapse, Typography } from 'antd';
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

export interface FileItemAiAssessmentProps {
  assessment?: AiAssessment | null;
  fileId?: string;
  reassessing?: boolean;
  onReassess?: (fileId: string) => void;
}

const FileItemAiAssessment: React.FC<FileItemAiAssessmentProps> = ({
  assessment,
  fileId,
  reassessing = false,
  onReassess,
}) => {
  const failed = isAiAssessmentFailed(assessment);
  const isContentUnavailable = assessment?.contentUnavailable === true;
  const levelInfo =
    assessment && !failed && !isContentUnavailable ? LEVEL_MAP[assessment.level] : null;

  const handleReassess = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reassessing || !fileId || !onReassess) return;
    onReassess(fileId);
  };

  return (
    <Collapse
      size="small"
      bordered={false}
      collapsible={reassessing ? 'disabled' : undefined}
      className={classNames('file-item-ai-assessment-card', styles['file-item-ai-assessment-card'])}
      items={[
        {
          key: 'ai-assessment',
          label: (
            <span className={classNames('file-item-ai-assessment-item', styles['file-item-ai-assessment-item'])}>
              <span className={classNames('file-item-ai-assessment-link', styles['file-item-ai-assessment-link'])}>AI 质量评估</span>
              {levelInfo && <SemanticTag color={levelInfo.color}>{levelInfo.label}</SemanticTag>}
              {isContentUnavailable && (
                <SemanticTag color={SEMANTIC_COLORS.WARNING}>待人工评估</SemanticTag>
              )}
              {failed && <SemanticTag color={SEMANTIC_COLORS.DEFAULT}>评估失败</SemanticTag>}
            </span>
          ),
          extra:
            failed && fileId && onReassess ? (
              <Button
                type="link"
                size="small"
                icon={<RefreshCw />}
                loading={reassessing}
                onClick={handleReassess}
                className={classNames('file-item-ai-assessment-label', styles['file-item-ai-assessment-label'])}
              >
                重新评估
              </Button>
            ) : undefined,
          children: failed ? (
            <Text type="secondary" className={classNames('file-item-ai-assessment-value', styles['file-item-ai-assessment-value'])}>
              {assessment?.summary || '暂无 AI 质量评估结果，请点击重新评估'}
            </Text>
          ) : (
            <div className={classNames('file-item-ai-assessment-meta', styles['file-item-ai-assessment-meta'])}>
              <Paragraph className={classNames('file-item-ai-assessment-icon', styles['file-item-ai-assessment-icon'])}>{assessment!.summary}</Paragraph>
              {assessment!.dimensions && (
                <div className={classNames('file-item-ai-assessment-title', styles['file-item-ai-assessment-title'])}>
                  {assessment!.dimensions.completeness && (
                    <div>
                      <Text type="secondary">完整性：</Text>
                      {assessment!.dimensions.completeness}
                    </div>
                  )}
                  {assessment!.dimensions.clarity && (
                    <div>
                      <Text type="secondary">逻辑清晰度：</Text>
                      {assessment!.dimensions.clarity}
                    </div>
                  )}
                  {assessment!.dimensions.practicalValue && (
                    <div>
                      <Text type="secondary">实践价值：</Text>
                      {assessment!.dimensions.practicalValue}
                    </div>
                  )}
                  {assessment!.dimensions.formatting && (
                    <div>
                      <Text type="secondary">格式规范性：</Text>
                      {assessment!.dimensions.formatting}
                    </div>
                  )}
                </div>
              )}
              <Text type="secondary" className={classNames('file-item-ai-assessment-desc', styles['file-item-ai-assessment-desc'])}>
                评估时间：{new Date(assessment!.assessedAt).toLocaleString('zh-CN')}
              </Text>
            </div>
          ),
        },
      ]}
    />
  );
};

export default FileItemAiAssessment;
