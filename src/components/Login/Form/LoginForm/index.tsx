import { Lock, User } from '@/icons';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import styles from './style.module.scss';
import classNames from 'classnames';

const { Title, Text } = Typography;

interface LoginFormProps {
  form: FormInstance;
  loading: boolean;
  onFinish: (values: { employeeId: string; password: string }) => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ form, loading, onFinish, onForgotPassword }) => (
  <>
    <Title level={3} className={classNames('login-form-form-title', styles['login-form-form-title'])}>
      登录
    </Title>
    <Text type="secondary" className={classNames('login-form-form-subtitle', styles['login-form-form-subtitle'])}>
      请输入您的工号和密码
    </Text>
    <Form form={form} onFinish={onFinish} size="large" autoComplete="off">
      <Form.Item name="employeeId" rules={[{ required: true, message: '请输入工号' }]}>
        <Input prefix={<User />} placeholder="工号" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password prefix={<Lock />} placeholder="密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          登录
        </Button>
      </Form.Item>
    </Form>
    <div className={classNames('login-form-form-footer', styles['login-form-form-footer'])}>
      <span
        className={classNames('login-form-form-link', styles['login-form-form-link'])}
        onClick={onForgotPassword}
      >
        忘记密码？
      </span>
    </div>
  </>
);

export default LoginForm;
