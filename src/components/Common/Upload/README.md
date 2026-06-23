# Common/Upload

### 概述

通用文件上传组件，基于 antd Upload 封装，支持类型校验、大小限制、批量上传、OSS 上传等。

### 示例

#### 示例样式

```scss
.upload-panel-demo-root {
  max-width: xl;
}

.upload-panel-demo-container {
  font-size: 12px;
  color: var(--font-color-grey);
}






































































.upload-button-demo-root {
  max-width: xl;
}

.upload-button-demo-container {
  font-size: 12px;
  color: var(--font-color-grey);
}

.upload-button-demo-wrapper {
  color: var(--primary-color);
  cursor: pointer;
  &:hover { text-decoration: underline; }
}

.upload-button-demo-actions {
  font-size: 30px;
  margin-bottom: 8px;
}

.upload-button-demo-upload-text {
  /* antd Upload.Dragger text hook */
}
```

#### 示例代码

- 面板模式
- variant=panel 拖拽上传面板
- _CommonUpload(@components/Common/Upload),_Common(@components/Common),_antd(antd)

```jsx
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

```

- 按钮模式
- variant=button 按钮触发上传
- _CommonUpload(@components/Common/Upload),_Common(@components/Common),_antd(antd)

```jsx
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

```

### API

#### CommonUploadProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| value / onChange | Form 受控值与回调 | UploadFile[] / (fileList)=>void |  |
| fileSize | 单文件大小限制(字节) | number | 500MB |
| maxLength | 最大上传数量 | number |  |
| accept | 允许的文件类型 | string |  |
| multiple | 是否允许多选 | boolean |  |
| size | 尺寸 | 'small' | 'middle' | 'large' | 'middle' |
| variant | UI 变体：panel 面板 / button 按钮 | 'panel' | 'button' | 'button' |
| showFileList | 是否展示文件列表 | boolean | true |
| renderTips | 自定义提示区渲染 | () => ReactNode |  |
| onSave | 保存回调 | (fileList)=>void |  |
| ossUpload | 是否走 OSS 直传 | boolean |  |
| onUpload | 自定义上传函数 | (options) => Promise<void> |  |
| concurrentCount | 并发数 | number |  |