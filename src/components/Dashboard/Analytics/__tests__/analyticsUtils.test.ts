import { describe, expect, it } from 'vitest';
import { buildDeptPointsTree, categorizeTypeData } from '../utils/analyticsUtils';

describe('fillDateGaps logic', () => {
  it('fills missing dates with zero counts', () => {
    const byDate = new Map([['2024-01-02', { count: 3, totalSize: 100 }]]);
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-03');
    const result: { date: string; count: number; totalSize: number }[] = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);
    while (cursor <= endDay) {
      const key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, '0'),
        String(cursor.getDate()).padStart(2, '0'),
      ].join('-');
      const stats = byDate.get(key!) || { count: 0, totalSize: 0 };
      result.push({ date: key!, count: stats.count, totalSize: stats.totalSize });
      cursor.setDate(cursor.getDate() + 1);
    }
    expect(result).toHaveLength(3);
    expect(result[1]?.count).toBe(3);
  });
});

describe('categorizeTypeData', () => {
  it('groups extensions into categories', () => {
    const result = categorizeTypeData([
      { extension: '.pdf', count: 5 },
      { extension: '.docx', count: 3 },
      { extension: '.mp4', count: 4 },
      { extension: '.xyz', count: 2 },
    ]);
    expect(result.find((d) => d.extension === 'PDF')?.count).toBe(5);
    expect(result.find((d) => d.extension === 'Word')?.count).toBe(3);
    expect(result.find((d) => d.extension === '视频')?.count).toBe(4);
    expect(result.find((d) => d.extension === '其他')?.count).toBe(2);
  });
});

describe('buildDeptPointsTree', () => {
  it('aggregates child stats into parent', () => {
    const tree = buildDeptPointsTree([
      {
        departmentId: 'p1',
        departmentName: '总部',
        departmentPath: '总部',
        parentId: null,
        memberCount: 2,
        fileCount: 1,
        totalScore: 10,
      },
      {
        departmentId: 'c1',
        departmentName: '分部',
        departmentPath: '总部/分部',
        parentId: 'p1',
        memberCount: 3,
        fileCount: 4,
        totalScore: 20,
      },
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0].fileCount).toBe(5);
    expect(tree[0].totalScore).toBe(30);
    expect(tree[0].memberCount).toBe(5);
  });

  it('removes empty children arrays from leaf nodes', () => {
    const tree = buildDeptPointsTree([
      {
        departmentId: 'p1',
        departmentName: '总部',
        departmentPath: '总部',
        parentId: null,
        memberCount: 2,
        fileCount: 1,
        totalScore: 10,
      },
      {
        departmentId: 'c1',
        departmentName: '分部',
        departmentPath: '总部/分部',
        parentId: 'p1',
        memberCount: 3,
        fileCount: 4,
        totalScore: 20,
      },
    ]);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children?.[0]?.children).toBeUndefined();
  });
});
