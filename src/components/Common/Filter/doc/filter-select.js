const { FilterSelect } = _CommonFilter;

const SINGLE_SELECT_OPTIONS = [
  { label: '选项一', value: 'a' },
  { label: '选项二', value: 'b' },
  { label: '选项三', value: 'c' },
  { label: '选项四', value: 'd' },
];

const SEARCHABLE_OPTIONS = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '西瓜', value: 'watermelon' },
];

const FilterSelectDemo = () => {
  const [value, setValue] = React.useState(undefined);
  const [multiValue, setMultiValue] = React.useState(undefined);

  return (
    <div className={'filter-select-demo-root'}>
      <FilterSelect
        label="单选"
        filterKey="singleSelect"
        options={SINGLE_SELECT_OPTIONS}
        value={value}
        onChange={setValue}
      />
      <FilterSelect
        label="可搜索"
        filterKey="searchable"
        searchable
        options={SEARCHABLE_OPTIONS}
        value={multiValue}
        onChange={setMultiValue}
      />
    </div>
  );
};

render(<FilterSelectDemo />);
