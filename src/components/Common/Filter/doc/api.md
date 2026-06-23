#### BaseFilterProps (公共属性)

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| filterKey | 筛选项唯一标识 | string (必填) |  |
| label | 显示标签 | string (必填) |  |
| active | 是否有值（控制选中态样式） | boolean |  |

#### FilterSelectProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| options | 选项列表 | FilterOption[] (必填) |  |
| value | 选中值 | string | number | undefined |  |
| onChange | 值变更回调 | (value) => void |  |
| placeholder | 占位符 | string |  |
| searchable | 是否可搜索 | boolean |  |
| multiple | 是否多选 | boolean |  |

#### FilterInputProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| value | 输入值 | string |  |
| onChange | 值变更回调 | (value) => void |  |
| placeholder | 占位符 | string |  |

#### FilterDateRangeProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| value | 日期区间 [start, end] | [string, string] | null |  |
| onChange | 值变更回调 | (value) => void |  |
| showQuickOptions | 是否显示快捷选项 | boolean | false |
| quickOptions | 自定义快捷选项 | QuickOption[] |  |

#### FilterNumberRangeProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| value | 数值区间 [min, max] | [number|undefined, number|undefined]|null |  |
| onChange | 值变更回调 | (value) => void |  |
| unit | 单位后缀 | string |  |
| minPlaceholder / maxPlaceholder | 最小/最大值占位符 | string |  |

#### FilterTreeSelectProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| treeData | 树形数据（优先于自动加载） | Department[] |  |
| autoLoadDept | 是否自动加载部门树 | boolean | true |
| value | 选中值 | string | undefined |  |
| onChange | 值变更回调 | (value: string | undefined) => void |  |
| showSearch | 是否显示搜索框 | boolean | false |
| multiple | 是否多选 | boolean | false |

#### CommonFilterProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| children | 子筛选器组件 | React.ReactNode (必填) |  |
| onClearAll | 清空全部额外回调（内部已通过 onRemove 自动清空） | () => void |  |
| label | 左侧标签文字 | string | "筛选" |
| selectedTagMaxLength | 已选标签 value 最大字符数，超出显示 ... 并在 hover 时展示完整内容 | number | 20 |