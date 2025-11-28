import React, { type ComponentType } from 'react';

/**
 * 转发 `ref` 的 HOC：将外部的 `ref` 传递到内部组件。
 * 注意：内部组件需要支持 `ref`（如使用 `React.forwardRef` 定义或原生元素）。
 * @param Component 需支持 `ref` 的内部组件（例如由 `forwardRef` 定义）
 * @example
 * // 将 ref 透传到原生 input
 * const Input = React.forwardRef<HTMLInputElement, { value?: string }>((props, ref) => <input ref={ref} {...props} />);
 * const InputWithRef = withForwardRef<HTMLInputElement, { value?: string }>(Input);
 * const App = () => {
 *   const ref = useRef<HTMLInputElement>(null);
 *   useEffect(() => ref.current?.focus(), []);
 *   return <InputWithRef ref={ref} value="hi" />;
 * };
 */
export function withForwardRef<R, P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P & { ref?: React.Ref<R> }>,
) {
  const Wrapped = React.forwardRef<R, P>((props, ref) =>
    React.createElement(Component, { ...props, ref } as P & { ref?: React.Ref<R> }),
  );
  type Named = { displayName?: string; name?: string };
  (Wrapped as Named).displayName =
    `WithForwardRef(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
  return Wrapped;
}
