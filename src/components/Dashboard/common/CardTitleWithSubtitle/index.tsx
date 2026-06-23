import styles from './style.module.scss';
import classNames from 'classnames';
import React from 'react';

export interface CardTitleWithSubtitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
}

/** Card 标题 + 灰色数据范围说明，样式与 StatPendingBreakdown subtitle 一致 */
const CardTitleWithSubtitle: React.FC<CardTitleWithSubtitleProps> = ({ title, subtitle, icon }) => (
  <div>
    <div className={classNames('card-title-with-subtitle-root', styles['card-title-with-subtitle-root'])}>
      {icon}
      <span>{title}</span>
    </div>
    {subtitle && (
      <div className={classNames('card-title-with-subtitle-container', styles['card-title-with-subtitle-container'])}>{subtitle}</div>
    )}
  </div>
);

export default CardTitleWithSubtitle;
