const { FilterTreeSelect } = _Common;


/** Mock 部门树数据 */
const MOCK_DEPT_TREE = [
  {
    id: 'root-1',
    name: '技术中心',
    parentId: null,
    sort: 1,
    memberCount: 30,
    children: [
      { id: 'child-1-1', name: '前端组', parentId: 'root-1', sort: 1, memberCount: 10 },
      { id: 'child-1-2', name: '后端组', parentId: 'root-1', sort: 2, memberCount: 12 },
      { id: 'child-1-3', name: '测试组', parentId: 'root-1', sort: 3, memberCount: 8 },
    ],
  },
  {
    id: 'root-2',
    name: '产品中心',
    parentId: null,
    sort: 2,
    memberCount: 20,
    children: [
      { id: 'child-2-1', name: '产品组', parentId: 'root-2', sort: 1, memberCount: 10 },
      { id: 'child-2-2', name: '设计组', parentId: 'root-2', sort: 2, memberCount: 10 },
    ],
  },
  {
    id: 'root-3',
    name: '行政部',
    parentId: null,
    sort: 3,
    memberCount: 5,
  },
];

const FilterTreeSelectDemo = () => {
  const [value, setValue] = useState<string>(undefined);

  const handleChange = (v: string | string[]) => {
    setValue(typeof v === 'string' ? v : undefined);
  };

  return (
    <div className={'filter-tree-select-demo-root'}>
      <FilterTreeSelect
        label="部门"
        filterKey="dept"
        value={value}
        onChange={handleChange}
        treeData={MOCK_DEPT_TREE}
        autoLoadDept={false}
      />
      <FilterTreeSelect
        label="部门(搜索)"
        filterKey="dept-search"
        value={value}
        onChange={handleChange}
        treeData={MOCK_DEPT_TREE}
        autoLoadDept={false}
        showSearch
      />
    </div>
  );
};

render(<FilterTreeSelectDemo />);
