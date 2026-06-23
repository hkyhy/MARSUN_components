const { default: CitationPanel } = _AgentHubChatDetailCitationPanel;
import { mockCitations } from '../mock';

const CitationPanelBasicDemo = () => {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  return (
    <div className={'citation-panel-basic-demo-block20'}>
      <CitationPanel
        citations={mockCitations}
        highlightedIndex={highlightedIndex}
        onClose={() => setHighlightedIndex(undefined)}
      />
    </div>
  );
};

render(<CitationPanelBasicDemo />);
