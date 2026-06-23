#### StepModalProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| title | 弹窗标题（覆盖步骤标题） | string |  |
| steps | 步骤列表 | StepItem[] (必填) |  |
| current | 当前步骤 key | string (必填) |  |
| open | 弹窗是否打开 | boolean (必填) |  |
| onCancel | 取消/关闭回调 | () => void (必填) |  |
| onStepChange | 切换步骤回调 | (key: string) => void |  |
| width | 弹窗宽度 | number | 600 |
| showSteps | 是否显示 Steps 导航条 | boolean | true |
| maskClosable | 是否允许点击遮罩关闭 | boolean | false |

#### StepItem

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| key | 步骤唯一标识 | string (必填) |  |
| title | 步骤标题 | string (必填) |  |
| description | 步骤描述 | string |  |
| content | 步骤内容，支持 JSX 或函数延迟求值 | ReactNode | (() => ReactNode) (必填) |  |
| footer | 底部按钮区域，不传则自动渲染 | ReactNode | (() => ReactNode) |  |
| allowBack | 是否允许返回上一步 | boolean | true |
| beforeEnter | 进入该步骤前的校验 | () => boolean | Promise<boolean> |  |