import type { ComponentType } from 'react';

/**
 * 设置组件的 `displayName`，使其在 React DevTools 中更易识别。
 * @param Component 要设置名称的组件
 * @param name 期望显示的组件名称
 * @example
 * // 为匿名组件命名，便于调试
 * const Page = () => <div/>;
 * export default withDisplayName(Page, 'UserPage');
 *
 * // 与其他 HOC 组合使用，便于层级结构阅读
 * export default withDisplayName(withMemo(List), 'Memo(List)');
 */
export function withDisplayName<P>(Component: ComponentType<P>, name: string) {
  type DisplayName = { displayName?: string };
  (Component as DisplayName).displayName = name;
  return Component;
}
