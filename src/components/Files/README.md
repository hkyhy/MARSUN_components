# Files

### 概述

文件管理模块的目录树、详情抽屉、筛选栏等业务组件。

### 示例

#### 示例样式

```scss
.files-demo-card-shadow {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.files-demo-demo-stack {
  @include flex-column(24px);
}

.files-demo-file-icon-blue {
  margin-right: 6px;
  color: var(--info-color);
}

.files-demo-breadcrumb-demo {
  margin-bottom: 12px;
}
```

#### 示例代码

- Files 组合
- 目录树 + 详情抽屉 + 筛选栏 + 批量操作
- _Files(@components/Files),_Common(@components/Common),_antd(antd)

```jsx
const { SemanticTag } = _Common;
import { File, Folder } from '@/icons';
import ButtonGroup from '@kne/button-group';
import { Breadcrumb, Card, Table, Tree } from 'antd';
import { FILE_STATUS_MAP } from '../config';
import { mockBreadcrumb, mockFiles, mockTreeData } from '../mock';

/** 文件夹树 Demo */
const FolderTreeDemo = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Card title="文件夹树" variant="borderless" className={'files-demo-card-shadow'} style={{ maxHeight: 400 }}>
      <Tree
        showIcon
        switcherIcon={<Folder />}
        treeData={mockTreeData}
        selectedKeys={selected}
        onSelect={(keys) => setSelected(keys [])}
      />
    </Card>
  );
};

/** 文件列表 Demo */
const FileListDemo = () => {
  const headerListArray: Record<string, unknown>[] = [
    {
      children: '新建文件夹',
      onClick: () => console.log('新建文件夹'),
    },
    {
      type: 'primary',
      children: '上传文件',
      onClick: () => console.log('上传文件'),
    },
  ];

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => (
        <>
          <File className={'files-demo-file-icon-blue'} />
          {v}
        </>
      ),
    },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '上传者', dataIndex: 'uploader', key: 'uploader' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <SemanticTag color={FILE_STATUS_MAP[v]?.color}>{FILE_STATUS_MAP[v]?.text}</SemanticTag>
      ),
    },
    { title: '日期', dataIndex: 'date', key: 'date' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: (typeof mockFiles)[0]) => {
        const listArray: Record<string, unknown>[] = [
          { type: 'link', children: '提报', onClick: () => console.log('提报', record) },
          { type: 'link', children: '重命名', onClick: () => console.log('重命名', record) },
          {
            type: 'link',
            children: '删除',
            danger: true,
            isDelete: true,
            message: &#96;确定删除「${record.name}」吗？&#96;,
          },
        ];
        return <ButtonGroup moreType="link" list={listArray} />;
      },
    },
  ];

  return (
    <Card
      title="文件列表"
      variant="borderless"
      className={'files-demo-card-shadow'}
      extra={<ButtonGroup list={headerListArray} />}
    >
      <Breadcrumb items={mockBreadcrumb.map((b) => ({ title: b.title }))} className={'files-demo-breadcrumb-demo'} />
      <Table dataSource={mockFiles} columns={columns} size="small" pagination={false} />
    </Card>
  );
};

export { FileListDemo, FolderTreeDemo };

const FilesDemo = () => (
  <div className={'files-demo-demo-stack'}>
    <FileListDemo />
  </div>
);

render(<FilesDemo />);

```

### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
