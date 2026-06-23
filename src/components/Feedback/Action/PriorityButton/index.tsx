import type { FeedbackItem } from '@/types';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface PriorityButtonProps {
  record: FeedbackItem;
  onPriorityChange: (record: FeedbackItem) => void;
}

/** 修改优先级按钮 */
const PriorityButton: React.FC<PriorityButtonProps> = ({ record, onPriorityChange }) => {
  return (
    <button
      type="button"
      className={classNames('priority-button-action-link', styles['priority-button-action-link'])}
      onClick={() => onPriorityChange(record)}
    >
      优先级
    </button>
  );
};

export default PriorityButton;
