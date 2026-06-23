const { Typography } = _antd;

const { Paragraph, Text } = Typography;

const INTERFACE_CODE = `interface AppTourProps {
  refs: {
    quickUpload: React.RefObject<HTMLElement | null>;
    content: React.RefObject<HTMLElement | null>;
    userMenu: React.RefObject<HTMLElement | null>;
  };
}

// 菜单模块通过 data-tour-menu 锚点定位，在 MainLayout 的 Menu label 上标记
const quickUploadRef = React.useRef(null);
const contentRef = React.useRef(null);
const userMenuRef = React.useRef(null);

<AppTour refs={{ quickUpload: quickUploadRef, content: contentRef, userMenu: userMenuRef }} />`;

const RESET_CODE = `// 按用户与角色存储，键名格式：maoyang-tour-completed-{userId}-{role}
localStorage.removeItem('maoyang-tour-completed-你的用户ID-你的角色');
// 或直接清除所有导览记录
Object.keys(localStorage)
  .filter((key) => key.startsWith('maoyang-tour-completed'))
  .forEach((key) => localStorage.removeItem(key));
// 刷新页面即可重新看到引导`;

const TourDemo = () => (
  <div className={'tour-demo-container'}>
    <p className={'tour-demo-wrapper'}>
      AppTour 是应用引导教程组件，基于 antd Tour 封装。首次访问时自动弹出引导流程，根据当前用户角色与权限动态展示对应模块说明，引导完成后按「用户 ID +
      角色」记录到 localStorage，角色变更后会重新触发。
    </p>
    <div className={'tour-demo-inner'}>
      <h4 className={'tour-demo-header'}>组件接口</h4>
      <Paragraph copyable={{ text: INTERFACE_CODE, tooltips: ['复制代码', '已复制'] }}>
        <Text code className={'tour-demo-body'}>
          {INTERFACE_CODE}
        </Text>
      </Paragraph>
    </div>
    <div className={'tour-demo-footer'}>
      <h4 className={'tour-demo-header'}>引导步骤（内置）</h4>
      <ul className={'tour-demo-row'}>
        <li>欢迎 — 按角色定制的工作流介绍（普通用户 / 审核员 / 部门负责人 / 管理员等）</li>
        <li>各菜单模块 — 通过 data-tour-menu 锚点定位到对应 menu item</li>
        <li>快速上传、工作区域、个人菜单 — 通用步骤</li>
      </ul>
    </div>
    <div className={'tour-demo-footer'}>
      <h4 className={'tour-demo-header'}>重置引导</h4>
      <Paragraph className={'tour-demo-col'}>
        <Text className={'tour-demo-wrapper'}>
          清除 localStorage 中以 <Text code>maoyang-tour-completed-</Text> 开头的键值即可重新触发引导（键名含用户 ID 与角色）。
        </Text>
      </Paragraph>
      <Paragraph copyable={{ text: RESET_CODE, tooltips: ['复制代码', '已复制'] }}>
        <Text code className={'tour-demo-body'}>
          {RESET_CODE}
        </Text>
      </Paragraph>
    </div>
  </div>
);

render(<TourDemo />);
