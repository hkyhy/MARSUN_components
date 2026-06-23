# Common/Layout

### 概述

统一的页面头部布局容器，集成标题、返回按钮、操作按钮区与页面说明提示。

### 示例

#### 示例样式

```scss
.page-header-layout-demo-header {
  padding: 16px;
  color: var(--font-color-grey);
}
```

#### 示例代码

- 基础用法
- PageHeaderLayout 标题 + 操作按钮组合
- _CommonLayout(@components/Common/Layout),_Common(@components/Common),_kneButtonGroup(@kne/button-group),_antd(antd)

```jsx
const { PageHeaderLayout } = _Common;
const { default: ButtonGroup } = _kneButtonGroup;

const PageHeaderLayoutDemo = () => {
  const headerListArray = [
    {
      children: '新建文件夹',
      onClick: () => console.log('新建文件夹'),
    },
    {
      type: 'primary',
      children: '上传文件',
      onClick: () => console.log('上传文件'),
    },
  ];

  return (
    <PageHeaderLayout
      title="页面标题"
      actions={<ButtonGroup list={headerListArray} />}
      description="页面说明提示，用于解释当前页面的用途或注意事项。"
    >
      <div className={'page-header-layout-demo-header'}>页面内容区域</div>
    </PageHeaderLayout>
  );
};

render(<PageHeaderLayoutDemo />);

```

### API

#### PageHeaderLayoutProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| title | 页面标题 | string (必填) |  |
| onBack | 返回按钮点击回调 | () => void |  |
| actions | 右侧操作区内容 | React.ReactNode |  |
| description | 页面说明提示，显示在头部下方 | React.ReactNode |  |
| children | 页面主体内容 | React.ReactNode |  |