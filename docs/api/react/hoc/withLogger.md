# withLogger
渲染/卸载审计 HOC：在组件渲染、挂载、卸载时记录日志或上报。

## Example

```ts
import { withLogger } from '@base-web-kits/base-tools/react';
// 控制台审计：渲染次数、挂载、卸载
export default withLogger({ label: 'UserList' })(UserList);

// 自定义上报函数
const report = (type: string, info?: any) => sendToServer(type, info);
export default withLogger({ label: 'Page', logger: (t, i) => report(t, i) })(Page);
```