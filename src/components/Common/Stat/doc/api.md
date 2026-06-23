#### StatCardProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| title | 标题 | string (必填) |  |
| value | 数值 | number (必填) |  |
| prefix | 前缀图标 | React.ReactNode |  |
| color | 数值颜色 | string |  |
| onClick | 点击回调 | () => void |  |
| inline | 内联模式（无 Card 包裹） | boolean |  |
| fontSize | 内联模式字体大小 | number |  |

#### StatCardListProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| items | 统计项列表 | StatItem[] (必填) |  |
| gutter | 行列间距 | [number, number] |  |
| className | 容器 className | string |  |
| inline | 内联模式 | boolean |  |
| fontSize | 内联模式字体大小 | number |  |