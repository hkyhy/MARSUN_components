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
