import { FileTags, ReviewStatusTag, SEMANTIC_COLORS, SemanticTag } from '@/components/Common';
import ReviewFileStatusTag from '@/components/Review/List/ReviewFileStatusTag';
import { isReviewFileDeleted } from '@/constants';
import { Folder } from '@/icons';
import type { FileItem } from '@/types';
import { getFileIcon, getFileTypeName } from '@/utils/Files';
import { formatFileSize } from '@/utils/format';
import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import classNames from 'classnames';
import { FileActionButtons, FolderActionButtons } from '../../Action';
import styles from './style.module.scss';

export interface GetColumnsOptions {
  canOperate: (record: FileItem) => boolean;
  onEnterFolder: (folder: FileItem) => void;
  onDetail: (record: FileItem) => void;
  onRename: (record: FileItem) => void;
  onMove: (record: FileItem) => void;
  onReupload: (record: FileItem) => void;
  onRefresh: () => void | Promise<void>;
  /** 获取部门完整路径 */
  getDepartmentPath?: (departmentId?: string | null, fallback?: string) => string;
}

export function getColumns(options: GetColumnsOptions): ColumnsType<FileItem> {
  const {
    canOperate,
    onEnterFolder,
    onDetail,
    onRename,
    onMove,
    onReupload,
    onRefresh,
    getDepartmentPath,
  } = options;

  return [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => {
        const deleted = isReviewFileDeleted(record);
        return (
          <div className={classNames('columns-name-row', styles['columns-name-row'])}>
            {getFileIcon(record)}
            <a
              title={name}
              className={classNames(
                'columns-name-link',
                styles['columns-name-link'],
                deleted && 'columns-name-link-deleted',
                deleted && styles['columns-name-link-deleted'],
              )}
              onClick={() => (record.type === 'FOLDER' ? onEnterFolder(record) : onDetail(record))}
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
      render: (extension: string, record) =>
        record.type === 'FOLDER' ? '文件夹' : getFileTypeName(extension),
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      width: 120,
      render: (status: string) => <ReviewStatusTag status={status} />,
    },
    {
      title: '文件状态',
      key: 'fileExistenceStatus',
      width: 110,
      render: (_: unknown, record: FileItem) => (
        <ReviewFileStatusTag deletedAt={record.deletedAt} />
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
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size?: number) => (size ? formatFileSize(size) : '-'),
      sorter: (a, b) => (a.size || 0) - (b.size || 0),
    },
    {
      title: '积分',
      dataIndex: 'totalScore',
      key: 'totalScore',
      width: 90,
      align: 'right',
      render: (score: number | undefined, record) =>
        record.type === 'FOLDER' ? '-' : (score ?? 0),
    },
    {
      title: '所属部门',
      dataIndex: 'departmentId',
      key: 'departmentName',
      width: 200,
      render: (_: unknown, record) =>
        record.isPublic || !record.departmentId ? (
          <SemanticTag color={SEMANTIC_COLORS.PRIMARY}>公共</SemanticTag>
        ) : (
          getDepartmentPath?.(record.departmentId, record.departmentName) ||
          record.departmentName ||
          '-'
        ),
    },
    {
      title: '上传者',
      dataIndex: 'uploaderName',
      key: 'uploaderName',
      width: 160,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
      render: (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: unknown, record: FileItem) =>
        record.type === 'FOLDER' ? (
          <FolderActionButtons
            record={record}
            canOperate={canOperate(record)}
            onRename={onRename}
            onMove={onMove}
            onRefresh={onRefresh}
          />
        ) : (
          <FileActionButtons
            record={record}
            canOperate={canOperate(record)}
            onRename={onRename}
            onMove={onMove}
            onReupload={onReupload}
            onRefresh={onRefresh}
          />
        ),
    },
  ];
}

export interface GetFolderColumnsOptions {
  canOperate: (record: FileItem) => boolean;
  onEnterFolder: (folder: FileItem) => void;
  onRename: (record: FileItem) => void;
  onMove?: (record: FileItem) => void;
  onRefresh: () => void | Promise<void>;
  /** 获取部门完整路径 */
  getDepartmentPath?: (departmentId?: string | null, fallback?: string) => string;
}

/** 文件夹管理页专用 columns */
export function getFolderColumns(options: GetFolderColumnsOptions): ColumnsType<FileItem> {
  const { canOperate, onEnterFolder, onRename, onMove, onRefresh, getDepartmentPath } = options;

  return [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          <Folder
            className={classNames('columns-folder-name-icon', styles['columns-folder-name-icon'])}
          />
          <a onClick={() => onEnterFolder(record)}>{name}</a>
        </Space>
      ),
    },
    {
      title: '类型',
      key: 'folderType',
      width: 130,
      render: (_: unknown, record) =>
        record.isPublic
          ? '公共文件夹'
          : record.isDepartmentFolder
            ? '系统部门文件夹'
            : '业务文件夹',
    },
    {
      title: '所属部门',
      dataIndex: 'departmentId',
      key: 'departmentName',
      width: 200,
      render: (_: unknown, record) =>
        record.isPublic || !record.departmentId ? (
          <SemanticTag color={SEMANTIC_COLORS.PRIMARY}>公共</SemanticTag>
        ) : (
          getDepartmentPath?.(record.departmentId, record.departmentName) ||
          record.departmentName ||
          '-'
        ),
    },
    {
      title: '上传者',
      dataIndex: 'uploaderName',
      key: 'uploaderName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      render: (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170,
      sorter: (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      render: (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: unknown, record: FileItem) => (
        <FolderActionButtons
          record={record}
          canOperate={canOperate(record)}
          onRename={onRename}
          onMove={onMove}
          onRefresh={onRefresh}
        />
      ),
    },
  ];
}
