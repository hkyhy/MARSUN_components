const mockDatasets = [
  {
    id: 'kb-1',
    name: '企业制度手册',
    description: '包含考勤、休假、报销等制度文档',
    chunk_count: 1280,
    document_count: 24,
    token_num: 520000,
  },
  {
    id: 'kb-2',
    name: '产品技术文档',
    description: 'API 文档与架构设计说明',
    chunk_count: 860,
    document_count: 12,
    token_num: 310000,
  },
  {
    id: 'kb-3',
    name: '客户服务 FAQ',
    description: '常见问题与标准回复话术',
    chunk_count: 420,
    document_count: 8,
    token_num: 98000,
  },
];

const mockChatAssistants = [
  {
    id: 'chat-1',
    name: '制度问答助手',
    description: '基于企业制度知识库，解答考勤、休假、报销等问题',
    status: '1',
    dataset_ids: ['kb-1', 'kb-3'],
    prompt_config: { prologue: '您好，我是制度问答助手，有什么可以帮您？' },
  },
  {
    id: 'chat-2',
    name: '技术支持助手',
    description: '解答产品 API 与集成相关问题',
    status: '1',
    dataset_ids: ['kb-2'],
    prompt_config: { prologue: '您好，我是技术支持助手。' },
  },
  {
    id: 'chat-3',
    name: '草稿助手',
    description: '尚未配置知识库',
    status: '0',
    dataset_ids: [],
  },
];

const mockCitations = [
  {
    id: 'cite-1',
    doc_id: 'doc-1',
    doc_name: '员工休假管理制度.pdf',
    content:
      '正式员工每年享有带薪年假，工龄满 1 年不满 10 年的，年休假 5 天；满 10 年不满 20 年的，年休假 10 天；满 20 年的，年休假 15 天。',
    score: 0.92,
    page_no: 3,
  },
  {
    id: 'cite-2',
    doc_id: 'doc-2',
    doc_name: '考勤管理办法.pdf',
    content:
      '员工请假须提前在 OA 系统提交申请，3 天以内由直属主管审批，3 天以上需部门负责人审批。',
    score: 0.78,
    page_no: 7,
  },
];

const mockUserMessage = {
  id: 'msg-1',
  role: 'user',
  content: '请问正式员工的年假有多少天？',
};

const mockAssistantMessage = {
  id: 'msg-2',
  role: 'assistant',
  content:
    '根据企业制度，正式员工的年假天数与工龄相关：[ID:1]\n\n- 工龄 1-10 年：5 天\n- 工龄 10-20 年：10 天\n- 工龄 20 年以上：15 天\n\n以下是精梳棉流程的 Mermaid 流程图：\n\n```mermaid\ngraph LR\n    A[梳棉生条] --> B[并条机（预并）]\n    B --> C[条并联合机（条卷）]\n    C --> D[精梳机]\n    D --> E[精梳条]\n    E --> F[并条]\n```\n\n请假流程请参考考勤规定 [ID:2]。',
  citations: mockCitations,
};

const mockStreamingMessage = {
  id: 'msg-3',
  role: 'assistant',
  content: '',
  streaming: true,
};

const mockChatSessions = [
  {
    id: 'sess-1',
    chat_id: 'chat-1',
    name: '新会话',
    messages: [{ id: 'm1', role: 'user', content: '请问正式员工的年假有多少天？' }],
    create_time: Date.now() - 1000 * 60 * 12,
    update_time: Date.now() - 1000 * 60 * 5,
  },
  {
    id: 'sess-2',
    chat_id: 'chat-1',
    name: '新会话',
    messages: [{ id: 'm2', role: 'user', content: '报销流程需要哪些材料？' }],
    create_time: Date.now() - 1000 * 60 * 60 * 26,
    update_time: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'sess-3',
    chat_id: 'chat-1',
    name: '考勤制度咨询',
    messages: [{ id: 'm3', role: 'user', content: '迟到 30 分钟怎么算？' }],
    create_time: Date.now() - 1000 * 60 * 60 * 72,
    update_time: Date.now() - 1000 * 60 * 60 * 48,
  },
];

const { default: ChatInput } = _AgentHubChatDetailChatInput;
const { default: CitationPanel } = _AgentHubChatDetailCitationPanel;
const { default: MessageItem } = _AgentHubChatDetailMessageItem;
const { default: SessionSidebar } = _AgentHubChatListSessionSidebar;
const { useAutoScrollToBottom } = _AgentHubChathooks;
const { animateScrollFromTopToBottom, getScrollBottom } = _AgentHubChatUtilsSmoothScroll;
const { VirtualScrollbar } = _CommonVirtualScrollbar;

const { message } = _antd;

const sessionMessagesMap = {
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
  const [sessions, setSessions] = React.useState(mockChatSessions);
  const [activeSessionId, setActiveSessionId] = React.useState(mockChatSessions[0]?.id);
  const [input, setInput] = React.useState('');
  const [citations, setCitations] = React.useState([]);
  const [showCitations, setShowCitations] = React.useState(false);
  const [highlightedCitationIndex, setHighlightedCitationIndex] = React.useState();

  const scrollContainerRef = React.useRef(null);
  const messagesContentRef = React.useRef(null);
  const prevSessionIdForScrollRef = React.useRef();
  const scrollAnimationCleanupRef = React.useRef(null);

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
    (behavior = 'auto') => {
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

  const handleCitationClick = React.useCallback((messageCitations, index) => {
    setCitations(messageCitations);
    setHighlightedCitationIndex(index);
    setShowCitations(true);
  }, []);

  const handleCreateSession = () => {
    const newSession = {
      id: `sess-${Date.now()}`,
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

  const handleClearSession = (sessionId) => {
    const newSession = {
      id: `sess-${Date.now()}`,
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

  const handleDeleteSession = (sessionId) => {
    const remaining = sessions.filter((item) => item.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0]?.id);
      setInput('');
      resetCitationState();
    }
    message.success('会话已删除');
  };

  const handleSelectSession = (sessionId) => {
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
