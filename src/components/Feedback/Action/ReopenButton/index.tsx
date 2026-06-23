import type { FeedbackItem } from '@/types';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ReopenButtonProps {
  record: FeedbackItem;
  onReopen: (record: FeedbackItem) => void;
}

/** 重新打开按钮 */
const ReopenButton: React.FC<ReopenButtonProps> = ({ record, onReopen }) => {
  return (
    <button
      type="button"
      className={classNames('reopen-button-action-link', styles['reopen-button-action-link'])}
      onClick={() => onReopen(record)}
    >
      重新打开
    </button>
  );
};

export default ReopenButton;
