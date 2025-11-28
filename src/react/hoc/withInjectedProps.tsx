import type { ComponentType } from 'react';

/**
 * 注入固定属性 HOC：为组件注入一组固定的 props（外部传入的同名 props 优先级更高）。
 * @param injected 需要注入的固定 props 对象
 * @example
 * // 提供默认样式/主题属性
 * const withPrimary = withInjectedProps({ variant: 'primary', size: 'md' });
 * export default withPrimary(Button);
 *
 * // 统一注入埋点/跟踪属性
 * const withTrack = withInjectedProps({ trackId: 'list' });
 * export default withTrack(List);
 */
export function withInjectedProps<Q extends object>(injected: Q) {
  return function <P extends JSX.IntrinsicAttributes>(Component: ComponentType<P & Q>) {
    const Wrapped = (props: P) => <Component {...(injected as Q)} {...props} />;
    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithInjectedProps(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}
