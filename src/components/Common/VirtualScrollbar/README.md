# Common/VirtualScrollbar

### 概述

覆盖式虚拟滚动条，隐藏原生滚动条，thumb 悬浮不占布局宽度。

### 示例

#### 示例样式

```scss
.virtual-scrollbar-basic-demo-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.virtual-scrollbar-basic-demo-col {
  margin-bottom: 8px;
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color-grey);
}

.virtual-scrollbar-basic-demo-wrap {
  height: 220px;
  border: 1px solid var(--font-color-grey-4);
  border-radius: 8px;
  background-color: var(--bg-color-white);
}

.virtual-scrollbar-basic-demo-panel {
  padding: 8px;
}

.virtual-scrollbar-basic-demo-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.virtual-scrollbar-basic-demo-item {
  padding: 8px 10px;
  border-radius: 6px;
  background-color: var(--bg-color-grey);
}

.virtual-scrollbar-basic-demo-link {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--font-color);
}

.virtual-scrollbar-basic-demo-label {
  margin-top: 2px;
  font-size: 12px;
  color: var(--font-color-grey-1);
}

.virtual-scrollbar-basic-demo-value {
  padding: 8px;
}

.virtual-scrollbar-basic-demo-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 640px;
}

.virtual-scrollbar-basic-demo-icon {
  padding: 8px 10px;
  border-radius: 6px;
  background-color: var(--bg-color-grey);
  font-size: var(--font-size-small);
  white-space: nowrap;
}
```

#### 示例代码

- 基础用法
- 纵向与双向滚动示例，悬停或滚动时显示自定义 thumb
- _CommonVirtualScrollbar(@components/Common/VirtualScrollbar),_antd(antd)

```jsx
const { VirtualScrollbar } = _CommonVirtualScrollbar;

const items = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  title: &#96;列表项 ${index + 1}&#96;,
  description: '覆盖式虚拟滚动条不占布局宽度，悬停或滚动时显示 thumb。',
}));

const VirtualScrollbarBasicDemo = () => (
  <div className={'virtual-scrollbar-basic-demo-row'}>
    <div>
      <div className={'virtual-scrollbar-basic-demo-col'}>
        纵向滚动
      </div>
      <VirtualScrollbar
        wrapperClassName={'virtual-scrollbar-basic-demo-wrap'}
        className={'virtual-scrollbar-basic-demo-panel'}
      >
        <div className={'virtual-scrollbar-basic-demo-card'}>
          {items.map((item) => (
            <div
              key={item.id}
              className={'virtual-scrollbar-basic-demo-item'}
            >
              <div className={'virtual-scrollbar-basic-demo-link'}>
                {item.title}
              </div>
              <div className={'virtual-scrollbar-basic-demo-label'}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </VirtualScrollbar>
    </div>

    <div>
      <div className={'virtual-scrollbar-basic-demo-col'}>
        双向滚动
      </div>
      <VirtualScrollbar
        direction="both"
        wrapperClassName={'virtual-scrollbar-basic-demo-wrap'}
        className={'virtual-scrollbar-basic-demo-value'}
      >
        <div className={'virtual-scrollbar-basic-demo-meta'}>
          {items.slice(0, 12).map((item) => (
            <div
              key={item.id}
              className={'virtual-scrollbar-basic-demo-icon'}
            >
              {item.title} — 这是一段较长的横向内容，用于演示水平滚动条同样不占布局宽度
            </div>
          ))}
        </div>
      </VirtualScrollbar>
    </div>
  </div>
);

render(<VirtualScrollbarBasicDemo />);

```

### API

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