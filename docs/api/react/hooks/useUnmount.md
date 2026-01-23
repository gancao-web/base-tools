# useUnmount

只在组件 unmount 时执行的 Hook。

## 示例

```ts
import { useUnmount } from '@base-web-kits/base-tools-react';

useUnmount(() => {
  console.log('unmount');
});
```

## 参数

- `fn (Function)`: 执行函数。

## 来源

- [ahooks useUnmount](https://ahooks.js.org/zh-CN/hooks/use-unmount/index)
