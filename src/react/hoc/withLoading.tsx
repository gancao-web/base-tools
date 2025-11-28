import type { ComponentType, ReactNode } from 'react';

/**
 * 加载占位 HOC：当 `props[prop]` 为真时展示 `fallback`，否则渲染组件。
 * @param fallback 加载占位内容
 * @param prop 表示加载状态的 prop 名，默认 `'loading'`
 * @param invert 取反逻辑；为真时渲染组件、为假时展示占位
 * @example
 * // 基础用法：通过 loading 控制骨架屏
 * export default withLoading(<Skeleton />)(List);
 *
 * // 自定义 prop 名
 * export default withLoading(<Spinner />, 'pending')(Button);
 *
 * // invert 场景：ready 为真时渲染
 * export default withLoading(<Skeleton />, 'ready', true)(Profile);
 */
export function withLoading<K extends string>(
  fallback: ReactNode,
  prop: K = 'loading' as K,
  invert = false,
) {
  return function <P extends Record<K, unknown> & JSX.IntrinsicAttributes>(
    Component: ComponentType<P>,
  ) {
    const Wrapped = (props: P) => {
      const v = Boolean(props[prop]);
      const showFallback = invert ? !v : v;
      return showFallback ? fallback : <Component {...props} />;
    };
    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithLoading(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}
