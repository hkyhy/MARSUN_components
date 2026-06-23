# Common/Modal

### 概述

步骤式弹窗等通用弹窗封装，将多步骤流程封装在同一个 Modal 中，自动管理步骤导航、标题切换和底部按钮。

### 示例

#### 示例样式

```scss
.step-modal-demo-inner {
  display: block;
}

.step-modal-demo-header {
  font-size: var(--font-size-small);
  color: var(--font-color-grey);
}

.step-modal-demo-body {
  background-color: var(--bg-color-grey);
  padding: 12px;
}

.step-modal-demo-footer {
  padding: 12px;
}

.step-modal-demo-row {
  padding-left: 16px; padding-right: 16px;
  padding-top: 8px; padding-bottom: 8px;
  color: var(--bg-color-white);
  background-color: var(--primary-color);
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
```

#### 示例代码

- 步骤式弹窗
- StepModal 将多步骤流程封装在 Modal 中，自动管理步骤导航、标题切换和底部按钮
- _CommonModal(@components/Common/Modal),_Common(@components/Common),_antd(antd)

```jsx
const { StepModal } = _Common;


const steps = [
  {
    key: 'basic',
    title: '基本信息',
    content: (
      <div className={'step-modal-demo-inner'}>
        <p className={'step-modal-demo-header'}>第一步：填写基本信息</p>
        <div className={'step-modal-demo-body'}>基本信息表单内容</div>
      </div>
    ),
  },
  {
    key: 'detail',
    title: '详细信息',
    content: () => (
      <div className={'step-modal-demo-inner'}>
        <p className={'step-modal-demo-header'}>第二步：补充详细信息</p>
        <div className={'step-modal-demo-body'}>详细信息表单内容（函数延迟求值）</div>
      </div>
    ),
  },
  {
    key: 'confirm',
    title: '确认提交',
    allowBack: true,
    content: () => (
      <div className={'step-modal-demo-inner'}>
        <p className={'step-modal-demo-header'}>第三步：确认并提交</p>
        <div className={'step-modal-demo-footer'}>请确认以上信息无误</div>
      </div>
    ),
  },
];

const StepModalDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState('basic');

  const handleOpen = () => {
    setCurrent('basic');
    setOpen(true);
  };

  return (
    <div>
      <button
        type="button"
        className={'step-modal-demo-row'}
        onClick={handleOpen}
      >
        打开步骤弹窗
      </button>
      <StepModal
        open={open}
        current={current}
        onCancel={() => setOpen(false)}
        onStepChange={setCurrent}
        steps={steps}
        width={600}
      />
    </div>
  );
};

render(<StepModalDemo />);

```

### API

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