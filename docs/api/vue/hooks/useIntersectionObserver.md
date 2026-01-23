# useIntersectionObserver

响应式的 IntersectionObserver。

## 示例

```ts
import { useIntersectionObserver } from '@base-web-kits/base-tools-vue';

const { stop } = useIntersectionObserver(target, ([entry]) => {
  const isVisible = entry.isIntersecting;
});
```

## 参数

- `target (Element)`: 目标元素。
- `callback (Function)`: 回调函数。

## 返回值

- `(Object)`: 包含 stop 函数的对象。

## 来源

- [VueUse useIntersectionObserver](https://vueuse.org/core/useIntersectionObserver/)
