import type { ComponentType, ReactNode } from 'react';

/**
 * 骨架屏 HOC：当 `props[prop]` 为真时展示 `skeleton`，否则渲染组件。
 * 常用于页面/列表初次加载的占位。
 * @param skeleton 骨架屏内容（如 `<Skeleton />`）
 * @param prop 表示加载状态的 prop 名，默认 `'loading'`
 * @param invert 取反逻辑；为真时渲染组件、为假时展示骨架
 * @example
 * // 页面骨架
 * export default withSkeleton(<PageSkeleton />)(Page);
 *
 * // 列表骨架：服务端数据加载中
 * export default withSkeleton(<ListSkeleton />, 'loading')(List);
 *
 * // ready 为真时渲染，未就绪显示骨架
 * export default withSkeleton(<ProfileSkeleton />, 'ready', true)(Profile);
 */
export function withSkeleton<K extends string>(
  skeleton: ReactNode,
  prop: K = 'loading' as K,
  invert = false,
) {
  return function <P extends Record<K, unknown> & JSX.IntrinsicAttributes>(
    Component: ComponentType<P>,
  ) {
    const Wrapped = (props: P) => {
      const v = Boolean(props[prop]);
      const showSkeleton = invert ? !v : v;
      return showSkeleton ? skeleton : <Component {...props} />;
    };
    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithSkeleton(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}
