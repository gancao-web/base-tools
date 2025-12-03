# withSuspense

使用 `Suspense` 包裹组件，统一处理异步加载占位。

## 示例

```ts
import { withSuspense } from '@base-web-kits/base-tools-react';
// 路由级别懒加载
const LazyPage = lazy(() => import('./Page'));
export default withSuspense(<Spinner />)(LazyPage);

// 组件内使用资源的 Suspense（例如数据读取）
const Product = lazy(() => import('./Product'));
const withPageSuspense = withSuspense(<Skeleton />);
export default withPageSuspense(Product);
```
