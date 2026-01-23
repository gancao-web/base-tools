# useDebounceFn

提供防抖函数的 Hook。

## 示例

```ts
import { useDebounceFn } from '@base-web-kits/base-tools-vue';

const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000);
```

## 参数

- `fn (Function)`: 执行函数。
- `ms (number)`: 延迟时间。

## 返回值

- `(Function)`: 防抖后的函数。

## 来源

- [VueUse useDebounceFn](https://vueuse.org/shared/useDebounceFn/)
