import { MemberStatusTag, RoleTag } from '@/components/Common/Tag';
import type { UserInfo } from '@/types';
import { MemberStatus, UserRole } from '@/types';
import { Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import UserLink from './UserLink';

interface GetColumnsOptions {
  canEdit: boolean;
  canStatus: boolean;
  canDelete: boolean;
  getDepartmentPath?: (departmentId?: string | null, fallback?: string) => string;
  onEdit: (record: UserInfo) => void;
  onStatus: (record: UserInfo) => void;
  onDelete: (record: UserInfo) => void;
}

export function getColumns({
  canEdit,
  canStatus,
  canDelete,
  getDepartmentPath,
  onEdit,
  onStatus,
  onDelete,
}: GetColumnsOptions): ColumnsType<UserInfo> {
  const base: ColumnsType<UserInfo> = [
    {
      title: '姓名',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (name: string, record: UserInfo) => <UserLink userId={record.id}>{name}</UserLink>,
    },
    {
      title: '工号',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (employeeId: string, record: UserInfo) => (
        <UserLink userId={record.id}>{employeeId}</UserLink>
      ),
    },
    {
      title: '部门',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 200,
      ellipsis: true,
      render: (_: unknown, record: UserInfo) =>
        getDepartmentPath?.(record.departmentId, record.departmentName) ||
        record.departmentName ||
        '-',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'role',
      render: (_: unknown, record: UserInfo) => (
        <RoleTag role={record.role} roleName={record.roleName} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      render: (status: string) => <MemberStatusTag status={status} />,
    },
    // { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-'),
    },
  ];

  if (canEdit || canStatus || canDelete) {
    base.push({
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: unknown, record: UserInfo) => {
        if (record.memberStatus === MemberStatus.DELETED) return null;
        return (
          <Space>
            {canEdit && (
              <Button type="link" size="small" onClick={() => onEdit(record)}>
                编辑
              </Button>
            )}
            {canStatus && (
              <Button type="link" size="small" onClick={() => onStatus(record)}>
                状态
              </Button>
            )}
            {canDelete && record.role !== UserRole.SYSTEM_ADMIN && (
              <Button type="link" size="small" danger onClick={() => onDelete(record)}>
                删除
              </Button>
            )}
          </Space>
        );
      },
    });
  }

  return base;
}
