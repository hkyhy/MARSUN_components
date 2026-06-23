#### FileItemViewProps (FileItemView)

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| file | 文件数据 | FileItem（@/types） (必填) |  |
| status | 状态标签 | React.ReactNode |  |
| showDownload | 是否显示下载按钮 | boolean |  |
| showDelete | 是否显示删除按钮 | boolean |  |
| showPreview | 是否显示预览按钮 | boolean |  |
| actions | 自定义操作项 | FileItemAction[] |  |
| onDownload | 下载回调 | (file: FileItem) => void |  |
| onDelete | 删除回调 | (file: FileItem) => void |  |
| onPreview | 预览回调（不传则使用内置弹窗） | (file: FileItem) => void |  |

#### FileItemAction

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| key | 操作唯一标识 | string (必填) |  |
| icon | 操作图标 | React.ReactNode (必填) |  |
| tooltip | 提示文字 | string (必填) |  |
| onClick | 点击回调 | (file: FileItem) => void (必填) |  |

#### FileLinkProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| file | 文件数据 | FileItem（@/types） (必填) |  |
| onClick | 点击回调 | (file: FileItem) => void |  |

#### FileListProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| items | 文件列表项 | FileListItem[] (必填) |  |
| showDownload | 是否显示下载按钮 | boolean |  |
| showDelete | 是否显示删除按钮 | boolean |  |
| showPreview | 是否显示预览按钮 | boolean |  |
| onDownload | 下载回调 | (file: FileItem) => void |  |
| onDelete | 删除回调 | (file: FileItem) => void |  |
| onPreview | 预览回调 | (file: FileItem) => void |  |
| onLinkClick | 链接点击回调 | (file: FileItem) => void |  |
| className | 容器 className | string |  |

#### FileListItem

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| file | 文件数据 | FileItem（@/types） (必填) |  |
| type | 展示模式 | 'default' | 'link' |  |
| status | 状态标签（仅 default 模式） | React.ReactNode |  |
| actions | 自定义操作项（仅 default 模式） | FileItemAction[] |  |

#### FilePreviewProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| file | 文件数据 | FileItem（@/types） (必填) |  |
| url | 预览 URL 覆盖 | string |  |
| unsupportedMessage | 不支持预览时的提示 | string |  |

#### FilePreviewModalProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| open | 是否显示弹窗 | boolean (必填) |  |
| file | 文件数据 | FileItem | null (必填) |  |
| url | 预览 URL 覆盖 | string |  |
| onCancel | 关闭回调 | () => void (必填) |  |
| width | 弹窗宽度 | number |  |