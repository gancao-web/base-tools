# useThrottleFn

提供节流函数的 Hook。

## 示例

```ts
import { useThrottleFn } from '@base-web-kits/base-tools-vue';

const throttledFn = useThrottleFn(() => {
  // do something
}, 1000);
```

## 参数

- `fn (Function)`: 执行函数。
- `ms (number)`: 延迟时间。

## 返回值

- `(Function)`: 节流后的函数。

## 来源

- [VueUse useThrottleFn](https://vueuse.org/shared/useThrottleFn/)
