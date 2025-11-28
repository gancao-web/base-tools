import type { ComponentType, ReactNode } from 'react';

/**
 * 条件渲染 HOC：当 `predicate(props)` 返回 true 时渲染组件，否则渲染 `fallback`。
 * @param predicate 判断是否展示组件的函数
 * @param fallback 条件不满足时的回退内容
 * @example
 * // 权限控制
 * const canRead = (p: { role: string }) => p.role === 'admin';
 * export default withConditional(canRead, <NoAccess />)(AdminPanel);
 *
 * // 功能开关
 * const enabled = (p: { featureOn: boolean }) => p.featureOn;
 * export default withConditional(enabled, null)(NewFeature);
 */
export function withConditional<P extends JSX.IntrinsicAttributes>(
  predicate: (props: P) => boolean,
  fallback?: ReactNode,
) {
  return function (Component: ComponentType<P>) {
    const Wrapped = (props: P) =>
      predicate(props) ? <Component {...props} /> : (fallback ?? null);
    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithConditional(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}
