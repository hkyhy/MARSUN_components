const { default: ParseStatusTag } = _AgentHubKnowledgeBaseDetailParseStatusTag;
import { Space } from 'antd';

const ParseStatusTagBasicDemo = () => (
  <Space wrap>
    <ParseStatusTag status="UNSTART" />
    <ParseStatusTag status="RUNNING" />
    <ParseStatusTag status="DONE" />
    <ParseStatusTag status="FAIL" />
    <ParseStatusTag status="CANCEL" />
  </Space>
);

render(<ParseStatusTagBasicDemo />);
