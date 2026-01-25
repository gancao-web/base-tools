# useIsomorphicLayoutEffect

## 描述

在 SSR 环境下使用 useEffect，在 CSR 环境下使用 useLayoutEffect。

## 示例

```ts
import { useIsomorphicLayoutEffect } from '@base-web-kits/base-tools-react';

useIsomorphicLayoutEffect(() => {
  console.log('layout effect');
}, []);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-isomorphic-layout-effect)
