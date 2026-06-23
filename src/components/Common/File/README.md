# Common/File

### 概述

文件展示与预览组件，支持文件项、文件链接、文件列表及多种文件类型的在线预览。

### 示例

#### 示例样式

```scss
.file-item-basic-demo-value {
  font-size: 12px;
}

.file-item-basic-demo-preview {
  display: block;
}

.file-item-basic-demo-scroll {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
  margin-bottom: 8px;
}

.file-item-basic-demo-viewport {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
  margin-top: 24px;
  margin-bottom: 8px;
}







































































































































.file-link-demo-preview {
  display: block;
}

.file-link-demo-scroll {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
  margin-bottom: 8px;
}

.file-link-demo-viewport {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
  margin-top: 24px;
  margin-bottom: 8px;
}

.file-link-demo-thumb {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-link-demo-track {
  display: flex;
  align-items: center;
  gap: 16px;
}































































































































.file-list-demo-scroll {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
  margin-bottom: 8px;
}

.file-list-demo-viewport {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
  margin-top: 24px;
  margin-bottom: 8px;
}

.file-list-demo-banner {
  display: block;
}































































































































.file-preview-demo-user-menu {
  font-size: 12px;
  color: var(--font-color-grey-1);
}

.file-preview-demo-scroll {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
  margin-bottom: 8px;
}

.file-preview-demo-stats {
  display: block;
}
```

#### 示例代码

- FileItemView 文件项
- 展示文件图标、名称、状态和操作按钮
- _CommonFile(@components/Common/File),_Common(@components/Common),_antd(antd)

```jsx
const mockFileItems = [
  {
    id: '1',
    name: '项目需求文档.docx',
    type: 'FILE',
    size: 1024000,
    extension: '.docx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: '数据分析报表.xlsx',
    type: 'FILE',
    size: 512000,
    extension: '.xlsx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'PENDING_REVIEWER',
    version: 2,
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
  },
  {
    id: '3',
    name: '产品演示.pptx',
    type: 'FILE',
    size: 5120000,
    extension: '.pptx',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-10T16:45:00Z',
    updatedAt: '2026-03-10T16:45:00Z',
  },
  {
    id: '4',
    name: '系统架构图.png',
    type: 'FILE',
    size: 2048000,
    extension: '.png',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: '5',
    name: '接口文档.pdf',
    type: 'FILE',
    size: 3072000,
    extension: '.pdf',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'REVIEWING_REVIEWER',
    version: 3,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-05T17:30:00Z',
  },
  {
    id: '6',
    name: '产品演示.mp4',
    type: 'FILE',
    size: 8388608,
    extension: '.mp4',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-11T16:45:00Z',
    updatedAt: '2026-03-11T16:45:00Z',
  },
];

const { FileItemView, ReviewStatusTag } = _Common;
const { message } = _antd;

const customActions = [
  {
    key: 'share',
    icon: <span className={'file-item-basic-demo-value'}>📤</span>,
    tooltip: '分享',
    onClick: (file) => message.info(&#96;分享: ${file.name}&#96;),
  },
];

const FileItemBasicDemo = () => {
  return (
    <div className={'file-item-basic-demo-preview'}>
      <h4 className={'file-item-basic-demo-scroll'}>基础用法（图标 + 文件名 + 操作）</h4>
      {mockFileItems.slice(0, 3).map((file) => (
        <FileItemView key={file.id} file={file} />
      ))}

      <h4 className={'file-item-basic-demo-viewport'}>带状态标签</h4>
      {mockFileItems.slice(0, 3).map((file) => (
        <FileItemView
          key={file.id}
          file={file}
          status={<ReviewStatusTag status={file.reviewStatus} />}
        />
      ))}

      <h4 className={'file-item-basic-demo-viewport'}>带删除和自定义操作</h4>
      {mockFileItems.slice(0, 2).map((file) => (
        <FileItemView
          key={file.id}
          file={file}
          showDelete
          actions={customActions}
          onDelete={(f) => message.info(&#96;删除: ${f.name}&#96;)}
        />
      ))}
    </div>
  );
};

render(<FileItemBasicDemo />);

```

