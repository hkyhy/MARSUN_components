const { default: KBFilterBar } = _AgentHubKnowledgeBaseListFilterBar;

const KnowledgeBaseFilterDemo = () => {
  const [keyword, setKeyword] = React.useState('企业制度');

  return <KBFilterBar keyword={keyword} onKeywordChange={setKeyword} />;
};

render(<KnowledgeBaseFilterDemo />);
