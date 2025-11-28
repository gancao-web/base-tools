import { useEffect, useRef, useState, type ComponentType } from 'react';

/**
 * 防抖 props HOC：在 props 频繁变化时，延迟传递到内部组件，降低渲染频率。
 * @param delay 防抖延迟毫秒数（默认 300ms）
 * @param options.leading 是否在首次变化时立即更新（默认 false）
 * @param options.trailing 是否在延迟后更新（默认 true）
 * @example
 * // 输入联动场景：防抖减少渲染
 * const DebouncedSearch = withDebounce(300)(SearchBox);
 *
 * // 仅首次立即更新，后续走 trailing
 * const DebouncedList = withDebounce(500, { leading: true })(List);
 */
export function withDebounce(delay = 300, options: { leading?: boolean; trailing?: boolean } = {}) {
  const { leading = false, trailing = true } = options;

  return function <P extends JSX.IntrinsicAttributes>(Component: ComponentType<P>) {
    const Wrapped = (props: P) => {
      const [debouncedProps, setDebouncedProps] = useState<P>(props);
      const timerRef = useRef<number | null>(null);
      const firstRef = useRef(true);

      useEffect(() => {
        // 取消上一次调度
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }

        // 领先触发：首次变化立即更新
        if (leading && firstRef.current) {
          setDebouncedProps(props);
          firstRef.current = false;
        }

        // 尾随触发：延迟后更新
        if (trailing) {
          timerRef.current = window.setTimeout(() => {
            setDebouncedProps(props);
            timerRef.current = null;
          }, delay);
        }

        // 清理
        return () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        };
      }, [props, delay, leading, trailing]);

      return <Component {...debouncedProps} />;
    };

    type Named = { displayName?: string; name?: string };
    (Wrapped as Named).displayName =
      `WithDebounce(${(Component as Named).displayName || (Component as Named).name || 'Component'})`;
    return Wrapped;
  };
}
