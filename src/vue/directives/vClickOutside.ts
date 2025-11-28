import type { Directive, DirectiveBinding } from 'vue';

const handlers = new WeakMap<HTMLElement, (e: Event) => void>();

/**
 * 点击在元素外部的事件
 * @example
 * <div v-click-outside="onOutside" />
 */
export const vClickOutside: Directive<HTMLElement, (e: Event) => void> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<(e: Event) => void>) {
    if (typeof binding.value !== 'function') return;

    const handler = (e: Event) => {
      const target = e.target as Node | null;
      if (target && !el.contains(target)) {
        binding.value!(e); // 如果事件目标不在元素内部，则触发回调
      }
    };

    handlers.set(el, handler);

    if (typeof document !== 'undefined') {
      document.addEventListener('click', handler, true);
    }
  },

  unmounted(el: HTMLElement) {
    const handler = handlers.get(el);

    if (handler && typeof document !== 'undefined') {
      document.removeEventListener('click', handler, true);
    }

    handlers.delete(el);
  },
};
