# Common/Filter

### 概述

统一筛选区域，包含多种筛选器组件，支持选中标签联动清除。

### 示例

#### 示例样式

```scss
.filter-select-demo-root {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}


.filter-tree-select-demo-root {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
```

#### 示例代码

- 完整筛选栏
- CommonFilter 完整组合：下拉、输入、日期范围、数字范围筛选器
- _CommonFilter(@components/Common/Filter),_Common(@components/Common),_antd(antd)

```jsx
const {
  CommonFilter,
  FilterDateRange,
  FilterInput,
  FilterNumberRange,
  FilterSelect,
} = _Common;
import { DEPT_OPTIONS, STATUS_OPTIONS } from './mock.js';

const CommonFilterDemo = () => {
  const [status, setStatus] = useState<string | number>(undefined);
  const [dept, setDept] = useState<string | number>(undefined);
  const [keyword, setKeyword] = useState<string>(undefined);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [scoreRange, setScoreRange] = useState<[number, number] | null>(
    null,
  );

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

```

- 单选筛选器
- FilterSelect 基础用法与可搜索模式
- _CommonFilter(@components/Common/Filter),_Common(@components/Common),_antd(antd)

```jsx
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

```

- 输入框筛选器
- FilterInput 关键词搜索输入框
- _CommonFilter(@components/Common/Filter),_Common(@components/Common),_antd(antd)

```jsx
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

```

- 日期范围筛选器
- FilterDateRange 日期区间选择，支持快捷选项
- _CommonFilter(@components/Common/Filter),_Common(@components/Common),_antd(antd)

```jsx
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

```

- 数字范围筛选器
- FilterNumberRange 数值区间选择，支持单位后缀
- _CommonFilter(@components/Common/Filter),_Common(@components/Common),_antd(antd)

```jsx
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

```

- 树形选择筛选器
- FilterTreeSelect 部门树形下拉选择，支持搜索和自动加载
- _CommonFilter(@components/Common/Filter),_Common(@components/Common),_antd(antd)

```jsx
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

```

### API

#### BaseFilterProps (公共属性)

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| filterKey | 筛选项唯一标识 | string (必填) |  |
| label | 显示标签 | string (必填) |  |
| active | 是否有值（控制选中态样式） | boolean |  |

#### FilterSelectProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| options | 选项列表 | FilterOption[] (必填) |  |
| value | 选中值 | string | number | undefined |  |
| onChange | 值变更回调 | (value) => void |  |
| placeholder | 占位符 | string |  |
| searchable | 是否可搜索 | boolean |  |
| multiple | 是否多选 | boolean |  |

#### FilterInputProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| value | 输入值 | string |  |
| onChange | 值变更回调 | (value) => void |  |
| placeholder | 占位符 | string |  |

#### FilterDateRangeProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| value | 日期区间 [start, end] | [string, string] | null |  |
| onChange | 值变更回调 | (value) => void |  |
| showQuickOptions | 是否显示快捷选项 | boolean | false |
| quickOptions | 自定义快捷选项 | QuickOption[] |  |

#### FilterNumberRangeProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| value | 数值区间 [min, max] | [number|undefined, number|undefined]|null |  |
| onChange | 值变更回调 | (value) => void |  |
| unit | 单位后缀 | string |  |
| minPlaceholder / maxPlaceholder | 最小/最大值占位符 | string |  |

#### FilterTreeSelectProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| treeData | 树形数据（优先于自动加载） | Department[] |  |
| autoLoadDept | 是否自动加载部门树 | boolean | true |
| value | 选中值 | string | undefined |  |
| onChange | 值变更回调 | (value: string | undefined) => void |  |
| showSearch | 是否显示搜索框 | boolean | false |
| multiple | 是否多选 | boolean | false |

#### CommonFilterProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| children | 子筛选器组件 | React.ReactNode (必填) |  |
| onClearAll | 清空全部额外回调（内部已通过 onRemove 自动清空） | () => void |  |
| label | 左侧标签文字 | string | "筛选" |
| selectedTagMaxLength | 已选标签 value 最大字符数，超出显示 ... 并在 hover 时展示完整内容 | number | 20 |