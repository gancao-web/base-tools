import type { Directive, DirectiveBinding } from 'vue';

/**
 * 在 mounted/updated 时调用元素的 focus 方法。
 * @example
 * <input v-focus /> 或 <input v-focus="enabled" />
 */
export const vFocus: Directive<HTMLElement, boolean | undefined> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean | undefined>) {
    if (binding?.value === false) return;
    if (typeof el.focus === 'function') el.focus();
  },

  updated(el: HTMLElement, binding: DirectiveBinding<boolean | undefined>) {
    if (binding?.value === false) return;
    if (typeof el.focus === 'function') el.focus();
  },
};
