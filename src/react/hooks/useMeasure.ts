import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useSize } from 'ahooks';

/**
 * 监听元素尺寸与位置变化，返回回调 `ref` 和最新的 `DOMRectReadOnly`。
 * @example
 * const [ref, rect] = useMeasure();
 * return <div ref={ref}>w:{rect.width} h:{rect.height}</div>
 */
export function useMeasure<T extends HTMLElement>() {
  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  } as DOMRectReadOnly);

  const nodeRef = useRef<T | null>(null);
  const size = useSize(nodeRef);

  const refCallback = useCallback((node: T | null) => {
    nodeRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const el = nodeRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();

    const nextRect = {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      left: r.left,
    } as DOMRectReadOnly;

    setRect(nextRect);
  }, [size?.width, size?.height]);

  return [refCallback, rect] as const;
}
