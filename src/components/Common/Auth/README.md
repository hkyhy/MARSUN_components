# Common/Auth

### 概述

基于角色的权限管理方案，支持页面级和按钮级权限控制。

### 示例

#### 示例样式

```scss
.auth-demo-root {
  display: block;
}

.auth-demo-container {
  margin-bottom: 8px;
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
}

.auth-demo-wrapper {
  font-size: var(--font-size-small);
  color: var(--font-color-grey);
}

.auth-demo-inner {
  white-space: pre-wrap !important;
  font-size: 12px !important;
  padding: 12px !important;
  display: block !important;
}

.auth-demo-header {
  display: block;
}

.auth-demo-body {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-small);
}

.auth-demo-footer {
  width: 80px;
  text-align: center;
}

.auth-demo-row {
  font-size: 12px !important;
  color: var(--font-color-grey-1) !important;
}













































.permission-guard-demo-root {
  display: block;
}

.permission-guard-demo-col {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--font-color-grey);
}

.permission-guard-demo-wrap {
  color: var(--font-color-grey-1);
  font-size: var(--font-size-small);
}

.permission-guard-demo-panel {
  font-size: var(--font-size-small);
}
```

#### 示例代码

- hasPermission 权限判断
- 判断当前用户是否拥有指定权限，返回 boolean
- _CommonAuth(@components/Common/Auth),_Common(@components/Common),_antd(antd)

```jsx
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

const HAS_PERMISSION_CODE = &#96;import { hasPermission } from '@/components/Common/Auth/hasPermission';

hasPermission(user, 'user:edit') // → true/false&#96;;

const GUARD_CODE = &#96;import { PermissionGuard } from '@/components/Common/Auth';

<PermissionGuard permission="user:edit">
  <Button>编辑</Button>
</PermissionGuard>&#96;;

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

```

- PermissionGuard 权限守卫
- 包裹需要权限控制的区域，无权限时隐藏内容或显示 fallback
- _CommonAuth(@components/Common/Auth),_Common(@components/Common),_antd(antd)

```jsx
const { PermissionGuard } = _CommonAuth;
const UserRole = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  DEPT_LEADER: 'DEPT_LEADER',
  REVIEWER: 'REVIEWER',
  NORMAL_USER: 'NORMAL_USER',
  SENIOR_EXECUTIVE: 'SENIOR_EXECUTIVE',
};
const { Button } = _antd;

/** PermissionGuard 权限守卫示例 */
const PermissionGuardDemo = () => (
  <div className={'permission-guard-demo-root'}>
    {/* 场景 1：有权限时显示 */}
    <div>
      <h4 className={'permission-guard-demo-col'}>有权限时正常渲染</h4>
      <PermissionGuard
        roles={[UserRole.SYSTEM_ADMIN]}
        fallback={<span className={'permission-guard-demo-wrap'}>无权限，不可见</span>}
      >
        <Button type="primary" size="small">
          管理员可见的操作按钮
        </Button>
      </PermissionGuard>
    </div>

    {/* 场景 2：无权限时显示 fallback */}
    <div>
      <h4 className={'permission-guard-demo-col'}>无权限时显示 Fallback</h4>
      <PermissionGuard
        roles={[UserRole.DEPT_LEADER]}
        fallback={<span className={'permission-guard-demo-panel'}>当前角色无此权限</span>}
      >
        <Button type="primary" danger size="small">
          超级管理员操作
        </Button>
      </PermissionGuard>
    </div>

    {/* 场景 3：不传 roles 时所有用户可访问 */}
    <div>
      <h4 className={'permission-guard-demo-col'}>不传 roles（所有已登录用户可见）</h4>
      <PermissionGuard>
        <Button size="small">公开内容</Button>
      </PermissionGuard>
    </div>
  </div>
);

render(<PermissionGuardDemo />);

```

### API

#### PermissionGuardProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| roles | 允许访问的角色列表，为空则所有已登录用户可访问 | UserRole[] (必填) |  |
| fallback | 无权限时的回退内容 | React.ReactNode |  |
| children | 受保护的内容 | React.ReactNode (必填) |  |

#### ProtectedRouteProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| roles | 允许访问的角色列表 | UserRole[] |  |
| children | 路由内容 | React.ReactNode (必填) |  |