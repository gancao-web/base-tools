import type { Directive } from 'vue';

type Binding = ((e: Event) => void) | { handler: (e: Event) => void; duration?: number };

const timers = new WeakMap<HTMLElement, number>();
const cleaners = new WeakMap<HTMLElement, () => void>();
const DURATION = 500; // 默认长按阈值

/**
 * 长按指令：按住超过 `duration` 毫秒触发回调，默认 `500` 毫秒。
 * @example
 * <button v-longpress="onLongpress" />
 * <button v-longpress="{ handler: onLongpress, duration: 800 }" />
 */
export const vLongpress: Directive<HTMLElement, Binding> = {
  mounted(el, binding) {
    const handler = typeof binding.value === 'function' ? binding.value : binding.value?.handler;

    if (!handler) return;

    const duration =
      typeof binding.value === 'object' ? (binding.value.duration ?? DURATION) : DURATION;

    const clear = () => {
      const t = timers.get(el);
      if (t !== undefined) {
        clearTimeout(t);
        timers.delete(el);
      }
    };

    const start = (e: Event) => {
      clear();
      timers.set(
        el,
        window.setTimeout(() => handler(e), duration),
      );
    };

    cleaners.set(el, clear);

    el.addEventListener('mousedown', start, { passive: true });
    el.addEventListener('touchstart', start, { passive: true });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach((evt) =>
      el.addEventListener(evt, clear, { passive: true }),
    );
  },

  unmounted(el) {
    cleaners.get(el)?.();
    cleaners.delete(el);
    timers.delete(el);
  },
};
