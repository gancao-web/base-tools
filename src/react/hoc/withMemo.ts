import React, { type ComponentType } from 'react';

/**
 * 使用 `React.memo` 包裹组件以避免不必要的渲染。
 * 可选传入自定义 props 比较函数。
 * @param Component 要进行 memo 的组件
 * @param areEqual 自定义比较函数，返回 `true` 表示跳过渲染
 * @example
 * // 基础用法：提升列表渲染性能
 * const UserListMemo = withMemo(UserList);
 *
 * // 自定义比较：忽略非关心的属性变化
 * const CardMemo = withMemo(Card, (prev, next) => prev.title === next.title);
 * export default CardMemo;
 */
export function withMemo<P>(
  Component: ComponentType<P>,
  areEqual?: (prev: Readonly<P>, next: Readonly<P>) => boolean,
) {
  const Wrapped = React.memo(Component, areEqual);
  type WithName = { displayName?: string; name?: string };
  const baseName =
    (Component as WithName).displayName || (Component as WithName).name || 'Component';
  Wrapped.displayName = `WithMemo(${baseName})`;
  return Wrapped;
}
