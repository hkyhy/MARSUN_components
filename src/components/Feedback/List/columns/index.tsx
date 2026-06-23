import { SemanticTag } from '@/components/Common';
import type { FeedbackItem } from '@/types';
import { MessageSquare } from '@/icons';
import { Badge, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { FeedbackActionButtons } from '../../Action';
import { CATEGORY_MAP, FEEDBACK_STATUS_MAP, PRIORITY_MAP } from '../../constants';
import styles from './style.module.scss';
import classNames from 'classnames';

interface GetColumnsOptions {
  getDepartmentPath: (departmentId?: string | null, fallback?: string) => string;
  onDetail: (record: FeedbackItem) => void;
  onProcess: (record: FeedbackItem) => void;
  onProcessComplete: (record: FeedbackItem) => void;
  onClose: (record: FeedbackItem) => void;
  onReopen: (record: FeedbackItem) => void;
  onAssign: (record: FeedbackItem) => void;
  onTransfer: (record: FeedbackItem) => void;
  onPriorityChange: (record: FeedbackItem) => void;
  onDelete: (record: FeedbackItem) => void;
  onEdit: (record: FeedbackItem) => void;
  onComment: (record: FeedbackItem) => void;
  /** 已处理/已关闭 Tab 不显示操作列 */
  hideAction?: boolean;
}

export function getColumns({
  getDepartmentPath,
  onDetail,
  onProcess,
  onProcessComplete,
  onClose,
  onReopen,
  onAssign,
  onTransfer,
  onPriorityChange,
  onDelete,
  onEdit,
  onComment,
  hideAction = false,
}: GetColumnsOptions): ColumnsType<FeedbackItem> {
  const cols: ColumnsType<FeedbackItem> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string, record: FeedbackItem) => (
        <a onClick={() => onDetail(record)} className={classNames('columns-title-link', styles['columns-title-link'])}>
          {title}
        </a>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (v: string) => {
        const map = CATEGORY_MAP[v];
        return map ? (
          <SemanticTag color={map.color}>{map.label}</SemanticTag>
        ) : (
          <SemanticTag>{v}</SemanticTag>
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (v: string) => {
        const map = PRIORITY_MAP[v];
        return map ? <SemanticTag color={map.color}>{map.label}</SemanticTag> : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v: string) => {
        const map = FEEDBACK_STATUS_MAP[v];
        return map ? <SemanticTag color={map.color}>{map.label}</SemanticTag> : '-';
      },
    },
    {
      title: '提交人',
      dataIndex: 'creatorName',
      key: 'creatorName',
      width: 90,
    },
    {
      title: '部门',
      dataIndex: 'creatorDept',
      key: 'creatorDept',
      width: 200,
      render: (_: unknown, record: FeedbackItem) =>
        getDepartmentPath(record.creatorDeptId, record.creatorDept) || record.creatorDept || '-',
    },
    {
      title: '负责人',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 90,
      render: (v: string) => v || '-',
    },
    {
      title: '评论',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 88,
      render: (v: number, record) => (
        <Tooltip title={v > 0 ? `查看 ${v} 条评论` : '查看评论'}>
          <a
            className={classNames('columns-comment-link', styles['columns-comment-link'])}
            onClick={(e) => {
              e.stopPropagation();
              onComment(record);
            }}
          >
            <Badge count={v} size="small" overflowCount={99} showZero={false}>
              <MessageSquare />
            </Badge>
            <span className={classNames('columns-comment-count', styles['columns-comment-count'])}>{v > 0 ? `${v}条` : '评论'}</span>
          </a>
        </Tooltip>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (v: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-'),
    },
  ];

  if (!hideAction) {
    cols.push({
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <FeedbackActionButtons
          record={record}
          onProcess={onProcess}
          onProcessComplete={onProcessComplete}
          onClose={onClose}
          onReopen={onReopen}
          onAssign={onAssign}
          onTransfer={onTransfer}
          onPriorityChange={onPriorityChange}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ),
    });
  }

  return cols;
}
