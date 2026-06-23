const { CommonUpload } = _Common;
import { UPLOAD_CONFIG } from '../mock';

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
