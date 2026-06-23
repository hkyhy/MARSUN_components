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