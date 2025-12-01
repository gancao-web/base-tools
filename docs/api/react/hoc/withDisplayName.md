# withDisplayName

设置组件的 `displayName`，使其在 React DevTools 中更易识别。

## 示例

```tsx
import { withDisplayName } from '@base-web-kits/base-tools-react';

// 为匿名组件命名，便于调试
const Page = () => <div>User Page</div>;
export default withDisplayName(Page, 'UserPage');

// 与其他 HOC 组合使用，便于层级结构阅读
export default withDisplayName(withMemo(List), 'Memo(List)');
```
