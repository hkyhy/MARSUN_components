const { default: ChatCard } = _AgentHubChatListChatCard;
import { message } from 'antd';
import { mockChatAssistants, mockDatasets } from '../mock';

const ChatCardBasicDemo = () => (
  <div className={'chat-card-basic-demo-block6'}>
    {mockChatAssistants.map((chat) => (
      <ChatCard
        key={chat.id}
        chat={chat}
        datasets={mockDatasets}
        onStartChat={(c) => message.info(`开始对话：${c.name}`)}
        onEdit={(c) => message.info(`编辑：${c.name}`)}
        onDelete={(c) => message.success(`已删除：${c.name}`)}
      />
    ))}
  </div>
);

render(<ChatCardBasicDemo />);
