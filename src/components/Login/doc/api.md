#### LoginFormProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| form | antd Form 实例 | FormInstance (必填) |  |
| loading | 提交加载状态 | boolean |  |
| onFinish | 登录提交回调 | (values: { employeeId: string; password: string }) => void (必填) |  |
| onForgotPassword | 点击忘记密码回调 | () => void (必填) |  |

#### ForgotPasswordFormProps

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| form | antd Form 实例 | FormInstance (必填) |  |
| loading | 提交加载状态 | boolean |  |
| onFinish | 重置密码提交回调 | (values: { employeeId: string; displayName: string; newPassword: string }) => void (必填) |  |
| onBackToLogin | 点击返回登录回调 | () => void (必填) |  |

#### useLogin Return

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |
| settings | 系统设置（logo/systemName/footerText 等） | Settings |  |
| loginForm | 登录表单实例 | FormInstance |  |
| forgotForm | 忘记密码表单实例 | FormInstance |  |
| loginLoading | 登录加载状态 | boolean |  |
| forgotLoading | 重置密码加载状态 | boolean |  |
| view | 当前视图（login / forgot） | AuthView |  |
| bgStyle | 登录页背景样式 | CSSProperties |  |
| handleLogin | 登录提交处理函数 | (values) => Promise<void> |  |
| handleForgotPassword | 重置密码提交处理函数 | (values) => Promise<void> |  |
| switchToForgot | 切换到忘记密码视图 | () => void |  |
| switchToLogin | 切换到登录视图 | () => void |  |