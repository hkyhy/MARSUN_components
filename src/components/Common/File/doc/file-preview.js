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
        <Card size="small" title={`${currentInlineFile.name} 预览`}>
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
