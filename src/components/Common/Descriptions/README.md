# Common/Descriptions

### 概述

通用描述列表组件，用于展示只读字段信息。基于 antd Descriptions 封装。

### 示例

#### 示例样式

```scss
.common-descriptions-demo-root {
  display: block;
}
```

#### 示例代码

- 基础用法
- 将 DescriptionItem 数组渲染为标准描述列表
- _CommonDescriptions(@components/Common/Descriptions),_Common(@components/Common),_antd(antd)

```jsx
const { CommonDescriptions } = _Common;
import { MOCK_ASSET_ITEMS, MOCK_BASIC_ITEMS } from '../mock';

const CommonDescriptionsDemo = () => (
  <div className={'common-descriptions-demo-root'}>
    <CommonDescriptions content={MOCK_BASIC_ITEMS} />
    <CommonDescriptions content={MOCK_ASSET_ITEMS} column={3} title="资产详情" />
  </div>
);

render(<CommonDescriptionsDemo />);

```

### API

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