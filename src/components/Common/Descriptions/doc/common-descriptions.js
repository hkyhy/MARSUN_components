const { CommonDescriptions } = _Common;
import { MOCK_ASSET_ITEMS, MOCK_BASIC_ITEMS } from '../mock';

const CommonDescriptionsDemo = () => (
  <div className={'common-descriptions-demo-root'}>
    <CommonDescriptions content={MOCK_BASIC_ITEMS} />
    <CommonDescriptions content={MOCK_ASSET_ITEMS} column={3} title="资产详情" />
  </div>
);

render(<CommonDescriptionsDemo />);
