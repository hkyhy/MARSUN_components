const { LoginForm } = _Login;
import { Form } from 'antd';

const LoginFormDemo = () => {
  const [form] = Form.useForm();

  return (
    <div className={'login-form-demo-demo-container'}>
      <LoginForm
        form={form}
        loading={false}
        onFinish={(values) => console.log('登录提交:', values)}
        onForgotPassword={() => console.log('切换到忘记密码')}
      />
    </div>
  );
};

render(<LoginFormDemo />);
