# withErrorBoundary

使用 `ErrorBoundary` 包裹组件，捕获渲染/生命周期错误并展示回退 UI。

## 示例

```ts
import { withErrorBoundary } from '@base-web-kits/base-tools-react';
// 页面级错误兜底
const Page = () => { throw new Error('boom'); };
export default withErrorBoundary(<ErrorHint />)(Page);

// 与 Suspense 组合：加载与错误统一处理
export default withAsyncBoundary({ suspenseFallback: <Spinner />, errorFallback: <ErrorHint /> })(Page);
```

## 版本

- 1.0.0 新增
