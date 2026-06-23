import { deptApi } from '@/api';
import type { Department } from '@/types';
import {
  buildDepartmentPathMapFromTree,
  buildDepartmentPathMaps,
  mergeDepartmentPathMaps,
  type DepartmentPathMaps,
  type FlatDepartment,
} from '@/utils/department/departmentPath';
import {
  buildPersonOptionLookup,
  createPersonSelectFilter,
  normalizePersonDtos,
  normalizeRawPersonList,
  toPersonOptions,
  toPersonSelectOptions,
  type PersonSelectOption,
} from '@/utils/user/personOption';
import { Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import PersonOptionRow from './PersonOptionRow';

type PersonSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  'options' | 'loading' | 'filterOption' | 'optionLabelProp'
> & {
  /** 加载人员原始数据（如 uploaders / reviewers / assignee-options） */
  loadOptions: () => Promise<unknown>;
};

function buildPathMapsFromSources(flatDepts: FlatDepartment[], tree: Department[]): DepartmentPathMaps {
  if (flatDepts.length > 0) {
    const fromFlat = buildDepartmentPathMaps(flatDepts);
    const fromTree = buildDepartmentPathMapFromTree(tree);
    const byId = mergeDepartmentPathMaps(fromTree, fromFlat.byId);
    return { byId, byUniqueLeaf: buildDepartmentPathMaps(flatDepts).byUniqueLeaf };
  }
  const byId = buildDepartmentPathMapFromTree(tree);
  const paths = Array.from(byId.values());
  const byUniqueLeaf = new Map<string, string>();
  const ambiguous = new Set<string>();
  for (const path of paths) {
    const leaf = path.includes('/') ? path.slice(path.lastIndexOf('/') + 1) : path;
    if (ambiguous.has(leaf)) continue;
    const prev = byUniqueLeaf.get(leaf);
    if (prev !== undefined && prev !== path) {
      ambiguous.add(leaf);
      byUniqueLeaf.delete(leaf);
    } else {
      byUniqueLeaf.set(leaf, path);
    }
  }
  return { byId, byUniqueLeaf };
}

/**
 * 人员下拉选择器：并行加载部门列表/树与人员数据，解析完整部门路径（父/子）。
 */
const PersonSelect: React.FC<PersonSelectProps> = ({ loadOptions, ...rest }) => {
  const [personOptions, setPersonOptions] = useState<PersonSelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const lookup = useMemo(() => buildPersonOptionLookup(personOptions), [personOptions]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([loadOptions(), deptApi.list(), deptApi.tree()])
      .then(([raw, listRes, treeRes]) => {
        if (cancelled) return;

        const flatDepts =
          (listRes as unknown as { data: FlatDepartment[] }).data?.map((d) => ({
            id: d.id,
            name: d.name,
            parentId: d.parentId,
          })) ?? [];

        const tree = (treeRes as unknown as { data: Department[] }).data ?? [];
        const pathMaps = buildPathMapsFromSources(flatDepts, tree);
        const dtos = normalizePersonDtos(normalizeRawPersonList(raw));

        setPersonOptions(toPersonSelectOptions(toPersonOptions(dtos, pathMaps)));
      })
      .catch(() => {
        if (!cancelled) setPersonOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadOptions]);

  const antdOptions = useMemo(
    () =>
      personOptions.map((opt) => ({
        value: opt.value,
        label: <PersonOptionRow option={opt} />,
        optionLabel: opt.optionLabel,
      })),
    [personOptions],
  );

  return (
    <Select
      showSearch
      options={antdOptions}
      optionLabelProp="optionLabel"
      filterOption={createPersonSelectFilter(lookup)}
      loading={loading}
      {...rest}
    />
  );
};

export default PersonSelect;
