import { Suspense, type ComponentType, type ReactNode } from 'react';

/**
 * 使用 `Suspense` 包裹组件，统一处理异步加载占位。
 * @param fallback 加载占位内容（如 `<Spinner />`）
 * @example
 * // 路由级别懒加载
 * const LazyPage = lazy(() => import('./Page'));
 * export default withSuspense(<Spinner />)(LazyPage);
 *
 * // 组件内使用资源的 Suspense（例如数据读取）
 * const Product = lazy(() => import('./Product'));
 * const withPageSuspense = withSuspense(<Skeleton />);
 * export default withPageSuspense(Product);
 */
export function withSuspense(fallback: ReactNode) {
  return function <P extends JSX.IntrinsicAttributes>(Component: ComponentType<P>) {
    const Wrapped = (props: P) => (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithSuspense(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}
