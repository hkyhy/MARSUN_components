# Common/Form

### 概述

业务表单中常用的选择型控件封装和步骤式表单弹窗，对接后端部门树、上传者数据，支持多步骤流程管理。

### 示例

#### 示例样式

```scss
.department-select-demo-header {
  display: block;
}

.department-select-demo-body {
  margin-bottom: 4px;
  display: block;
  font-size: var(--font-size-small);
  color: var(--font-color-grey);
}









































.uploader-select-demo-header {
  display: block;
}

.uploader-select-demo-col {
  margin-bottom: 4px;
  display: block;
  font-size: 12px;
  color: var(--font-color-grey);
}

.uploader-select-demo-wrap {
  margin-top: 4px;
  font-size: 12px;
  color: var(--font-color-grey-1);
}





































.step-form-demo-footer {
  padding: 12px;
}

.step-form-demo-row {
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

- 部门选择器
- DepartmentSelect 树形下拉选择，支持排除当前节点和标记当前部门
- _CommonForm(@components/Common/Form),_Common(@components/Common),_antd(antd)

```jsx
const { DepartmentSelect, UploaderSelect } = _Common;

const FormSelectsDemo = () => {
  const [dept, setDept] = React.useState();
  const [uploader, setUploader] = React.useState();

  return (
    <div className={'department-select-demo-header'}>
      <div>
        <label className={'department-select-demo-body'}>部门选择</label>
        <DepartmentSelect
          value={dept}
          onChange={(v) => setDept(v )}
          style={{ width: 240 }}
        />
      </div>
      <div>
        <label className={'department-select-demo-body'}>上传者选择</label>
        <UploaderSelect
          value={uploader}
          onChange={(v) => setUploader(v )}
          style={{ width: 240 }}
        />
      </div>
    </div>
  );
};

render(<FormSelectsDemo />);

```

- 上传者选择器
- UploaderSelect 用户下拉选择
- _CommonForm(@components/Common/Form),_Common(@components/Common),_antd(antd)

```jsx
const { UploaderSelect } = _Common;

/** UploaderSelect 基础用法 */
const UploaderSelectDemo = () => {
  const [uploader, setUploader] = React.useState();

  return (
    <div className={'uploader-select-demo-header'}>
      <div>
        <label className={'uploader-select-demo-col'}>上传者选择</label>
        <UploaderSelect
          value={uploader}
          onChange={(v) => setUploader(v )}
          placeholder="请选择上传者"
          style={{ width: 280 }}
        />
        <p className={'uploader-select-demo-wrap'}>当前选中：{uploader ?? '-'}</p>
      </div>
    </div>
  );
};

render(<UploaderSelectDemo />);

```

- 步骤式表单弹窗
- StepForm 在 StepModal 基础上集成 Form 校验，每个步骤可声明校验字段
- _CommonForm(@components/Common/Form),_Common(@components/Common),_antd(antd)

```jsx
const { StepForm } = _Common;

const { Form, Input, Select } = _antd;

const steps = [
  {
    key: 'basic',
    title: '基本信息',
    validateFields: ['name'],
    content: () => (
      <>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item name="type" label="类型">
          <Select
            placeholder="请选择类型"
            options={[
              { label: '类型A', value: 'a' },
              { label: '类型B', value: 'b' },
            ]}
          />
        </Form.Item>
      </>
    ),
  },
  {
    key: 'detail',
    title: '详细信息',
    validateFields: ['description'],
    content: () => (
      <Form.Item
        name="description"
        label="描述"
        rules={[{ required: true, message: '请输入描述' }]}
      >
        <Input.TextArea rows={3} placeholder="请输入描述" />
      </Form.Item>
    ),
  },
  {
    key: 'confirm',
    title: '确认提交',
    content: () => (
      <div className={'step-form-demo-footer'}>
        请确认以上信息无误后提交
      </div>
    ),
    footer: null,
  },
];

const StepFormDemo = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState('basic');

  const handleOpen = () => {
    form.resetFields();
    setCurrent('basic');
    setOpen(true);
  };

  return (
    <div>
      <button
        type="button"
        className={'step-form-demo-row'}
        onClick={handleOpen}
      >
        打开步骤表单
      </button>
      <StepForm
        form={form}
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

render(<StepFormDemo />);

```

### API

#### DepartmentSelectProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| excludeId | 编辑时排除当前部门 ID | string |  |
| currentId | 当前所属部门 ID（显示"当前"标签） | string |  |
| ...TreeSelect props | 继承 antd TreeSelect 其余属性 | Omit<TreeSelectProps, "treeData"> |  |

#### UploaderSelectProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| ...Select props | 继承 antd Select 其余属性 | Omit<SelectProps, "options" | "loading"> |  |

#### StepFormProps (extends StepModalProps)

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| form | antd Form 实例 | FormInstance (必填) |  |
| steps | 步骤列表（StepFormItem[]） | StepFormItem[] (必填) |  |

#### StepFormItem (extends StepItem)

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| validateFields | 进入下一步前校验的表单字段列表 | string[] |  |
| beforeEnter | 自定义校验（在 validateFields 之后执行） | (values: Record<string, unknown>) => boolean | Promise<boolean> |  |