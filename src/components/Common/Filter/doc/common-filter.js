const {
  CommonFilter,
  FilterDateRange,
  FilterInput,
  FilterNumberRange,
  FilterSelect,
} = _CommonFilter;

const STATUS_OPTIONS = [
  { label: '待提交', value: 'pending' },
  { label: '审核中', value: 'reviewing' },
  { label: '已通过', value: 'approved' },
  { label: '已驳回', value: 'rejected' },
];

const DEPT_OPTIONS = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '设计部', value: 'design' },
  { label: '运营部', value: 'ops' },
  { label: '市场部', value: 'market' },
  { label: '财务部', value: 'finance' },
];

const CommonFilterDemo = () => {
  const [status, setStatus] = React.useState(undefined);
  const [dept, setDept] = React.useState(undefined);
  const [keyword, setKeyword] = React.useState(undefined);
  const [dateRange, setDateRange] = React.useState(null);
  const [scoreRange, setScoreRange] = React.useState(null);

  return (
    <CommonFilter
      onClearAll={() => {
        setStatus(undefined);
        setDept(undefined);
        setKeyword(undefined);
        setDateRange(null);
        setScoreRange(null);
      }}
    >
      <FilterSelect
        label="状态"
        filterKey="status"
        options={STATUS_OPTIONS}
        value={status}
        onChange={setStatus}
      />
      <FilterSelect
        label="部门"
        filterKey="dept"
        options={DEPT_OPTIONS}
        value={dept}
        onChange={setDept}
        searchable
      />
      <FilterInput label="关键词" filterKey="keyword" value={keyword} onChange={setKeyword} />
      <FilterDateRange label="日期" filterKey="date" value={dateRange} onChange={setDateRange} />
      <FilterNumberRange
        label="评分"
        filterKey="score"
        value={scoreRange}
        onChange={setScoreRange}
        unit="分"
      />
    </CommonFilter>
  );
};

render(<CommonFilterDemo />);
