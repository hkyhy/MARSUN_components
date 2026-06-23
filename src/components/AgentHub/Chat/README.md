# AgentHub/Chat

### 概述

AgentHub 问答模块的助手卡片、消息气泡、引用来源、对话输入框、会话侧边栏等组件。

### 示例

#### 示例样式

```scss
.citation-inline-badge-basic-demo-block19 {
  font-size: var(--font-size-small);
  line-height: var(--line-height-default);
}


























































































































































































































































































   

  
  
   
     
  

   
     
  


  
  
   
     
     
  


  
  
   
     
  

   
     
  






































   







































   

















































   

















   


























































.chat-input-basic-demo-block5 {
  font-size: var(--font-size-small);
}

.chat-input-basic-demo-block11 {
  display: block;
}

.chat-input-basic-demo-block12 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-input-basic-demo-block13 {
  border-radius: 12px;
  border-width: 1px; border-style: solid;
  border-color: var(--font-color-grey-4);
  overflow: hidden;
}


























































































































































































































































































   

  
  
   
     
  

   
     
  


  
  
   
     
     
  


  
  
   
     
  

   
     
  






































   







































   

















































   

















   














































.message-item-basic-demo-block21 {
  background-color: var(--bg-color-grey);
  border-radius: 12px;
  padding: 16px;
}


























































































































































































































































































   

  
  
   
     
  

   
     
  


  
  
   
     
     
  


  
  
   
     
  

   
     
  






































   







































   

















































   

















   














































.citation-panel-basic-demo-block20 {
  height: 360px;
  border-radius: 12px;
  border-width: 1px; border-style: solid;
  border-color: var(--font-color-grey-4);
  overflow: hidden;
}


























































































































































































































































































   

  
  
   
     
  

   
     
  


  
  
   
     
     
  


  
  
   
     
  

   
     
  






































   







































   

















































   

















   














































.chat-card-basic-demo-block6 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px;
  @media (min-width: 768px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}


























































































































































































































































































   

  
  
   
     
  

   
     
  


  
  
   
     
     
  


  
  
   
     
  

   
     
  






































   







































   

















































   

















   


























































.chat-conversation-demo-block7 {
  display: flex;
  height: 480px;
  border-radius: 12px;
  border-width: 1px; border-style: solid;
  border-color: var(--font-color-grey-4);
  overflow: hidden;
  background-color: var(--bg-color-grey);
}

.chat-conversation-demo-block8 {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-conversation-demo-block9 {
  flex: 1;
  overflow-y: auto;
  padding-left: 16px; padding-right: 16px;
  padding-top: 16px; padding-bottom: 16px;
}

.chat-conversation-demo-block10 {
  width: 320px;
  flex-shrink: 0;
  border-color: var(--font-color-grey-4);
}


























































































































































































































































































   

  
  
   
     
  

   
     
  


  
  
   
     
     
  


  
  
   
     
  

   
     
  






































   







































   

















































   

















   


















































.session-sidebar-basic-demo-block24 {
  display: flex;
  height: 420px;
  min-width: 0;
  overflow: hidden;
  border-radius: 12px;
  border-width: 1px; border-style: solid;
  border-color: var(--font-color-grey-4);
  background-color: var(--bg-color-grey);
}

.session-sidebar-basic-demo-block25 {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-small);
  color: var(--font-color-grey-1);
}


























































































































































































































































































   

  
  
   
     
  

   
     
  


  
  
   
     
     
  


  
  
   
     
  

   
     
  






































   







































   

















































   

















   


















































.session-action-buttons-basic-demo-block22 {
  display: block;
}

.session-action-buttons-basic-demo-block23 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-small);
  color: var(--font-color-grey);
}


























































































































































































































































































   

  
  
   
     
  

   
     
  


  
  
   
     
     
  


  
  
   
     
  

   
     
  






































   







































   

















































   

















   


































































.chat-session-layout-demo-media {
  min-height: 0;
  flex: 1;
}

.chat-session-layout-demo-block14 {
  display: flex;
  height: 520px;
  min-width: 0;
  overflow: hidden;
  border-radius: 12px;
  border-width: 1px; border-style: solid;
  border-color: var(--font-color-grey-4);
  background-color: var(--bg-color-white);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.chat-session-layout-demo-block15 {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bg-color-grey);
}

.chat-session-layout-demo-block16 {
  padding-left: 16px; padding-right: 16px;
  padding-top: 16px; padding-bottom: 16px;
}

.chat-session-layout-demo-block17 {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-small);
  color: var(--font-color-grey-1);
}

.chat-session-layout-demo-block18 {
  width: 320px;
  flex-shrink: 0;
  overflow: hidden;
  border-color: var(--font-color-grey-4);
}
```

