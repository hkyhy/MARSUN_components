#### CommonDescriptionsProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| content | 描述项数组 | DescriptionItem[] (必填) |  |
| column | 列数配置，支持响应式对象 | number | ResponsiveValue | 3 |
| bordered | 是否带边框 | boolean | false |
| size | 尺寸 | 'small' | 'default' | 'middle' | 'default' |
| title | 标题文本 | React.ReactNode |  |
| extra | 操作区 | React.ReactNode |  |

#### DescriptionItem

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| label | 标签文本 | string (必填) |  |
| value | 值内容 | React.ReactNode (必填) |  |
| span | 占列数 | number | 1 |