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