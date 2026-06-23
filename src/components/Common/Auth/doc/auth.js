const { SEMANTIC_COLORS, SemanticTag } = _Common;
import { Typography } from 'antd';
import { PERMISSION_CONFIG } from '../mock';

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
