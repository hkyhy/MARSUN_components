import type { FeedbackItem } from '@/types';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ProcessCompleteButtonProps {
  record: FeedbackItem;
  onProcessComplete: (record: FeedbackItem) => void;
}

/** 处理完成按钮 */
const ProcessCompleteButton: React.FC<ProcessCompleteButtonProps> = ({
  record,
  onProcessComplete,
}) => {
  return (
    <button
      type="button"
      className={classNames('process-complete-button-action-link', styles['process-complete-button-action-link'])}
      onClick={() => onProcessComplete(record)}
    >
      处理完成
    </button>
  );
};

export default ProcessCompleteButton;
