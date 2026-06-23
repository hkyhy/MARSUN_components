const { default: CitationPanel } = _AgentHubChatDetailCitationPanel;
import ChatInput from '@/components/AgentHub/Chat/Detail/ChatInput';
const { default: MessageItem } = _AgentHubChatDetailMessageItem;

import { mockAssistantMessage, mockCitations, mockUserMessage } from '../mock';

const ChatConversationDemo = () => {
  const [input, setInput] = React.useState('');
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number>();
  const [citations, setCitations] = useState<Citation[]>(mockCitations);

  const handleCitationClick = (items: Citation[], index: number) => {
    setCitations(items);
    setPanelOpen(true);
    setHighlightedIndex(index);
  };

  const handleEditMessage = (_messageId: string, content: string) => {
    setInput(content);
  };

  const handleResendMessage = (content: string) => {
    setInput(content);
  };

  return (
    <div className={'chat-conversation-demo-block7'}>
      <div className={'chat-conversation-demo-block8'}>
        <div className={'chat-conversation-demo-block9'}>
          <MessageItem
            message={mockUserMessage}
            onEditMessage={handleEditMessage}
            onResendMessage={handleResendMessage}
          />
          <MessageItem message={mockAssistantMessage} onCitationClick={handleCitationClick} />
        </div>
        <ChatInput
          value={input}
          loading={false}
          onChange={setInput}
          onSend={() => setInput('')}
        />
      </div>

      {panelOpen && (
        <div className={'chat-conversation-demo-block10'}>
          <CitationPanel
            citations={citations}
            highlightedIndex={highlightedIndex}
            onClose={() => setPanelOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

render(<ChatConversationDemo />);
