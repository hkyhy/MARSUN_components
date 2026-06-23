import { TooltipInfo } from '@/components/Common';
import type { RoleConfig } from '@/types';
import { UserRole } from '@/types';
import { Shield } from '@/icons';
import { Button, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { DeleteButton } from '../../Action';
import { getRoleDisplayName } from '../../utils/roleValidation';
import styles from './style.module.scss';
import classNames from 'classnames';

const { Text } = Typography;

function renderRoleName(record: RoleConfig) {
  const roleName = getRoleDisplayName(record);

  return (
    <TooltipInfo
      hidden={!record.createdAt}
      content={[
        { label: '添加人', value: record.createdByName || '-' },
        {
          label: '添加时间',
          value: record.createdAt ? dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-',
        },
      ]}
    >
      <span>{roleName}</span>
    </TooltipInfo>
  );
}

interface GetColumnsOptions {
  onEdit: (record: RoleConfig) => void;
  onSuccess: () => void;
}

export function getColumns({ onEdit, onSuccess }: GetColumnsOptions): ColumnsType<RoleConfig> {
  return [
    {
      title: '角色',
      dataIndex: 'key',
      key: 'key',
      render: (key: string, record: RoleConfig) => (
        <a onClick={() => onEdit(record)}>
          <Space>
            <Shield className="text-primary" />
            <div>
              <div className={classNames('columns-loading', styles['columns-loading'])}>{renderRoleName(record)}</div>
              <Text type="secondary" className={classNames('columns-overlay', styles['columns-overlay'])}>
                {key}
              </Text>
            </div>
          </Space>
        </a>
      ),
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (v: number) => <Tag>{v}</Tag>,
    },
    {
      title: '权限数',
      dataIndex: 'permCount',
      key: 'permCount',
      render: (v: number) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: unknown, record: RoleConfig) => (
        <Space>
          <Button type="link" size="small" onClick={() => onEdit(record)}>
            编辑
          </Button>
          {record.key !== UserRole.SYSTEM_ADMIN && (
            <DeleteButton role={record} onSuccess={onSuccess} />
          )}
        </Space>
      ),
    },
  ];
}
