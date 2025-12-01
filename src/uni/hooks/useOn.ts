import { onUnmounted } from 'vue';

/**
 * 全局事件监听 (组件销毁时取消监听,避免重复监听导致多次触发)
 * @example
 * useOn('eventName', (result) => {
 *   console.log(result);
 * });
 */
export function useOn(key: string, callback: (result: unknown) => void) {
  uni.$on(key, callback);

  onUnmounted(() => {
    uni.$off(key, callback);
  });
}
