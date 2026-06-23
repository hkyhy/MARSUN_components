const { FilterInput } = _CommonFilter;

const FilterInputDemo = () => {
  const [value, setValue] = React.useState(undefined);

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
