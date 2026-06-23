const { FilePreview, FilePreviewModal } = _Common;
import { Button, Card, Radio, Space } from 'antd';
import { mockFileItems } from '../mock';

const FilePreviewDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState<(typeof mockFileItems)[0] | null>(null);
  const [previewMode, setPreviewMode] = useState<'inline' | 'modal'>('inline');
  const [inlineFileId, setInlineFileId] = useState<string>('4'); // 默认选中图片

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
