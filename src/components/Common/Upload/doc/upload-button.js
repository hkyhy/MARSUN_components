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

/** 按钮模式 — 按钮触发文件选择 */
const UploadButtonDemo = () => (
  <div className={'upload-button-demo-root'}>
    <p className={'upload-button-demo-container'}>
      variant=&quot;button&quot;(默认) — 通过按钮触发文件选择。
    </p>
    <CommonUpload
      variant="button"
      accept={UPLOAD_CONFIG.accept}
      maxLength={UPLOAD_CONFIG.maxCount}
      fileSize={UPLOAD_CONFIG.maxSize}
    >
      <span className={'upload-button-demo-wrapper'}>
        选择文件上传
      </span>
    </CommonUpload>
  </div>
);

render(<UploadButtonDemo />);
