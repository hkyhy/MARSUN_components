const { FilterSelect } = _Common;
import { SEARCHABLE_OPTIONS, SINGLE_SELECT_OPTIONS } from '../mock';

const FilterSelectDemo = () => {
  const [value, setValue] = useState<string | number>(undefined);
  const [multiValue, setMultiValue] = useState<string | number>(undefined);

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
