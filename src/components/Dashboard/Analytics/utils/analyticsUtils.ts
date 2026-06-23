export const EXT_CATEGORY_MAP: Record<string, string> = {
  '.doc': 'Word',
  '.docx': 'Word',
  '.pdf': 'PDF',
  '.xls': 'Excel',
  '.xlsx': 'Excel',
  '.csv': 'Excel',
  '.ppt': 'PPT',
  '.pptx': 'PPT',
  '.jpg': '图片',
  '.jpeg': '图片',
  '.png': '图片',
  '.gif': '图片',
  '.webp': '图片',
  '.bmp': '图片',
  '.svg': '图片',
  '.mp4': '视频',
  '.webm': '视频',
  '.mov': '视频',
  '.vsdx': 'Visio',
  '.vsd': 'Visio',
  '.zip': '压缩包',
  '.rar': '压缩包',
  '.7z': '压缩包',
};

export function categorizeTypeData(typeData: { extension: string; count: number }[]) {
  const catMap = new Map<string, number>();
  for (const item of typeData) {
    const cat = EXT_CATEGORY_MAP[item.extension] || '其他';
    catMap.set(cat, (catMap.get(cat) || 0) + item.count);
  }
  return Array.from(catMap.entries())
    .map(([extension, count]) => ({ extension, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildDeptPointsTree(deptStats: import('@/types').DeptPointsStat[]) {
  const map = new Map<
    string,
    import('@/types').DeptPointsStat & { children?: import('@/types').DeptPointsStat[] }
  >();
  const roots: import('@/types').DeptPointsStat[] = [];
  for (const item of deptStats) {
    map.set(item.departmentId, { ...item, children: [] });
  }
  for (const item of deptStats) {
    const node = map.get(item.departmentId)!;
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)!;
      parent.children = parent.children || [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const aggregate = (
    node: import('@/types').DeptPointsStat & { children?: import('@/types').DeptPointsStat[] },
  ): void => {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        aggregate(child);
        node.fileCount += child.fileCount;
        node.memberCount += child.memberCount;
        node.totalScore += child.totalScore;
      }
    }
  };
  for (const root of roots) aggregate(root);
  const stripEmptyChildren = (
    nodes: import('@/types').DeptPointsStat[],
  ): import('@/types').DeptPointsStat[] =>
    nodes.map((node) => {
      const children = node.children?.length ? stripEmptyChildren(node.children) : undefined;
      return children ? { ...node, children } : { ...node, children: undefined };
    });
  return stripEmptyChildren(roots);
}
