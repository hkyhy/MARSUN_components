/** 上传组件配置 */
const UPLOAD_CONFIG = {
  /** 最大文件数 */
  maxCount: 5,
  /** 最大文件大小（50MB） */
  maxSize: 50 * 1024 * 1024,
  /** 允许的文件类型 */
  accept: '.pdf,.doc,.docx,.xlsx,.png,.jpg',
  /** 允许的文件类型描述 */
  acceptText: 'PDF、Word、Excel、图片',
};

/** Mock 已上传文件列表 */
const MOCK_FILE_LIST = [
  { uid: '1', name: '报告.pdf', status: 'done', url: '#' },
  { uid: '2', name: '方案.docx', status: 'done', url: '#' },
];

const { CommonUpload } = _Common;

/** 面板模式 — 拖拽上传区域 */
const UploadPanelDemo = () => (
  <div className={'upload-panel-demo-root'}>
    <p className={'upload-panel-demo-container'}>
      variant=&quot;panel&quot; — 显示拖拽面板，支持拖拽或点击选择文件。
    </p>
    <CommonUpload
      variant="panel"
      accept={UPLOAD_CONFIG.accept}
      maxLength={UPLOAD_CONFIG.maxCount}
      fileSize={UPLOAD_CONFIG.maxSize}
    />
  </div>
);

render(<UploadPanelDemo />);
