import { FileTags, ReviewStatusTag } from '@/components/Common';
import { isReviewFileDeleted } from '@/constants';
import type { ReviewListItem } from '@/types';
import { getFileIconByExtension, getFileTypeName } from '@/utils/Files';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { NavigateFunction } from 'react-router-dom';
import { ReviewActionButtons, type ReviewActionMode } from '../../Action';
import type { ReviewMode } from '../../constants';
import ReviewFileStatusTag from '../ReviewFileStatusTag';
import styles from './style.module.scss';
import classNames from 'classnames';

interface GetColumnsOptions {
  mode?: ReviewMode;
  navigate: NavigateFunction;
  onActionComplete: () => void;
  /** 审核人操作回调（打开 Modal） */
  onReviewAction: (
    action: 'approve' | 'reject' | 'return' | 'transfer',
    record: ReviewListItem,
  ) => void;
  /** 重新上传回调 */
  onReupload: (record: ReviewListItem) => void;
  /** 获取部门完整路径 */
  getDepartmentPath?: (departmentId?: string | null, fallback?: string) => string;
}

export function getColumns({
  mode,
  navigate,
  onActionComplete,
  onReviewAction,
  onReupload,
  getDepartmentPath,
}: GetColumnsOptions): ColumnsType<ReviewListItem> {
  const reviewMode = (mode || 'pending') as ReviewActionMode;

  const base: ColumnsType<ReviewListItem> = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      width: 240,
      ellipsis: true,
      render: (name: string, record: ReviewListItem) => {
        const deleted = isReviewFileDeleted(record);
        return (
          <div className={classNames('columns-file-name-cell', styles['columns-file-name-cell'])}>
            {getFileIconByExtension(record.extension)}
            <a
              title={name}
              className={classNames('columns-file-name-link', styles['columns-file-name-link'],
                deleted && 'columns-file-name-link-deleted',
                deleted && styles['columns-file-name-link-deleted'],
              )}
              onClick={() => navigate(`/review/${reviewMode}/detail/${record.fileId || record.id}`)}
            >
              {name}
            </a>
          </div>
        );
      },
    },
    {
      title: '文件类型',
      dataIndex: 'extension',
      key: 'fileType',
      width: 100,
      render: (extension?: string) => getFileTypeName(extension),
    },
    {
      title: '文件状态',
      key: 'fileExistenceStatus',
      width: 110,
      render: (_: unknown, record: ReviewListItem) => (
        <ReviewFileStatusTag deletedAt={record.deletedAt} deletedByName={record.deletedByName} />
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags?: string[]) => <FileTags tags={tags} showLength={2} />,
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      width: 120,
      render: (s: string) => <ReviewStatusTag status={s} />,
    },
    // 我发起的列表不显示上传者（就是当前用户自己）
    ...(mode === 'initiated'
      ? []
      : [{ title: '上传者', dataIndex: 'uploaderName', key: 'uploaderName', width: 160 }]),
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 200,
      render: (_: unknown, record: ReviewListItem) =>
        getDepartmentPath?.(record.departmentId, record.departmentName) ||
        record.departmentName ||
        '-',
    },
    {
      title: '审核人',
      dataIndex: 'reviewerName',
      key: 'reviewerName',
      width: 120,
      render: (v: string) => v || '-',
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (v: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (v: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
  ];

  // 非已审核模式添加操作列
  if (mode !== 'processed') {
    base.push({
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: unknown, record: ReviewListItem) => (
        <ReviewActionButtons
          mode={reviewMode}
          moreType="link"
          record={record}
          onActionComplete={onActionComplete}
          onReviewAction={onReviewAction}
          onReupload={onReupload}
        />
      ),
    });
  }

  return base;
}
