import { Lock, User } from '@/icons';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import styles from './style.module.scss';
import classNames from 'classnames';

const { Title, Text } = Typography;

interface ForgotPasswordFormProps {
  form: FormInstance;
  loading: boolean;
  onFinish: (values: { employeeId: string; displayName: string; newPassword: string }) => void;
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  form,
  loading,
  onFinish,
  onBackToLogin,
}) => (
  <>
    <Title level={3} className={classNames('forgot-password-form-form-title', styles['forgot-password-form-form-title'])}>
      重置密码
    </Title>
    <Text type="secondary" className={classNames('forgot-password-form-form-subtitle', styles['forgot-password-form-form-subtitle'])}>
      通过工号和姓名验证身份后设置新密码
    </Text>
    <Form form={form} onFinish={onFinish} size="large" autoComplete="off">
      <Form.Item name="employeeId" rules={[{ required: true, message: '请输入工号' }]}>
        <Input prefix={<User />} placeholder="工号" />
      </Form.Item>
      <Form.Item name="displayName" rules={[{ required: true, message: '请输入姓名' }]}>
        <Input prefix={<User />} placeholder="请输入真实姓名" />
      </Form.Item>
      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: '请输入新密码' },
          { min: 6, message: '密码至少6位' },
        ]}
      >
        <Input.Password prefix={<Lock />} placeholder="新密码（至少6位）" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '请确认密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<Lock />} placeholder="确认新密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          重置密码
        </Button>
      </Form.Item>
    </Form>
    <div className={classNames('forgot-password-form-form-footer', styles['forgot-password-form-form-footer'])}>
      <span
        className={classNames('forgot-password-form-form-link', styles['forgot-password-form-form-link'])}
        onClick={onBackToLogin}
      >
        返回登录
      </span>
    </div>
  </>
);

export default ForgotPasswordForm;
