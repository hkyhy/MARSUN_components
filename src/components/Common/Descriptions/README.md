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
/** 基础描述列表 mock 数据 */
const MOCK_BASIC_ITEMS = [
  { label: '文件名', value: '示例文档.pdf' },
  { label: '大小', value: '2.4 MB' },
  { label: '上传者', value: '张三' },
  { label: '状态', value: '已通过' },
  { label: '上传时间', value: '2026-05-21 10:30:00' },
  { label: '备注', value: '这是一个示例文件', span: 2 },
];

/** 三列资产详情 mock 数据 */
const MOCK_ASSET_ITEMS = [
  { label: '资产编号', value: 'AST-2026-001' },
  { label: '资产名称', value: 'MacBook Pro 16寸' },
  { label: '分类', value: '电子设备' },
  { label: '品牌', value: 'Apple' },
  { label: '型号', value: 'M4 Max' },
  { label: '购入价格', value: '¥27,999' },
  { label: '使用人', value: '李四' },
  { label: '所属部门', value: '技术部' },
  { label: '状态', value: '使用中' },
];

const { CommonDescriptions } = _Common;

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