# useMount

只在组件 mount 时执行的 Hook。

## 示例

```ts
import { useMount } from '@base-web-kits/base-tools-react';

useMount(() => {
  console.log('mount');
});
```

## 参数

- `fn (Function)`: 执行函数。

## 来源

- [ahooks useMount](https://ahooks.js.org/zh-CN/hooks/use-mount/index)
