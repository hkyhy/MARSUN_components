/** Auth 权限配置示例 */
const PERMISSION_CONFIG = {
  /** 系统权限列表 */
  permissions: [
    { key: 'file:view', label: '查看文件', module: '文件管理' },
    { key: 'file:upload', label: '上传文件', module: '文件管理' },
    { key: 'file:delete', label: '删除文件', module: '文件管理' },
    { key: 'file:submit', label: '提报审核', module: '文件管理' },
    { key: 'review:view', label: '查看审核', module: '审核中心' },
    { key: 'review:approve', label: '通过审核', module: '审核中心' },
    { key: 'review:reject', label: '驳回审核', module: '审核中心' },
    { key: 'user:manage', label: '用户管理', module: '系统管理' },
    { key: 'dept:manage', label: '部门管理', module: '系统管理' },
  ],
  /** 角色默认权限映射 */
  rolePermissions: {
    SYSTEM_ADMIN: [
      'file:view',
      'file:upload',
      'file:delete',
      'file:submit',
      'review:view',
      'review:approve',
      'review:reject',
      'user:manage',
      'dept:manage',
    ],
    REVIEWER: ['file:view', 'file:submit', 'review:view', 'review:approve', 'review:reject'],
    UPLOADER: ['file:view', 'file:upload', 'file:submit', 'review:view'],
  },
};

const { SEMANTIC_COLORS, SemanticTag } = _Common;
const { Typography } = _antd;

const { Paragraph, Text } = Typography;

const HAS_PERMISSION_CODE = `import { hasPermission } from '@/components/Common/Auth/hasPermission';

hasPermission(user, 'user:edit') // → true/false`;

const GUARD_CODE = `import { PermissionGuard } from '@/components/Common/Auth';

<PermissionGuard permission="user:edit">
  <Button>编辑</Button>
</PermissionGuard>`;

const AuthDemo = () => (
  <div className={'auth-demo-root'}>
    <div>
      <h4 className={'auth-demo-container'}>hasPermission 权限判断</h4>
      <p className={'auth-demo-wrapper'}>判断当前用户是否拥有指定权限，返回 boolean。</p>
      <Paragraph copyable={{ text: HAS_PERMISSION_CODE, tooltips: ['复制代码', '已复制'] }}>
        <Text
          code
          className={'auth-demo-inner'}
        >
          {HAS_PERMISSION_CODE}
        </Text>
      </Paragraph>
    </div>
    <div>
      <h4 className={'auth-demo-container'}>PermissionGuard 权限守卫</h4>
      <p className={'auth-demo-wrapper'}>包裹需要权限控制的区域，无权限时隐藏内容。</p>
      <Paragraph copyable={{ text: GUARD_CODE, tooltips: ['复制代码', '已复制'] }}>
        <Text
          code
          className={'auth-demo-inner'}
        >
          {GUARD_CODE}
        </Text>
      </Paragraph>
    </div>
    <div>
      <h4 className={'auth-demo-container'}>权限配置一览</h4>
      <div className={'auth-demo-header'}>
        {PERMISSION_CONFIG.permissions.map((p) => (
          <div key={p.key} className={'auth-demo-body'}>
            <SemanticTag color={SEMANTIC_COLORS.INFO} className={'auth-demo-footer'}>
              {p.module}
            </SemanticTag>
            <span>{p.label}</span>
            <Text
              copyable={{ text: p.key, tooltips: ['复制', '已复制'] }}
              className={'auth-demo-row'}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

render(<AuthDemo />);
