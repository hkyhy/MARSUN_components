import { CommonDescriptions, SemanticTag } from '@/components/Common';
import { useDepartmentPath } from '@/hooks/useDepartmentPath';
import type { FeedbackItem } from '@/types';
import { Card } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { CATEGORY_MAP, FEEDBACK_STATUS_MAP, PRIORITY_MAP } from '../constants';

interface FeedbackInfoProps {
  detail: FeedbackItem;
}

/** 反馈基本信息展示 */
const FeedbackInfo: React.FC<FeedbackInfoProps> = ({ detail }) => {
  const { getDepartmentPath } = useDepartmentPath();

  return (
    <Card title="反馈信息" size="small">
      <CommonDescriptions
        content={[
          { label: '标题', value: detail.title },
          { label: '提交人', value: detail.creatorName },
          {
            label: '部门',
            value: getDepartmentPath(detail.creatorDeptId, detail.creatorDept) || '-',
          },
          {
            label: '分类',
            value: (() => {
              const map = CATEGORY_MAP[detail.category];
              return map ? <SemanticTag color={map.color}>{map.label}</SemanticTag> : '-';
            })(),
          },
          {
            label: '状态',
            value: (() => {
              const map = FEEDBACK_STATUS_MAP[detail.status];
              return map ? <SemanticTag color={map.color}>{map.label}</SemanticTag> : '-';
            })(),
          },
          {
            label: '优先级',
            value: (() => {
              const map = PRIORITY_MAP[detail.priority];
              return map ? <SemanticTag color={map.color}>{map.label}</SemanticTag> : '-';
            })(),
          },
          { label: '负责人', value: detail.assigneeName || '-' },
          { label: '提交时间', value: dayjs(detail.createdAt).format('YYYY-MM-DD HH:mm:ss') },
          { label: '详细描述', value: detail.content || '-', span: 2 },
          ...(detail.resolution
            ? [{ label: '解决方法/关闭原因', value: detail.resolution, span: 2 as const }]
            : []),
        ]}
      />
    </Card>
  );
};

export default FeedbackInfo;
