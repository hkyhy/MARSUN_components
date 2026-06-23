import { useEffect, useState, useCallback } from 'react';
import { deptApi } from '@/api';
import type { Department } from '@/types';
import {
  buildDepartmentPathMapFromTree,
  getDepartmentPath as resolvePath,
} from '@/utils/department/departmentPath';

/** 获取部门完整路径的 hook，返回 getDepartmentPath 函数 */
export function useDepartmentPath() {
  const [pathMap, setPathMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    deptApi
      .tree()
      .then((res) => {
        const tree = (res as unknown as { data: Department[] }).data;
        setPathMap(buildDepartmentPathMapFromTree(tree));
      })
      .catch(() => {});
  }, []);

  const getDepartmentPath = useCallback(
    (departmentId?: string | null, fallback = '-'): string => {
      return resolvePath(pathMap, departmentId, fallback);
    },
    [pathMap],
  );

  return { getDepartmentPath, pathMap };
}
