import type { TooltipProps } from 'antd';
import { Tooltip } from 'antd';
import React from 'react';
import type { DescriptionItem } from '../Descriptions/CommonDescriptions';
import CommonDescriptions from '../Descriptions/CommonDescriptions';

export interface TooltipInfoProps extends Pick<
  TooltipProps,
  'placement' | 'mouseEnterDelay' | 'mouseLeaveDelay' | 'overlayClassName' | 'overlayStyle'
> {
  /** 详情描述项，内部使用 CommonDescriptions 渲染 */
  content: DescriptionItem[];
  children: React.ReactNode;
  /** CommonDescriptions 列数，默认 1 */
  column?: number;
  /** 为 true 或 content 为空时不展示 Tooltip */
  hidden?: boolean;
}

/** Tooltip 详情展示，内部统一使用 CommonDescriptions */
const TooltipInfo: React.FC<TooltipInfoProps> = ({
  content,
  children,
  column = 1,
  hidden = false,
  placement = 'top',
  overlayClassName,
  overlayStyle,
  mouseEnterDelay = 0.3,
  ...rest
}) => {
  if (hidden || content.length === 0) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      placement={placement}
      mouseEnterDelay={mouseEnterDelay}
      overlayClassName={['tooltip-info-overlay', overlayClassName].filter(Boolean).join(' ')}
      overlayStyle={{ maxWidth: 360, padding: 0, ...overlayStyle }}
      title={<CommonDescriptions content={content} column={column} size="small" />}
      {...rest}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipInfo;
