import { Tag } from 'antd';
import type { ReactNode } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

export interface FolderDisplayNode {
  name: string;
  isDepartmentFolder?: boolean;
  isPublic?: boolean;
}

/** 树节点标题：层级由缩进表达，仅展示文件夹名称 */
export function folderTreeNodeTitle(
  folder: FolderDisplayNode,
  suffix?: ReactNode,
): ReactNode {
  return (
    <span>
      {folder.name}
      {folder.isDepartmentFolder && (
        <Tag color="blue" className={classNames('folder-display-track', styles['folder-display-track'])}>
          部门
        </Tag>
      )}
      {folder.isPublic && (
        <Tag color="green" className={classNames('folder-display-track', styles['folder-display-track'])}>
          公共
        </Tag>
      )}
      {suffix}
    </span>
  );
}

/** 选中后输入框展示的纯文本（避免重复部门路径） */
export function folderSelectLabel(folder: FolderDisplayNode): string {
  if (folder.isPublic) return `${folder.name}（公共文件夹）`;
  return folder.isDepartmentFolder ? `${folder.name}（部门文件夹）` : folder.name;
}
