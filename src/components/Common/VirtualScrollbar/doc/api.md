#### VirtualScrollbarProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| children | 滚动内容 | React.ReactNode (必填) |  |
| direction | 滚动方向 | 'vertical' | 'horizontal' | 'both' | 'vertical' |
| autoHide | 滚动/悬停后自动隐藏 thumb | boolean | true |
| className | viewport 容器 className | string |  |
| wrapperClassName | 外层容器 className | string |  |
| style | 外层容器 style | React.CSSProperties |  |
| onScroll | viewport 滚动回调 | React.UIEventHandler<HTMLDivElement> |  |