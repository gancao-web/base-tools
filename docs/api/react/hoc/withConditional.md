# withConditional

条件渲染 HOC：当 `predicate(props)` 返回 true 时渲染组件，否则渲染 `fallback`。

## 示例

```tsx
import { withConditional } from '@base-web-kits/base-tools-react';

// 权限控制
const canRead = (p: { role: string }) => p.role === 'admin';
export default withConditional(canRead, <NoAccess />)(AdminPanel);

// 功能开关
const enabled = (p: { featureOn: boolean }) => p.featureOn;
export default withConditional(enabled, null)(NewFeature);
```
