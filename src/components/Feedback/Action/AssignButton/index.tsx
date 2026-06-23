import type { FeedbackItem } from '@/types';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface AssignButtonProps {
  record: FeedbackItem;
  onAssign: (record: FeedbackItem) => void;
}

/** 指定负责人按钮 */
const AssignButton: React.FC<AssignButtonProps> = ({ record, onAssign }) => {
  return (
    <button
      type="button"
      className={classNames('assign-button-action-link', styles['assign-button-action-link'])}
      onClick={() => onAssign(record)}
    >
      指定负责人
    </button>
  );
};

export default AssignButton;
