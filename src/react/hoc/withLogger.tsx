import { useEffect, useRef, type ComponentType } from 'react';

/**
 * 渲染/卸载审计 HOC：在组件渲染、挂载、卸载时记录日志或上报。
 * @param options.label 记录时使用的标签（默认取组件名）
 * @param options.onRender 是否记录每次渲染（默认 true）
 * @param options.logger 日志函数，默认 `console.log`
 * @example
 * // 控制台审计：渲染次数、挂载、卸载
 * export default withLogger({ label: 'UserList' })(UserList);
 *
 * // 自定义上报函数
 * const report = (type: string, info?: any) => sendToServer(type, info);
 * export default withLogger({ label: 'Page', logger: (t, i) => report(t, i) })(Page);
 */
export function withLogger(
  options: {
    label?: string;
    onRender?: boolean;
    logger?: (type: string, info?: unknown) => void;
  } = {},
) {
  const { label: customLabel, onRender = true, logger } = options;
  const log =
    logger ??
    ((type: string, info?: unknown) => {
      console.log(`[withLogger] ${type}`, info);
    });

  return function <P extends JSX.IntrinsicAttributes>(Component: ComponentType<P>) {
    type Named = { displayName?: string; name?: string };
    const name = (Component as Named).displayName || (Component as Named).name || 'Component';
    const label = customLabel ?? name;

    const Wrapped = (props: P) => {
      const renderCountRef = useRef(0);

      // 每次渲染计数
      renderCountRef.current += 1;
      if (onRender) log('render', { label, count: renderCountRef.current, props });

      // 挂载/卸载
      useEffect(() => {
        log('mount', { label, props });
        return () => log('unmount', { label });
      }, []);

      return <Component {...props} />;
    };

    (Wrapped as Named).displayName = `WithLogger(${name})`;
    return Wrapped;
  };
}
