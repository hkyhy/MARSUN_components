const { SemanticTag, TooltipInfo } = _Common;
import { MOCK_DELETE_META_ITEMS, MOCK_ROLE_META_ITEMS } from '../mock';

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
