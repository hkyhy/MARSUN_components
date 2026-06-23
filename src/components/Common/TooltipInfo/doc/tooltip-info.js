const MOCK_ROLE_META_ITEMS = [
  { label: '添加人', value: '系统管理员' },
  { label: '添加时间', value: '2026-06-08 11:58:19' },
];

const MOCK_DELETE_META_ITEMS = [
  { label: '删除人', value: '张三' },
  { label: '删除时间', value: '2026-06-08 10:30:00' },
];

const { SemanticTag, TooltipInfo } = _Common;

const TooltipInfoDemo = () => (
  <div className={'tooltip-info-demo-root'}>
    <TooltipInfo content={MOCK_ROLE_META_ITEMS}>
      <span className={'tooltip-info-demo-container'}>高管</span>
    </TooltipInfo>
    <TooltipInfo content={MOCK_DELETE_META_ITEMS}>
      <SemanticTag color="danger" className={'tooltip-info-demo-wrapper'}>
        文件已删除
      </SemanticTag>
    </TooltipInfo>
  </div>
);

render(<TooltipInfoDemo />);
