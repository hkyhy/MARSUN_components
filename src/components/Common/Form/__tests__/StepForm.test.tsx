import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form, Input } from 'antd';
import { describe, it, expect, vi } from 'vitest';
import StepForm from '../StepForm';
import type { StepFormItem } from '../StepForm';

/** 包装组件，提供 Form 上下文 */
const StepFormWrapper: React.FC<{
  steps: StepFormItem[];
  current: string;
  onCancel: () => void;
  onStepChange?: (key: string) => void;
}> = ({ steps, current, onCancel, onStepChange }) => {
  const [form] = Form.useForm();
  return (
    <StepForm
      form={form}
      open
      current={current}
      onCancel={onCancel}
      onStepChange={onStepChange}
      steps={steps}
      showSteps={false}
    />
  );
};

describe('StepForm', () => {
  const stepsWithValidation: StepFormItem[] = [
    {
      key: 'basic',
      title: '基本信息',
      validateFields: ['name'],
      content: () => (
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
      ),
    },
    {
      key: 'detail',
      title: '详细信息',
      content: () => <div>详细信息内容</div>,
    },
  ];

  it('renders form content', () => {
    render(
      <StepFormWrapper
        steps={stepsWithValidation}
        current="basic"
        onCancel={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText('请输入名称')).toBeInTheDocument();
  });

  it('calls onStepChange when validation passes', async () => {
    const onStepChange = vi.fn();
    render(
      <StepFormWrapper
        steps={stepsWithValidation}
        current="basic"
        onCancel={() => {}}
        onStepChange={onStepChange}
      />,
    );

    // 输入名称后点击下一步
    fireEvent.change(screen.getByPlaceholderText('请输入名称'), {
      target: { value: '测试名称' },
    });
    fireEvent.click(screen.getByText('下一步'));

    await waitFor(() => {
      expect(onStepChange).toHaveBeenCalledWith('detail');
    });
  });

  it('blocks step change when validation fails', async () => {
    const onStepChange = vi.fn();
    render(
      <StepFormWrapper
        steps={stepsWithValidation}
        current="basic"
        onCancel={() => {}}
        onStepChange={onStepChange}
      />,
    );

    // 不输入任何内容直接点击下一步
    fireEvent.click(screen.getByText('下一步'));

    await waitFor(() => {
      expect(onStepChange).not.toHaveBeenCalled();
    });
  });

  it('calls beforeEnter after validation passes', async () => {
    const beforeEnter = vi.fn().mockReturnValue(true);
    const stepsWithBeforeEnter: StepFormItem[] = [
      {
        key: 'step1',
        title: '步骤1',
        validateFields: ['name'],
        beforeEnter,
        content: () => (
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input placeholder="名称" />
          </Form.Item>
        ),
      },
      {
        key: 'step2',
        title: '步骤2',
        content: () => <div>步骤2</div>,
      },
    ];

    const onStepChange = vi.fn();
    render(
      <StepFormWrapper
        steps={stepsWithBeforeEnter}
        current="step1"
        onCancel={() => {}}
        onStepChange={onStepChange}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('名称'), {
      target: { value: '测试' },
    });
    fireEvent.click(screen.getByText('下一步'));

    await waitFor(() => {
      expect(beforeEnter).toHaveBeenCalled();
      expect(onStepChange).toHaveBeenCalledWith('step2');
    });
  });
});
