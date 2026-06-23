const { FilterDateRange } = _CommonFilter;

const FilterDateRangeDemo = () => {
  const [value, setValue] = React.useState(null);

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
