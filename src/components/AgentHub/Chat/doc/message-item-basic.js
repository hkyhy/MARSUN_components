const { default: MessageItem } = _AgentHubChatDetailMessageItem;
import { mockAssistantMessage, mockStreamingMessage, mockUserMessage } from '../mock';

const MessageItemBasicDemo = () => (
  <div className={'message-item-basic-demo-block21'}>
    <MessageItem
      message={mockUserMessage}
      onEditMessage={() => {}}
      onResendMessage={() => {}}
    />
    <MessageItem message={mockAssistantMessage} onCitationClick={() => {}} />
    <MessageItem message={mockStreamingMessage} />
  </div>
);

render(<MessageItemBasicDemo />);
