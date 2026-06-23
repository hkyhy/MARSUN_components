const { CommonUpload } = _Common;
import { UPLOAD_CONFIG } from '../mock';

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
