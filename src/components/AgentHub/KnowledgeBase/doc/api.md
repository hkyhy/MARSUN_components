#### ParseStatusTagProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| status | 解析状态（UNSTART / RUNNING / DONE / FAIL / CANCEL） | string |  |

#### KBFilterBarProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| keyword | 搜索关键词 | string (必填) |  |
| onKeywordChange | 关键词变更回调 | (v: string) => void (必填) |  |

#### KnowledgeCardProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| dataset | 知识库对象 | Dataset (必填) |  |
| onView | 查看文档 | (dataset: Dataset) => void (必填) |  |
| onUpload | 上传文档 | (dataset: Dataset) => void (必填) |  |
| onEdit | 编辑知识库 | (dataset: Dataset) => void (必填) |  |
| onDelete | 删除知识库 | (dataset: Dataset) => void (必填) |  |

#### DocumentTableProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| datasetId | 知识库 ID | string (必填) |  |
| data | 文档列表 | KBDocument[] (必填) |  |
| loading | 加载状态 | boolean (必填) |  |
| total | 文档总数 | number (必填) |  |
| page | 当前页码 | number (必填) |  |
| pageSize | 每页条数 | number (必填) |  |
| onPageChange | 分页变更 | (page, pageSize) => void (必填) |  |
| onParse | 开始解析 | (doc: KBDocument) => void (必填) |  |
| onStopParse | 停止解析 | (doc: KBDocument) => void (必填) |  |
| onDelete | 删除文档 | (doc: KBDocument) => void (必填) |  |