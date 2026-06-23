import type { FeedbackItem } from '@/types';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface TransferButtonProps {
  record: FeedbackItem;
  onTransfer: (record: FeedbackItem) => void;
}

/** 转交按钮 */
const TransferButton: React.FC<TransferButtonProps> = ({ record, onTransfer }) => {
  return (
    <button
      type="button"
      className={classNames('transfer-button-action-link', styles['transfer-button-action-link'])}
      onClick={() => onTransfer(record)}
    >
      转交
    </button>
  );
};

export default TransferButton;
