import { Suspense, type ComponentType, type ReactNode } from 'react';
import { ErrorBoundary } from './withErrorBoundary';

/**
 * 同时提供 `Suspense` 与 `ErrorBoundary` 的异步边界 HOC。
 * @param options.suspenseFallback 加载占位内容
 * @param options.errorFallback 错误兜底内容
 * @example
 * const LazyPage = lazy(() => import('./Page'));
 * export default withAsyncBoundary({
 *   suspenseFallback: <Spinner />,
 *   errorFallback: <ErrorHint />,
 * })(LazyPage);
 */
export function withAsyncBoundary(
  options: { suspenseFallback?: ReactNode; errorFallback?: ReactNode } = {},
) {
  const { suspenseFallback, errorFallback } = options;
  return function <P extends JSX.IntrinsicAttributes>(Component: ComponentType<P>) {
    const Wrapped = (props: P) => (
      <Suspense fallback={suspenseFallback}>
        <ErrorBoundary fallback={errorFallback}>
          <Component {...props} />
        </ErrorBoundary>
      </Suspense>
    );
    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithAsyncBoundary(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}
