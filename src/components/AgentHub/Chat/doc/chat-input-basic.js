const { default: ChatInput } = _AgentHubChatDetailChatInput;
const { Switch, Typography } = _antd;

const { Text } = Typography;

const ChatInputBasicDemo = () => {
  const [value, setValue] = React.useState('请问正式员工的年假有多少天？');
  const [loading, setLoading] = React.useState(false);

  return (
    <div className={'chat-input-basic-demo-block11'}>
      <div className={'chat-input-basic-demo-block12'}>
        <Text type="secondary" className={'chat-input-basic-demo-block5'}>
          模拟生成中
        </Text>
        <Switch size="small" checked={loading} onChange={setLoading} />
      </div>
      <div className={'chat-input-basic-demo-block13'}>
        <ChatInput
          value={value}
          loading={loading}
          onChange={setValue}
          onSend={() => setLoading(true)}
          onStop={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

render(<ChatInputBasicDemo />);
