const { PermissionGuard } = _CommonAuth;
import { UserRole } from '@/types';
import { Button } from 'antd';

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
