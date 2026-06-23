import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Form } from 'antd';
import ForgotPasswordForm from '../ForgotPasswordForm';

const ForgotPasswordFormWrapper: React.FC<{
  loading?: boolean;
  onFinish?: () => void;
  onBackToLogin?: () => void;
}> = ({ loading = false, onFinish, onBackToLogin }) => {
  const [form] = Form.useForm();
  return (
    <ForgotPasswordForm
      form={form}
      loading={loading}
      onFinish={onFinish ?? vi.fn()}
      onBackToLogin={onBackToLogin ?? vi.fn()}
    />
  );
};

describe('ForgotPasswordForm', () => {
  it('renders title and description', () => {
    render(<ForgotPasswordFormWrapper />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('重置密码');
    expect(screen.getByText('通过工号和姓名验证身份后设置新密码')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<ForgotPasswordFormWrapper />);
    const textboxes = screen.getAllByRole('textbox');
    // employeeId + displayName = 2 text inputs
    expect(textboxes.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByPlaceholderText('新密码（至少6位）')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('确认新密码')).toBeInTheDocument();
  });

  it('renders back to login link and handles click', () => {
    const onBackToLogin = vi.fn();
    render(<ForgotPasswordFormWrapper onBackToLogin={onBackToLogin} />);
    fireEvent.click(screen.getByText('返回登录'));
    expect(onBackToLogin).toHaveBeenCalledOnce();
  });

  it('shows loading state on submit button', () => {
    render(<ForgotPasswordFormWrapper loading={true} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('loading');
  });
});