#### 示例代码

- 引用角标
- CitationInlineBadge 行内引用序号角标，嵌入在回答正文中
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_antd(antd)

```jsx
const { default: CitationInlineBadge } = _AgentHubChatDetailCitationInlineBadge;
import { Typography } from 'antd';

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

```

- 对话输入框
- ChatInput 支持 Enter 发送、Shift+Enter 换行，生成中显示停止按钮
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_AgentHubChatDetailChatInput(@components/AgentHub/Chat/Detail/ChatInput),_antd(antd)

```jsx
const { default: ChatInput } = _AgentHubChatDetailChatInput;
import { Switch, Typography } from 'antd';

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

```

- 消息气泡
- MessageItem 用户/助手消息、Markdown 渲染、流式打字与引用摘要
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_AgentHubChatDetailChatInput(@components/AgentHub/Chat/Detail/ChatInput),_AgentHubChatDetailMessageItem(@components/AgentHub/Chat/Detail/MessageItem),_antd(antd)

```jsx
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

```

- 引用来源面板
- CitationPanel 展示引用文档列表，支持高亮定位与展开详情
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_AgentHubChatDetailChatInput(@components/AgentHub/Chat/Detail/ChatInput),_AgentHubChatDetailMessageItem(@components/AgentHub/Chat/Detail/MessageItem),_AgentHubChatDetailCitationPanel(@components/AgentHub/Chat/Detail/CitationPanel),_antd(antd)

```jsx
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

```

- 助手卡片
- ChatCard 助手列表卡片，展示关联知识库与操作按钮
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_AgentHubChatDetailChatInput(@components/AgentHub/Chat/Detail/ChatInput),_AgentHubChatDetailMessageItem(@components/AgentHub/Chat/Detail/MessageItem),_AgentHubChatDetailCitationPanel(@components/AgentHub/Chat/Detail/CitationPanel),_AgentHubChatListChatCard(@components/AgentHub/Chat/List/ChatCard),_antd(antd)

```jsx
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
        onStartChat={(c) => message.info(&#96;开始对话：${c.name}&#96;)}
        onEdit={(c) => message.info(&#96;编辑：${c.name}&#96;)}
        onDelete={(c) => message.success(&#96;已删除：${c.name}&#96;)}
      />
    ))}
  </div>
);

render(<ChatCardBasicDemo />);

```

- 对话场景
- 消息列表 + 输入框 + 引用面板的完整对话交互
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_AgentHubChatDetailChatInput(@components/AgentHub/Chat/Detail/ChatInput),_AgentHubChatDetailMessageItem(@components/AgentHub/Chat/Detail/MessageItem),_AgentHubChatDetailCitationPanel(@components/AgentHub/Chat/Detail/CitationPanel),_AgentHubChatListChatCard(@components/AgentHub/Chat/List/ChatCard),_antd(antd)

```jsx
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

```

- 会话侧边栏
- SessionSidebar 展示 Agent 标题、新建会话入口与历史对话列表，位于消息区左侧
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_AgentHubChatDetailChatInput(@components/AgentHub/Chat/Detail/ChatInput),_AgentHubChatDetailMessageItem(@components/AgentHub/Chat/Detail/MessageItem),_AgentHubChatDetailCitationPanel(@components/AgentHub/Chat/Detail/CitationPanel),_AgentHubChatListChatCard(@components/AgentHub/Chat/List/ChatCard),_AgentHubChatListSessionSidebar(@components/AgentHub/Chat/List/SessionSidebar),_antd(antd)

