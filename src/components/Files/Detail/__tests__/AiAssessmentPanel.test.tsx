import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AiAssessmentPanel from '../AiAssessmentPanel';

describe('AiAssessmentPanel', () => {
  it('renders empty state', () => {
    render(<AiAssessmentPanel />);
    expect(screen.getByText('暂无 AI 质量评估结果')).toBeInTheDocument();
  });

  it('renders pending task state', () => {
    render(<AiAssessmentPanel taskStatus="RUNNING" />);
    expect(screen.getByText('AI 质量评估进行中，请稍候…')).toBeInTheDocument();
  });

  it('renders failed task state', () => {
    render(<AiAssessmentPanel taskStatus="FAILED" />);
    expect(screen.getByText('评估失败')).toBeInTheDocument();
  });

  it('renders pending submit hint', () => {
    render(<AiAssessmentPanel pendingHint="pending_submit" />);
    expect(screen.getByText('提交审核后将自动进行 AI 质量评估')).toBeInTheDocument();
  });

  it('renders quality level and summary', () => {
    render(
      <AiAssessmentPanel
        assessment={{
          level: 'high',
          summary: '内容完整，逻辑清晰',
          assessedAt: new Date().toISOString(),
        }}
      />,
    );
    expect(screen.getByText('极高质量')).toBeInTheDocument();
    expect(screen.getByText('内容完整，逻辑清晰')).toBeInTheDocument();
  });
});
