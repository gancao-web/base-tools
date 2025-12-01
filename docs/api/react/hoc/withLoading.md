# withLoading

加载占位 HOC：当 `props[prop]` 为真时展示 `fallback`，否则渲染组件。

## 示例

```tsx
import { withLoading } from '@base-web-kits/base-tools-react';

// 基础用法：通过 loading 控制骨架屏
export default withLoading(<Skeleton />)(List);

// 自定义 prop 名
export default withLoading(<Spinner />, 'pending')(Button);

// invert 场景：ready 为真时渲染
export default withLoading(<Skeleton />, 'ready', true)(Profile);
```
