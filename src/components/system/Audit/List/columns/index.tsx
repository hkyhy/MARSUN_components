import { SEMANTIC_COLORS, SemanticTag } from '@/components/Common';
import type { AuditLogItem } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import styles from './style.module.scss';
import classNames from 'classnames';
import { formatIp, getAuditActionLabel, getAuditTargetTypeLabel } from '../../utils';

interface GetColumnsOptions {
  onViewDetail: (record: AuditLogItem) => void;
}

export function getColumns({ onViewDetail }: GetColumnsOptions): ColumnsType<AuditLogItem> {
  return [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 140,
      render: (value: string) => (
        <SemanticTag color={SEMANTIC_COLORS.INFO}>{getAuditActionLabel(value)}</SemanticTag>
      ),
    },
    {
      title: '对象类型',
      dataIndex: 'targetType',
      key: 'targetType',
      width: 100,
      render: (value: string) => getAuditTargetTypeLabel(value),
    },
    {
      title: '对象ID',
      dataIndex: 'targetId',
      key: 'targetId',
      width: 120,
      ellipsis: true,
    },
    {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
      width: 100,
      render: (_: unknown, record) =>
        record.detail ? (
          <a onClick={() => onViewDetail(record)} className={classNames('columns-detail-link', styles['columns-detail-link'])}>
            查看
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      render: (value: string) => formatIp(value),
    },
  ];
}
