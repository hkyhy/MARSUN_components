#### PermissionGuardProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| roles | 允许访问的角色列表，为空则所有已登录用户可访问 | UserRole[] (必填) |  |
| fallback | 无权限时的回退内容 | React.ReactNode |  |
| children | 受保护的内容 | React.ReactNode (必填) |  |

#### ProtectedRouteProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| roles | 允许访问的角色列表 | UserRole[] |  |
| children | 路由内容 | React.ReactNode (必填) |  |