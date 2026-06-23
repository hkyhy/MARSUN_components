# Common/TooltipInfo

### 概述

用于在 Tooltip 中展示结构化详情信息，内部统一使用 CommonDescriptions 渲染。

### 示例

#### 示例样式

```scss
.tooltip-info-demo-root {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.tooltip-info-demo-container {
  cursor: pointer;
  font-weight: 500;
  color: var(--primary-color);
}

.tooltip-info-demo-wrapper {
  cursor: pointer;
}
```

#### 示例代码

- 基础用法
- hover 触发元素展示 DescriptionItem 详情
- _CommonTooltipInfo(@components/Common/TooltipInfo),_Common(@components/Common),_antd(antd)

```jsx
const MOCK_ROLE_META_ITEMS = [
  { label: '添加人', value: '系统管理员' },
  { label: '添加时间', value: '2026-06-08 11:58:19' },
];

const MOCK_DELETE_META_ITEMS = [
  { label: '删除人', value: '张三' },
  { label: '删除时间', value: '2026-06-08 10:30:00' },
];

const { SemanticTag, TooltipInfo } = _Common;

const TooltipInfoDemo = () => (
  <div className={'tooltip-info-demo-root'}>
    <TooltipInfo content={MOCK_ROLE_META_ITEMS}>
      <span className={'tooltip-info-demo-container'}>高管</span>
    </TooltipInfo>
    <TooltipInfo content={MOCK_DELETE_META_ITEMS}>
      <SemanticTag color="danger" className={'tooltip-info-demo-wrapper'}>
        文件已删除
      </SemanticTag>
    </TooltipInfo>
  </div>
);

render(<TooltipInfoDemo />);

```

### API

#### TooltipInfoProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| content | 详情描述项，内部使用 CommonDescriptions 渲染 | DescriptionItem[] (必填) |  |
| children | 触发 Tooltip 的元素 | React.ReactNode (必填) |  |
| column | CommonDescriptions 列数 | number | 1 |
| hidden | 为 true 或 content 为空时不展示 Tooltip | boolean | false |
| placement | Tooltip 位置 | TooltipProps['placement'] | 'top' |
| mouseEnterDelay | 鼠标移入后延时显示 | number | 0.3 |