```jsx
const { default: SessionSidebar } = _AgentHubChatListSessionSidebar;
import { message } from 'antd';
import { mockChatAssistants, mockChatSessions } from '../mock';

const SessionSidebarBasicDemo = () => {
  const [sessions, setSessions] = React.useState(mockChatSessions);
  const [activeSessionId, setActiveSessionId] = React.useState(mockChatSessions[0]?.id);

  const handleCreateSession = () => {
    const newSession = {
      id: &#96;sess-${Date.now()}&#96;,
      chat_id: 'chat-1',
      name: '新会话',
      messages: [],
      create_time: Date.now(),
      update_time: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    message.success('已创建新会话');
  };

  const handleClearSession = (sessionId: string) => {
    const newSession = {
      id: &#96;sess-${Date.now()}&#96;,
      chat_id: 'chat-1',
      name: '新会话',
      messages: [],
      create_time: Date.now(),
      update_time: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev.filter((item) => item.id !== sessionId)]);
    setActiveSessionId(newSession.id);
    message.success('会话内容已清空');
  };

  const handleDeleteSession = (sessionId: string) => {
    const remaining = sessions.filter((item) => item.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0]?.id);
    }
    message.success('会话已删除');
  };

  return (
    <div className={'session-sidebar-basic-demo-block24'}>
      <SessionSidebar
        title={mockChatAssistants[0]?.name ?? '制度问答助手'}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={(sessionId) => {
          setActiveSessionId(sessionId);
          message.info('已切换会话');
        }}
        onCreateSession={handleCreateSession}
        onClearSession={handleClearSession}
        onDeleteSession={handleDeleteSession}
      />
      <div className={'session-sidebar-basic-demo-block25'}>
        消息区域占位
      </div>
    </div>
  );
};

render(<SessionSidebarBasicDemo />);

```

- 会话操作按钮
- SessionActionButtons 页面头部清空对话操作
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_AgentHubChatDetailChatInput(@components/AgentHub/Chat/Detail/ChatInput),_AgentHubChatDetailMessageItem(@components/AgentHub/Chat/Detail/MessageItem),_AgentHubChatDetailCitationPanel(@components/AgentHub/Chat/Detail/CitationPanel),_AgentHubChatListChatCard(@components/AgentHub/Chat/List/ChatCard),_AgentHubChatListSessionSidebar(@components/AgentHub/Chat/List/SessionSidebar),_antd(antd)

```jsx
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

```

- 会话对话布局
- 左侧会话侧边栏 + 消息区 + 引用面板，支持会话切换滚动到底部与点击角标打开引用来源
- _AgentHubChat(@components/AgentHub/Chat),_AgentHubChatDetailCitationInlineBadge(@components/AgentHub/Chat/Detail/CitationInlineBadge),_AgentHubChatDetailChatInput(@components/AgentHub/Chat/Detail/ChatInput),_AgentHubChatDetailMessageItem(@components/AgentHub/Chat/Detail/MessageItem),_AgentHubChatDetailCitationPanel(@components/AgentHub/Chat/Detail/CitationPanel),_AgentHubChatListChatCard(@components/AgentHub/Chat/List/ChatCard),_AgentHubChatListSessionSidebar(@components/AgentHub/Chat/List/SessionSidebar),_AgentHubChathooks(@components/AgentHub/Chat/hooks),_CommonVirtualScrollbar(@components/Common/VirtualScrollbar),_antd(antd)

