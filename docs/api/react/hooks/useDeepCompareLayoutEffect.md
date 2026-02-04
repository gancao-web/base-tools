# useDeepCompareLayoutEffect

## 描述

用法与 useLayoutEffect 一致，但 deps 通过 lodash isEqual 进行深比较。

## 示例

```ts
import { useDeepCompareLayoutEffect } from '@base-web-kits/base-tools-react';

useDeepCompareLayoutEffect(() => {
  // ...
}, [deepObject]);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-deep-compare-layout-effect)
