const { FilterInput } = _Common;

/**
 * FilterInput 输入框筛选示例
 */
const FilterInputDemo = () => {
  const [value, setValue] = useState<string>(undefined);

  return (
    <FilterInput
      label="关键词"
      filterKey="keyword"
      value={value}
      onChange={setValue}
      placeholder="请输入搜索关键词"
    />
  );
};

render(<FilterInputDemo />);
