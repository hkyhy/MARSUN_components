import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Form } from 'antd';
import LoginForm from '../LoginForm';

const LoginFormWrapper: React.FC<{
  loading?: boolean;
  onFinish?: () => void;
  onForgotPassword?: () => void;
}> = ({ loading = false, onFinish, onForgotPassword }) => {
  const [form] = Form.useForm();
  return (
    <LoginForm
      form={form}
      loading={loading}
      onFinish={onFinish ?? vi.fn()}
      onForgotPassword={onForgotPassword ?? vi.fn()}
    />
  );
};

describe('LoginForm', () => {
  it('renders title and description', () => {
    render(<LoginFormWrapper />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('登录');
    expect(screen.getByText('请输入您的工号和密码')).toBeInTheDocument();
  });

  it('renders employeeId and password inputs', () => {
    render(<LoginFormWrapper />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();
  });

  it('renders forgot password link and handles click', () => {
    const onForgotPassword = vi.fn();
    render(<LoginFormWrapper onForgotPassword={onForgotPassword} />);
    fireEvent.click(screen.getByText('忘记密码？'));
    expect(onForgotPassword).toHaveBeenCalledOnce();
  });

  it('shows loading state on submit button', () => {
    render(<LoginFormWrapper loading={true} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('loading');
  });
});
