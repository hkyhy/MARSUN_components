const { StepModal } = _Common;


const steps = [
  {
    key: 'basic',
    title: '基本信息',
    content: (
      <div className={'step-modal-demo-inner'}>
        <p className={'step-modal-demo-header'}>第一步：填写基本信息</p>
        <div className={'step-modal-demo-body'}>基本信息表单内容</div>
      </div>
    ),
  },
  {
    key: 'detail',
    title: '详细信息',
    content: () => (
      <div className={'step-modal-demo-inner'}>
        <p className={'step-modal-demo-header'}>第二步：补充详细信息</p>
        <div className={'step-modal-demo-body'}>详细信息表单内容（函数延迟求值）</div>
      </div>
    ),
  },
  {
    key: 'confirm',
    title: '确认提交',
    allowBack: true,
    content: () => (
      <div className={'step-modal-demo-inner'}>
        <p className={'step-modal-demo-header'}>第三步：确认并提交</p>
        <div className={'step-modal-demo-footer'}>请确认以上信息无误</div>
      </div>
    ),
  },
];

const StepModalDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState('basic');

  const handleOpen = () => {
    setCurrent('basic');
    setOpen(true);
  };

  return (
    <div>
      <button
        type="button"
        className={'step-modal-demo-row'}
        onClick={handleOpen}
      >
        打开步骤弹窗
      </button>
      <StepModal
        open={open}
        current={current}
        onCancel={() => setOpen(false)}
        onStepChange={setCurrent}
        steps={steps}
        width={600}
      />
    </div>
  );
};

render(<StepModalDemo />);
