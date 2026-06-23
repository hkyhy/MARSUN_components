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