```jsx
const { default: ChatInput } = _AgentHubChatDetailChatInput;
import CitationPanel from '@/components/AgentHub/Chat/Detail/CitationPanel';
const { default: MessageItem } = _AgentHubChatDetailMessageItem;
import SessionSidebar from '@/components/AgentHub/Chat/List/SessionSidebar';
const { useAutoScrollToBottom } = _AgentHubChathooks;
import {
  animateScrollFromTopToBottom,
  getScrollBottom,
} from '@/components/AgentHub/Chat/utils/smoothScroll';
const { VirtualScrollbar } = _CommonVirtualScrollbar;

import { message } from 'antd';
import {
  mockAssistantMessage,
  mockChatAssistants,
  mockChatSessions,
  mockCitations,
  mockUserMessage,
} from '../mock';

const sessionMessagesMap: Record<string, ChatMessage[]> = {
  'sess-1': [mockUserMessage, mockAssistantMessage],
  'sess-2': [
    {
      id: 'msg-u2',
      role: 'user',
      content: '报销流程需要哪些材料？',
    },
    {
      id: 'msg-a2',
      role: 'assistant',
      content:
        '请先在 OA 提交报销申请，并附上发票原件、费用明细与审批单。具体材料要求见制度文档 [ID:1]。',
      citations: mockCitations[1] ? [mockCitations[1]] : [],
    },
  ],
  'sess-3': [
    {
      id: 'msg-u3',
      role: 'user',
      content: '迟到 30 分钟怎么算？',
    },
    {
      id: 'msg-a3',
      role: 'assistant',
      content: '迟到 30 分钟以内记为迟到一次，超过 30 分钟按旷工半天处理，具体以考勤制度为准。',
    },
  ],
};

const ChatSessionLayoutDemo = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(mockChatSessions);
  const [activeSessionId, setActiveSessionId] = React.useState(mockChatSessions[0]?.id);
  const [input, setInput] = React.useState('');
  const [citations, setCitations] = useState<Citation[]>([]);
  const [showCitations, setShowCitations] = React.useState(false);
  const [highlightedCitationIndex, setHighlightedCitationIndex] = useState<number>();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesContentRef = useRef<HTMLDivElement>(null);
  const prevSessionIdForScrollRef = useRef<string>();
  const scrollAnimationCleanupRef = useRef<(() => void) | null>(null);

  const resetCitationState = React.useCallback(() => {
    setCitations([]);
    setShowCitations(false);
    setHighlightedCitationIndex(undefined);
  }, []);

  const messages = React.useMemo(
    () => (activeSessionId ? (sessionMessagesMap[activeSessionId] ?? []) : []),
    [activeSessionId],
  );

  const { stickToBottom } = useAutoScrollToBottom(scrollContainerRef, messagesContentRef, {
    enabled: messages.length > 0,
  });

  const scrollMessagesToBottom = React.useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      scrollAnimationCleanupRef.current?.();
      scrollAnimationCleanupRef.current = null;

      stickToBottom();
      const container = scrollContainerRef.current;
      if (!container) return () => {};

      if (behavior === 'smooth') {
        const cleanup = animateScrollFromTopToBottom(container);
        scrollAnimationCleanupRef.current = cleanup;
        return cleanup;
      }

      const scrollInstant = () => {
        container.scrollTop = getScrollBottom(container);
      };

      scrollInstant();
      const raf1 = requestAnimationFrame(() => {
        scrollInstant();
        requestAnimationFrame(scrollInstant);
      });
      const timers = [0, 50, 150, 300].map((delay) => window.setTimeout(scrollInstant, delay));

      const cleanup = () => {
        cancelAnimationFrame(raf1);
        timers.forEach((timer) => window.clearTimeout(timer));
      };

      scrollAnimationCleanupRef.current = cleanup;
      return cleanup;
    },
    [stickToBottom],
  );

  React.useEffect(() => {
    if (messages.length === 0) return;

    const isSessionSwitch = prevSessionIdForScrollRef.current !== activeSessionId;
    prevSessionIdForScrollRef.current = activeSessionId;

    return scrollMessagesToBottom(isSessionSwitch ? 'smooth' : 'auto');
  }, [activeSessionId, messages, scrollMessagesToBottom]);

  const handleCitationClick = React.useCallback((messageCitations: Citation[], index: number) => {
    setCitations(messageCitations);
    setHighlightedCitationIndex(index);
    setShowCitations(true);
  }, []);

  const handleCreateSession = () => {
    const newSession: ChatSession = {
      id: &#96;sess-${Date.now()}&#96;,
      chat_id: 'chat-1',
      name: '新会话',
      messages: [],
      create_time: Date.now(),
      update_time: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput('');
    resetCitationState();
    message.success('已创建新会话');
  };

  const handleClearSession = (sessionId: string) => {
    const newSession: ChatSession = {
      id: &#96;sess-${Date.now()}&#96;,
      chat_id: 'chat-1',
      name: '新会话',
      messages: [],
      create_time: Date.now(),
      update_time: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev.filter((item) => item.id !== sessionId)]);
    setActiveSessionId(newSession.id);
    setInput('');
    resetCitationState();
    message.success('会话内容已清空');
  };

  const handleDeleteSession = (sessionId: string) => {
    const remaining = sessions.filter((item) => item.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0]?.id);
      setInput('');
      resetCitationState();
    }
    message.success('会话已删除');
  };

  const handleSelectSession = (sessionId: string) => {
    if (sessionId === activeSessionId) return;
    setActiveSessionId(sessionId);
    setInput('');
    resetCitationState();
  };

  return (
    <div className={'chat-session-layout-demo-block14'}>
      <SessionSidebar
        title={mockChatAssistants[0]?.name ?? '制度问答助手'}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={handleSelectSession}
        onCreateSession={handleCreateSession}
        onClearSession={handleClearSession}
        onDeleteSession={handleDeleteSession}
      />
      <div className={'chat-session-layout-demo-block15'}>
        <VirtualScrollbar
          ref={scrollContainerRef}
          wrapperClassName={'chat-session-layout-demo-media'}
          className={'chat-session-layout-demo-block16'}
        >
          {messages.length === 0 ? (
            <div className={'chat-session-layout-demo-block17'}>
              选择或新建会话后开始对话
            </div>
          ) : (
            <div ref={messagesContentRef}>
              {messages.map((item) => (
                <MessageItem
                  key={item.id}
                  message={item}
                  onCitationClick={
                    item.citations && item.citations.length > 0 ? handleCitationClick : undefined
                  }
                />
              ))}
            </div>
          )}
        </VirtualScrollbar>
        <ChatInput value={input} loading={false} onChange={setInput} onSend={() => setInput('')} />
      </div>

      {showCitations && (
        <div className={'chat-session-layout-demo-block18'}>
          <CitationPanel
            citations={citations}
            highlightedIndex={highlightedCitationIndex}
            onClose={() => setShowCitations(false)}
          />
        </div>
      )}
    </div>
  );
};

render(<ChatSessionLayoutDemo />);

```

