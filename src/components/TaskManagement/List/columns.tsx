import { SEMANTIC_COLORS, SemanticTag } from '@/components/Common';
import { TaskActionButtons } from '@/components/TaskManagement/Action';
import {
  ASSESSMENT_TASK_STATUS_LABEL,
  QUALITY_LEVEL_COLOR,
  QUALITY_LEVEL_LABEL,
} from '@/components/TaskManagement/constants/status';
import type { AssessmentTaskItem, AssessmentTaskStatus } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const STATUS_COLOR: Record<
  AssessmentTaskStatus,
  (typeof SEMANTIC_COLORS)[keyof typeof SEMANTIC_COLORS]
> = {
  PENDING: SEMANTIC_COLORS.DEFAULT,
  RUNNING: SEMANTIC_COLORS.INFO,
  COMPLETED: SEMANTIC_COLORS.SUCCESS,
  FAILED: SEMANTIC_COLORS.DANGER,
  CANCELLED: SEMANTIC_COLORS.WARNING,
};

interface GetColumnsOptions {
  onViewDetail: (record: AssessmentTaskItem) => void;
  onRefresh: () => void;
}

export function getColumns({
  onViewDetail,
  onRefresh,
}: GetColumnsOptions): ColumnsType<AssessmentTaskItem> {
  return [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      ellipsis: true,
      width: 240,
      render: (name: string, record) => <a onClick={() => onViewDetail(record)}>{name}</a>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v: AssessmentTaskStatus) => (
        <SemanticTag color={STATUS_COLOR[v]}>{ASSESSMENT_TASK_STATUS_LABEL[v]}</SemanticTag>
      ),
    },
    {
      title: '质量等级',
      key: 'level',
      width: 120,
      render: (_: unknown, record) =>
        record.result?.level ? (
          <SemanticTag color={QUALITY_LEVEL_COLOR[record.result.level] ?? SEMANTIC_COLORS.INFO}>
            {QUALITY_LEVEL_LABEL[record.result.level] ?? record.result.level}
          </SemanticTag>
        ) : (
          '-'
        ),
    },
    {
      title: '触发人',
      dataIndex: 'triggererName',
      key: 'triggererName',
      width: 150,
      render: (v: string | null) => v ?? '-',
    },
    {
      title: '重试次数',
      dataIndex: 'retryCount',
      key: 'retryCount',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '完成时间',
      dataIndex: 'finishedAt',
      key: 'finishedAt',
      width: 170,
      render: (v: string | null) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '错误信息',
      dataIndex: 'errorMsg',
      key: 'errorMsg',
      ellipsis: true,
      render: (v: string | null) => v ?? '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record) => (
        <TaskActionButtons record={record} onViewDetail={onViewDetail} onRefresh={onRefresh} />
      ),
    },
  ];
}
