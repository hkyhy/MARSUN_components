import { useState, useEffect } from 'react';
import { deptApi } from '@/api';

/** 共享的部门数据加载 hook，避免每个页面独立加载 */
export function useDepartments() {
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    deptApi
      .list()
      .then((res) => {
        const data = (res as unknown as { data: { id: string; name: string }[] }).data;
        setDepartments(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const options = departments.map((d) => ({ value: d.id, label: d.name }));

  return { departments, options, loading };
}
