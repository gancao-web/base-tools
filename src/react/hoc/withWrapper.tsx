import type { ComponentType, ReactNode } from 'react';

/**
 * 包装容器 HOC：使用自定义 `wrapper(children)` 包裹组件渲染。
 * @param wrapper 包装函数，接收子元素并返回渲染节点
 * @example
 * const withTooltip = withWrapper((children) => <Tooltip content="tip">{children}</Tooltip>);
 * export default withTooltip(Button);
 */
export function withWrapper(wrapper: (children: ReactNode) => ReactNode) {
  return function <P extends JSX.IntrinsicAttributes>(Component: ComponentType<P>) {
    const Wrapped = (props: P) => wrapper(<Component {...props} />);
    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithWrapper(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}
