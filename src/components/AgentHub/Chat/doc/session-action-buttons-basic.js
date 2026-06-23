const { SessionActionButtons } = _AgentHubChat;
import { message } from 'antd';

const SessionActionButtonsBasicDemo = () => {
  const [streaming, setStreaming] = React.useState(false);

  return (
    <div className={'session-action-buttons-basic-demo-block22'}>
      <SessionActionButtons
        streaming={streaming}
        clearDisabled={false}
        onClearConversation={() => message.success('已清空当前对话')}
      />
      <label className={'session-action-buttons-basic-demo-block23'}>
        <input
          type="checkbox"
          checked={streaming}
          onChange={(e) => setStreaming(e.target.checked)}
        />
        模拟生成中（禁用清空）
      </label>
    </div>
  );
};

render(<SessionActionButtonsBasicDemo />);
