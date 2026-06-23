#### TooltipInfoProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| content | 详情描述项，内部使用 CommonDescriptions 渲染 | DescriptionItem[] (必填) |  |
| children | 触发 Tooltip 的元素 | React.ReactNode (必填) |  |
| column | CommonDescriptions 列数 | number | 1 |
| hidden | 为 true 或 content 为空时不展示 Tooltip | boolean | false |
| placement | Tooltip 位置 | TooltipProps['placement'] | 'top' |
| mouseEnterDelay | 鼠标移入后延时显示 | number | 0.3 |