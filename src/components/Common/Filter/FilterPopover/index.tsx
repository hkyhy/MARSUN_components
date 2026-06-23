import { Popover } from 'antd';
import React, { useState } from 'react';
import FilterPanel from '../FilterPanel';
import FilterTrigger from '../FilterTrigger';

interface FilterPopoverProps {
  /** 筛选项标签 */
  label: string;
  /** 是否有值（控制选中态样式） */
  active?: boolean;
  /** 面板宽度 */
  width?: number;
  /** 确定按钮文字 */
  confirmText?: string;
  /** 面板内容 */
  children: React.ReactNode;
  /** 受控打开状态（传入则由外部控制） */
  open?: boolean;
  /** 打开状态变更回调 */
  onOpenChange?: (open: boolean) => void;
  /** 确认回调（不传则无确定/取消按钮） */
  onConfirm?: () => void;
  /** 取消回调 */
  onReset?: () => void;
}

/**
 * 筛选 Popover 包装器
 * 统一管理：触发按钮 + 弹出面板 + 打开/关闭状态
 *
 * 用法：
 * ```tsx
 * <FilterPopover label="状态" value={val} onConfirm={handleConfirm} onReset={handleReset}>
 *   <Select options={...} />
 * </FilterPopover>
 * ```
 */
const FilterPopover: React.FC<FilterPopoverProps> = ({
  label,
  active,
  width,
  confirmText = '确定',
  children,
  open: controlledOpen,
  onOpenChange,
  onConfirm,
  onReset,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };

  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  const handleReset = () => {
    onReset?.();
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomLeft"
      styles={{ body: { maxWidth: '300px' } }}
      content={
        <FilterPanel
          onConfirm={onConfirm ? handleConfirm : undefined}
          onReset={onReset ? handleReset : undefined}
          confirmText={confirmText}
          width={width || 300}
        >
          {children}
        </FilterPanel>
      }
    >
      <FilterTrigger label={label} active={active} open={open} />
    </Popover>
  );
};

export default FilterPopover;
export type { FilterPopoverProps };
