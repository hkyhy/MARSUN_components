const { FilterDateRange } = _Common;

/**
 * FilterDateRange 日期范围筛选示例
 */
const FilterDateRangeDemo = () => {
  const [value, setValue] = useState<[string, string] | null>(null);

  return (
    <FilterDateRange
      label="日期范围"
      filterKey="dateRange"
      value={value}
      onChange={setValue}
      showQuickOptions
    />
  );
};

render(<FilterDateRangeDemo />);