### API

#### CitationInlineBadgeProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| number | 引用序号 | number (必填) |  |
| onClick | 点击角标回调 | () => void |  |

#### ChatInputProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| value | 输入内容 | string (必填) |  |
| loading | 是否正在生成回复 | boolean (必填) |  |
| onChange | 内容变更回调 | (v: string) => void (必填) |  |
| onSend | 发送回调 | () => void (必填) |  |
| onStop | 停止生成回调 | () => void |  |
| placeholder | 占位提示 | string | 输入问题… Enter 发送，Shift+Enter 换行 |

#### MessageItemProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| message | 聊天消息对象 | ChatMessage (必填) |  |
| onCitationClick | 点击引用角标或来源摘要回调 | (citations: Citation[], index?: number) => void |  |
| onTypingChange | 助手消息打字机状态变化回调 | (typing: boolean) => void |  |
| onEditMessage | 用户消息重新编辑确认回调（Popover 内确认后触发，含 messageId） | (messageId: string, content: string) => void |  |
| onResendMessage | 用户消息重新发送回调（将内容回填到输入框） | (content: string) => void |  |
| editDisabled | 是否禁用重新编辑（生成中） | boolean |  |

#### MessageEditPopoverProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| open | 是否展开 | boolean (必填) |  |
| value | 编辑中的内容 | string (必填) |  |
| originalContent | 原始消息内容 | string (必填) |  |
| onOpenChange | 展开状态变化 | (open: boolean) => void (必填) |  |
| onChange | 内容变更 | (value: string) => void (必填) |  |
| onConfirm | 确认编辑 | () => void (必填) |  |
| onCancel | 取消编辑 | () => void (必填) |  |
| children | 锚点元素（编辑图标按钮） | React.ReactNode (必填) |  |

#### CitationPanelProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| citations | 引用来源列表 | Citation[] (必填) |  |
| highlightedIndex | 高亮定位的引用下标 | number |  |
| onClose | 关闭面板回调 | () => void |  |

#### ChatCardProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| chat | 问答助手对象 | ChatAssistant (必填) |  |
| datasets | 知识库列表（用于解析关联名称） | Dataset[] (必填) |  |
| onStartChat | 开始对话 | (chat: ChatAssistant) => void (必填) |  |
| onEdit | 编辑助手 | (chat: ChatAssistant) => void (必填) |  |
| onDelete | 删除助手 | (chat: ChatAssistant) => void (必填) |  |

#### SessionSidebarProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| title | 当前 Agent 标题 | string (必填) |  |
| sessions | 历史会话列表 | ChatSession[] (必填) |  |
| activeSessionId | 当前激活的会话 ID | string |  |
| loading | 会话列表加载中 | boolean |  |
| disabled | 禁用切换与新建（如流式生成中） | boolean |  |
| onSelect | 切换会话回调 | (sessionId: string) => void (必填) |  |
| onCreateSession | 新建会话回调（标题栏 + 按钮） | () => void (必填) |  |
| onClearSession | 清空当前选中会话内容 | (sessionId: string) => void (必填) |  |
| onDeleteSession | 删除指定会话 | (sessionId: string) => void (必填) |  |

#### SessionActionButtonsProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| streaming | 是否正在流式生成 | boolean |  |
| clearDisabled | 是否禁用清空对话 | boolean |  |
| onClearConversation | 清空当前对话回调 | () => void (必填) |  |