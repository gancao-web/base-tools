import React, { type ComponentType, type ReactNode } from 'react';

/**
 * 使用 `ErrorBoundary` 包裹组件，捕获渲染/生命周期错误并展示回退 UI。
 * @param fallback 发生错误时展示的回退内容
 * @example
 * // 页面级错误兜底
 * const Page = () => { throw new Error('boom'); };
 * export default withErrorBoundary(<ErrorHint />)(Page);
 *
 * // 与 Suspense 组合：加载与错误统一处理
 * export default withAsyncBoundary({ suspenseFallback: <Spinner />, errorFallback: <ErrorHint /> })(Page);
 */
export function withErrorBoundary(fallback?: ReactNode) {
  return function <P extends JSX.IntrinsicAttributes>(Component: ComponentType<P>) {
    const Wrapped = (props: P) => (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithErrorBoundary(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}

/**
 * 错误边界 HOC：捕获组件渲染/生命周期错误，展示回退 UI。
 */
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: ReactNode }>,
  { hasError: boolean }
> {
  constructor(props: React.PropsWithChildren<{ fallback?: ReactNode }>) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children as React.ReactNode;
  }
}