- FileLink 文件链接
- 以链接形式展示文件
- _CommonFile(@components/Common/File),_Common(@components/Common),_antd(antd)

```jsx
const mockFileItems = [
  {
    id: '1',
    name: '项目需求文档.docx',
    type: 'FILE',
    size: 1024000,
    extension: '.docx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: '数据分析报表.xlsx',
    type: 'FILE',
    size: 512000,
    extension: '.xlsx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'PENDING_REVIEWER',
    version: 2,
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
  },
  {
    id: '3',
    name: '产品演示.pptx',
    type: 'FILE',
    size: 5120000,
    extension: '.pptx',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-10T16:45:00Z',
    updatedAt: '2026-03-10T16:45:00Z',
  },
  {
    id: '4',
    name: '系统架构图.png',
    type: 'FILE',
    size: 2048000,
    extension: '.png',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: '5',
    name: '接口文档.pdf',
    type: 'FILE',
    size: 3072000,
    extension: '.pdf',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'REVIEWING_REVIEWER',
    version: 3,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-05T17:30:00Z',
  },
  {
    id: '6',
    name: '产品演示.mp4',
    type: 'FILE',
    size: 8388608,
    extension: '.mp4',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-11T16:45:00Z',
    updatedAt: '2026-03-11T16:45:00Z',
  },
];

const { FileLink } = _Common;
const { message } = _antd;

const FileLinkDemo = () => {
  return (
    <div className={'file-link-demo-preview'}>
      <h4 className={'file-link-demo-scroll'}>文件链接列表</h4>
      <div className={'file-link-demo-thumb'}>
        {mockFileItems.map((file) => (
          <FileLink
            key={file.id}
            file={file}
            onClick={(f) => message.info(&#96;点击文件: ${f.name}&#96;)}
          />
        ))}
      </div>

      <h4 className={'file-link-demo-viewport'}>内联展示</h4>
      <div className={'file-link-demo-track'}>
        附件：
        {mockFileItems.slice(0, 3).map((file) => (
          <FileLink key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};

render(<FileLinkDemo />);

```

- FileList 文件列表
- 展示文件列表，支持 default 和 link 两种模式
- _CommonFile(@components/Common/File),_Common(@components/Common),_antd(antd)

```jsx
const mockFileItems = [
  {
    id: '1',
    name: '项目需求文档.docx',
    type: 'FILE',
    size: 1024000,
    extension: '.docx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: '数据分析报表.xlsx',
    type: 'FILE',
    size: 512000,
    extension: '.xlsx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'PENDING_REVIEWER',
    version: 2,
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
  },
  {
    id: '3',
    name: '产品演示.pptx',
    type: 'FILE',
    size: 5120000,
    extension: '.pptx',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-10T16:45:00Z',
    updatedAt: '2026-03-10T16:45:00Z',
  },
  {
    id: '4',
    name: '系统架构图.png',
    type: 'FILE',
    size: 2048000,
    extension: '.png',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: '5',
    name: '接口文档.pdf',
    type: 'FILE',
    size: 3072000,
    extension: '.pdf',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'REVIEWING_REVIEWER',
    version: 3,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-05T17:30:00Z',
  },
  {
    id: '6',
    name: '产品演示.mp4',
    type: 'FILE',
    size: 8388608,
    extension: '.mp4',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-11T16:45:00Z',
    updatedAt: '2026-03-11T16:45:00Z',
  },
];

const { FileList, ReviewStatusTag } = _Common;
const { message } = _antd;

const FileListDemo = () => {
  return (
    <div className={'file-list-demo-banner'}>
      <h4 className={'file-list-demo-scroll'}>默认模式（FileItem）</h4>
      <FileList
        items={mockFileItems.slice(0, 3).map((file) => ({
          file,
          status: <ReviewStatusTag status={file.reviewStatus} />,
        }))}
        onDelete={(f) => message.info(&#96;删除: ${f.name}&#96;)}
        showDelete
      />

      <h4 className={'file-list-demo-viewport'}>链接模式（FileLink）</h4>
      <FileList
        items={mockFileItems.map((file) => ({ file, type: 'link'  }))}
        onLinkClick={(f) => message.info(&#96;点击: ${f.name}&#96;)}
      />

      <h4 className={'file-list-demo-viewport'}>混合模式</h4>
      <FileList
        items={[
          ...mockFileItems.slice(0, 2).map((file) => ({
            file,
            type: 'default' ,
            status: <ReviewStatusTag status={file.reviewStatus} />,
          })),
          ...mockFileItems.slice(2, 4).map((file) => ({
            file,
            type: 'link' ,
          })),
        ]}
      />
    </div>
  );
};

render(<FileListDemo />);

```

