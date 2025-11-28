# withAsyncBoundary
同时提供 `Suspense` 与 `ErrorBoundary` 的异步边界 HOC。

## Example

```ts
import { withAsyncBoundary } from '@base-web-kits/base-tools/react';
const LazyPage = lazy(() => import('./Page'));
export default withAsyncBoundary({
suspenseFallback: <Spinner />,
errorFallback: <ErrorHint />,
})(LazyPage);
```