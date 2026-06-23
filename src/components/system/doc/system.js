const { RoleTag, SEMANTIC_COLORS, SemanticTag } = _Common;
import { Users, User } from '@/icons';
import ButtonGroup from '@kne/button-group';
import { Badge, Card, Table, Tree, Typography } from 'antd';
import { USER_STATUS_MAP } from '../config';
import { mockDeptTree, mockPermissions, mockUsers } from '../mock';

const { Title } = Typography;

/** 部门管理 Demo */
const DepartmentDemo = () => {
  const headerListArray: Record<string, unknown>[] = [
    {
      children: '新增部门',
      onClick: () => console.log('新增部门'),
    },
  ];

  return (
    <Card
      title="部门管理"
      variant="borderless"
      className={'system-demo-wrap'}
      extra={<ButtonGroup list={headerListArray} />}
    >
      <Tree showIcon defaultExpandAll switcherIcon={<Users />} treeData={mockDeptTree} />
    </Card>
  );
};

/** 用户管理 Demo */
const UserManageDemo = () => {
  const headerListArray: Record<string, unknown>[] = [
    {
      type: 'primary',
      children: '新增用户',
      onClick: () => console.log('新增用户'),
    },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => (
        <>
          <User className={'system-demo-panel'} />
          {v}
        </>
      ),
    },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (v: string) => <RoleTag role={v} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: boolean) => {
        const cfg = v ? USER_STATUS_MAP.active : USER_STATUS_MAP.disabled;
        return <Badge status={cfg.badge} text={cfg.text} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: (typeof mockUsers)[0]) => {
        const listArray: Record<string, unknown>[] = [
          { type: 'system-demo-link', children: '编辑', onClick: () => console.log('编辑', record) },
          { type: 'system-demo-link', children: '权限', onClick: () => console.log('权限', record) },
          {
            type: 'system-demo-link',
            children: '删除',
            danger: true,
            isDelete: true,
            message: `确定删除用户「${record.name}」吗？`,
          },
        ];
        return <ButtonGroup moreType="link" list={listArray} />;
      },
    },
  ];

  return (
    <Card
      title="用户管理"
      variant="borderless"
      className={'system-demo-wrap'}
      extra={<ButtonGroup list={headerListArray} />}
    >
      <Table dataSource={mockUsers} columns={columns} size="small" pagination={false} />
    </Card>
  );
};

/** 权限配置 Demo */
const PermissionDemo = () => (
  <Card title="权限配置" variant="borderless" className={'system-demo-wrap'}>
    <div className={'system-demo-card2'}>
      {mockPermissions.map((perm) => (
        <div key={perm.module} className={'system-demo-item'}>
          <Title level={5} className={'system-demo-link'}>
            {perm.module}
          </Title>
          <div className={'system-demo-label'}>
            {Object.entries(perm.roles).map(([role, actions]) => (
              <div key={role} className={'system-demo-value'}>
                <SemanticTag color={SEMANTIC_COLORS.OTHER} className={'system-demo-meta'}>
                  {role}
                </SemanticTag>
                <div className={'system-demo-icon'}>
                  {perm.actions.map((action) => (
                    <SemanticTag
                      key={action}
                      color={
                        actions.includes(action) ? SEMANTIC_COLORS.SUCCESS : SEMANTIC_COLORS.DEFAULT
                      }
                      className={'system-demo-title'}
                    >
                      {actions.includes(action) ? `✓ ${action}` : action}
                    </SemanticTag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export { DepartmentDemo, PermissionDemo, UserManageDemo };

const SystemDemo = () => (
  <div className={'system-demo-desc'}>
    <DepartmentDemo />
    <UserManageDemo />
    <PermissionDemo />
  </div>
);

render(<SystemDemo />);
