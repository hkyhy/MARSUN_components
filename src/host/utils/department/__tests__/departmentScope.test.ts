import type { Department } from '@/types';
import {
  collectDepartmentIds,
  extractDepartmentSubtree,
  findDepartmentRootId,
  flattenDepartments,
  getNormalUserAccessibleDepartmentIds,
  getNormalUserDepartmentTree,
} from '../departmentScope';

const sampleTree: Department[] = [
  {
    id: 'admin',
    name: '行政部',
    parentId: null,
    sort: 1,
    memberCount: 1,
    children: [],
  },
  {
    id: 'tech',
    name: '技术部',
    parentId: null,
    sort: 2,
    memberCount: 3,
    children: [
      {
        id: 'digital',
        name: '数字化',
        parentId: 'tech',
        sort: 0,
        memberCount: 0,
        children: [],
      },
      {
        id: 'info',
        name: '信息部',
        parentId: 'tech',
        sort: 0,
        memberCount: 1,
        children: [],
      },
    ],
  },
];

describe('departmentScope', () => {
  const flat = flattenDepartments(sampleTree);

  it('finds root department for nested user department', () => {
    expect(findDepartmentRootId('info', flat)).toBe('tech');
    expect(findDepartmentRootId('admin', flat)).toBe('admin');
  });

  it('collects department subtree ids', () => {
    expect(collectDepartmentIds('tech', flat).sort()).toEqual(['digital', 'info', 'tech'].sort());
  });

  it('returns accessible ids for normal user in info department', () => {
    expect(getNormalUserAccessibleDepartmentIds('info', flat).sort()).toEqual(
      ['digital', 'info', 'tech'].sort(),
    );
  });

  it('extracts organization branch tree for normal user', () => {
    const scoped = getNormalUserDepartmentTree('info', sampleTree);
    expect(scoped).toHaveLength(1);
    expect(scoped[0].id).toBe('tech');
    expect(scoped[0].children?.map((d) => d.id).sort()).toEqual(['digital', 'info'].sort());
  });

  it('extractDepartmentSubtree returns single root node', () => {
    const subtree = extractDepartmentSubtree('tech', sampleTree);
    expect(subtree[0]?.name).toBe('技术部');
    expect(subtree[0]?.children).toHaveLength(2);
  });
});
