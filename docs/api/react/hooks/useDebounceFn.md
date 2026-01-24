# useDebounceFn

## 描述

用来处理防抖函数的 Hook。

## 示例

```ts
import { useDebounceFn } from '@base-web-kits/base-tools-react';

const { run } = useDebounceFn(
  () => {
    console.log('click');
  },
  { wait: 500 },
);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-debounce-fn)
