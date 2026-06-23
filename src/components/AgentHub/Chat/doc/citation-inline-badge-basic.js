const { default: CitationInlineBadge } = _AgentHubChatDetailCitationInlineBadge;
const { Typography } = _antd;

const { Text } = Typography;

const CitationInlineBadgeBasicDemo = () => (
  <div className={'citation-inline-badge-basic-demo-block19'}>
    <Text>根据企业制度文档</Text>
    <CitationInlineBadge number={1} />
    <CitationInlineBadge number={2} />
    <Text>，正式员工年假标准为 5-15 天。</Text>
  </div>
);

render(<CitationInlineBadgeBasicDemo />);
