import type { Directive } from 'vue';

const ioMap = new WeakMap<HTMLImageElement, IntersectionObserver>();

/**
 * 图片懒加载指令：进入视口后设置 `src`。
 * @example
 * <img v-lazy="imgUrl" />
 */
export const vLazy: Directive<HTMLImageElement, string> = {
  mounted(el, binding) {
    const src = binding.value;
    if (!src) return;

    const load = () => {
      el.src = src;
      const io = ioMap.get(el);
      if (io) {
        io.disconnect();
        ioMap.delete(el);
      }
    };

    if (!window.IntersectionObserver) {
      load();
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) load();
      });
    });
    io.observe(el);
    ioMap.set(el, io);
  },

  unmounted(el) {
    const io = ioMap.get(el);
    if (io) {
      io.disconnect();
      ioMap.delete(el);
    }
  },
};
