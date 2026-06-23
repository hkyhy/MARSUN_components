const { FilterNumberRange } = _CommonFilter;

const FilterNumberRangeDemo = () => {
  const [value, setValue] = React.useState(null);

  return (
    <FilterNumberRange
      label="评分"
      filterKey="score"
      value={value}
      onChange={setValue}
      unit="分"
    />
  );
};

render(<FilterNumberRangeDemo />);