- FilePreview 文件预览
- 文件预览弹窗，支持图片、PDF、视频、Excel、文本等格式
- _CommonFile(@components/Common/File),_Common(@components/Common),_antd(antd)

```jsx
const mockFileItems = [
  {
    id: '1',
    name: '项目需求文档.docx',
    type: 'FILE',
    size: 1024000,
    extension: '.docx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: '数据分析报表.xlsx',
    type: 'FILE',
    size: 512000,
    extension: '.xlsx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'PENDING_REVIEWER',
    version: 2,
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
  },
  {
    id: '3',
    name: '产品演示.pptx',
    type: 'FILE',
    size: 5120000,
    extension: '.pptx',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-10T16:45:00Z',
    updatedAt: '2026-03-10T16:45:00Z',
  },
  {
    id: '4',
    name: '系统架构图.png',
    type: 'FILE',
    size: 2048000,
    extension: '.png',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: '5',
    name: '接口文档.pdf',
    type: 'FILE',
    size: 3072000,
    extension: '.pdf',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'REVIEWING_REVIEWER',
    version: 3,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-05T17:30:00Z',
  },
  {
    id: '6',
    name: '产品演示.mp4',
    type: 'FILE',
    size: 8388608,
    extension: '.mp4',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-11T16:45:00Z',
    updatedAt: '2026-03-11T16:45:00Z',
  },
];

const { FilePreview, FilePreviewModal } = _Common;
const { Button, Card, Radio, Space } = _antd;

const FilePreviewDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [previewMode, setPreviewMode] = React.useState('inline');
  const [inlineFileId, setInlineFileId] = React.useState('4'); // 默认选中图片

  const handlePreview = (file: (typeof mockFileItems)[0]) => {
    setSelectedFile(file);
    if (previewMode === 'modal') {
      setOpen(true);
    }
    setInlineFileId(file.id);
  };

  const currentInlineFile = mockFileItems.find((f) => f.id === inlineFileId);

  return (
    <div className={'file-preview-demo-stats'}>
      {/* 预览模式切换 */}
      <div>
        <h4 className={'file-preview-demo-scroll'}>文件预览</h4>
        <Radio.Group
          value={previewMode}
          onChange={(e) => setPreviewMode(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="inline">直接展示预览</Radio.Button>
          <Radio.Button value="modal">弹窗预览</Radio.Button>
        </Radio.Group>
      </div>

      {/* 文件选择 */}
      <p className={'file-preview-demo-user-menu'}>
        选择文件进行预览（实际预览需要后端 API 支持，此处仅展示组件交互）
      </p>
      <Space wrap>
        {mockFileItems.map((file) => (
          <Button
            key={file.id}
            size="small"
            type={file.id === inlineFileId ? 'primary' : 'default'}
            onClick={() => handlePreview(file)}
          >
            {file.name}
          </Button>
        ))}
      </Space>

      {/* 直接展示预览 */}
      {previewMode === 'inline' && currentInlineFile && (
        <Card size="small" title={&#96;${currentInlineFile.name} 预览&#96;}>
          <FilePreview file={currentInlineFile} />
        </Card>
      )}

      {/* 弹窗预览 */}
      {previewMode === 'modal' && (
        <FilePreviewModal
          open={open}
          file={selectedFile || null}
          onCancel={() => setOpen(false)}
          width={900}
        />
      )}
    </div>
  );
};

render(<FilePreviewDemo />);

```

### API

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