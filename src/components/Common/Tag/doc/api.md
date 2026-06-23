#### SemanticTagProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| children | 标签文本 | React.ReactNode (必填) |  |
| color | 语义化颜色（推荐使用 SEMANTIC_COLORS） | SemanticColor | string | 'default' |
| ...Tag props | 继承 antd Tag 其余属性 | TagProps |  |

#### SEMANTIC_COLORS

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| DEFAULT | 默认/中性 | 'default' |  |
| INFO | 信息/提示 | 'blue' |  |
| PROCESSING | 进行中/处理中 | 'processing' |  |
| SUCCESS | 成功/已完成 | 'green' |  |
| WARNING | 警告/待处理 | 'orange' |  |
| DANGER | 危险/紧急 | 'red' |  |
| SPECIAL | 特殊/待复查 | 'purple' |  |
| VOLCANO | 火山/领导审批 | 'volcano' |  |
| CYAN | 青色/辅助 | 'cyan' |  |
| GOLD | 金色/高优先级 | 'gold' |  |
| LIME | 石灰/低优先级 | 'lime' |  |