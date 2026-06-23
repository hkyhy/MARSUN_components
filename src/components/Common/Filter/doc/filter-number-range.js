const { FilterNumberRange } = _Common;

/**
 * FilterNumberRange 数字范围筛选示例
 */
const FilterNumberRangeDemo = () => {
  const [value, setValue] = useState<[number, number] | null>(null);

  return (
    <FilterNumberRange
      label="评分范围"
      filterKey="score"
      value={value}
      onChange={setValue}
      unit="分"
    />
  );
};

render(<FilterNumberRangeDemo />);
