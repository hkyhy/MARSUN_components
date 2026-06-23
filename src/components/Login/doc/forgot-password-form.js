const { ForgotPasswordForm } = _Login;
import { Form } from 'antd';

const ForgotPasswordFormDemo = () => {
  const [form] = Form.useForm();

  return (
    <div className={'forgot-password-form-demo-demo-container'}>
      <ForgotPasswordForm
        form={form}
        loading={false}
        onFinish={(values) => console.log('重置密码提交:', values)}
        onBackToLogin={() => console.log('返回登录')}
      />
    </div>
  );
};

render(<ForgotPasswordFormDemo />);
