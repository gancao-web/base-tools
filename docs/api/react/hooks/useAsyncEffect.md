# useAsyncEffect

## 描述

支持异步函数的 useEffect。

## 示例

```ts
import { useAsyncEffect } from '@base-web-kits/base-tools-react';

useAsyncEffect(async () => {
  await mockCheck();
}, []);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-async-effect)
